import type { Book } from "../types/book";

const DB_NAME = "audiolibros-db";
const DB_VERSION = 1;
const STORE = "books";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runTransaction<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const store = tx.objectStore(STORE);
    const request = fn(store);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

export function getAllBooks(): Promise<Book[]> {
  return runTransaction("readonly", (store) => store.getAll());
}

export function getBook(id: string): Promise<Book | undefined> {
  return runTransaction("readonly", (store) => store.get(id));
}

export async function saveBook(book: Book): Promise<void> {
  await runTransaction("readwrite", (store) => store.put(book));
}

export async function deleteBook(id: string): Promise<void> {
  await runTransaction("readwrite", (store) => store.delete(id));
}

export async function updateProgress(id: string, progressIndex: number): Promise<void> {
  const book = await getBook(id);
  if (!book) return;
  await saveBook({ ...book, progressIndex });
}

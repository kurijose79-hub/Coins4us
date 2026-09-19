import { useCallback, useEffect, useState } from "react";
import { TopNav, type MainView } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { Library } from "./components/Library";
import { AddBookModal } from "./components/AddBookModal";
import { Reader } from "./components/Reader";
import { AccountSettings } from "./components/AccountSettings";
import { CreateHub } from "./components/CreateHub";
import { AnalyticsView } from "./components/AnalyticsView";
import { getAllBooks, saveBook, deleteBook, updateProgress } from "./db/booksDb";
import { loadSettings, saveSettings } from "./utils/settings";
import type { Book, VoicePrefs } from "./types/book";

const PREFS_KEY = "audiolibros:prefs";

function loadPrefs(): VoicePrefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) return JSON.parse(raw) as VoicePrefs;
  } catch {
    // ignore malformed prefs
  }
  return { rate: 1, pitch: 1 };
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [mainView, setMainView] = useState<MainView>("biblioteca");
  const [prefs, setPrefs] = useState<VoicePrefs>(loadPrefs);
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    getAllBooks()
      .then(setBooks)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleCreate = useCallback(async (book: Book) => {
    await saveBook(book);
    setBooks((current) => [...current, book]);
    setShowAddModal(false);
    setActiveBookId(book.id);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteBook(id);
      setBooks((current) => current.filter((b) => b.id !== id));
      if (activeBookId === id) setActiveBookId(null);
    },
    [activeBookId],
  );

  const handleProgress = useCallback(
    (index: number) => {
      if (!activeBookId) return;
      updateProgress(activeBookId, index);
      setBooks((current) =>
        current.map((b) => (b.id === activeBookId ? { ...b, progressIndex: index } : b)),
      );
    },
    [activeBookId],
  );

  const handleNavigate = useCallback((view: MainView) => {
    setActiveBookId(null);
    setMainView(view);
  }, []);

  const activeBook = books.find((b) => b.id === activeBookId) ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <TopNav active={mainView} onNavigate={handleNavigate} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
        {loading ? (
          <p className="text-center text-neutral-500">Cargando biblioteca…</p>
        ) : activeBook ? (
          <Reader
            book={activeBook}
            prefs={prefs}
            onBack={() => setActiveBookId(null)}
            onProgress={handleProgress}
            onPrefsChange={setPrefs}
          />
        ) : mainView === "cuenta" ? (
          <AccountSettings
            settings={settings}
            onSettingsChange={setSettings}
            prefs={prefs}
            onPrefsChange={setPrefs}
          />
        ) : mainView === "crear" ? (
          <CreateHub onAddBook={() => setShowAddModal(true)} />
        ) : mainView === "analisis" ? (
          <AnalyticsView books={books} prefs={prefs} onOpen={setActiveBookId} />
        ) : (
          <Library
            books={books}
            onOpen={setActiveBookId}
            onDelete={handleDelete}
            onOpenAddModal={() => setShowAddModal(true)}
            onAddPublicDomain={handleCreate}
          />
        )}
      </main>

      <Footer />

      {showAddModal && (
        <AddBookModal onClose={() => setShowAddModal(false)} onCreate={handleCreate} />
      )}
    </div>
  );
}

export default App;

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-6 text-center text-sm text-neutral-500">
      © {new Date().getFullYear()} Audiolibros. La conversión de voz ocurre en tu navegador; tus
      libros no se suben a ningún servidor.
    </footer>
  );
}

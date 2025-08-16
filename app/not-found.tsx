// app/not-found.tsx
export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "56px 20px", fontFamily: "sans-serif" }}>
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe o fue movida.</p>
      <p>
        <a href="/" style={{ textDecoration: "underline" }}>
          ← Volver al inicio
        </a>
      </p>
    </div>
  );
}

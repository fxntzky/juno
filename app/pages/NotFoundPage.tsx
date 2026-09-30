export const NotFoundPage = ({ navigate }: { navigate: (to: string) => void }) => {
  return (
    <section className="page not-found-page">
      <h1>Page Not Found</h1>
      <p>The requested route is outside the JUNO ecommerce slice.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </section>
  );
};

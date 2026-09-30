export type MaterialItem = {
  title: string;
  caption: string;
  image: string;
};

export const ObjectMaterial = ({ items }: { items: MaterialItem[] }) => {
  return (
    <section className="object-section object-material" id="material">
      <p className="eyebrow">Material</p>
      <h2>Macro surfaces</h2>
      <div className="material-grid">
        {items.map((item) => (
          <article key={item.title} className="material-card">
            <img src={item.image} alt={item.title} loading="lazy" />
            <h3>{item.title}</h3>
            <p>{item.caption}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

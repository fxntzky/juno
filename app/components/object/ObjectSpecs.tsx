import type { ProductDetail } from "../../../commerce/provider-interface/commerce-provider";

export const ObjectSpecs = ({ product }: { product: ProductDetail }) => {
  const collectionName = product.collection === "analog-time" ? "Analog Time" : "Digital Time";
  const philosophyModule = product.storyModules.find((module) => module.type === "philosophy");
  const engineeringModule = product.storyModules.find((module) => module.type === "engineering");

  const materialBySlug: Record<string, string> = {
    junom83: "Brushed metal case, integrated link bracelet, high-contrast digital lens.",
    junom64: "Matte-finish metal surfaces, compact case architecture, integrated bracelet links.",
    junom31: "Slim brushed-metal body, lightweight link articulation, controlled edge radii.",
    junob612: "Sculpted metal bezel geometry, deep contrast frame, reinforced case structure.",
  };

  const functionBySlug: Record<string, string> = {
    junom83: "Instant digital time readout, one-glance legibility, daily-wear durability.",
    junom64: "Compact digital time display, reduced visual noise, stable everyday operation.",
    junom31: "Slim-profile digital time interface, ergonomic wrist behavior, fast readability.",
    junob612: "High-contrast digital display, dramatic bezel identity, utility-first daily use.",
  };

  const signatureTags = product.tags
    .filter((tag) => tag !== "launch-ready" && tag !== "digital")
    .map((tag) => tag[0].toUpperCase() + tag.slice(1))
    .join(" / ");

  return (
    <section className="object-section object-specs" id="specs">
      <div className="specs-head">
        <div>
          <p className="eyebrow">Specifications</p>
          <h2>Industrial baseline</h2>
        </div>
        <p className="spec-inventory">Product details</p>
      </div>
      <div className="spec-chip-row">
        <span>{product.name}</span>
        <span>{collectionName}</span>
      </div>
      <table>
        <tbody>
          <tr>
            <th>Model</th>
            <td>{product.name}</td>
          </tr>
          <tr>
            <th>Collection</th>
            <td>{collectionName}</td>
          </tr>
          <tr>
            <th>Materials</th>
            <td>{materialBySlug[product.slug] ?? "Brushed metal case and integrated bracelet construction."}</td>
          </tr>
          <tr>
            <th>Functions</th>
            <td>{functionBySlug[product.slug] ?? "Digital time display with immediate read-at-a-glance clarity."}</td>
          </tr>
          <tr>
            <th>Interface</th>
            <td>{philosophyModule?.title ?? "Digital interface language"}</td>
          </tr>
          <tr>
            <th>Build Focus</th>
            <td>{engineeringModule?.body ?? "Production geometry tuned for reliable assembly and daily wear."}</td>
          </tr>
          <tr>
            <th>Signature</th>
            <td>{signatureTags || "Retrofuturist digital"}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};

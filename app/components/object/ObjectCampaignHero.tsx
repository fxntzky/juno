import heroImage from "../../../catalog/digital-time/media/hero.webp";

export const ObjectCampaignHero = () => {
  return (
    <section className="campaign-hero" id="hero" aria-label="JUNO campaign hero">
      <div className="campaign-hero-media">
        <p className="campaign-hero-brand">JUNO</p>
        <img
          className="campaign-hero-image"
          src={heroImage}
          alt="JUNO digital hero"
          loading="eager"
          decoding="async"
          width={1536}
          height={1024}
        />
      </div>
    </section>
  );
};

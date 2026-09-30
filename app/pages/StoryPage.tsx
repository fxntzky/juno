import { campaignMedia } from '../../catalog/media-manifest';

export const StoryPage = ({ navigate }: { navigate: (to: string) => void }) => (
  <div className="xp-story-page">
    <section className="xp-story-hero" aria-labelledby="xp-story-title">
      <p className="xp-story-brand">JUNO</p>
      <div className="xp-story-hero-text">
        <p className="xp-eyebrow">The story / JUNO</p>
        <h1 id="xp-story-title">The past.<br />Without staying<br />there.</h1>
        <p>A product concept about memory, utility and the enduring clarity of digital time.</p>
      </div>
      <img src={campaignMedia.angle} alt="JUNO M83, three-quarter view" loading="eager" />
    </section>

    <section className="xp-story-chapter" aria-labelledby="xp-story-beginning">
      <p className="xp-kicker"><span>01</span><span className="xp-rule" aria-hidden="true" />The beginning</p>
      <div><h2 id="xp-story-beginning">A familiar<br />feeling.</h2><p>JUNO began with a question: what if a digital watch could keep the emotional clarity of the objects we grew up with, without feeling locked in the past?</p><p>Not retro for the sake of retro. Something direct, legible and quietly expressive, with enough capability to belong in everyday life now.</p></div>
    </section>

    <section className="xp-story-image-section"><img src={campaignMedia.closeup} alt="Detail of the M83 case, display and bracelet" loading="lazy" /><span>JUNO / DIGITAL TIME — M83</span></section>

    <section className="xp-story-chapter xp-story-chapter--dark" aria-labelledby="xp-story-design">
      <p className="xp-kicker"><span>02</span><span className="xp-rule" aria-hidden="true" />The object</p>
      <div><h2 id="xp-story-design">Less outside.<br />More inside.</h2><p>The M83 builds its identity around a simple case, an honest segmented display, tactile side controls and an integrated bracelet. Its visual language is deliberately restrained.</p><p>Inside that simplicity sits a proposed full digital toolkit: stopwatch, countdown, five alarms, dual time and the essentials that turn a nostalgic silhouette into an everyday instrument.</p></div>
    </section>

    <section className="xp-story-ending" aria-labelledby="xp-story-end">
      <img src={campaignMedia.onWrist} alt="JUNO M83 worn on wrist" loading="lazy" />
      <div><p className="xp-kicker">03 / The intention</p><h2 id="xp-story-end">Time should feel<br />like yours.</h2><p>JUNO is a fictional watch brand and interactive product-design study. The experience explores how industrial form, brand storytelling and digital commerce can support the same idea.</p><button type="button" className="xp-button xp-button--dark" onClick={() => navigate('/')}>Discover M83 <span aria-hidden="true">↗</span></button></div>
    </section>
  </div>
);

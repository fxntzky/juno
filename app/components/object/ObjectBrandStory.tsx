import { BRAND_STORY_KICKER, BRAND_STORY_LINE_ONE, BRAND_STORY_LINE_TWO } from "../../content/brandStory";

export const ObjectBrandStory = () => {
  return (
    <section className="brand-story-band" id="brand-story" aria-label="JUNO brand story">
      <div className="brand-story-inner">
        <div className="brand-story-copy">
          <p className="brand-story-kicker">{BRAND_STORY_KICKER}</p>
          <h2 className="brand-story-title">
            <span>{BRAND_STORY_LINE_ONE}</span>
            <span>{BRAND_STORY_LINE_TWO}</span>
          </h2>
        </div>
      </div>
    </section>
  );
};

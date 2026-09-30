// Product media is a single source of truth for collection cards and product pages.
// M83 references the approved clean campaign set. All images are part of JUNO's concept presentation.

// Vite cannot statically analyze fully dynamic new URL() expressions for bundled assets.
// Keep literal paths for reliable production hashing.
export const campaignMedia = {
  hero: new URL('./digital-time/media/hero.webp', import.meta.url).href,
  front: new URL('./digital-time/media/m83-01-front.webp', import.meta.url).href,
  angle: new URL('./digital-time/media/m83-02-angle.webp', import.meta.url).href,
  display: new URL('./digital-time/media/m83-03-front-macro.webp', import.meta.url).href,
  angleWide: new URL('./digital-time/media/m83-04-angle-wide.webp', import.meta.url).href,
  closeup: new URL('./digital-time/media/m83-05-angle-closeup.webp', import.meta.url).href,
  caseback: new URL('./digital-time/media/m83-06-caseback.webp', import.meta.url).href,
  onWrist: new URL('./digital-time/media/m83-07-on-wrist.webp', import.meta.url).href,
};

export const productImageBySlug: Record<string, string> = {
  junom83: campaignMedia.front,
  junom64: new URL('./digital-time/media/m64-front.webp', import.meta.url).href,
  junom31: new URL('./digital-time/media/m31-front.webp', import.meta.url).href,
  junob612: new URL('./digital-time/media/b612-front.webp', import.meta.url).href,
};

export const productGalleryBySlug: Record<string, Array<{ type: 'image'; url: string; alt: string }>> = {
  junom83: [
    { type: 'image', url: campaignMedia.front, alt: 'JUNO M83 full front view' },
    { type: 'image', url: campaignMedia.angle, alt: 'JUNO M83 oblique view' },
    { type: 'image', url: campaignMedia.display, alt: 'JUNO M83 display detail' },
    { type: 'image', url: campaignMedia.angleWide, alt: 'JUNO M83 wide angle view' },
    { type: 'image', url: campaignMedia.closeup, alt: 'JUNO M83 case close-up' },
    { type: 'image', url: campaignMedia.caseback, alt: 'JUNO M83 caseback concept' },
    { type: 'image', url: campaignMedia.onWrist, alt: 'JUNO M83 worn on wrist' },
  ],
  junom64: [
    { type: 'image', url: new URL('./digital-time/media/m64-front.webp', import.meta.url).href, alt: 'JUNO M64 front view' },
    { type: 'image', url: new URL('./digital-time/media/m64-side.webp', import.meta.url).href, alt: 'JUNO M64 side view' },
    { type: 'image', url: new URL('./digital-time/media/m64-back.webp', import.meta.url).href, alt: 'JUNO M64 rear view' },
  ],
  junom31: [
    { type: 'image', url: new URL('./digital-time/media/m31-front.webp', import.meta.url).href, alt: 'JUNO M31 front view' },
    { type: 'image', url: new URL('./digital-time/media/m31-side.webp', import.meta.url).href, alt: 'JUNO M31 side view' },
    { type: 'image', url: new URL('./digital-time/media/m31-back.webp', import.meta.url).href, alt: 'JUNO M31 rear view' },
  ],
  junob612: [
    { type: 'image', url: new URL('./digital-time/media/b612-front.webp', import.meta.url).href, alt: 'JUNO B612 front view' },
    { type: 'image', url: new URL('./digital-time/media/b612-side.webp', import.meta.url).href, alt: 'JUNO B612 side view' },
    { type: 'image', url: new URL('./digital-time/media/b612-back.webp', import.meta.url).href, alt: 'JUNO B612 rear view' },
  ],
};

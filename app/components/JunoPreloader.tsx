import { useEffect, useState } from 'react';

type Props = {
  heroSrc: string;
};

const MIN_VISIBLE_MS = 780;
const MAX_WAIT_MS = 1800;
const FADE_OUT_MS = 220;

let preloadState: 'idle' | 'running' | 'done' = 'idle';
let preloadPromise: Promise<void> | null = null;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();

    let finished = false;

    const finish = async () => {
      if (finished) return;

      finished = true;

      try {
        await image.decode();
      } catch {
        // The image may already be decoded or decode may not be supported.
      }

      resolve();
    };

    image.onload = finish;
    image.onerror = finish;
    image.src = src;

    if (image.complete) {
      void finish();
    }
  });

const startPreloader = (heroSrc: string) => {
  if (preloadPromise) {
    return preloadPromise;
  }

  preloadState = 'running';

  const startedAt = performance.now();

  preloadPromise = Promise.race([
    preloadImage(heroSrc),
    wait(MAX_WAIT_MS),
  ]).then(async () => {
    const elapsed = performance.now() - startedAt;
    const remaining = MIN_VISIBLE_MS - elapsed;

    if (remaining > 0) {
      await wait(remaining);
    }

    preloadState = 'done';
  });

  return preloadPromise;
};

export const JunoPreloader = ({
  heroSrc,
}: Props) => {
  const [visible, setVisible] = useState(
    preloadState !== 'done',
  );

  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (preloadState === 'done') {
      setVisible(false);
      return;
    }

    let active = true;
    let fadeTimer: number | undefined;

    setVisible(true);

    const previousOverflow =
      document.documentElement.style.overflow;

    document.documentElement.style.overflow = 'hidden';

    void startPreloader(heroSrc).then(() => {
      if (!active) return;

      setLeaving(true);

      fadeTimer = window.setTimeout(() => {
        if (!active) return;

        setVisible(false);
        document.documentElement.style.overflow =
          previousOverflow;
      }, FADE_OUT_MS);
    });

    return () => {
      active = false;

      if (fadeTimer) {
        window.clearTimeout(fadeTimer);
      }

      document.documentElement.style.overflow =
        previousOverflow;
    };
  }, [heroSrc]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`xp-preloader ${
        leaving
          ? 'xp-preloader--leaving'
          : ''
      }`}
      role="status"
      aria-label="Loading JUNO"
      aria-live="polite"
    >
      <div className="xp-preloader__inner">
        <p className="xp-preloader__brand">
          JUNO
        </p>

        <span
          className="xp-preloader__track"
          aria-hidden="true"
        >
          <span className="xp-preloader__bar" />
        </span>
      </div>
    </div>
  );
};
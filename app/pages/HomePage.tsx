import { useEffect, useState } from 'react';

import type { ProductSummary } from '../../commerce/provider-interface/commerce-provider';

import {
  campaignMedia,
  productImageBySlug,
} from '../../catalog/media-manifest';

import { JunoPreloader } from '../components/JunoPreloader';

import { formatMoney } from '../lib/money';

import { useCommerceServices } from '../providers/CommerceProviderContext';

const ORDER = [
  'junom83',
  'junom64',
  'junom31',
  'junob612',
] as const;

const MODEL_NAMES: Record<
  (typeof ORDER)[number],
  string
> = {
  junom83: 'M83',
  junom64: 'M64',
  junom31: 'M31',
  junob612: 'B612',
};

const chapter = (
  index: string,
  label: string,
) => (
  <p className="xp-kicker">
    <span>{index}</span>

    <span
      className="xp-rule"
      aria-hidden="true"
    />

    <span>{label}</span>
  </p>
);

// Concept module, not certified hardware specifications.
const functions = [
  {
    number: '01',
    label: 'Stopwatch',
    detail:
      'Elapsed time, split and lap tracking.',
  },
  {
    number: '02',
    label: 'Countdown timer',
    detail:
      'A configurable reverse timer.',
  },
  {
    number: '03',
    label: '5 daily alarms',
    detail:
      'Five independently set reminders.',
  },
  {
    number: '04',
    label: 'Dual time',
    detail:
      'Keep a second time zone in view.',
  },
  {
    number: '05',
    label: 'Auto calendar',
    detail:
      'Date and weekday, with calendar logic.',
  },
  {
    number: '06',
    label: 'Cyan backlight',
    detail:
      'A restrained glow, only when needed.',
  },
  {
    number: '07',
    label: 'Hourly signal',
    detail:
      'An optional reminder at the top of the hour.',
  },
  {
    number: '08',
    label: '12 / 24 hour',
    detail:
      'Choose the way time is displayed.',
  },
] as const;

export const HomePage = ({
  navigate,
}: {
  navigate: (to: string) => void;
}) => {
  const { catalogService } =
    useCommerceServices();

  const [products, setProducts] =
    useState<ProductSummary[]>([]);

  const [catalogError, setCatalogError] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    catalogService
      .listProductsByCollection(
        'digital-time',
      )
      .then((result) => {
        if (!mounted) return;

        const bySlug = new Map(
          result.map((product) => [
            product.slug,
            product,
          ]),
        );

        setProducts(
          ORDER.map((slug) =>
            bySlug.get(slug),
          ).filter(
            (
              product,
            ): product is ProductSummary =>
              Boolean(product),
          ),
        );
      })
      .catch(() => {
        if (mounted) {
          setCatalogError(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, [catalogService]);

  const m83 = products.find(
    (product) =>
      product.slug === 'junom83',
  );

  const toProduct = (slug: string) =>
    navigate(`/product/${slug}`);

  return (
    <div className="xp-home">
      <JunoPreloader
        heroSrc={campaignMedia.hero}
      />

      {/* BRAND */}
      <section
        className="xp-hero"
        aria-labelledby="xp-hero-title"
      >
        <p
          className="xp-hero-wordmark"
          aria-label="JUNO"
        >
          JUNO
        </p>

        <img
          className="xp-hero-watch"
          src={campaignMedia.hero}
          alt="JUNO M83 digital watch, full front view"
          loading="eager"
        />

        <div className="xp-hero-copy">
          <p className="xp-eyebrow">
            M83 / Digital Time
          </p>

          <h1 id="xp-hero-title">
            A time machine
            <br />
            to the kid
            <br />
            you were.
          </h1>

          <p className="xp-description">
            A digital watch for today.
            <br />
            Built on nostalgia, designed
            for the future.
          </p>

          <button
            type="button"
            className="xp-button xp-button--dark"
            onClick={() =>
              toProduct('junom83')
            }
          >
            Explore M83{' '}
            <span aria-hidden="true">
              ↗
            </span>
          </button>
        </div>

        <p className="xp-hero-edition">
          M83 / DIGITAL TIME
        </p>
      </section>

      {/* OVERVIEW */}
      <section
        className="xp-overview xp-dark"
        id="overview"
        aria-labelledby="xp-overview-title"
      >
        <div className="xp-overview-lead">
          {chapter('01', 'Overview')}

          <h2 id="xp-overview-title">
            Less noise.
            <br />
            More time.
          </h2>
        </div>

        <div className="xp-overview-text">
          <p>
            It looks familiar for a
            reason. M83 takes the
            directness of a classic
            digital watch and gives it a
            quieter, more deliberate
            form.
          </p>

          <p>
            Minimal on the wrist.
            Complete where it matters.
          </p>

          <span className="xp-overview-signoff">
            M83 / JUNO DIGITAL TIME
          </span>
        </div>
      </section>

      {/* OBJECT */}
      <div
        className="xp-object-story"
        aria-label="Materials and display"
      >
        <section
          className="xp-editorial-row xp-materials"
          id="materials"
          aria-labelledby="xp-materials-title"
        >
          <div className="xp-editorial-copy">
            {chapter(
              '02',
              'Materials',
            )}

            <h2 id="xp-materials-title">
              Built to
              <br />
              be noticed.
            </h2>

            <p>
              Brushed metal. Considered
              proportions. A familiar
              silhouette, seen through a
              contemporary lens.
            </p>

            <span className="xp-editorial-aside">
              THE CASE / M83
            </span>
          </div>

          <figure className="xp-editorial-media xp-editorial-media--detail">
            <img
              src={
                campaignMedia.closeup
              }
              alt="JUNO M83 brushed-metal case and side controls"
              loading="lazy"
            />
          </figure>
        </section>

        <section
          className="xp-editorial-row xp-editorial-row--reverse xp-display"
          id="display"
          aria-labelledby="xp-display-title"
        >
          <div className="xp-editorial-copy">
            {chapter(
              '03',
              'Digital soul',
            )}

            <h2 id="xp-display-title">
              An iconic
              <br />
              display.
            </h2>

            <p>
              A single glance. Bold
              numerals. The graphic
              character of a classic
              digital watch, without the
              noise.
            </p>

            <span className="xp-editorial-aside">
              12:24 / ALWAYS RECOGNIZABLE
            </span>
          </div>

          <figure className="xp-editorial-media xp-editorial-media--display">
            <img
              src={
                campaignMedia.display
              }
              alt="M83 segmented digital display with four side buttons"
              loading="lazy"
            />
          </figure>
        </section>
      </div>

      {/* DESIGN */}
      <section
        className="xp-editorial-row xp-design-notes"
        id="design-notes"
        aria-labelledby="xp-design-notes-title"
      >
        <div className="xp-editorial-copy">
          {chapter(
            '04',
            'Design notes',
          )}

          <h2 id="xp-design-notes-title">
            Considered
            <br />
            from every side.
          </h2>

          <p>
            The case, integrated
            bracelet and rear geometry
            share one restrained
            industrial language.
            Nothing added simply to
            look more technical.
          </p>

          <p className="xp-footnote">
            Physical design study.
            Manufacturing and
            durability claims are not
            certified.
          </p>
        </div>

        <figure className="xp-editorial-media xp-editorial-media--caseback">
          <img
            src={
              campaignMedia.caseback
            }
            alt="Rear case and integrated bracelet of the JUNO M83 concept"
            loading="lazy"
          />
        </figure>
      </section>

      {/* WATCH FUNCTIONS */}
      <section
        className="xp-functions xp-dark"
        id="functions"
        aria-labelledby="xp-functions-title"
      >
        <div className="xp-functions-lead">
          <div className="xp-functions-copy">
            {chapter(
              '05',
              'Watch functions',
            )}

            <h2 id="xp-functions-title">
              Quiet outside.
              <br />
              Capable inside.
            </h2>

            <p>
              A full everyday digital
              toolkit behind a
              deliberately simple
              display. The features of
              a capable digital module,
              without a cluttered
              exterior.
            </p>

            <span className="xp-function-concept">
              M83 / Proposed
              digital-module
              specification
            </span>
          </div>

          <figure className="xp-functions-photo">
            <img
              src={
                campaignMedia.front
              }
              alt="JUNO M83 with its LCD and four side controls"
              loading="lazy"
            />
          </figure>
        </div>

        <div
          className="xp-function-grid"
          aria-label="Eight M83 digital functions"
        >
          {functions.map(
            ({
              number,
              label,
              detail,
            }) => (
              <div
                className="xp-function"
                key={number}
              >
                <span className="xp-function-number">
                  {number} / M83
                </span>

                <h3>{label}</h3>

                <p>{detail}</p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* FORM & WEAR */}
      <section
        className="xp-editorial-row xp-angles"
        id="details"
        aria-labelledby="xp-details-title"
      >
        <div className="xp-editorial-copy">
          {chapter(
            '06',
            'Every angle matters',
          )}

          <h2 id="xp-details-title">
            Details
            <br />
            make it real.
          </h2>

          <p>
            The shape of the case, the
            position of each pusher and
            the continuity of the
            integrated bracelet are
            parts of one considered
            object.
          </p>

          <span className="xp-editorial-aside">
            FORM / CASE / BRACELET
          </span>
        </div>

        <figure className="xp-editorial-media xp-editorial-media--angle">
          <img
            src={
              campaignMedia.angleWide
            }
            alt="JUNO M83 three-quarter angle showing the case and bracelet"
            loading="lazy"
          />
        </figure>
      </section>

      <section
        className="xp-editorial-row xp-editorial-row--reverse xp-lifestyle"
        id="everyday"
        aria-labelledby="xp-lifestyle-title"
      >
        <div className="xp-editorial-copy">
          {chapter(
            '07',
            'Made to be worn',
          )}

          <h2 id="xp-lifestyle-title">
            Everyday.
            <br />
            Anywhere.
          </h2>

          <p>
            A small piece of design
            that belongs in real life.
            Understated, tactile and
            unapologetically digital.
          </p>

          <span className="xp-editorial-aside">
            BUILT AROUND THE EVERYDAY
          </span>
        </div>

        <figure className="xp-editorial-media xp-editorial-media--wrist">
          <img
            src={
              campaignMedia.onWrist
            }
            alt="JUNO M83 worn on a wrist with a dark knit sleeve"
            loading="lazy"
          />
        </figure>
      </section>

      {/* TECH SPECS */}
      <section
        className="xp-specs xp-dark"
        id="specifications"
        aria-labelledby="xp-specs-title"
      >
        <div className="xp-specs-lead">
          {chapter(
            '08',
            'Technical notes',
          )}

          <h2 id="xp-specs-title">
            The essentials.
            <br />
            Nothing extra.
          </h2>

          <p className="xp-footnote">
            Proposed M83 design and
            module details.
            Specifications are
            illustrative, not
            certified hardware claims.
          </p>
        </div>

        <dl className="xp-spec-grid">
          <div>
            <dt>Case</dt>
            <dd>
              Brushed-metal aesthetic
            </dd>
          </div>

          <div>
            <dt>Display</dt>
            <dd>
              Segmented digital LCD
              concept
            </dd>
          </div>

          <div>
            <dt>Controls</dt>
            <dd>Four side pushers</dd>
          </div>

          <div>
            <dt>Bracelet</dt>
            <dd>
              Integrated metal-link
              design
            </dd>
          </div>

          <div>
            <dt>Timekeeping</dt>
            <dd>
              Dual time · Auto
              calendar · 12 / 24h
            </dd>
          </div>

          <div>
            <dt>Timing tools</dt>
            <dd>
              Stopwatch · Countdown · 5
              alarms
            </dd>
          </div>

          <div>
            <dt>Illumination</dt>
            <dd>
              Cyan backlight concept
            </dd>
          </div>

          <div>
            <dt>Alert</dt>
            <dd>
              Optional hourly signal
            </dd>
          </div>
        </dl>
      </section>

      {/* BUY */}
      <section
        className="xp-buy"
        id="buy"
        aria-labelledby="xp-buy-title"
      >
        <div className="xp-buy-copy">
          {chapter(
            '09',
            'Discover JUNO',
          )}

          <h2 id="xp-buy-title">
            Make it yours.
          </h2>

          <p>
            Explore the object, select
            your model and try a
            complete no-payment
            checkout.
          </p>
        </div>

        <div className="xp-buy-actions">
          {m83 ? (
            <p className="xp-buy-price">
              M83 ·{' '}
              {formatMoney(
                m83.currentPrice,
              )}{' '}
              <span>
                Illustrative price
              </span>
            </p>
          ) : null}

          <button
            type="button"
            className="xp-button xp-button--dark"
            onClick={() =>
              toProduct('junom83')
            }
          >
            View M83 / Buy demo{' '}
            <span aria-hidden="true">
              ↗
            </span>
          </button>

          <small>
            Interactive concept. No
            purchase, charge or
            shipment.
          </small>
        </div>
      </section>

      {/* COLLECTION */}
      <section
        className="xp-collection xp-dark"
        id="collection"
        aria-labelledby="xp-collection-title"
      >
        <div className="xp-collection-intro">
          {chapter(
            '10',
            'Digital Time',
          )}

          <h2 id="xp-collection-title">
            Four models.
            <br />
            One attitude.
          </h2>

          <p>
            Different personalities.
            The same belief in useful,
            understated design.
          </p>

          <button
            type="button"
            className="xp-button xp-button--light"
            onClick={() =>
              navigate(
                '/collection/digital-time',
              )
            }
          >
            Explore the collection{' '}
            <span aria-hidden="true">
              ↗
            </span>
          </button>
        </div>

        <div
          className="xp-lineup"
          aria-label="Digital Time models"
        >
          {ORDER.map((slug) => {
            const item =
              products.find(
                (product) =>
                  product.slug === slug,
              );

            const name =
              MODEL_NAMES[slug];

            return (
              <button
                key={slug}
                type="button"
                className="xp-lineup-item"
                onClick={() =>
                  toProduct(slug)
                }
                title={`Explore JUNO ${name}`}
              >
                <img
                  src={
                    productImageBySlug[
                      slug
                    ]
                  }
                  alt={`JUNO ${name}`}
                  loading="lazy"
                />

                <span className="xp-lineup-meta">
                  <strong>
                    {name}
                  </strong>

                  {item ? (
                    <small>
                      {formatMoney(
                        item.currentPrice,
                      )}{' '}
                      / demo
                    </small>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        {catalogError ? (
          <p className="xp-footnote">
            Catalog information is
            temporarily unavailable.
            Product imagery remains
            available.
          </p>
        ) : null}

        <footer
          className="xp-mega-footer"
          aria-label="JUNO footer"
        >
          <span>© 2026 JUNO</span>

          <span>
            DESIGNED IN ARGENTINA
          </span>

          <span>
            DIGITAL TIME / INTERACTIVE
            PROTOTYPE
          </span>
        </footer>
      </section>
    </div>
  );
};
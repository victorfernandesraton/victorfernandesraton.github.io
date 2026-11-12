export default function (
  data: Lume.Data,
) {
  const {
    page,
    title,
    children,
    tags,
    description,
    readingInfo,
    sitename,
    comp,
    url,
    alternates,
    lang,
    cover,
    nav,
    date,
    theme,
    fullDate,
  } = data;

  // frontmatter tags may be a string or an array
  const tagList: string[] = Array.isArray(tags) ? tags : tags ? [tags] : [];

  const upCover = cover ? page.data.url + cover.split(".")[0] : undefined;
  const coverPath = cover ? page.data.url + cover : undefined;
  const coverFallback = upCover + "-small" + "." + "webp";
  // Preload hints for the LCP cover image. The srcset densities mirror the
  // <picture> sources below exactly, so the browser preloads the exact file
  // it will display. The viewport meta must come BEFORE these hints: until
  // it is parsed the default viewport (980px) matches the desktop media
  // query and every breakpoint image would be downloaded on mobile.
  const coverPreload: [string, string, string][] = cover
    ? [
        [`${upCover}-300w.avif 1x, ${upCover}-300w@2.avif 2x`, "(max-width: 599px)", `${upCover}-300w.avif`],
        [
          `${upCover}-720w.avif 1x, ${upCover}-720w@2.avif 2x`,
          "(min-width: 600px) and (max-width: 899px)",
          `${upCover}-720w.avif`,
        ],
        [`${upCover}-900w.avif 1x, ${upCover}-900w@2.avif 2x`, "(min-width: 900px)", `${upCover}-900w.avif`],
      ]
    : [];
  const createdAt = new Date(date);

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}

      <html data-webui-theme={theme} lang={lang ?? "pt-BR"}>
        <head>
          {/* The viewport meta MUST come before any resource hints: the
              preload scanner evaluates `media` attributes against the default
              viewport (980px) until this tag is parsed, which made the desktop
              cover preload download on mobile. */}
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>
            {`${sitename} - ${title}`}
          </title>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin="anonymous"
          />
          <link
            rel="preload"
            href="/theme.css"
            as="style"
            fetchpriority="high"
          />
          <link
            rel="stylesheet"
            href="/theme.css"
          />
          {coverPreload.map(([srcset, media, href]) => (
            <link
              key={media}
              rel="preload"
              as="image"
              type="image/avif"
              fetchpriority="high"
              href={href}
              imagesrcset={srcset}
              media={media}
            />
          ))}
        </head>
        <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
        <body>
          <main class="single-header">
            {cover && (
              <a href={url} aria-label={`Go to ${title}`}>
                <div class="blurred-img cover">
                  <img
                    class="low"
                    src={coverFallback}
                    alt={`Cover for ${title} post (placeholder)`}
                    fetchpriority="low"
                    image-size
                  />
                  <picture>
                    <source
                      media="(min-width: 900px)"
                      srcset={coverPath}
                      transform-images="avif webp jpg 900@2"
                    />
                    <source
                      media="(min-width: 600px)"
                      srcset={coverPath}
                      transform-images="avif webp jpg 720@2"
                    />
                    <img
                      class="high"
                      src={coverPath}
                      alt={`Cover for ${title} post`}
                      fetchpriority="high"
                      decoding="async"
                      transform-images="avif webp jpg 300@2"
                    />
                  </picture>
                </div>
              </a>
            )}
            <h1>{title}</h1>
            <h2>{description}</h2>
            <h3>{fullDate(createdAt)} · {readingInfo.minutes} min de leitura</h3>
            <ul class="tags">
              {tagList.map((item, index) => (
                <li key={index}>
                  <a href={`/tag/${item}/`}>{item}</a>
                </li>
              ))}
            </ul>
          </main>
          <article>
            <div transform-images="avif webp jpg 300@2 600@2 720@2 900@2">
              {children}
            </div>
          </article>

          <comp.Footer />
        </body>
      </html>
    </>
  );
}

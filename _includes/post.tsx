export default function (
  data: Lume.Data,
) {
  const {
    page,
    title,
    children,
    tags,
    description,
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

  const upCover = cover ? page.data.url + cover.split(".")[0] : undefined;
  const coverPath = cover ? page.data.url + cover : undefined;
  const coverFallback = upCover + "-small" + "." + "webp";
  const coverPreloadDesktop = upCover + "-900w" + "." + "webp";
  const coverPreloadTablet = upCover + "-720w" + "." + "webp";
  const coverPreloadMobile = upCover + "-300w" + "." + "webp";
  const createdAt = new Date(date);

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}

      <html data-webui-theme={theme} lang={lang ?? "pt-BR"}>
        <head>
          <title>
            {`${sitename} - ${title}`}
          </title>
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
          {cover && (
            <>
              <link
                rel="preload"
                as="image"
                href={coverPreloadMobile}
                fetchpriority="high"
                media="(max-width: 599px)"
              />
              <link
                rel="preload"
                as="image"
                href={coverPreloadTablet}
                fetchpriority="high"
                media="(min-width: 600px) and (max-width: 899px)"
              />
              <link
                rel="preload"
                as="image"
                href={coverPreloadDesktop}
                fetchpriority="high"
                media="(min-width: 900px)"
              />
            </>
          )}
          <meta name="viewport" content="width=device-width,initial-scale=1" />
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
            <h3>{fullDate(createdAt)}</h3>
            <ul class="tags">
              {tags.map((item, index) => (
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

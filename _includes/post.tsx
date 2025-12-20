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

  const upCover = cover ? page.data.url + "/" + cover.split(".")[0] : undefined;
  const coverRes = upCover + "-big" + "." + "webp";
  const coverFallback = upCover + "-small" + "." + "webp";
  const createdAt = new Date(date)

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}

      <html data-webui-theme={theme} lang={lang ?? "pt-BR"}>
        <head>
          <title>
            {`${sitename} - ${title}`}
          </title>
          <link rel="stylesheet" href="/theme.css" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content={description} />
          {coverFallback && (
              <meta itemprop="image" content={`${url}/${coverFallback}`} />
          )}
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
                    fetchpriority="high"
                  />
                  <img
                    class="high cover"
                    src={coverRes}
                    alt={`Cover for ${title} post`}
                    onload="this.classList.add('loaded'); this.previousElementSibling.style.opacity=0;"
                    fetchpriority="low"
                  />
                </div>
              </a>
            )}
            <h1>{title}</h1>
            <h2>{description}</h2>
            <h3>{fullDate(createdAt)}</h3>
            <ul class="tags">
              {tags.map((item, index) => (
                <li key={index}>
                  <a href={`/tag/${item}`}>{item}</a>
                </li>
              ))}
            </ul>
          </main>
          <article>
            {children}
          </article>

          <comp.Footer />
        </body>
      </html>
    </>
  );
}

export default function (
  data: Lume.Data,
) {
  const {
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
    theme,
  } = data;

  const upCover = cover ? cover.split(".")[0] : undefined;
  const coverRes = upCover + "-big" + "." + "webp";
  const coverFallback = upCover + "-small" + "." + "webp";

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}

      <html data-webui-theme={theme}>
        <head>
          <title>
            {`${sitename} - ${title}`}
          </title>
          <link rel="stylesheet" href="/theme.css" />
        </head>
        <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
        <body>
          <div class="single-header">
            {cover && (
              <a href={url} aria-label={`Go to ${title}`}>
                <div class="blurred-img cover">
                  <img
                    class="low"
                    src={coverFallback}
                    alt={`Cover for ${title} post (placeholder)`}
                  />
                  <img
                    class="high cover"
                    src={coverRes}
                    alt={`Cover for ${title} post`}
                    onload="this.classList.add('loaded'); this.previousElementSibling.style.opacity=0;"
                  />
                </div>
              </a>
            )}
            <h1>{title}</h1>
            <h2>{description}</h2>
            <ul>
              {tags.map((item, index) => (
                <li key={index}>
                  <a href={`/tag/${item}`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <article>
            {children}
          </article>

          <comp.Footer />
        </body>
      </html>
    </>
  );
}

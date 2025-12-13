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
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <meta name="description" content={description}/>

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
            <ul>
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

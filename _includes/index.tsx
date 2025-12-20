export default function (
  { title, children, search, comp, lang, alternates, nav, theme, fullDate, page }: Lume.Data,
) {
  const recent = search.pages(`lang=${lang} type=post draft=false`, "date=desc", 3);
  const xp = search.pages(`lang=${lang} type=xp`, "date=desc", 3);

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html data-webui-theme={theme}>
        <head>
          <title>{title}</title>
          <link rel="stylesheet" href="/theme.css" />
          <link ref="preconnect" href={page.data.url} />
        </head>
        <body>
          <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
          <main class="intro">
            <div>{children}</div>
            <article>

            <h2>Posts</h2>
            <ol>
              {recent.map((page) => (
                <li>
                  <a href={page.url}>{page.title}</a>
                  <p>{fullDate(new Date(page.date))}</p>
                </li>
              ))}
            </ol>
            </article>

            <h2>Experiências</h2>
            <article>
            <ol>
              {xp.map((page) => (
                <li>
                  <a href={page.url}>{page.title}</a>
                </li>
              ))}
            </ol>
            </article>
          </main>
          <comp.Footer />
        </body>
      </html>
    </>
  );
}

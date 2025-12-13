export default function (
  { title, children, search, comp, lang, alternates, nav, theme }: Lume.Data,
) {
  const recent = search.pages(`lang=${lang} type=post`, "date=desc", 3);
  const xp = search.pages(`lang=${lang} type=xp`, "date=desc", 3);

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html data-webui-theme={theme}>
        <head>
          <title>{title}</title>
          <link rel="stylesheet" href="/theme.css" />
          <link ref="preconnect" href="http://localhost:3000" />
        </head>
        <body>
          <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
          <main class="intro">
            <div>{children}</div>
            <ol>
              {recent.map((page) => (
                <li>
                  <a href={page.url}>{page.title}</a>
                </li>
              ))}
            </ol>

            <ol>
              {xp.map((page) => (
                <li>
                  <a href={page.url}>{page.title}</a>
                </li>
              ))}
            </ol>
          </main>
          <comp.Footer />
        </body>
      </html>
    </>
  );
}

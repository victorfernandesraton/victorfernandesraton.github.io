export default function (
  { title, children, search, nav, comp, lang, alternates, theme, fullDate }:
    Lume.Data,
) {
  const recent = search.pages(`lang=${lang} type=post`, "date=desc");
  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="/theme.css" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <html data-webui-theme={theme}>
        <body>
          <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
          <main class="list">
            {children}
            <ol>
              {recent.map((page) => (
                <li>
                  <a href={page.url}>{page.title}</a>
                  <p>{fullDate(new Date(page.date))}</p>
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

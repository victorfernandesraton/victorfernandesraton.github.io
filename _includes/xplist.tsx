export default function (
  { title, children, search, nav, comp, lang, alternates, theme }: Lume.Data,
) {
  const recent = search.pages(
    `lang=${lang} type=xp`,
    "start_date=desc end_date=desc",
  );
  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="/theme.css" />
      </head>
      <html data-webui-theme={theme}>
        <body>
          <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
          <main>
            {children}
            <ol>
              {recent.map((page) => (
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

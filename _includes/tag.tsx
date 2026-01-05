export default function (
  { title, search, nav, comp, lang, alternates, theme , result=""}: Lume.Data,
) {

  const recent = search.pages(result);

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
        <head>
          <title>{title}</title>
          <link rel="stylesheet" href="/theme.css" />
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
        </head>

      <html data-webui-theme={theme}>
        <body>
          <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
          <main class="list">
            <title>{title}</title>
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

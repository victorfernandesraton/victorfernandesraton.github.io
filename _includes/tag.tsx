export default function (
  {
    title,
    description,
    search,
    nav,
    comp,
    lang,
    alternates,
    theme,
    result = "",
  }: Lume.Data,
) {
  const recent = search.pages(result);

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <head>
        <title>{title}</title>
        <link
          rel="stylesheet"
          href="/theme.css"
          media="print"
          onload="this.media='all'"
        />

        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="description" content={description} />
      </head>

      <html data-webui-theme={theme}>
        <body>
          <comp.Navbar nav={nav} alternates={alternates} lang={lang} />

          <main class="list">
            <h1>#{title}</h1>
            <h2>{description}</h2>
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

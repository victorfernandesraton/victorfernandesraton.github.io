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
      <html data-webui-theme={theme} lang={lang ?? "pt-BR"}>
        <head>
          <title>{title}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
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
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="description" content={description} />
        </head>
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

export default function (
  { title, search, comp, result = "", theme }: Lume.Data,
) {
  const recent = search.pages(result);

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html data-webui-theme={theme}>
        <head>
          <title>{title}</title>
          <link rel="stylesheet" href="/theme.css" />
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
        </head>
        <body>
          <comp.Navbar />
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

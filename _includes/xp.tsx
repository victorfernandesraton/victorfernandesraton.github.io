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
    alternates,
    lang,
    nav,
    theme,
  } = data;

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html data-webui-theme={theme}>
        <head>
          <title>{title}</title>
          <link rel="stylesheet" href="/theme.css" />
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
        </head>
        <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
        <body>

          <main class="list">
          <h1>{title}</h1>
          <h2>{description}</h2>
          <ul>
            {tags.map((item, index) => (
              <li key={index}>
                <a href={`/tag/${item}`}>{item}</a>
              </li>
            ))}
          </ul>
            {children}
          </main>

          <comp.Footer />
        </body>
      </html>
    </>
  );
}

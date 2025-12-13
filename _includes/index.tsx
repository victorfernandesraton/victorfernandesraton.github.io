export default function (
  { title, children, search, comp, lang, alternates, nav }: Lume.Data,
) {
  const recent = search.pages(`lang=${lang} type=post`, "date=desc", 3);
  const xp = search.pages(`lang=${lang} type=xp`, "date=desc", 3);

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html>
        <head>
          <title>{title}</title>
          <link rel="stylesheet" href="/theme.css" />
        </head>
        <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
        <body>
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

          <comp.Footer />
        </body>
      </html>
    </>
  );
}

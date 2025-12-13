export default function (
  { title, search, menus, comp, lang, alternates, result = "" }: Lume.Data,
) {
  const recent = search.pages(result);

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html>
        <head>
          <title>{title}</title>
                    <link rel="stylesheet" href="/theme.css" />

        </head>
        <comp.Navbar />
        <body>
          <title>{title}</title>
          <ol>
            {recent.map((page) => (
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

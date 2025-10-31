
export default function (
  { title, children, search ,nav, comp, lang, alternates}: Lume.Data,
) { 

    const recent =search.pages(`lang=${lang} type=post`, "date=desc") 
    return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html>
        <head>
          <title>{title}</title>
        </head>
        <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
        <body>

        {children}
          <ol>
            {recent.map((page) => (
              <li>
                <a href={page.url}>{page.title}</a>
              </li>
            ))}
          </ol>
        </body>
      </html>
    </>
  );
}

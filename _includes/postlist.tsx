
export default function (
  { title, children, search ,nav, comp, lang, alternates}: Lume.Data,
) { 

    const recent =search.pages(`lang=${lang} type=post`, "date=desc") 
    const tags =search.values<string>('tags', `lang=${lang} type=post`)

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

          <ul>
            {tags.map((page) => (
              <li>
                <a href={page}>{page}</a>
              </li>
            ))}
          </ul>
        </body>
      </html>
    </>
  );
}

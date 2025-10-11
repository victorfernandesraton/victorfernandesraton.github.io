export default function (
  { title, search ,menus, comp, lang, alternates, result = ''}: Lume.Data,
) { 

    const recent =search.pages(`lang=${lang} type=post ${result}`, "date=desc", 3) 

    return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html>
        <head>
          <title>{title}</title>
        </head>
        <comp.Navbar  />
        <body>
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

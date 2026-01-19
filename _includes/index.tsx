export default function (
  {
    title,
    children,
    search,
    comp,
    lang,
    alternates,
    nav,
    theme,
    fullDate,
    page,
    monthYear,
    social,
  }: Lume.Data,
) {
  const recent = search.pages(`lang=${lang} type=post`, "date=desc", 3);
  const xp = search.pages(
    `lang=${lang} type=xp`,
    "start_date=desc end_date=desc",
    3,
  );

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html data-webui-theme={theme}>
        <head>
          <title>{title}</title>
          <link rel="stylesheet" href="/theme.css" />
          <link ref="preconnect" href={page.data.url} />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
        </head>
        <body>
          <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
          <main class="intro">
            <div>{children}</div>
            <article>
              <h2>Posts</h2>
              <ol>
                {recent.map((page) => (
                  <li>
                    <a href={page.url}>
                      <h3>{page.title}</h3>
                    </a>
                    <p>{fullDate(new Date(page.date))}</p>
                  </li>
                ))}
              </ol>
            </article>

            <article>
              <h2>Experiências</h2>
              <ol>
                {xp.map((page) => (
                  <li>
                    <a href={page.url}>
                      <h3>{page.title}</h3>
                    </a>
                    <p>
                      {monthYear(new Date(page.start_date))}
                      {page.end_date
                        ? " | " + monthYear(new Date(page.end_date))
                        : ""}
                    </p>
                  </li>
                ))}
              </ol>
            </article>
          </main>
          <comp.Footer social={social} />
        </body>
      </html>
    </>
  );
}

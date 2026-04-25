export default function (
  { title, children, search, nav, comp, lang, alternates, theme, monthYear }:
    Lume.Data,
) {
  const recent = search.pages(
    `lang=${lang} type=xp`,
    "start_date=desc end_date=desc",
  );
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
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
          <main class="list">
            {children}
            <ol>
              {recent.map((page) => (
                <li>
                  <a href={page.url}>{page.title}</a>
                  <p>
                    {monthYear(new Date(page.start_date))}
                    {page.end_date
                      ? " | " + monthYear(new Date(page.end_date))
                      : " | Atual"}
                  </p>
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

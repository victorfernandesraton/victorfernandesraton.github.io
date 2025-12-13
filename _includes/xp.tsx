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
  } = data;

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <header>
        <title>
          {`${sitename} - ${title}`}
                    <link rel="stylesheet" href="/theme.css" />

        </title>
      </header>
      <html>
        <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
        <body>
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

          <comp.Footer />
        </body>
      </html>
    </>
  );
}

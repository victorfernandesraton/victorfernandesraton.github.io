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
    url,
    alternates,
    lang,
    cover,
    nav,
  } = data;

  const upCover = cover ? cover.split(".")[0] : undefined;
  const coverRes = upCover + "-big" + "." + "webp";

  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <header>
        <title>
          {`${sitename} - ${title}`}
        </title>
        <link rel="stylesheet" href="/theme.css" />
      </header>
      <html>
        <comp.Navbar nav={nav} alternates={alternates} lang={lang} />
        <body>
          {cover && (
            <a href={url} aria-label={`Go to ${title}`}>
              <img
                class="image"
                src={coverRes}
                alt={`Cover for ${title} post`}
              />
            </a>
          )}
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

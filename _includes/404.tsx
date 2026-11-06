export default function (
  { title, description, comp, lang, nav, theme }: Lume.Data,
) {
  return (
    <>
      {{ __html: "<!DOCTYPE html>" }}
      <html data-webui-theme={theme} lang={lang ?? "pt-BR"}>
        <head>
          <title>{title}</title>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin="anonymous"
          />
          <link rel="stylesheet" href="/theme.css" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta name="description" content={description} />
        </head>
        <body>
          <comp.Navbar nav={nav} alternates={{}} lang={lang} />
          <main class="list" style="text-align:center;padding:4rem 1rem;">
            <h1 style="font-size:clamp(6rem,20vw,12rem);margin:0;">404</h1>
            <h2>A página que você buscou não existe</h2>
            <p>{description}</p>
            <p>
              <a href="/">Voltar para a página inicial</a>
            </p>
          </main>
          <comp.Footer social={[]} />
        </body>
      </html>
    </>
  );
}

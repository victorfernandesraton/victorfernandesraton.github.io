export default ({ title, children, theme }: Lume.Data) => (
  <>
    {{ __html: "<!DOCTYPE html>" }}

    <html data-webui-theme={theme}>
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="/theme.css" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  </>
);

export default ({ title, children, theme }: Lume.Data) => (
  <>
    {{ __html: "<!DOCTYPE html>" }}

    <html data-webui-theme={theme}>
      <head>
        <title>{title}</title>
        <link rel="stylesheet" href="/theme.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  </>
);

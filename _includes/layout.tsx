export default ({ title, children }: Lume.Data) => (
  <>
    {{ __html: "<!DOCTYPE html>" }}
    <html>
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

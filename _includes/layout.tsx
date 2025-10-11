export default ({ title, children }: Lume.Data) => (
  <>
    {{ __html: "<!DOCTYPE html>" }}
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  </>
);

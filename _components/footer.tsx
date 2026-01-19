type Social = {
  name: string;
  url: string;
};
export default function ({ social = [] }: { social: Social[] }) {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>Developed with &#128156; by victorfernandesraton</p>
      <a class="powered-by" href="https://lume.land">
        <p>Powered by</p>
        <img
          src="https://raw.githubusercontent.com/lumeland/logo/1eac98cb08ab69c428328246f591ab31731ebd7e/lume-dark.svg"
          width="50"
          alt="Lumen Logo"
        />
      </a>

      <div>
        <a href="https://vraton.dev">raton.dev</a> © {year} by{" "}
        <a href="https://fosstodon.org/@v_raton">Victor Raton</a>{" "}
        is licensed under{" "}
        <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
          CC BY-NC-SA 4.0
        </a>
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/cc.svg"
          alt=""
          style="max-width: 1em;max-height:1em;margin-left: .2em;"
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
          alt=""
          style="max-width: 1em;max-height:1em;margin-left: .2em;"
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
          alt=""
          style="max-width: 1em;max-height:1em;margin-left: .2em;"
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/sa.svg"
          alt=""
          style="max-width: 1em;max-height:1em;margin-left: .2em;"
        />
      </div>
      <ul class="social-links">
        {social.map((item, index) => (
          <li key={index}>
            <a href={item.url}>{item.name}</a>
          </li>
        ))}
      </ul>
    </footer>
  );
}

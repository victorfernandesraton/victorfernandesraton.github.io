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
          src="/lume.svg"
          width="50"
          height="50"
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
          width="16"
          height="16"
          style="max-width: 1em;max-height:1em;margin-left: .2em;"
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/by.svg"
          alt=""
          width="16"
          height="16"
          style="max-width: 1em;max-height:1em;margin-left: .2em;"
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/nc.svg"
          alt=""
          width="16"
          height="16"
          style="max-width: 1em;max-height:1em;margin-left: .2em;"
        />
        <img
          src="https://mirrors.creativecommons.org/presskit/icons/sa.svg"
          alt=""
          width="16"
          height="16"
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

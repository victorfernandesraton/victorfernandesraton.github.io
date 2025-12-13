export default function () {
    const year = new Date().getFullYear()
  return (
    <footer>
      <p>Developed with &#128156; by victorfernandesraton</p>
      <a className="powered-by" href="https://gohugo.io/">
        <p>Powered by</p> <img src="lume.svg" width="50" alt="Description of image" />
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
    </footer>
  );
}

// <p> {{ i18n "followmeon" }}:</p>
// <ul class="social-list">
//     {{ range .Site.Params.social }}
//     <li><a href="{{ .url }}" rel="me" target="_blank">{{ .name }}</a></li>
//     {{ end }}
// </ul>

export default function() {
  return (
    <footer>
      <p>Developed with &#128156; by victorfernandesraton</p>
      <a className="powered-by" href="https://gohugo.io/">
        <p>Powered by</p>
        <img
          width="76px"
          alt="Hugo logo with formed by each letter for HUGO inside a colorfull hexagon, for H using pink ,U as blue, G is green and O is yellow"
          src="https://raw.githubusercontent.com/gohugoio/gohugoioTheme/master/static/images/hugo-logo-wide.svg?sanitize=true"
        />
      </a>

      <div>
        <a href="https://vraton.dev">raton.dev</a> © 2025 by{" "}
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

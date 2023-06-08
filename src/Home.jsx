import Nullstack from 'nullstack';
import PostList from './PostList';

class Home extends Nullstack {
  links = [
    {"name": "github", "link": "https://github.com/victorfernandesraton"},
    {"name": "linkedin", "link": "https://linkedin.com/in/vraton"},
    {"name": "mastodon", "link": "https://mastodon.social/@ratondev"}
  ]
  description = "Bem vindo ao meu caos"

  prepare(context) {
    context.page.title = `${context.project.shortName} - Home`
    context.page.description = this.description
  }

  render() {
    return (
      <main class='max-w-[900px] mx-auto'>

        <div class='flex flex-col-reverse md:flex-row gap-x-16'>
          <div class="flex flex-col">
            <h1 class='text-5xl font-bold mt-8 mb-8 sm:mb-16'>
              {this.description}
            </h1>
            <p class='text-xl my-2'>Fala guys, sou Victor Raton, desenvolvedor fullstack dedsde 2019, defensor ferrenho de open-source e criador exímio de bugs em javascript</p>
            <div class="flex mt-8 flex-row items-center justify-center md:justify-start">
              {this.links.map(({link, name}) => (
                <a aria-label={`link to my ${name}`} target="_blank" href={link}>
                  <i class={["fab text-rosePine-rose mr-4 text-3xl md:text-5xl",`fa-${name}`]} />
                </a>
              ))}
            </div>
          </div>
          <img src='assets/img/profile.webp' alt="Victor Raton image face" class="md:w-48 w-40 self-center border border-rosePine-rose border-b-4 border-r-4" />
        </div>
        <h2 class='text-4xl font-bold text-rosePine-rose my-8'>O que andei aprontando </h2>
        <PostList persistent />
      </main>
    )
  }

}

export default Home;

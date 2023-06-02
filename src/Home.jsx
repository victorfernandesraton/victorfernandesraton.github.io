import Nullstack from 'nullstack';
import PostList from './PostList';

class Home extends Nullstack {

  render() {
    return (
      <main class='max-w-[900px] mx-auto'>

        <div class='flex flex-col-reverse md:flex-row gap-x-16'>
          <div class="flex flex-col">
            <h1 class='text-5xl font-bold mt-8 mb-8 sm:mb-16'>
              Bem vindo ao meu caos
            </h1>
            <p class='text-xl my-4'>Fala guys, sou Victor Raton, desenvolvedor fullstack dedsde 2019, defensor ferrenho de open-source e criador exímio de bugs em javascript</p>
          </div>
          <img src='assets/img/profile.webp' class="w-44 py-4 rounded-full self-center" />
        </div>
        <h2 class='text-4xl font-bold text-rosePine-rose my-8'>O que andei aprontando </h2>
        <PostList persistent />
      </main>
    )
  }

}

export default Home;

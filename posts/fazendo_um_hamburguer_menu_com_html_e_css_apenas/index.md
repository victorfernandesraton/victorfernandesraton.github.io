+++
title = 'Fazendo um hamburguer menu com HTML e CSS apenas'
date = 2024-01-28T00:42:48-03:00
draft = false
description = 'Usando HTML e CSS apenas podemos reproduzir certos comportamentos de interatividade'
tags = ['web', 'html', 'css', 'react', 'ui']
cover = "cover.jpg"

+++

# O que é um hamburguer menu

Sem dúvida, se você tem navegado pela internet, certamente já se deparou com um menu hambúrguer em diversos sites. Esse tipo de menu tornou-se extremamente comum na atualidade, aparecendo principalmente em sites que têm um design adaptativo, criado especificamente para se ajustar perfeitamente a telas de diferentes tamanhos, como as dos smartphones, tablets e até mesmo laptops. O menu hambúrguer é uma ferramenta eficaz para manter a experiência do usuário limpa e desobstruída, ocultando a navegação do site até que seja necessário. Mas, apesar de ter interagido com muitos deles, você já se perguntou como seria o processo de criar um?

Normalmente, em um projeto de desenvolvimento web, a maneira como abordamos essa situação é implementando um componente web específico. Este componente terá um estado associado que é ativado sempre que ocorre o evento de clicar no menu para abri-lo. Dessa forma, conseguimos gerenciar a interação do usuário com o menu de uma forma muito eficiente e intuitiva. Ao implementar essa estratégia, estamos garantindo que o menu responda corretamente às ações do usuário, proporcionando uma experiência de usuário suave e sem problemas.

Um exemplo de código genérico que poderiamos ter ao fazer esse tipo de coisa seria visto [aqui](https://codepen.io/maximakymenko/pen/aboWJpX/) mais ou menos assim:

```jsx
const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #EFFFFA;
  transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
  height: 100vh;
  text-align: left;
  padding: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 576px) {
      width: 100%;
    }

  a {
    font-size: 2rem;
    text-transform: uppercase;
    padding: 2rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: #0D0C1D;
    text-decoration: none;
    transition: color 0.3s linear;

    @media (max-width: 576px) {
      font-size: 1.5rem;
      text-align: center;
    }

    &:hover {
      color: #343078;
    }
  }
`

const Menu = ({ open }) => {
  return (
    <StyledMenu open={open}>
      <a href="/">
        <span role="img" aria-label="about us">💁🏻‍♂️</span>
        About us
      </a>
      <a href="/">
        <span role="img" aria-label="price">💸</span>
        Pricing
        </a>
      <a href="/">
        <span role="img" aria-label="contact">📩</span>
        Contact
        </a>
    </StyledMenu>
  )
}

const StyledBurger = styled.button`
  position: absolute;
  top: 5%;
  left: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;

  &:focus {
    outline: none;
  }

  div {
    width: 2rem;
    height: 0.25rem;
    background: ${({ open }) => open ? '#0D0C1D' : '#EFFFFA'};
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;

    :first-child {
      transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
    }

    :nth-child(2) {
      opacity: ${({ open }) => open ? '0' : '1'};
      transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'};
    }

    :nth-child(3) {
      transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
    }
  }
`

const Burger = ({ open, setOpen }) => {
  return (
    <StyledBurger open={open} onClick={() => setOpen(!open)}>
      <div />
      <div />
      <div />
    </StyledBurger>
  )
}

const App = () => {
  const [open, setOpen] = React.useState(false);
  const node = React.useRef();
  return (
    <div>
      <div>
        <h1>Hello. This is burger menu tutorial</h1>
        <img src="https://image.flaticon.com/icons/svg/2016/2016012.svg" alt="burger icon" />
        <small>Icon made by <a href="https://www.freepik.com/home">Freepik</a> from <a href="https://www.flaticon.com">www.flaticon.com</a></small>
       </div>
      <div ref={node}>
        <Burger open={open} setOpen={setOpen} />
        <Menu open={open} setOpen={setOpen} />
      </div>
    </div>
  )  
}
```

Mase se eu disser que não precisamos nem de javascript para fazer algo ter um comportamento similar?

# A lógica por baixo dos panos

Ao criar um checkbox no HTML e usar um id para associar uma etiqueta a este elemento através do parâmetro `for`, você renderizará um input do tipo checkbox com uma etiqueta ao lado. No entanto, por padrão, tanto a checkbox quanto a etiqueta podem atualizar o status do elemento quando clicados.

```html
<input type='checkbox' id="hamburger-trigger"/>
<label for="hamburger-trigger"> Label for checkbox </label>
```

Você pode testar em qualquer navegador e verá que é possível alterar o status da caixa de seleção simplesmente clicando na etiqueta. Interessante, não é?

# A solução

Dai pensei: E se eu ocultar a checkbox e usar o estado da mesma para gerir os elementos , seria a mesma coisa que o status `open` faz no componente React?

Para isso primeiro iremos implementar um código em HTML que renderize uma lista de links , iremos ocultar o checkbox por meio de css. Tanbém iremos adicionar tags span para saber se o menu está aberto ou não

```html
<nav>
<input type='checkbox' id="hamburger-trigger"/>
<label for="hamburger-trigger">
  <span id="on">Active</span>
  <span id="off">Hidden</span>
</label>
<ul id="options">
  <li> DuckduckGo</li>
  <li>Tilvids</li>
  <li>Mastodon</li>
</nav>
```

Dai adicionamos este css abaixo que oculta o checkbox e os itens da lista por padrão, deixando apenas o texto Active e Hideen na tela

```css
#hamburger-trigger {
  display: none;
}

#options {
  display: none;
}
```

Primeiro faremos apenas a lista sumir e aparecer de acordo com o status do checkbox, para isso adicionaremos mais uma propriedade no nosso CSS, deixando ele assim:

```css
#hamburger-trigger {
  display: none;
}

#options {
  display: none;
}

#hamburger-trigger:checked ~ #options {
  display: flex;
  flex-direction: column
}
```

E… Pronto, já está funcionando, o que faz essa mágica acontecer é o seletor do CSS que estamos usando, a primeira parte corresponde a atribuir um seletor quando o status da checkbox for checked ou seja , a mesma estiver ativa `#hamburger-trigger:checked` . Em seguida usamos o operador `~` que mescla a segunda parte do seletor como é explicado no [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Subsequent-sibling_combinator) , e por fim o seletor da lista de elementos `#options` seu hamburger já está funcionado

# Customize como quiser

Por fim basta adicionar algumas perfumarias como usar diferentes elenmentos SVG para representar o estado de aberto ou fechado do menu, melhorar o estilo da lista, eu deixei o meu +- assim

```html
<nav>
<input type='checkbox' id="hamburger-trigger"/>
<label for="hamburger-trigger">
        <svg id="on" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>

        <svg id="off" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>

</label>
<ul id="options">
  <li> DuckduckGo</li>
  <li>Tilvids</li>
  <li>Mastodon</li>
</nav>
```

```css
#hamburger-trigger {
  display: none;
}

#options {
  display: none;
}

#hamburger-trigger:checked ~ #options {
  display: flex;
  flex-direction: column;
  
}

#options {
  list-style-type: none;
  margin: 0;
  padding: 0 1rem;
  gap: 1rem;
}

#off {
  color: red;
}

svg {
  width: 5rem;
}

#hamburger-trigger:checked ~ label svg#on {
  display: none;
}

#hamburger-trigger:checked ~ label svg#off {
  display: inline;
}

#hamburger-trigger ~ label  svg#off {
  display: none;
}

#hamburger-trigger ~ label svg#on {
  display: inline;
}
```

# Conclusões

O que aprendemos até agora é que usando alguns truques do CSS, como verificar certos status e mesclar seletores, nos permite estilizar componentes de acordo com eventos. No entanto, isso não é de graça, pois o principal trade-off deste código é que não estamos respeitando as boas práticas de HTML semântico. Nesses casos de menu hambúrguer, o mesmo deve ser disparado a partir de um elemento button. Por isso, apesar de ser interessante e estar sendo usado no layout do blog que fiz para 2024, **não recomendo** o uso dessa técnica, pois pode causar problemas a ferramentas de acessibilidade como leitores de tela.


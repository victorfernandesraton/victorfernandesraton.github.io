+++
title = 'Criando um bot para buscar vagas no linkedin Parte 2'
description = 'Fazendo scrapping e extraindo dados'
date = 2024-04-13T18:00:00-03:00
tags = ["python","linkedin", "web-scrapping", "selenium", "selenium-grid", "urn" ]
cover = "cover.jpg"
layout = 'post.tsx'
+++

# No episódio anterior...

Como vimos antes [aqui](/posts/criando_um_bot_para_buscar_vagas_no_linkedin/part_1/), conseguimos criar uma estrutura básica de como gerenciar mais de um processo usando selenium pra logar no linkedin e docker+selenium-grid para gerir essa bagunça organizada, nas agora temos que ir além, nosso desafio hoje é apenas mostrar como fazer scrapping e interagir com as páginas, fora toda a ciência tosca e esforço que tive que fazer para "hackear" os links do linkedin, nosso objetivo hoje se resume em 3:

1. Refatorar o vagabot para que use mais composição e menos herança
1. Conseguir fazer uma busca no linkedin
2. Conseguir pegar postagems com essa busca
3. Persistir essas postagens usando Sqlite

Então bora lá ver até onde essa confusão irá nos levar hoje.

# A grande refatoração

Decidi fazer algumas mudanças para minimizar o uso de herança de forma desnecessária em prol do uso de composição
A refatoração se deu em separar o que antes chamavamos de `LinkedinWorkflow` em duas coisas, um serviço que nos permite gerir um browser , vamos chamá-lo de `BrowserService` onde teremos concentrado tudo referente ao browser e o selenium , enquanto teremos o `LinkedinWorkflow` sendo usado para definir métodos abstratos da nossa api para que nossos workflows sejam componentes fechados e isolados, de forma que possamos encadear execuções de workflows com o mesmo browser

No fnal do dia escrevemos o serviço de browser dessa forma

```python
# vagabot/services/browser_service.py

import logging

import fake_useragent
from selenium import webdriver
from selenium.webdriver.remote.webdriver import WebDriver
from undetected_chromedriver import ChromeOptions


class BrowserService:
    _se_router_host = ""
    _se_router_port: str | int = 4444

    def __init__(self, se_router_host: str, se_router_port: str | int) -> None:
        self._se_router_host = se_router_host
        self._se_router_port = se_router_port
        self.drivers: dict[str, WebDriver] = {}
        if self._se_router_port:
            self._se_router_url = (
                f"http://{self._se_router_host}:{self._se_router_port}"
            )
        else:
            self._se_router_url = f"http://{self._se_router_host}"

    def __create_driver(self) -> WebDriver:
        opts = ChromeOptions()
        opts.add_argument(
            f"user-agent={fake_useragent.UserAgent(os='windows', browsers=['chrommiun'])}"
        )
        driver = webdriver.Remote(options=opts, command_executor=self._se_router_url)
        return driver

    def open_browser(self) -> str:
        logging.debug(f"Open browser in {self._se_router_url}")
        driver = self.__create_driver()

        if not driver.session_id:
            raise Exception("Not able to regisrer a driver")
        driver.maximize_window()
        self.drivers[driver.session_id] = driver

        return driver.session_id

    def close(self, driver_key: str):
        self.drivers[driver_key].close()
        del self.drivers[driver_key]

    def __del__(self):
        for session_id, driver in self.drivers.items():
            try:
                driver.quit()
                logging.debug(f"Closed driver with session_id {session_id}")
            except Exception as e:
                logging.error(f"Error when close driver {session_id}: {e}")
            finally:
                try:
                    if session_id:
                        logging.error(
                            f"Derrubando o driver com session_id {session_id} do Selenium Grid."
                        )
                        webdriver.Remote(
                            command_executor=driver.command_executor,
                            desired_capabilities={},
                        ).quit()
                except Exception as e:
                    logging.error(
                        f"Erro ao desconectar o driver com session_id {session_id} do Selenium Grid: {e}"
                    )
```

Agora a nossa classe `LinkedinWorkflow` ficou realmente com cara de um strategy

```python
import time
from abc import abstractmethod

from selenium.webdriver.remote.webelement import WebElement

from vagabot.services import BrowserService


class LinkedinWorkflow:
    def __init__(self, browser_service: BrowserService) -> None:
        self.browser_service = browser_service

    @staticmethod
    def human_input_simulate(element: WebElement, content: str, delay=1):
        for key in content:
            time.sleep(delay)
            element.send_keys(key)

    @abstractmethod
    def execute(self, *args, **kwargs): ...
```

Com essa mudança da api , podemos deasenhar um entrypoint de script um pouco mais detalhado e com a responsabilidade mais clara. Parafrazeando o grande Tio Bob (Ribert C. Martin) em Còdigo Limpo, se tem um lugar do seu código que pode ficar sujo é o módulo de inicialização. E ao contrário de muitos que movem a poeira pra baixo do tapete nosso código ficou assim:

```python
# script.py
import argparse
import logging
import sys

from decouple import config

from vagabot.adapters.posts_from_search_adapters import PostsFromSearchExtractor
from vagabot.services import BrowserService
from vagabot.workflows import LinkedinAuth, LinkedinGetPosts

_se_router_host = config("SE_ROUTER_HOST", "localhost")
_se_router_port = config("SE_ROUTER_PORT", "4444")

# Como o service agora é global fica mais facil de encadear coisas se necessário
browser_service = BrowserService(
    se_router_host=_se_router_host, se_router_port=_se_router_port
)


def linkedin_auth(args) -> str:
    logging.info(f"Login for {args.user} in linkedin")
    service_auth = LinkedinAuth(browser_service)
    driver_key = browser_service.open_browser()
    service_auth.execute(driver_key, args.user, args.password)
    return driver_key


def search_posts(args) -> list:
    logging.info(f"Search posts: {args.query}")
    driver_key = linkedin_auth(args)
    service = LinkedinGetPosts(browser_service)
    finded_posts = service.execute(args.query, driver_key)
    result = PostsFromSearchExtractor(finded_posts).to_dict()
    browser_service.close(driver_key)
    return result




def main():
    # create common argarse without helper to keep global args
    common = argparse.ArgumentParser(add_help=False)

    # Add global arguments
    common.add_argument(
        "-u", "--user", help="Linkedin Username", default=config("LINKEDIN_EMAIL", "")
    )
    common.add_argument(
        "-p",
        "--password",
        help="Linkedin Password",
        default=config("LINKEDIN_PASS", ""),
    )

    # Create the parser
    parser = argparse.ArgumentParser(
        description="CLI for user and password management.", parents=[common]
    )

    # Create the subparsers
    subparsers = parser.add_subparsers(dest="command")

    search_posts_parser = subparsers.add_parser(
        "search-posts", help="Search posts", parents=[common]
    )
    search_posts_parser.add_argument(
        "-q", "--query", required=False, help="Query for search", type=str
    )


    args = parser.parse_args()

    if args.command == "search-posts":
        result = search_posts(args)
        logging.warn(result)

    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
```

Dei tanbém uma mexida melhor nos logs e em alguns detalhes de baixo nivél, mas por agora temos isso ai....


# Buscando as postagens

Sabe quando seu colega de trabalho enche teu saco pra usar o html semântico? quando eu reclamo quando vejo um código React cheio de div em vez de usar os componentes nativos como inputs e checkbox? Então uma das razõoes disso é que querendo ou não seu projeto web vai ser indexado, seja pela google pra te avaliar no algoritimo de busca deles, seja a openai varrendo a internet e desdenhando de propriedade intelectual, seja só eu fazendo automações para pagar as contas. Você vai ver nessa parte o porque isso (e minha grande preguiça) me fizeram ter que descobrir como hackear o linkedin, tudo para obter um link.

Para pegar as postagens precisamos fazer uma busca usando a barra de busca do linkedin, selecionar o tipo de busca e copiar os links dos conteúdos encontrados, talvez mais tarde possamos fazer uma análise se a postagem é ou não sobre uma vaga, mas entenderam a idéia certo?

Aqui está a masterpice de código que fiz

```python
import time
from typing import List

from selenium.common import exceptions
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

from .linkedin_workflow import LinkedinWorkflow


class LinkedinGetPosts(LinkedinWorkflow):
    SEARCH_INPUT_XPATH = "//*[@id='global-nav-typeahead']/input"
    POSTS_BUTTON_SELECT = (
        "/html/body/div[5]/div[3]/div[2]/section/div/nav/div/ul/li[2]/button"
    )
    POSTS_LIST_XPATH = "//ul[@role='list' and contains(@class, 'reusable-search__entity-result-list ')]/li"

    def execute(self, queue_search: str, driver_key: str) -> List[str | None]:
        self.browser_service.drivers[driver_key].get("https://www.linkedin.com")
        input_wait = WebDriverWait(self.browser_service.drivers[driver_key], timeout=20)
        try:
            search_input = input_wait.until(
                EC.presence_of_element_located((By.XPATH, self.SEARCH_INPUT_XPATH))
            )
            self.human_input_simulate(search_input, queue_search)
            self.human_input_simulate(search_input, Keys.ENTER)
        except exceptions.TimeoutException:
            raise Exception("not found input here search")

        self.browser_service.drivers[driver_key].get(
            f"https://www.linkedin.com/search/results/content/?keywords={queue_search}&origin=SWITCH_SEARCH_VERTICAL&sid=r01"
        )
        time.sleep(5)

        try:
            post_list = input_wait.until(
                EC.presence_of_all_elements_located((By.XPATH, self.POSTS_LIST_XPATH))
            )[:9]

        except exceptions.TimeoutException:
            raise Exception("not found post list")

        result = [post.get_attribute("outerHTML") for post in post_list]
        return result
```

essa classe é bem simples e condensa o que vimos antes na [parte 1]({{<ref "/posts/criando_um_bot_para_buscar_vagas_no_linkedin/part_1/index.md">}}), usamos a tag `SEARCH_INPUT_XPATH` para definir o xpath daquela barra de navegação do linkedin, digitamos o texto que queremos e apertamos o que seria o ENTER pra ele fazer a busca. Mas devido ao comportamento estranho dos botões de menu para selecionar o tipo de postagen (afinal são botões com eventos específicos sendo invocados) eu preferi ajustar a url diretamente para busca , porém mantive a busca em texto com imput para evitar ser pego como bot pelo próprio linkedin 


depois pegamos todas as postagens , isto é o conteúdo em html inteiro e separamos, usamos novamente a magial do xapth com `POSTS_LIST_XPATH`
e aqui veio nossa primeira limitação

Como o linkedin usa o sistema de paginação por meio dee scroll infinito, eu penso que podemos no futuro implementar o método de fazer isso e limitar até quantas páginas vamos ter, mas por hora pegar os 10 primeiros itens que são retornados é o suficiente, o evento de scroll não é tão trivial de implementar pois depende muito de encontrar uma forma de saber quando parar de fazer o scroll, esperar o carregamento e fazer este de novo, tenho algumas hipoteses de como fazer isso usando a funcionalidade do selenium de fazer scroll até um elemento específico, mas por hora eu acho suficiente extrair apenas os 10 primeiros posts.

Com essa brincadeira toda pronta já até podemos testar nosso cli com o comando abaixo

```python
python script.py -h
```

Agora podemos fazer um experimento de buscar vagas de java nas postagens

```python
python script.py search-posts -q "VAGAS + JAVA"
```
Com isso conseguimos fazer o nosso bot buscar postagens no linkedin e retornar a string html do componente de postagem


# Persistindo dados em sqlite

Agora que conseguimos extrair dados vamos criar uma estrutura para persistir esses dados, a minha idéia é primeiro criar entidades para definir os dados como objeto por meio de dataclass, que nos permite uma facilidade melhor e instanciação dinâmica, bem como vamos criar uma camada de persistência do zero usando sqlite. O principal motivo para o uso do sqlite é que ele é um banco em arquivo, fora que podemos usar ele com a runtime padrão do python no debian que tem suporte nativo ao sqlite3, ou seja , não precisamos de dependencia, até pq vamos escrever query na mão.

## Entendendo dataclass

Parafrazeando a [PEP-557](https://peps.python.org/pep-0557/) dataclass são estruturas de tuplas nomeadas com valores padrão (default), ou seja uma forma de criar algo similar a uma struct em go , uma espécie de plain object que irá nos ajudar a lhedar com os dados, eu particulamente gosto de usar dataclass para definir esse tipo de coisa pois assim fica mais fácil o plugin do mypy me ajudar como tanbém consigo fazer transformadores, dto, parses (chame como quiser) usando as blibiotecas nativas do python de uma forma legivél, ou seja, só pra não ter que ficar mexendo com dict diretamente, ~~ninguém merece~~

Dito isso vamos definir nossas entidades

```python
# vagabot/repository/entities.py

import uuid
from dataclasses import dataclass, field
from enum import Enum


class PostStatus(Enum):
    CREATED = 1
    COMMENTED = 2
    DELETED = 0


@dataclass(frozen=True, order=True)
class Post:
    linkedin_id: str
    link: str
    author_id: str
    content: str
    status: PostStatus = PostStatus.CREATED
    id: str = field(default_factory=lambda: str(uuid.uuid4()))


class AuthorStatus(Enum):
    CREATED = 1
    FOLLOWED = 2
    MUTUAL = 3
    DELETED = 0


@dataclass(frozen=True, order=True)
class Author:
    name: str
    link: str
    avatar: str = ""
    status: AuthorStatus = AuthorStatus.CREATED
    description: str = ""
    id: str = field(default_factory=lambda: str(uuid.uuid1()))
```

Esse código por si só é bem autoexplicativo: 
- Usamos enuns para definir status , pois é muito mais typing friendly;
- Usamos factories de field para gerar uma string de UUID 
- Usamos a sintaxe padrão do dataclass para definir valores default
- Usamos a propriedade `frozen` para criar objetos imutavéis, o que pro nosso caso é bem interessante
- Usamos a propriedade `order` para gerar métodos de comparação, lá na frente isso vai ser importante quando formos implementar outras coisas

## Abstraindo o Sqlite em estruturas de repositórios

Agora vamos implementar uma estrutura de repository que o sqlite consiga lhedar (e nós tanbém). nessa etapa eu poderia separar a implementaçào da interface, o que inclusive recomendo que faça nos seus projetos em nome da sua sanidade, mas como eu pretenddo descartar futuramente o sqlite, vou fazer tudo em um lugar só , mas estejam avisados, nada de misturar classe concreta com definição de interface.

```python

# vagabot/repository/repository.py
from abc import abstractmethod
from sqlite3 import Connection


class SqliteRepository:
    def __init__(self, conn: Connection):
        self.conn = conn
        self.cursor = self.conn.cursor()

    @abstractmethod
    def create_table_ddl(self):
        pass

```
Esse é o nosso repository, ignorando um pouco as possivéis issues de memória aqui, eu fiz dessa forma para que cada repository seja responsavél pela tabela que este maneja, nem sempre um repository vai ser responsavél pela tabela, e a parte de gerar o script de sql ficaria melhor gerida por meio de migrations, mas como aqui é algo que vai ser descartados e apenas para testes, vamos deixar como estar

Agora é só implementar nossos repositórios:

```python
# vagabot/repository/author_repository.py
import uuid
from sqlite3 import IntegrityError
from typing import Optional

from vagabot.entities import Author, AuthorStatus
from vagabot.repository.repository import SqliteRepository


class AuthorRepository(SqliteRepository):
    def create_table_ddl(self):
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS authors (
                id TEXT PRIMARY KEY,
                name TEXT,
                description TEXT,
                link TEXT UNIQUE,
                avatar TEXT,
                status INTEGER
            )
            """
        )

        self.conn.commit()

    def count_authors(self) -> int:
        row = self.cursor.execute(
            "SELECT COUNT(*) FROM authors WHERE status != ?",
            (AuthorStatus.DELETED.value,),
        ).fetchone()

        if not row:
            return 0

        return int(row[0])

    def get_by_id(self, author_id: uuid.UUID) -> Optional[Author]:
        self.cursor.execute("SELECT * FROM authors WHERE id = ?", (str(author_id),))
        row = self.cursor.fetchone()
        if row:
            return Author(
                name=row[1],
                description=row[2],
                link=row[3],
                avatar=row[4],
                status=AuthorStatus(row[5]),
                id=row[0],
            )
        return None

    def get_by_link(self, link: str) -> Optional[Author]:
        self.cursor.execute("SELECT * FROM authors WHERE link = ?", (str(link),))
        row = self.cursor.fetchone()
        if row:
            return Author(
                name=row[1],
                description=row[2],
                link=row[3],
                avatar=row[4],
                status=AuthorStatus(row[5]),
                id=row[0],
            )
        return None

    def upsert_by_link(self, author: Author) -> Optional[Author]:
        try:
            self.cursor.execute(
                """
                INSERT INTO authors (id, name, description,link, avatar, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    str(author.id),
                    author.name,
                    author.description,
                    author.link,
                    author.avatar,
                    author.status.value,
                ),
            )
            self.conn.commit()

        except IntegrityError:
            self.cursor.execute(
                """
                UPDATE authors
                SET name = ?, description = ?, avatar = ?, status = ?
                WHERE link = ?
                """,
                (
                    author.name,
                    author.description,
                    author.avatar,
                    author.status.value,
                    str(author.link),
                ),
            )
            self.conn.commit()
        return self.get_by_link(author.link)

    def close(self):
        self.conn.close()
```

```python
# vagabot/repository/post_repository.py
from sqlite3 import IntegrityError
from typing import List, Optional

from vagabot.entities import Post, PostStatus
from vagabot.repository.repository import SqliteRepository


class PostRepository(SqliteRepository):
    def create_table_ddl(self):
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS posts (
                id TEXT PRIMARY KEY,
                linkedin_id TEXT UNIQUE,
                link TEXT,
                author_id TEXT,
                content TEXT,
                status INTEGER,
                FOREIGN KEY(author_id) REFERENCES authors(id)
            )
            """
        )

        self.conn.commit()

    def count_posts(self) -> int:
        row = self.cursor.execute(
            "SELECT COUNT(*) FROM posts WHERE status != ?",
            (PostStatus.DELETED.value,),
        ).fetchone()

        if not row:
            return 0

        return int(row[0])

    def get_by_id(self, post_id: str) -> Optional[Post]:
        self.cursor.execute("SELECT * FROM posts WHERE id = ?", (str(post_id),))
        row = self.cursor.fetchone()
        if row:
            return Post(
                linkedin_id=row[1],
                link=row[2],
                author_id=row[3],
                content=row[4],
                status=PostStatus(row[5]),
                id=row[0],
            )
        return None

    def get_by_author_id(self, author_id: str) -> List[Post]:
        self.cursor.execute("SELECT * FROM posts WHERE author_id = ?", (author_id,))
        rows = self.cursor.fetchall()
        return [
            Post(
                linkedin_id=row[1],
                link=row[2],
                author_id=row[3],
                content=row[4],
                status=PostStatus(row[5]),
                id=row[0],
            )
            for row in rows
        ]

    def get_by_linkedin_id(self, linkedin_id: str) -> Optional[Post]:
        self.cursor.execute(
            "SELECT * FROM posts WHERE linkedin_id = ?", (str(linkedin_id),)
        )
        row = self.cursor.fetchone()
        if row:
            return Post(
                linkedin_id=row[1],
                link=row[2],
                author_id=row[3],
                content=row[4],
                status=PostStatus(row[5]),
                id=row[0],
            )
        return None

    def get_by_status(self, status: PostStatus) -> Optional[Post]:
        self.cursor.execute(
            "SELECT * FROM posts WHERE status = ?", (int(status.value),)
        )
        rows = self.cursor.fetchall()
        return [
            Post(
                linkedin_id=row[1],
                link=row[2],
                author_id=row[3],
                content=row[4],
                status=PostStatus(row[5]),
                id=row[0],
            )
            for row in rows
        ]

    def set_deleted(self, post: Post):
        self.cursor.execute(
            """
            UPDATE posts
            SET status = ?
            WHERE id = ?
            """,
            (
                PostStatus.DELETED,
                str(post.id),
            ),
        )
        self.conn.commit()

    def upsert_by_linkedin_id(self, post: Post) -> Optional[Post]:
        try:
            self.cursor.execute(
                """
                INSERT INTO posts (id, linkedin_id, link, author_id, content, status)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    str(post.id),
                    post.linkedin_id,
                    post.link,
                    post.author_id,
                    post.content,
                    post.status.value,
                ),
            )
            self.conn.commit()
        except IntegrityError:
            self.cursor.execute(
                """
                UPDATE posts
                SET author_id = ?, content = ?, status = ?, link = ?
                WHERE linkedin_id = ?
                """,
                (
                    post.author_id,
                    post.content,
                    post.status.value,
                    post.link,
                    post.linkedin_id,
                ),
            )
            self.conn.commit()

        return self.get_by_linkedin_id(post.linkedin_id)

    def close(self):
        self.conn.close()
```

Esse código é bem autoexplicativo, com apenas o conhecimento básico de SQL e de python você consegue vizualizar o que está acontecendo, eu tanbém desenvolvi testes usando pytest e fixtures, mas vou deixar isso pra um post separado posterior que estou preparando...

## Bela sopa

Vamos parar agora organizar um parser, o qual irá transformar o html do linkedin nessa estrutura de dados, usaremos a blibioteca Beatfulsoap, muito comun no mundo de web scrapping, mas resumindo , ela nos permite navegar por uma estrutura de html a partir de um objeto python, mas para isso precisamos entender o que estamos buscando num post do linkedin como fiz isso em off eu defini a estrutura de dados antes , mas o meu processo se deu , ao rodar o script de busca de postagens, eu usei o famigerado print para pegar o conteúdo html de uma postagem e salvei num arquivo, mas usei o inspecionar do chrome/brave para descobrir algumas coisas que eu queria.

Utilizando o inspector do browser eu descobri algumas coisas:

- Podemos pegar o nome e a descrição do autor com seletores de css:
    - li div.update-components-actor div .update-components-actor__title
    - li div.update-components-actor div .update-components-actor__description
- A melhor forma de conseguir o link do perfil do usuário seria pegar o link que existe no avatar 
- Extrair o texto da postagem (esse foi simples)

Porém precisei dar uma de hacker pra descobrir como gerar os links corretos, pois o redirect é gerado ao clicar nos elementos, eles não possuem tags claras de para onde irão redirecionar. Inagino inclusive que isso deve causar alguma complexidade por parte das ferramentas de acessibilidade, gostaria de ver um estudo das redes sociais e o uso de leitores de tela nos navegadores. 

O que me entregou as peças que eu queria foi no componente da div, a qual possuia uma propriedade chamada `data-urn`, me parecia uma forma de identificar a qual post aquele componente pertencia, pesquisando um pouco descobri que era algo similar a isso conmo é apontado [neste post do stack overflow](https://stackoverflow.com/questions/4913343/what-is-the-difference-between-uri-url-and-urn#4913371). 

O urn em questão estava nesse padrão aqui `urn:li:activity:{ID_NUMERICO}` como mostra essa captura de tela

![image](captura-data-urn.png)

Depois disso decidi ver se achava esse cara em outro lugar, tentei enviar o post a um amigo como compartilhamento e não deu outra, lá no card do chat estava o nosso urn, dai foi fácil descobrir como gerar a url para um post através de um urn

![image](captura-chat-sharing.png)

Após algum ajuste gerei esse código aqui que por meio do Beatfulsoap extrai dados do html, gerando esse código final:

```python
from typing import List

from bs4 import BeautifulSoup

from vagabot.entities import Author, Post


class PostsFromSearchExtractor:
    AUTHOR_TITLE_SELECTOR = (
        "li div.update-components-actor div .update-components-actor__title"
    )
    AUTHOR_DESCRIPTION_SELECTOR = (
        "li div.update-components-actor div .update-components-actor__description"
    )
    AUTHOR_AVATAR_SELECTOR = "li div.update-components-actor div  a.app-aware-link"
    POST_CONTENT_SELECTOR = "li div.update-components-text span.break-words"
    POST_LINK_SELECTOR = "li div.feed-shared-update-v2"

    def __init__(self, posts: List[str]) -> None:
        self.posts = posts

    def __get_author(self, soup: BeautifulSoup) -> Author:
        avatar = soup.select_one(self.AUTHOR_AVATAR_SELECTOR)
        return Author(
            name=soup.select_one(self.AUTHOR_TITLE_SELECTOR).text.replace("\n", ""),
            description=soup.select_one(self.AUTHOR_DESCRIPTION_SELECTOR).text,
            avatar=avatar.find("img").get("src"),
            link=avatar.get("href"),
        )

    def __get_publication(self, soup: BeautifulSoup, author: Author) -> Post:
        urn = soup.select_one(self.POST_LINK_SELECTOR).get("data-urn")

        return Post(
            linkedin_id=urn,
            link=f"https://www.linkedin.com/feed/update/{urn}",
            author_id=author.id,
            content=soup.select_one(self.POST_CONTENT_SELECTOR).text,
        )

    def __to_dict(self, post: str) -> dict:
        soup = BeautifulSoup(post, features="lxml")
        urn = soup.select_one(self.POST_LINK_SELECTOR)
        if not urn:
            return None

        author = self.__get_author(soup)
        post = self.__get_publication(soup, author)
        return {"author": author, "post": post}

    def to_dict(self) -> List[dict]:
        result = []
        for idx, post_content in enumerate(self.posts):
            post = self.__to_dict(post_content)
            if not post:
                print(f"Not found valid content in post[{idx}]")
            else:
                result.append(post)

        return result
```

Agora que conseguimos extrair dados, transformar em objetos , basta mudar nosso script main para ter suporte a persistir os dados e pronto.


```python
# script.py
import argparse
import logging
import sys

from decouple import config

from vagabot.adapters.posts_from_search_adapters import PostsFromSearchExtractor
from vagabot.services import BrowserService
from vagabot.workflows import LinkedinAuth, LinkedinGetPosts

_se_router_host = config("SE_ROUTER_HOST", "localhost")
_se_router_port = config("SE_ROUTER_PORT", "4444")

# Como o service agora é global fica mais facil de encadear coisas se necessário
browser_service = BrowserService(
    se_router_host=_se_router_host, se_router_port=_se_router_port
)


def linkedin_auth(args) -> str:
    logging.info(f"Login for {args.user} in linkedin")
    service_auth = LinkedinAuth(browser_service)
    driver_key = browser_service.open_browser()
    service_auth.execute(driver_key, args.user, args.password)
    return driver_key


def search_posts(args) -> list:
    logging.info(f"Search posts: {args.query}")
    driver_key = linkedin_auth(args)
    service = LinkedinGetPosts(browser_service)
    finded_posts = service.execute(args.query, driver_key)
    result = PostsFromSearchExtractor(finded_posts).to_dict()
    browser_service.close(driver_key)
    return result




def main():
    # create common argarse without helper to keep global args
    common = argparse.ArgumentParser(add_help=False)
    # connect with sqlite 
    conn = sqlite3.connect(config("DB_FILENAME"))
    author_repository = AuthorRepository(conn)
    author_repository.create_table_ddl()
    post_repository = PostRepository(conn)
    post_repository.create_table_ddl()


    # Add global arguments
    common.add_argument(
        "-u", "--user", help="Linkedin Username", default=config("LINKEDIN_EMAIL", "")
    )
    common.add_argument(
        "-p",
        "--password",
        help="Linkedin Password",
        default=config("LINKEDIN_PASS", ""),
    )

    # Create the parser
    parser = argparse.ArgumentParser(
        description="CLI for user and password management.", parents=[common]
    )

    # Create the subparsers
    subparsers = parser.add_subparsers(dest="command")

    search_posts_parser = subparsers.add_parser(
        "search-posts", help="Search posts", parents=[common]
    )
    search_posts_parser.add_argument(
        "-q", "--query", required=False, help="Query for search", type=str
    )


    args = parser.parse_args()

    if args.command == "search-posts":
        result = search_posts(args)
        logging.debug(result)
        for item in result:
            author_repository.upsert_by_link(item["author"])
            post_repository.upsert_by_linkedin_id(item["post"])

    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
```

Agora basta atualizar nosso arquivo de .env para ter suporte ao sqlie con `DB_FILENAME=./db/vagabot.db` e testar o bot de novo.

Acho que por hoje já deu...


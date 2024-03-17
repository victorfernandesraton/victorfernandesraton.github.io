+++
title = 'Criando um bot para buscar vagas no linkedin Parte 1'
description = 'Implementando uma forma de logar no linkedin usando Python e selenium'
date = 2024-03-14T00:00:00-03:00
tags = ["python","linkedin", "web-scrapping", "selenium", "selenium-grid", "poetry", "docker" ]
cover = "cover.webp"
+++

# Disclaimer
O resultado que eu desenvolvi trata-se de um cli que automatiza por meio do selenium o acesso ao Linkedin, testei em minha conta pessoal e não tive problemas, mas não sei dizer qual a legalidade dessa brincadeira e se usuários detectados usufruindo desta poderão sofrer algum tipo de penalidade ou perder a sua conta. USE POR CONTA E RISCO

Este projeto assume que você saiba ler definições de [Dockerfile](https://github.com/victorfernandesraton/vagabot/blob/main/Dockerfile) , esteja habituado ao uso de ferramentas como [poetry](https://python-poetry.org/) e tenha em seu sistema python instalado ao menos na versão 3.11 e a versão mais recente do Docker com o plugin docker-compose. Lembrando que esses experiemtnos foram feitos no Debian 12 (bookworm), não sei até que ponto usar Mac ou Windows será reproduzivél

# Linkedisney: Um lugar para falar ~~mal~~ sobre seu trabalho

O linkedin é uma rede social que tem o intuito de conectar profissionais a outros profissionais e empresas, ou seja , um mar de confusão, posts motivacionais e pessoas ditando regras sobre if's e elses's, mas em meio a essa bagunça nada organizada , é possivél sim achar vagas de empregos.

Claro a plataforma tem toda uma estrutura de anúncios de empregos e formas de aplicações, ainda que, sem saber o motivo, eu tenho encontrado posts de anuncio de vagas , onde constam a descrição da posição, os requisitos e por fim alguma forma de contato, bem como aprendi recentemente por meio do [post do Gab Bo](https://www.linkedin.com/posts/gabebo_existem-milhares-de-vagas-escondidas-no-linkedin-activity-7159184550667923457-rHei) , dessa forma decidi criar uma ferramenta de CLI (por hora) que auxiliasse as pessoas a fazerem network em cima dessas postagens do linkedin, afinal o que conta pra uma vaga de emprego é o famoso QI (Quem indica)

# Vamos ao diagrama postumo

Como bom desenvolvedor, adepto do Go Horse, eu simplesmente fui desenvolvendo tudo da forma mais ~~estúpida~~ criativa que conheço, mas como nem toda boa ação sai impune, tive que organizaer essa bagunça em passos com o inutito de ~~tentar~~ descrever o que eu pensei como solução pra essa brincadeira, afinal amo gastar um mês automatizando algo que faço em meia hora.

Piadas de gosto duvidoso a parte, esses são os objetivos e fluxos necessários para este projeto

1. Implementar uma forma de autenticar no linkedin sem ser detectado como bot
2. Buscar postagens com base na query do usuário, como por exemplo "vaga" + "estágio" + "java" + "remoto"
3. Comentar (por hora de forma genérica) em postagens encontradas em que ainda não comentou
4. Dar um like nessas postagens
5. Se conectar aos autores da postagem

E assim fariamos nosso network.

Por hoje vamos criar a estrutura de gerenciamento dos navegadores e implementar o passo 1

# Dependencias

Para entender melhor as depedências que serão usadas no projeto recomendo dar uma conferida (ou copiar e colar) as definições do nosso Dockerfile no [repositório do bot](https://github.com/victorfernandesraton/vagabot)

# Vamos criar nosso container

Para facilitar o uso ~~e por cuasa da minha preguiça~~, usaremos o selenium e o selenium-grid como base pra esse projeto, como a documentação descreve na captura que tirei no dia 16/03/2024 é uma ferramenta para automatizar o browser e é isso... Já o selenium-grid é uma solução que permite manipular webdrivers do selenium em maquinas geridas remotamente. Resumindo para nosso caso de uso, vamos criar uma configuração de containeres com o docker-composer que nos permita criar containeres de navegadores pré configurados para serem operados pelo selenium, asism estarei reduzindo todo o atrito que normalmente temos ao usar o selenium que é selecionar o navegador da maquina rost pra ser usado.

Para fazer essa magia toda funcionar, iremos usar docker e docker-composer, que é por onde vamos começar:

```yaml

# To execute this docker-compose yml file use `docker-compose -f docker-compose-v3-full-grid.yml up`
# Add the `-d` flag at the end for detached execution
# To stop the execution, hit Ctrl+C, and then `docker-compose -f docker-compose-v3-full-grid.yml down`
version: "3"
services:
  worker:
    build: .
    container_name: vagabot-worker
    environment:
      - LINKEDIN_EMAIL=${LINKEDIN_EMAIL}
      - LINKEDIN_PASS=${LINKEDIN_PASS}
      # this define host for selenium grid router, if you runing outside container is should be http://localhost:4444 by default
      - SE_ROUTER_HOST=selenium-router
      - SE_ROUTER_PORT=4444
      - DB_FILENAME=./db/vagabot.db
    depends_on:
      - selenium-router
    volumes:
      - ./db:/usr/app/db

  selenium-event-bus:
    image: selenium/event-bus:4.1.1-20211217
    container_name: vagabot-selenium-event-bus
    ports:
      - "4442:4442"
      - "4443:4443"
      - "5557:5557"

  selenium-sessions:
    image: selenium/sessions:4.1.1-20211217
    container_name: vagabot-selenium-sessions
    ports:
      - "5556:5556"
    depends_on:
      - selenium-event-bus
    environment:
      - SE_EVENT_BUS_HOST=selenium-event-bus
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443

  selenium-session-queue:
    image: selenium/session-queue:4.1.1-20211217
    container_name: vagabot-selenium-session-queue
    ports:
      - "5559:5559"
    depends_on:
      - selenium-event-bus
    environment:
      - SE_EVENT_BUS_HOST=selenium-event-bus
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443

  selenium-distributor:
    image: selenium/distributor:4.1.1-20211217
    container_name: vagabot-selenium-distributor
    ports:
      - "5553:5553"
    depends_on:
      - selenium-event-bus
      - selenium-sessions
      - selenium-session-queue
    environment:
      - SE_EVENT_BUS_HOST=selenium-event-bus
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_SESSIONS_MAP_HOST=selenium-sessions
      - SE_SESSIONS_MAP_PORT=5556
      - SE_SESSION_QUEUE_HOST=selenium-session-queue
      - SE_SESSION_QUEUE_PORT=5559

  selenium-router:
    image: selenium/router:4.1.1-20211217
    container_name: vagabot-selenium-router
    ports:
      - "4444:4444"
    depends_on:
      - selenium-distributor
      - selenium-sessions
      - selenium-session-queue
    environment:
      - SE_DISTRIBUTOR_HOST=selenium-distributor
      - SE_DISTRIBUTOR_PORT=5553
      - SE_SESSIONS_MAP_HOST=selenium-sessions
      - SE_SESSIONS_MAP_PORT=5556
      - SE_SESSION_QUEUE_HOST=selenium-session-queue
      - SE_SESSION_QUEUE_PORT=5559

  chrome:
    container_name: vagabot-selenium-chrome
    image: selenium/node-chrome:4.1.1-20211217
    shm_size: 2gb
    depends_on:
      - selenium-event-bus
    environment:
      - SE_EVENT_BUS_HOST=selenium-event-bus
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_INSTANCES=4
      - SE_NODE_MAX_SESSIONS=4

```
Um pouco extenso não? Mas explicando o que acontece aqui nesse docker-compose, definimos os serviços do selenium-grid onde cada um tem uma responsabilidade


1. `selenium-event-bus`: Este serviço executa o barramento de eventos Selenium, que é usado para comunicação entre os diferentes componentes da grade Selenium.
2. `selenium-sessions`: Este serviço gerencia as sessões Selenium. Ele depende do `selenium-event-bus`.
3. `selenium-session-queue`: Este serviço é responsável por gerenciar a fila de sessões Selenium. Ele também depende do `selenium-event-bus`.
4. `selenium-distributor`: Este serviço distribui as sessões Selenium para os nós disponíveis. Ele depende do `selenium-event-bus`, `selenium-sessions` e `selenium-session-queue`.
5. `selenium-router`: Este serviço roteia as solicitações para o componente apropriado na grid Selenium. Ele depende do `selenium-distributor`, `selenium-sessions` e `selenium-session-queue`.
6. `chrome`: Este serviço executa um nó Selenium que permite a execução de uma instância do chrome, podemos usar ele como base para definir outros navegadores como firefox e o Edge com suporte ao Internet Exxplorer habilitado.

Agora ao utilizar o comando abaixo teremos toda a nossa infra de selenium disponivél com uma interface web que permite a visualização das sessões ativas por meio do protocolo VNC 
```bash
docker compose up -d --build
```

Podemos verificar se está funcionado acessando localhost:4444, mas apenas verá um painel vazio como mostra o print abaixo

# Implementando o browser e o login

Agora que temos nossa infraestturua, vamos por nossa mão na massa para conseguir logar no linkedin sem ser detectado como bot , essa parte do projeto ainda está meio obscura, pois ainda não consegui desvendar de fato a metodologia aplicada pelo linkedin para esta detecção.

Para isso eu criei um diretório `vagabot/workflows` para podeer modularizar melhor a aplicação, tudo que for executado no browser será nesse tal de módulo workflows

Então , usando python decidi definir uma instância de browser anonimizada por meio de configurações de agente. Essa brincadeira ficou mais ou menos assim:

```python
# vagabot/workflows/linkedin_workflow.py                                                                                         56,2       
import time
from abc import abstractmethod

import fake_useragent
from decouple import config
from selenium import webdriver
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from undetected_chromedriver import ChromeOptions


class LinkedinWorkflow:
    # TODO: moving foward for cli
    _se_router_host = config("SE_ROUTER_HOST", "localhost")
    _se_router_port = config("SE_ROUTER_PORT", "4444")

    def __init__(self) -> None:
        self.drivers: dict[str, WebDriver] = {}
        if self._se_router_port:
            self._se_router_url = (
                f"http://{self._se_router_host}:{self._se_router_port}"
            )
        else:
            self._se_router_url = f"http://{self._se_router_host}"

    @staticmethod
    def human_input_simulate(element: WebElement, content: str, delay=1):
        for key in content:
            time.sleep(delay)
            element.send_keys(key)

    def open_browser(self) -> str:
        print(f"Open browser in {self._se_router_url}")
        opts = ChromeOptions()
        opts.add_argument(
            f"user-agent={fake_useragent.UserAgent(os='windows', browsers=['chrommiun'])}"
        )
        driver = webdriver.Remote(options=opts, command_executor=self._se_router_url)

        if not driver.session_id:
            raise Exception("Not able to regisrer a driver")
        driver.maximize_window()
        self.drivers[driver.session_id] = driver

        return driver.session_id

    def close(self, driver_key: str):
        self.drivers[driver_key].close()
        del self.drivers[driver_key]

    def __del__(self):
        for driver_key in list(self.drivers.keys()):
            self.close(driver_key)

    @abstractmethod
    def execute(self, *args, **kwargs): ...
```


usando a blibioteca `fake_useragent` no método `open_browser`, pude implementar um browser cujo as configurações são pouco detectáveis, de forma que simule um pc com Windows usando o chrome, algo não muito incomun certo?

Usando o `webbdricver.Remote` provido pela blibioteca do selenium eu pude configurar uma instancia de browser que usa as variaveis de anbiente `SE_ROUTER_HOST` e `SE_ROUTER_PORT`

No construtor da classe (método `__init__`) eu implemento um dicionario de webdrivers, para que eu possa ter multiplos browsers instanciados por execução, algo que usarei no futuro para paralelizar a execução

O método `human_input_simulate` é uma gambiarra para que o input de textos e conteúdos ao serem digitados possuam um dlay de um segundo ao menos para que o bnt não seja detectado por digitar rápido demais, algo que acontecia com frequencia ao tentar logar

defini um método abstrato para poder usar essa classe como base para as demais, mas basicamente criamos uma classe abstrata que definie como vai ser a esttrutura interna da execução que de fato irá controlar o navegador

Em seguida e por algum motivo que eu não me lembro, decidi separar a instância do navegador e a função de logar no linkedin em classes separadas, dessa forma ficamos com a seguinte implementação

```python
# vagabot/workflows/linkedin_auth.py
import logging
import time

from selenium.common import exceptions
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

from vagabot.workflows.linkedin_workflow import LinkedinWorkflow


class LinkedinAuth(LinkedinWorkflow):
    USERNAME_INPUT_XPATH = "//input[@id='session_key']"
    PASSWORD_INPUT_XPATH = "//input[@id='session_password']"
    BUTTON_SUBMIT_XPATH = "//*[@id='main-content']/section/div/div/form/div/button"

    def login(self, driver: WebDriver, username: str, password: str):
        logging.info("go to site")
        driver.maximize_window()
        driver.get("https://www.linkedin.com")
        input_wait = WebDriverWait(driver, timeout=30)
        logging.info("set input")
        input_list = {
            self.USERNAME_INPUT_XPATH: username,
            self.PASSWORD_INPUT_XPATH: password,
        }
        for xpath, value in input_list.items():
            try:
                txt_input = input_wait.until(
                    EC.presence_of_element_located((By.XPATH, xpath))
                )
                self.human_input_simulate(txt_input, value)
            except exceptions.TimeoutException:
                raise Exception(f"Not found {xpath} input")

        try:
            time.sleep(5)
            btn_submit = input_wait.until(
                EC.presence_of_element_located((By.XPATH, self.BUTTON_SUBMIT_XPATH))
            )

            btn_submit.click()
            logging.info("button clicked")
        except exceptions.TimeoutException:
            raise Exception("Not found button input")
```
Aqui está uma explicação detalhada do que o código faz:

1. **Importações**: O código começa importando os módulos necessários. Isso inclui `logging` e `time` do Python padrão, várias classes e funções do pacote `selenium`, e a classe `LinkedinWorkflow` de um módulo local.

2. **Definição da Classe**: A classe `LinkedinAuth` é definida, herdando de `LinkedinWorkflow`. Ela contém três constantes de classe que definem os caminhos XPATH para os campos de entrada do nome de usuário e senha e o botão de envio na página de login do LinkedIn.

3. **Método de Login**: A classe `LinkedinAuth` tem um método chamado `login` que aceita três argumentos: um objeto `WebDriver`, um nome de usuário e uma senha. Este método automatiza o processo de login no LinkedIn da seguinte maneira:
    - Primeiro, ele registra uma mensagem de log, maximiza a janela do navegador e navega até a página inicial do LinkedIn.
    - Em seguida, ele cria um objeto `WebDriverWait` que será usado para pausar a execução do script até que certas condições sejam atendidas.
    - Ele define um dicionário `input_list` que mapeia os caminhos XPATH dos campos de entrada para os valores correspondentes do nome de usuário e senha.
    - Para cada par de caminho XPATH e valor no dicionário `input_list`, ele tenta localizar o elemento de entrada correspondente na página e simula a digitação do valor no campo de entrada. Se o elemento de entrada não for encontrado dentro do tempo limite, ele lança uma exceção.
    - Depois de preencher os campos de entrada, ele pausa a execução do script por 5 segundos. Isso pode ser para dar tempo para a página processar as entradas ou para simular o comportamento humano.
    - Finalmente, ele tenta localizar o botão de envio na página e clica nele. Se o botão de envio não for encontrado dentro do tempo limite, ele lança uma exceção.

Nós já conseguimos testar essa brincadeira no terminal interativo do python

Assumindo que você visitou o [repositório do vagabot](https://github.com/victorfernandesraton/vagabot), tenha copiado nosso `requirements.txt` e nosso arquivo `pyproject.toml`, iremos iniciar nosso projeto da seguinte forma:

1. Criando um anbiente virtual python
```bash
python -m venv .venv
```

2. Ativando esse anbiente virtual (exemplo linux)
```bash
source .veenv/bin/activate
```

3. Instalando o poetry no anbiente virtual
```bash
pip install -r requirements.txt
```

4. Instalando as dependeicas do projeto via poetry
```bash
poetry install --no-interaction
```

5. Defina um arquio .env com os valores `LINKEDIN_EMAIL` e `LINKEDIN_PASS` com os valores de seu usuário e senha
6. Abra o interpretador do python localmente com o comando python apenas
7. Digite os seguintes comandos no interpretador dinamico, lembrando que linha a linha para dar certo
```bash
Python 3.11.2 (main, Mar 13 2023, 12:18:29) [GCC 12.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> from decouple import config
>>> print(config("LINKEDIN_EMAIL"))
vfbraton@gmail.com
>>> from vagabot.workflows.linkedin_auth import LinkedinAuth
>>> service = LinkedinAuth()
>>> driver_key = service.open_browser()
Open browser in http://localhost:4444
>>> service.login(username=config("LINKEDIN_EMAIL"),password=config("LINKEDIN_PASS"),driver=service.drivers[driver_key])
>>> service.close(driver_key)
```

Agora podemos iniciar o anbiente interativo do python e importar o que queremos, com o cli ativo basta chamar nosso módulo e o método passando o login e a senha. Lembrando que antes desse passo recomenda-se logar no linkedin no seu navegador.

Como exemplo você pode ver o teste no vídeo abaixo do que fiz acima

{{< video "./video_login_linkedin_demo.mp4" >}}

E assim conseguimos cumprir nosso primeiro objetivo, uma implementação geral que consegue logar no linkedim.

Ufa! Por hoje é só, nos vemos por ai...

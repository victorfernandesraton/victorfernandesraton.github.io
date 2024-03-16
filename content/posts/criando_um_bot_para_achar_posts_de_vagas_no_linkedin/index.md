+++
title = 'Criando um bot para achar posts de vagas no linkedin'
description = 'Usando querys de postagens e selenium para automatizar o processo de busca de vagas no linkedin'
date = 2024-03-14T00:00:00-03:00
tags = ["python","linkedin", "web-scrapping", "selenium", "selenium-grid" ]
+++

# Disclaimer
O resultado que eu desenvolvi trata-se de um cli que automatiza por meio do selenium o acesso ao Linkedin, testei em minha conta pessoal e não tive problemas, mas não sei dizer qual a legalidade dessa brincadeira e se usuários detectados usufruindo desta poderão sofrer algum tipo de penalidade ou perder a sua conta. USE POR CONTA E RISCO

# Linkedisney: Um lugar para falar <del>mal</del> sobre seu trabalho

O linkedin é uma rede social que tem o intuito de conectar profissionais a outros profissionais e empresas, ou seja , um mar de confusão, posts motivacionais e pessoas ditando regras sobre if's e elses's, mas em meio a essa bagunça nada organizada , é possivél sim achar vagas de empregos.

Claro a plataforma tem toda uma estrutura de anúncios de empregos e formas de aplicações, ainda que, sem saber o motivo, eu tenho encontrado posts de anuncio de vagas , onde constam a descrição da posição, os requisitos e por fim alguma forma de contato, bem como aprendi recentemente por meio do [post do Gab Bo](https://www.linkedin.com/posts/gabebo_existem-milhares-de-vagas-escondidas-no-linkedin-activity-7159184550667923457-rHei) , dessa forma decidi criar uma ferramenta de CLI (por hora) que auxiliasse as pessoas a fazerem network em cima dessas postagens do linkedin, afinal o que conta pra uma vaga de emprego é o famoso QI (Quem indica)

# Vamos ao diagrama postumo

Como bom desenvolvedor, adepto do Go Horse, eu simplesmente fui desenvolvendo tudo da forma mais <del>estúpida</del> criativa que conheço, mas como nem toda boa ação sai impune, tive que fazer esse diagrama com o inutito de <del>tentar</del> descrever o que eu pensei como solução pra essa brincadeira, afinal amo gastar um mês automatizando algo que faço em meia hora.

Piadas de gosto duvidoso a parte, esses são os objetivos e fluxos necessários para este projeto

- Buscar postagens com base na query do usuário, como por exemplo "vaga" + "estágio" + "java" + "remoto"
- Comentar (por hora de forma genérica) em postagens encontradas em que ainda não comentou
- Dar um like nessas postagens
- Se conectar aos autores da postagem

E assim fariamos nosso network.

Todavia , pro se tratar de uma prova de conceito , eu decidi me ater aos dois primeiros itens, sem mais delongas aqui está o diagrama do que quero fazer 

[DIAGRAMA]

# Vamos criar nosso container

Para facilitar o uso <del>e por cuasa da minha preguiça</del>, usaremos o selenium e o selenium-grid como base pra esse projeto, como a documentação descreve na captura que tirei no dia 16/03/2024 é uma ferramenta para automatizar o browser e é isso... Já o selenium-grid é uma solução que permite manipular webdrivers do selenium em maquinas geridas remotamente. Resumindo para nosso caso de uso, vamos criar uma configuração de containeres com o docker-composer que nos permita criar containeres de navegadores pré configurados para serem operados pelo selenium, asism estarei reduzindo todo o atrito que normalmente temos ao usar o selenium que é selecionar o navegador da maquina rost pra ser usado.

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



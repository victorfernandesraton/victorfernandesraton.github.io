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



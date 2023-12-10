---
title: RPA e Automação Parte 1 - webscraping e webcrawler
description: Como começar a extrair dados da web 
published_at: 2023-12-08
cover: /public/assets/img/ok-logo.png
tags: ["python", "scrapping", "open source","Quickstart"]
-

# Disclaimer

Primeiramente eu gostaria de salientar que neste artigo eu apresento um compilado para iniciar as pessoas no mundo de RPA, webscrapping e webcrawler com base na minha recente experiência como desenvolvedor na Squad de Automação da Rede Lojacorr, logo o conteúdo apresentado será baseado unicamente na minha (falha) OPINIÃO.

# Botando o pingo nos I's

Como o objetivo aqui é ser prático e demonstrar um guia, um passo a passo do processo de automatizar as coisas pensando em web, irei assumir alguns fatos a respeito de você:

1 - Sabe que web scrapping diz respeito a raspagem de dados, isto é entender a estrutura de como uma página web é apresentada como HTML e raspar dela as informações que você precisa;
2 - Sabe que web crawler é o ato de "engatinhar" pelas aplicações web, isto é navegar por elas para poder testar o seu funcionamento e/ou extrair dados, o que a diferencia da raspagem é que esta exige que você simule ser um usuário no navegador , uma especie primitiva de bot.
3 - Sabe que RPA é a sigla para Robotic Process Automatization ou Automação de Processos Robóticos, ou seja automatizar a intervenção humana em um processo
4 - Sabe o que é python
5 - Sabe o básico de front-end "classico", HTML e CSS


Sem mais delongas....

# O problema

Devido a presença de novas modalidades de impostos nos ecomerces disponiveis no brasil, comprar algo se tornou complicado, ainda que existam sites como promobit que ajudam a descobrir promoções , eu como o chato cagador de regra que sou gosto de comprar algo com o melhor preço possivél e com a maior garantia de entrega.

Quando eu comprei meu celular recentemente eu percebi que o preço e disponibilidade em ecomerces tendem a variar , dai eu decidi fazer um projeto no qual eu busque nos sites de confiança que normalmente compro, comapre o acrescimo de impostos e de frete e encontre a melhor solução.

Dessa forma escolhi a metodologia de verificar na Amazon, Aliexpress, Mercado Livre , comparar os custos e trazer uma lista com link e ranqueamento dessas páginas.

# A parte filósfica

Entenda antes de quaisuqer linha de código o que você pretende automatizar, conheça o processo e os caminhos que deseja percorrer, quais botões apertar, quais formas usar para identificar esses botões, procure se aproveitar de atalhos e brechas, link de rotas previsivéis, requisićões http realizadas que podem ser reaproveitadas, possivéis erros e impecilhos como pop-ups, modais , e campos de formuários.

# Primeira ferramenta

Para conseguir entender o que eu estou automatizando , eu preciso entender como funciona e ninguém melhor que o navegadoer pra me dizer como uma página web funciona.

Irei apresentar as ferramentas usando o librewolf um navegador feito em cima do firefox, mas você pode fazer virtualmente as mesmas coisas em navegadores chromiun, não sei a respeito do safari (e não me importo)

A ferramenta que iremos utilizar é a aba Elements que nos permite ver os elementos DOM que compoem a tela, nela tanbém possuimos um campo de busca que nos permite usar css selector ou xpath para poder encontrar os elementos.

Usando o atalho Ctrl+Shift+i no librewolf eu consigo acessar essas ferramentas, e como veremos nas capturas de tela abaixo eu consigo ainda fazer algumas outras coisas



# Jeff Bezos land

Pensando nisso vamos navegar um pouco na amazon. Como moro no brasil usarei amazon.com.br para garantir que n vou pagar em dolar por algo que vai demorar 120 dias para não chegar


Primeiro o campo de busca, ao inspecionar o elemento vemos que trata-se de um input com o id unifiedLocation1ClickAddress

[PRINT IMAGEM INPUT AMAZON]

Tenho uma teoria de que ao clicar no tipo de produto ele mude esse id...

[CAPTURA DO INPUT MUDANDO AMAZON]

Minha teoria estava certa, não podemos confiar nesse id , vamos subir um pouco mais e verificar se esse input està dentro de um form

[CAPUTRA DO FORM AMAZON]

Como eu suspeitava novamente , achamos nosso suspeito, agora com as informações que temos , basta elaborarmos uma estratégia para chegar a este form, mas parece que ele possui um name o que garante que consigamos buscar por ele de forma mais precisa, e vualá nosso primeiro resource, um  xpath que nos leva ao form

```
//form[@name='site-search']
```

Ainda que eu não vá usar, vou testar por encargo de consciencia a versão americana do site da Amazon com amazom.com e ver se o mesmo truque funciona

[CAPTURA AMAZOM AMEICANA INPUT]

Parece que funcionou...

seguimos o passo agora de capturar o botào de envio para click

Depois iremos ao passo de descobrir como extrair os dados da página, irei usar o preço, nome do produto

Para o nome vamos usar este xpath `//span[@id='productTitle']` pois ao analisar a DOM, vimos que é o único elemento que correspode a esse padrão

[CAPTURA NOME PRODUTO AMAZON]

Para o preço foi um pouco mais complicado pois não havia um id , suponho que isso seja feito pra dificultar justamente o que estou fazendo, mas acredito que o primeiro item do selector `div#rightCol div#buybox > div .a-price .a-offscreen` já resolva nosso caso

[CAPTURA PREÇO AMAZON]

Em seguida iremos extrair o código EAN, mais precisamente detalhes técnicos, como estão em duas tabelas, basta processar em seguida todos os elemento do seguinte selector `table.prodDetTable` 

[CAPTURA DAS TABELAS AMAZON]

Por fim vamos preeencher o campo de CEP com o seu , para isso temos que clicar no link para cálculo de frete, por meio desse selector
`div#cipInsideDeliveryBlock_feature_div a`

[CAPTURA DO BOTÃO DE FRETE AMAZON]


E por fim usando esse xpath `//div[@role='dialog']//div[@id='GLUXZipInputSection']//input` conseguimos a lista de inputs que iremos usar

[CAPTURA DOS INPUTS DE CEP AMAZON]

Agora é só pegar o preço do frete e pronto , processo de extração de dados desenvolvido

[CAPTURA DE PRECO DE ENTREGA AMAZON]

Tendo tudo isso em mente vamos começar a desenvolver nossa solução

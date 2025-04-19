+++
title = 'Guia de webcrawler parte 1 - Webcrawler VS Scrapper'
description = 'Pegar dados ou engatinhar sobre Apps?'
date = 2025-04-01T00:00:00-03:00
draft = true
tags = ["python", "elixir", "wikipedia"]
+++

## Disclaimer

Arte não tem preço , o intuito aqui não é dizer que filme X ou Y vale mais ou menos com base no preço, mas como fã de arte e do ecosistema do Jovem ~Velho~ Nerd , e como pessoa que acha muito dahora o trabalho do Anderson Gaveta, eu gosto de entender as coisas desse mundo.

# Um pouco de storytelling...

Era fim de carnaval, eu estava levemente acoolizado em casa e altamente entediado, assistindo a festa do Oscar com a vitória de "Ainda Estou Aqui" e fazendo vários nadas, quando vi um debate idiota no Twiiter (Me recuso a chamar de X) sobre implicações de uso de dinheiro da Lei Ruanet no financiamento do filme.

Obvío que uma bela de uma fake news, mas fiquei pensando com os dois neurônios que ainda me restavam pré-ressaca "O quanto custa ganhar um Oscar", isto é, qual a característica financeira dos filmes indicados, vencedores e perdedores.

Me lembrei de algum vídeo do Gaveta, falando sobre essa coisa de usar como propaganda do filme o seu "Baixo Custo" e que isso não é de hoje, como fã de Interstellar eu lembro de todo burburinho na época de lançamento dessa obra-prima, sobre o quão barato foi o filme , mesmo tendo efeitos especiais malucos.

Eu sei que há todo um debate sobre efeitos práticos x especiais desde toda a história por trás do [fenômeno Barbiehimer](aaaa)

Então no meio dessa enchurradas de pensamentos pensei, eu sou um dev que tem skill o suficiente pra fazer uuma dataset e entender esse fenômeno. As 1h da manhã de um domigo (ou segunda) de carnaval, toda energia nervosa após assistir a cerimnônia do oscar, me fez ligar o notebook e começar a codar essa loucura.

O resultado foi que eu fiz um Raspador de dados usando a Wikipedia, Integrei resultados usando a API do OMDB. O resultado [pode ser visto aqui](https://oscarinsights.streamlit.app/)

Mas o que foi esse Scrapper (Raspador) e porquê não um Crawler?

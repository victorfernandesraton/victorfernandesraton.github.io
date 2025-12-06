+++
title = 'REST API: Porquê você complica?'
description = 'Qauis erros e complicações podemos evitar ao escrever uma API REST'
date = 2025-12-06T02:12:00-03:00
tags = ["python", "api", "rest", "http"]
draft = false
+++

# Esta apresentação NÃO é sobre: 

- Criar uma API REST do zero
- Um curso sobre HTTP
- Um curso de FastAPI/Python

Porém se possui interesse nessses temas, recomendo muito o curso [FastAPI do Zero](https://fastapidozero.dunossauro.com/estavel/) publicado pelo [Eduardo Mendes](https://dunossauro.com).

# A web , REST API e Hipermidia

Se você atua na área de tecnologia como desenvolvedor de sofware para a web, já deve estar familiarizado com o termo API(Application Progaming Interface - Interface de Programação de Aplicação), que pode ser toda e quaisquer aplicação que tem como objetivo interfacear de forrma programavél algum recurso, indo de consulta a base de dados a acesso a recursos de hardware como GPU.

Exemplos de API que podemos citar seria o uso de GPU por meio do navegador, através da [API WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

Porém pensando em aplicações web, uma API REST(ful) - Representational State Transfer, refere-se a uma forma de controlar e restringir uma aplicação por meio de representação de estados destas em recursos. Atualmente o formato mais comun de implementação consiste em um servidor Web que por meio do protocolo HTTP (Hipertext Transfer Protocol) que entrega as informações a respeito dos estados em estrutura JSON (Javascript Object Notation).

Um exeplo de API aberta ao público seria a API [OMDb](https://www.omdbapi.com/), Open Movie Databse 

Nesta conversa, o termo Hipermidia, mais precisamente o acrônomo Hypermedia as the engine of application state (HATEOAS), seria uma forma de implementação de arquitetura para REST API que por meio das hipermidias, torna a consulta e navegação pelos recursos mais dinâmica, conseguindo comunicar por meio de metadados e padrões, formas de navegação e integração entre os recursos disponibilizados.

A principal e mais comun forma de implementação de HATEOS em aplicações modernas é dada por meio da implementação de recursos com [HAL - Hypertext Application Language](https://en.wikipedia.org/wiki/Hypertext_Application_Language), onde adicionamos a resposta do dado, possivéis links relacionados a este, como exemplo a resposta abaixo.

```json
{
  "_links": {
    "self": {
      "href": "http://example.com/api/book/hal-cookbook"
    }
  },
  "id": "hal-cookbook",
  "name": "HAL Cookbook"
}
```

# HATTEOS é complicado

Implementar essa estrutura é um desafio tecnológico que gira em torno de 3 principais fatores de complexidade.

- Implementações não são claras: Por se tratar de uma estrutura de arquitetura, estaria mais para uma recomendação que não pode ser validada de forma quantitativa, além de não possuir uma estrutura padrão, afinal de acordo com a estrutura de dados implementada, maior tende a ser a complexidade de metadados a serem adicionados. Ainda que existam implementações de arquitetura, a ausência de um protocolo comun leva a implementações dúbias que precisam ser comunicadas por meio de documentação.
- Degradação de performance: Ao misturar conteúdo com seu metadado, acabamos por cair na amardilha da serialização, onde eu preciso serializar toda a informação obtida, apenas para então utilizar uma url de referência, independente da necessidade de uso do dado obtido em si, é utilizado recurso para deserializar este. Um exemplo seria lidar com recursos aninhado em tempo de serialização para um caso em que apenas consumo o metadado, tais como estrutura de paginação.
- Muita/Pouca Informação: Gira em torno da incapacidade de escolher entre metadados apenas ou leitura de conteúdo, obrigando a utilização de recurso para sempre produzir o conteúdo resultante de quaisquer formas.

# Referências

- [API REST - o que é API REST?](https://www.redhat.com/pt-br/topics/api/what-is-a-rest-api), Acessado em 06/12/2025.
- [WebGL: 2D and 3D Graphics for the web](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API), Acessado em 06/12/2025
- [OMDb API - The Open Movie Database](https://www.omdbapi.com/), Acessado em 06/12/2025
- [Hypertext Application Language - Wikipedia](https://en.wikipedia.org/wiki/Hypertext_Application_Language), Acessado em 06/12/2025

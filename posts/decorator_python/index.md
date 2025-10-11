+++
title = 'Desvendamdo decorators em Python'
date = 2024-01-20T10:27:08-03:00
draft = false
description ='Decorators: O que são, aonde vivem e o que comen'
tags = ["python", "designpattern", "decorators"]
cover = 'cover.jpg'
layout = 'post.tsx'
+++
# O que são decorators

Você, desenvolvedor, já esteve em uma situação em que precisava estender um comportamento padrão de um método ou função, mas queria manter isso separado da implementação do mesmo? Você precisa aprender mais sobre o Padrão de Projeto Decorator.

Por definição, o Decorator é um Padrão de Projeto do tipo estrutural que permite interagir e modificar o comportamento padrão de objetos envolvendo estes com outros objetos (o famoso wrapper), assim você consegue estender e implementar aquilo que precisa sem modificar o objeto original.

Um exemplo prático desse design seria a ideia de periféricos de um computador. Você pode ter um desktop com um gabinete que contém peças essenciais para o funcionamento do computador, como CPU, memória RAM, placas de rede e áudio, disco rígido, mas você pode adquirir um monitor curvo, teclado mecânico, headsets e periféricos no geral que interagem com os componentes principais para adicionar novas funcionalidades.


# Quando usar
- Estender classes sem criar heranças malucas
- Criar modularizações genéricas que podem ser usadas em vários tipos de classes
- Manter as responsabilidades coesas entre os módulos
- Adicionar funcionalidades de forma dinâmica em tempo de execução


# O que devemos evitar
- Empilhar decorators interdependentes de forma que fique complexo remover um decorator de uma pilha
- Evitar usar quando precisar serializar ou clonar algo, isso pode ser uma grande dor de cabeça
- Usar o decorator para substituir composição


# Para os pythonistas
Assim como em algumas linguagens, o python possui uma sintaxe que permite associar decorators a métodos e funções por meio do uso do @ ou como alguns chamam annotation, assim como veremos no exemplo abaixo



```python
# Definir um decorator que adiciona um periférico ao computador
def adicionar_periferico(periferico):
    def decorador_interno(computador):
        def wrapper():
            print(f"Conectando o {periferico} ao computador...")
            computador()
            print(f"O {periferico} está pronto para usar!")
        return wrapper
    return decorador_interno

# Definir uma função que representa um computador básico
def computador_basico():
    print("O computador básico possui gabinete, monitor, teclado e mouse.")

# Usar o decorator para adicionar uma impressora ao computador
@adicionar_periferico("impressora")
def computador_com_impressora():
    computador_basico()

# Usar o decorator para adicionar um scanner ao computador
@adicionar_periferico("scanner")
def computador_com_scanner():
    computador_basico()

# Chamar as funções decoradas
computador_com_impressora()
computador_com_scanner()

```
# Outros exemplos

No mundo python existem muitas blibiotecas que utilizam de decorator para fornecer algumas funcionalidades, como por exemplo [Flask](https://flask.palletsprojects.com "Link para Flask") e [FastAPI](https://fastapi.tiangolo.com "Link para FastAPI") que usam e abusam dos decorators para poder gerenciar rotas e controllers http

```python
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'
```
Outro caso de uso está na blibioteca de testes mais recomendada do mundo python, pytest, que usa a estrutura de decorators para várias coisas , entre elas parmetrizar fixtrures e adicionar flags para ignorar certos testes

```python
# Importar a biblioteca pytest
import pytest

# Definir uma fixture que recebe um parâmetro chamado "nome"
@pytest.fixture
def nome(request):
    # Retornar o valor do parâmetro
    return request.param

# Definir um teste que usa a fixture nome e define o valor do parâmetro
@pytest.mark.parametrize("nome", ["João", "Maria", "Pedro"])
def test_saudacao(nome):
    # Verificar se a saudação está correta
    assert f"Olá, {nome}!" == saudacao(nome)jjj

# O teste abaixo será ignorado por causa de um dos decorators
@pytest.mark.parametrize("nome", ["Jorge"])
@pytest.mark.skip(reason="Apenas para demonstrar o skip")
def test_saudacao_ignorado(nome):
    # Verificar se a saudação está correta
    assert f"Olá, {nome}!" == saudacao(nome)jjj

```
Esse foi nosso passeio pelos decoratos, bem utíl não? Fico por aqui é até a próxima

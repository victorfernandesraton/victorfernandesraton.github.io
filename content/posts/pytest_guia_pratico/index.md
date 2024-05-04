+++
title = 'Pytest: guia prático'
date = 2024-04-27T20:58:21-03:00
draft = false
description ="Um guia com o que eu uso no meu dia-a-dia"
tags = ["python", "pytest", "tests", "unittest"]
cover = ""
+++

# Afinal pra quê testes?

Desenvolver software nunca foi fácil, não basta saber programar, tem que dominar um conjunto de conhecimentos e ferramentas para que se tenha um resultado eficaz em seu papel ao passo que outros programadores consigam atuar nesse projeto.

Uma das formas de garantir e comprovar o funcionasmento de um software é por meio de testes, e uma forma de aprimorar a qualidade daquilo que está sendo desenvolvido é por meio de testes automatizados, pois além de ajudarem a entender as funcionalidades, estes testes podem servir como evidência de funcionamento, bem como garantia de funcionamento e de retrocompatibilidade , além de controle de qualidade.

O python , da forma mais comun que conhecemos (CPython) traz no seu kit de ferramentas uma blibioteca chamada unittest, a qual nos permite escrever testes para os nossos projetos python. Mas hoje vou mostrar a vocês o que faço no meu dia-a-dia na Lojacorr utilizando o pytest, uma blibioteca popular e amigavél do python para testes automatizados, bem como alguns truques e macetes que aprendi recentemente.

# Tá mais porquê não o unittest?

A blibioteca padrão unittest é eficaz naquilo que ela propõe em seu nome, permitir o desenvolvimento de testes unitários, seu código é simples e a mesma está inclusa na blibioteca padrão do python, se está desenvolvendo algo simples o qual testes unitários são mais que suficiente para a validação do seu software, não vejo porquê usar outra opção. 

Todavia, mesmo sendo adepto de um anbiente mais simplificado existe um conjunto de features no pytest que são uma mão na roda, a primeira delas é o discovery que o pytest consegue fazer de forma mais eficaz, o segundo é o uso de fixtures, um recurso bem interessante que na minha interpretação servem para nos auxiliar a fazer algumas coisas:

- Manipular dados compartilhados entre testes (Meio que uma forma de shared mocks)
- Permitir gerenciar side-effects em etapas de testes.

Por isso vamos usar o pytest, neste caso vamos usar um pouco da magia de fixtures para simular coisas interessantes

# O que vamos testar

Como a idéia é apresentar alguns cenários diferentes do que podemos fazer com o pytest a proposta é que consigamos testar os seguintes casos:

- Uma implementação da blibioteca python-holidays criando um calendário customuizado
- Criar controle de estado e teardowns para testes com sqlite

# Fixtures

Decidio os cenãrios que iremos aprender a testar , vou precisar explicar agora a ferramenta principal provida pelo pytest que iremos usar para atingir nossos objetios, fixtures.

Parafraseando a documentação do pytest, fixtures tratam-se de uma forma de prover contextos definidos, reutilizaveis e consistentes entre os testes, podendo ser informações de anbiente , como credenciais de banco de dados ou conteúdo como expor datasets entre testes

Para definir uma fixture , o pytest pede que escreva uma função utilizando a annotation @pytest.fixtrure, a qual irá disponibilizar o retorno dessa função como argumento para nossos testes poderem consumir ela de forma implicita.

Tanbém podemos usar de definição de contexto e yelds para definir meios de "destruição" de uma fixture, assim podemos por exemplo usar uma fixture para criar a conexão com um banco de dados e no final do contexto, podemos encerrar essa conexão e realizar um drop das tabelas criadaas, uma ferramenta muito poderosa se usada com cuidado.

por fim o que eu acho mais interessante é que fixtures podem consumir e serem consumidas por outros fixtures, muito interessante para simular side effects em testes

# Cenário um: Uma fixture ordinária

Imagine que estamos desenvolvendo uma aplicação de estimativa de entregas para empresas do nordeste, essa ferramenta gera o cáculo de estimativa usando dias úteis, porém como uma empresa nordestina , ela considera os festejos juninos como feriado afinal as estradas ficam congestionadas e há a tradição de se dar folga aos funcionários por respeito às tradições locais. Para isso iremos desenvolver em python essa funcionalidade por meio da blibioteca python-holidays, que nos permite gerar calendários de feriados compativeis com o module datetime nativo do python, assim este serviço de estimativa será implementado em uma cloud function para economizar (afinal é algo que faz sentido ser processado por demanda)

Todavia queremos dar a liberdade no futuro de se definir o calendário a ser utilizazdo por meio de um outro serviço, para que fique dinâmico, permitindo ajustes conforme muda por exemplo a legislação e o calendário de feriados, assim, para nossos testes unitários não podemos então definir hardcoded o calendário, mas podemos usar fixture para definir um calendário global para nossa suite de testes.

O projeto se encontra [aqui](https://github.com/victorfernandesraton/pytest-fixture-experiment)

Sem mais delongas vamos ao código de nossa funcionalidade

```python
# /delivery/estimative_delivery_service.py
from datetime import date, timedelta

from holidays import HolidayBase


class EstimativeDeliveryService:
    def __init__(self, holidays: HolidayBase):
        self.holidays = holidays

    def estimate_delivery(self, start_date: date, min: int, max: int) -> list[date]:
        result = list()
        count = max
        day = start_date
        while count > 0:

            if day.weekday() < 5 and day not in self.holidays:
                count -= 1
                if count <= max - min:
                    result.append(day)

            day = day + timedelta(days=1)
        return result
```

Esse nosso service recebe um dicionário de HolidayBase, e implementa o método de cálculo de data usando um loop while, verificamos se a data atual é um final de semana ou feriado, se não for ele subtrai um do contador, se o contador estiver dentro do range de minimo e máximo ele adiciona a data atual na lisrta de resultados e por fim acrescenta um dia na data atual

Com isso feito vamos definir nossa fixture

```python
# /tests/delivery/conftest.py
from datetime import date

import pytest
from holidays import country_holidays
from holidays.countries import BR
from holidays.holiday_base import HolidayBase


class CustonNordesteCalendar(BR):
    def _populate(self, year):
        super()._populate(year)
        self[date(year, 6, 24)] = "Véspera de São João"
        self[date(year, 6, 25)] = "São João"


@pytest.fixture(scope="module")
def default_holidays():
    calendar = country_holidays("BR")
    return calendar


@pytest.fixture(scope="module")
def custon_holidays(default_holidays):
    return default_holidays + CustonNordesteCalendar()
```


Agora usando uma fixture vamos gerar um calendário específico para que seja setado apenas uma vez para todo módulo de teste que ele corresponde, chamaremos nossa fixture de `custon_holidays` e ela retorna nosso calendário customizado que como vimos acima gera o calendário do brasil com nossos feriados extras

Tanbém definimos o calendário padrão do brasil com o `default_holidays`, assinm podemos demonstrar tanbém que fitures podem consulmir outras fixtures

Agora podemos escrever alguns testes para demonstrar nossa funcionalidade


```python
# tests/test_estimative_delivery_service.py
from datetime import date
from unittest.case import TestCase

import pytest

from delivery import EstimativeDeliveryService

_test = TestCase()


@pytest.mark.delivery
def test_calculate_delivery_in_ordinary_day_with_default_calendar(default_holidays):
    service = EstimativeDeliveryService(default_holidays)
    result = service.estimate_delivery(date(2024, 5, 10), 5, 8)
    _expcted_result = [
        date(2024, 5, 16),
        date(2024, 5, 17),
        date(2024, 5, 20),
        date(2024, 5, 21),
    ]
    _test.assertEqual(len(result), len(_expcted_result))
    for item in result:
        _test.assertIn(item, _expcted_result)


@pytest.mark.delivery
def test_calculate_delivery_in_ordinary_day_with_custon_calendar(custon_holidays):
    service = EstimativeDeliveryService(custon_holidays)
    result = service.estimate_delivery(date(2024, 5, 10), 5, 8)
    _expcted_result = [
        date(2024, 5, 16),
        date(2024, 5, 17),
        date(2024, 5, 20),
        date(2024, 5, 21),
    ]
    _test.assertEqual(len(result), len(_expcted_result))
    for item in result:
        _test.assertIn(item, _expcted_result)


@pytest.mark.delivery
def test_calculate_delivery_in_special_holidays_with_default_calendar(
    default_holidays,
):
    service = EstimativeDeliveryService(default_holidays)
    result = service.estimate_delivery(date(2024, 6, 20), 5, 8)
    _expcted_result = [
        date(2024, 6, 26),
        date(2024, 6, 27),
        date(2024, 6, 28),
        date(2024, 7, 1),
    ]
    _test.assertEqual(len(result), len(_expcted_result))
    for item in result:
        _test.assertIn(item, _expcted_result)


@pytest.mark.delivery
def test_calculate_delivery_in_special_holidays_with_custon_calendar(custon_holidays):
    service = EstimativeDeliveryService(custon_holidays)
    result = service.estimate_delivery(date(2024, 6, 20), 5, 8)
    _expcted_result = [
        date(2024, 6, 28),
        date(2024, 7, 1),
        date(2024, 7, 2),
        date(2024, 7, 3),
    ]
    _test.assertEqual(len(result), len(_expcted_result))
    for item in result:
        _test.assertIn(item, _expcted_result)


```

Com os testes  `test_calculate_delivery_in_ordinary_day_*` conseguimos provar que em dias ordináros nosso serviço retorna as datas de forma igual, porém para `test_calculate_delivery_in_special_holidays_*` provamos que há uma diferença nos dias retornados pois definimos que 24 e 24 de junho serão feriados

Outra feature demonstrada nesse código é que podemos agrupar nossos testes por meio da annotation `pytest.mark.<name>` m, neste caso `pytest.mark.delivery` para marcar essas funções para uso de delivery

# Cenário 2: Criando controle de ciclo de vida em fixtures

Agora que já sabemos usar fixtures para compartilhar estados e efeitos colaterais , podemos avançar neste tópico e fazer algo realmente interessante...

Quando trabalhamos com banco de dados e queremos relaizar testes em nossos projetos, é comun ver o uso de estruturas de mock ou de ferramentas como testcontainers, mas eu , particulamente em meus projeto não vejo muito sentido em realizar testes que não estejam contra algo que vou usar em produção ou o mais próximo que eu conseguir ter em um anbiente de CI/CD, claro , cada caso é um caso e nem sempre é viavél utilizar testes e2e em face de mocks e testcontainers, tudo na vida tem um tradeoff.

Tendo isso em mente eu vou demonstrar como utilizar o controle de ciclo de vida de fixtures para poder fazer testes contra bancos de dados e depois usar uma funçào de teardown para limpar todo o anbiente, assim permitindo testes sem estados residuais.

Para essa demonstração irei implementar uma tabela simples usando sqlite em memória mesmo, sem ORM, mas nbada que não possa ser adaptado para o seu cenário de banco de dados e CI/CD.

Seguindo ainda com o serviço de delivery, precisamos agora gerenciar os veículos e as entrregas da nossa empresa, visto que precisamos fazer o cálculo de estimativa de entrega com base na disponibilidade de entregadores e veículos.

Para isso iremos implementar uma estrutura simples SQL que nos permita ter 3 tabelas.

A primeira tabela irá conter a lista de pedidos, com a cidade destino e a data de criação e o valor do pedido, além de um código de rastreio, iremos gerar o seguinte SQL:

```sql
CREATE IF NOT EXISTS TABLE delivery (
    id INTEGER PRIMARY KEY,
    ammount REAL,
    destiny_citty TEXT NOT NULL,
    min_days INT NOT NULL DEFAULT 1,
    max_days INT NOT NULL DEFAULT 0,
    created_at NUMERIC,
    updated_at NUMERIC,
)

```

Em seguida teremos a lista de veículos da empresa com a placa do veículo, e o status atual do veículo que pode ser 3:
1. Disponivél para entrega 
2. Realizando entrega
3. Em manutenção

```sql
CREATE TABLE IF NOT EXISTS veichiles (
    id INTEGER PRIMARY KEY,
    plate TEXT NOT NULL UNIQUE,
    status INT NOT NULL DEFAULT 1,
    created_at NUMERIC,
    updated_at NUMERIC,
)

```
Por fim uma tabela que vamos chamar de checkin onde registraremos quando o veículo sai e quando o veículo chega

```sql
CREATE TABLE IF NOT EXISTS checkouts (
    id INTEGER PRIMARY KEY,
    veichile_id INTEGER NOT NULL,
    delivery_id INTEGER NOT NULL,
    is_incoming INTEGER NOT NULL DEFAULT 1,
    created_at NUMERIC,
    updated_at NUMERIC,
    FOREIGN KEY(veichile_id) REFERENCES veichiles(id),
    FOREIGN KEY(delivery_id) REFERENCES delivery(id),
) 

```

O sistema será bloqueante , portanto ao sair para uma entrega, é registrado a data de estimativa da entrega gerada pela ferramenrta anterior.

Por hora é algo rudimentar e não será feito o calculo de previsão de entrega ainda, apenas armazenado os dados, porém não será permitido relaizar a saida de um caminhão que não esteja disponivél, assim toda vez que for criado um checkout de saída, deve-se verificar o registo do ultimo checkout pro caminhão em questão se foi um checkout de entrada e se o status dele está como disponivél, bem como toda vez que for realizado uma entrada ou saída, será mudado o status do veículo.

Esse tipo de funcionalidade irá criar dependencia de estado nos testes, assim como ao encerrar os testes queremos apagar a base de dados, no caso do Sqlite podemos simplesmente  apagar o arquivo e rodar o script de criação das tabelas de novo, e para isso usaremos os escopos das fixtures e controle de ciclo de vida, interessante não?

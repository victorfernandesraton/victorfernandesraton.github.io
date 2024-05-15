+++
title = 'Pytest & fixtures: guia prático'
date = 2024-05-14T20:58:21-03:00
description ="Um guia de como usar pytest e fixtures ao seu favor"
tags = ["python", "pytest", "tests", "unittest", "fixtures", "sqlite"]
cover = "cover.jpg"
+++

# Afinal pra quê testes?

Desenvolver software nunca foi fácil, não basta saber programar, tem que dominar um conjunto de conhecimentos e ferramentas para que se tenha um resultado eficaz em seu papel ao passo que outros programadores consigam atuar nesse projeto.

Uma das formas de garantir e comprovar o funcionasmento de um software é por meio de testes, e uma forma de aprimorar a qualidade daquilo que está sendo desenvolvido é por meio de testes automatizados, pois além de ajudarem a entender as funcionalidades, estes testes podem servir como evidência de funcionamento, bem como garantia de funcionamento e de retrocompatibilidade , além de controle de qualidade.

O python , da forma mais comun que conhecemos (CPython) traz no seu kit de ferramentas uma blibioteca chamada unittest, a qual nos permite escrever testes para os nossos projetos python. Mas hoje vou falar um pouco sobre pytest uma blibioteca popular e amigavél do python para testes automatizados, bem como alguns truques e macetes que aprendi recentemente usando fixtures , um recurso do pytest que nos permie modularizar melhor nossos testes.

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

Decidio os cenãrios que iremos aprender a testar , vou precisar explicar agora a ferramenta principal provida pelo pytest que iremos usar para atingir nossos objetios, as fixtures fixtures.

Parafraseando a [documentação do pytest](https://docs.pytest.org/en/7.1.x/how-to/fixtures.html), fixtures tratam-se de uma forma de prover contextos definidos, reutilizaveis e consistentes entre os testes, podendo ser informações de anbiente , como credenciais de banco de dados ou conteúdo como expor datasets entre testes

Para definir uma fixture , o pytest pede que escreva uma função utilizando a annotation @pytest.fixtrure, a qual irá disponibilizar o retorno dessa função como argumento para nossos testes poderem consumir ela de forma implicita.

Tanbém podemos usar de definição de contexto e yelds para definir meios de "destruição" de uma fixture, assim podemos por exemplo usar uma fixture para criar a conexão com um banco de dados e no final do contexto, podemos encerrar essa conexão e realizar um drop das tabelas criadaas, uma ferramenta muito poderosa se usada com cuidado.

por fim fixtures podem consumir e serem consumidas por outros fixtures, muito interessante para simular side effects em testes

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

Seguindo ainda com o serviço de delivery, precisamos agora gerenciar os veículos da nossa empresa, visto que precisamos fazer o cálculo de estimativa de entrega com base na disponibilidade de entregadores e veículos.

Para isso iremos implementar uma estrutura simples SQL que nos permita ter uma tabela de veículos.

Nesta tabela teremos a lista de veículos da empresa com a placa do veículo, e o status atual do veículo que pode ser 3:
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
Dessa forma toda vez que um veículo for acionado o mesmo mudará seu status, assim como saberemos em tempo real quais veículos estão disponivéis

Assim implementamos nossa classe de serviço a qual de fato iremos testar, mas para poder evr com mais detalhes o projeto, veja [este link](https://github.com/victorfernandesraton/pytest-fixture-experiment)

```python
from datetime import datetime
from sqlite3 import Connection

from delivery.domain.models import VeichileModel, VeichileStatus
from delivery.repository import VeichileRepository


class VeichileStorageSqlite(VeichileRepository):
    def __init__(self, conn: Connection, table_name: str = "veichile"):
        self.conn = conn
        self.table_name = table_name

    def create_table(self):
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute(
                f"""
                CREATE TABLE IF NOT EXISTS {self.table_name} (
                    id INTEGER PRIMARY KEY,
                    plate TEXT NOT NULL UNIQUE,
                    status INT NOT NULL DEFAULT 1,
                    created_at NUMERIC,
                    updated_at NUMERIC
                )
                """
            )

    def drop_table(self):
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute(
                f"""
                DROP TABLE {self.table_name}
                """
            )

    def create_veichile(self, veichile: VeichileModel) -> VeichileModel:
        created_at = datetime.now().timestamp()
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute(
                """
                    INSERT INTO veichile (plate, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?)
                """,
                (veichile.plate, veichile.status.value, created_at, created_at),
            )
            veichile_id = cursor.lastrowid
            return VeichileModel(
                id=veichile_id,
                plate=veichile.plate,
                status=veichile.status,
                created_at=datetime.fromtimestamp(created_at),
                updated_at=datetime.fromtimestamp(created_at),
            )

    def get_veichile_by_id(self, veichile_id: int) -> VeichileModel | None:
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute("SELECT * FROM veichile WHERE id = ?", (veichile_id,))
            if cursor.rowcount == 0:
                return None
            row = cursor.fetchone()
            if not row:
                return None
            print(row)
            return VeichileModel(
                id=row[0],
                plate=row[1],
                status=VeichileStatus(row[2]),
                created_at=datetime.fromtimestamp(row[3]),
                updated_at=datetime.fromtimestamp(row[4]),
            )

    def update_veichile_status(
        self, veichile_id: int, status: VeichileStatus
    ) -> VeichileModel | None:

        old_veichile = self.get_veichile_by_id(veichile_id)
        if not old_veichile:
            return None

        now = datetime.now().timestamp()
        with self.conn:
            cursor = self.conn.cursor()
            cursor.execute(
                """
                UPDATE veichile
                SET status = ?, updated_at = ?
                WHERE id = ?
            """,
                (status.value, now, veichile_id),
            )
            if cursor.rowcount == 0:
                return None

            update_veichile = self.get_veichile_by_id(veichile_id)
            return update_veichile
```

Em seguida iremos implementar as fixtures, uma para gerar a conexão e outra para apagar a tabela após o uso


```python
import sqlite3
from datetime import date

import pytest
from holidays import country_holidays
from holidays.countries import BR
from holidays.holiday_base import HolidayBase

from delivery.storage import VeichileStorageSqlite


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


@pytest.fixture(scope="session")
def create_database():
    db_name = ":memory:"
    conn = sqlite3.connect(db_name)

    yield conn

    conn.close()


@pytest.fixture(scope="session")
def create_veichile_database(create_database):
    conn = create_database
    db = VeichileStorageSqlite(conn)
    db.create_table()

    yield db
    db.drop_table()

```


Nas fixtures de create_database e create_veichile_database utilizamos o escopo de sessão, para que a limpeza de estado seja feita após o termino dos testes, vale ressaltar que em vez de retornar o valor assumido pela fixture, usamos o yeld, assim tudo que ocorrer após o yeld será o cleanup da fixture, podemos fazer o drop da tabela, bem como encerrar a conexão, aida que esta seja estabelecida em memória no nosso exemplo


Por fim escreveremos nosso teste o qual expõe como eviência o reaproveitamento de estado, no primeiro iremos criar um veículo, no segundo iremos consultar este veículo criado no teste anterior e atualizar o status, inicialmente não recomendo esse tipo de abordagem , pois obriga o teste a ser sequêncial e não permite que cada um seja executado de forma independente, gerando assim side-effects, então use com caltela


```python
from unittest.case import TestCase

from delivery.domain.models import VeichileModel, VeichileStatus

_test = TestCase()


def test_insert_one_veichile(create_veichile_database):
    database = create_veichile_database
    search_veichile = database.get_veichile_by_id(1)
    _test.assertIsNone(search_veichile)
    veichile = VeichileModel(
        id=1,
        plate="CNC-1212",
        status=VeichileStatus.AVAILABLE,
    )
    created_veichile = database.create_veichile(veichile)
    _test.assertEqual(created_veichile.id, 1)


def test_update_veichile_status(create_veichile_database):
    database = create_veichile_database
    search_veichile = database.get_veichile_by_id(1)
    _test.assertEqual(search_veichile.status, VeichileStatus.AVAILABLE)
    updated_veichile = database.update_veichile_status(
        search_veichile.id, VeichileStatus.UNAVAILABLE
    )

    get_updated_veichile = database.get_veichile_by_id(1)

    _test.assertEqual(updated_veichile.id, search_veichile.id)
    _test.assertNotEqual(updated_veichile.status, search_veichile.status)
    _test.assertEqual(updated_veichile.status, VeichileStatus.UNAVAILABLE)
    _test.assertEqual(get_updated_veichile.status, VeichileStatus.UNAVAILABLE)
```

Basta agora rodar o comando para executar nossos testes , concluir nosso commit, fechar nosso card no jira e dizer pro chefe que conseguimos fazer 80% de cobertura de testes em nosso projetos

# Conclusões

Escrever testes não é uma tarefa simples, seu sofgtware sempre vai precisar estar desacoplado e estruturado de forma que possa testar partes. Ainda que nestes exemplos eu demonstrei uma implementação de teste statefull, esse tipo de prática deve ser evitado, ao testar mutabilidade certifique-se de apagar os dados gerados nas etapas anteriores, para que cada suite de teste seja independente e seus testes se tornem mais eficazes.

Por hoje é só...

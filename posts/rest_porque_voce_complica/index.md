+++
title = 'REST API: Por que você complica?'
description = 'Fazendo uma API REST detalhada'
date = 2025-12-06T02:12:00-03:00
tags = ["api", "rest", "http"]
draft = false 
media = "https://www.youtube.com/live/vogBqPxwBCk?si=_r8Q-lAxXKqqeKOU&t=4890https://www.youtube.com/live/vogBqPxwBCk?si=_r8Q-lAxXKqqeKOU&t=4890"
cover = "cover.jpeg"
+++

# Esta apresentação NÃO é sobre:

- Criar uma API REST do zero
- Um curso sobre HTTP
- Um curso de FastAPI/Python

Porém se possui interesse nesses temas, recomendo muito o curso [FastAPI do Zero](https://fastapidozero.dunossauro.com/estavel/) publicado pelo [Eduardo Mendes](https://dunossauro.com).

# Esta apresentação é sobre

- Formas de simplificar a implementação e consumo de API REST por meio de boas práticas.
- Independente de tecnologia, ecossistema e linguagem.
- Otimizações para facilitar sua vida na hora de lidar com automações e deploys orquestrados

# A web, REST API e Hipermídia

Se você atua na área de tecnologia como desenvolvedor de sofware para a web, já seja familiarizado com o termo API (Application Programming Interface - Interface de Programação de Aplicação), que pode ser toda e quaisquer aplicação que tem como objetivo interfacear de forma programável algum recurso, indo de consulta a base de dados a acesso a recursos de hardware como GPU.

Exemplos de API que podemos citar seria o uso de GPU por meio do navegador, através da [API WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)

Porém pensando em aplicações web, uma API REST(ful) - Representational State Transfer, refere-se a uma forma de controlar e restringir uma aplicação por meio de representação de estados destas em recursos. Atualmente o formato mais comum de implementação consiste em um servidor Web que, por meio do protocolo HTTP de implementação consiste em um servidor Web que por meio do protocolo HTTP (Hipertext Transfer Protocol) que entrega as informações a respeito dos estados em estrutura JSON (Javascript Object Notation).

Uma aplicação REST que contemple todos os princípios referentes à idempotência, que é a capacidade de representar todos os estados necessários de forma semântica, usando os verbos adequados (GET, POST, PUT, PATCH, DELETE...) bem como respeitando os princípios de manter o estado entre requisições, ser cacheável e possuir mensagens expressivas em caso de falha é denominada de RESTful, porém podemos usar o termo em questão de forma análoga ao próprio conceito de REST API em linhas gerais.

# Exemplo prático e resumido

Uma API REST é como um restaurante, onde o estabelecimento é o `servidor`, o `cliente` por sua vez está implicito no nome.

- Para saber quais pratos estão disponíveis, você lê o cardápio, assim como um método GET no endpoint `/cardapio` pode retornar uma lista.
- Ao pedir mais informações ao garçom sobre o prato em questão, seria como usar o método GET no endpoint `cardapio/12` para saber os detalhes do item 12 do cardápio
- Para realizar um pedido ao garçom para a sua mesa, seria como usar o método POST no endpoint /pedido, enviando no corpo da requisição um objeto com o número da sua mesa e os itens do cardápio.
- Para pedir uma mudança em um item do prato, seria equivalente a usar o método PATCH.
- Para mudar o pedido por completo ou pedir, com educação, para mudar o seu pedido é como usar o método PUT
- Para cancelar o pedido, podemos usar o DELETE O método OPTIONS seria equivalente a verificar se o restaurante está servindo aquele prato.
- O método HEAD seria equivalente a avaliar o preço da refeição e se você tem alguma alergia ao prato em questão.
- Se o restaurante possui pulseiras de identificação entregues na hora da reserva, seria o equivalente ao utilizar tokens de autenticação.

Um exemplo de API REST aberta ao público seria a API [OMDb](https://www.omdbapi.com/), Open Movie Database

# Componentes de uma requisição HTTP

Dado que o principal objetivo de uma requisição HTTP diz respeito à capacidade de comunicar dados entre servidor e cliente, podemos dividir esses dados em dois grupos:

- informações de infraestrutura e estado: são informações referentes a requisição que comunicam de forma genérica e imediata o estado atual de um servidor ou de um dado solicitado a este. neste grupo encontram-se os códigos de estado (Status Code) e o cabeçalho.
- informações de resultado: trata-se da informação retornada pelo servidor, chamamos normalmente isso de corpo de resposta ou response body da requisição. Este pode estar codificado em vários formatos, os mais comuns são `application/json`, `text/plain` para dados em texto plano bem como tipos de mídia para multimídia.

## Status Code

Status Code são números de 3 dígitos entregues numa requisição HTTP como forma de comunicar o resultado de forma imediata, sem precisar de serialização ou informações adicionais para tomar decisões básicas.

É importante que estes sejam usados de forma consistente, para que clientes automatizados, como frameworks, possam consumir sua API sem muitos ajustes

Podemos dividir os status code em 5 faixas.

1. **1xx**: status de informação, usados para comunicar algum tipo de informação a respeito do servidor.
    - 100: Continue, muito usado quando se quer evitar o envio de um payload muito grande, mas precisa verificar se o servidor está disponível
        - Um caso de uso curioso que eu vi isso em prática foi em fila de geração de PDF de apólices em sistemas de seguradora.
2. **2xx**: status de sucesso (é o que esperamos que aconteça no caminho feliz), representa uma operação bem-sucedida.
    - 200: Ok, simplesmente Ok
    - 201: Created, um código frequentemente negligenciado que deveria ser usado mais, principalmente quando uma operação resulta em algum tipo de dado criado, como vimos com métodos POST e PUT.
    - 202: Accepted, quando uma requisição é aceita, porém o resultado será enviado depois, isso é crucial quando se faz HTTP polling, que é o processo de verificar no servidor até a informação estar pronta. Muito comum em sistemas de fila de impressão mais antigos ou de geração de arquivos em segundo plano.
    - 204: No Content, a operação deu certo, mas não há body a ser retornado, porém os headers são úteis e, se necessário, o cache deve ser atualizado. Em casos de DELETE, é o ideal na maioria dos cenários*
3. **3xx**: status de redirecionamento, servem para informar os possíveis motivos de dados terem sido migrados
    - 301: Moved Permanently, significa que o conteúdo foi movido de URL, a nova será disponibilizada no response.
    - 302: Found, significa que o conteúdo foi encontrado e movido temporariamente, pode representar uma nova URL e um novo método.
    - 307: Temporary Redirect, semântica igual ao 302, porém significa que o método HTTP não deve ser mudado no redirect, apenas a URL.
4. **4xx**: status de erros causados pelo cliente ~~culpa do frontend~~, quando algum dado enviado ou requisição feita pelo lado do cliente é inconsistente.
    - 404: Não encontrado, para rota ou conteúdo não encontrado, origem do meme 404: Not Found
    - 401: Não autenticado, significa que o usuário não forneceu a informação que determina que ele foi autenticado em algum momento. Usado como identificador de endpoints protegidos, ou seja, endpoints disponíveis apenas para usuários autenticados.
    - 403: Forbidden, significa que o usuário, independente de autenticado ou não, não possui acesso à informação devida.
    - 418: I'm a Teapot (Eu sou uma chaleira), servidor se recusa a fazer café.
5. **5xx**: status de erro causados pelo servidor ~~culpa sua~~, usado principalmente para erros de mecanismos internos
    - 500: Internal Server Error, quando seu servidor tem um erro de execução, runtime ou um erro não tratável. Em ambiente de desenvolvimento e nos logs, normalmente consta a stacktrace que ocasionou a falha.
    - 502: Bad Gateway, quando um servidor de Gateway falha em encontrar ou realizar a conexão com o servidor de origem, normalmente associado a timeout entre o gateway e o servidor consumido por este.
    - 503: Service Unavailable, mostrado quando há uma falha temporária, em conjunto com uma página de erro amigável se possível para explicar de forma breve a falha. Em casos de serviços como aplicações, é recomendado devolver o Header Retry-After com informações de quando está previsto a volta do recurso. Era muito comum no período de transição para a Web 2.0 (Twitter lá por 2010 e o famigerado "Rails não escala")


## Cabeçalhos HTTP (Headers)

Cabeçalhos são informações extras que podem ser enviadas, bem como recebidas por uma ou para uma API REST. Nestes, em formatos de texto (string), detalhamos informações e metadados no geral sobre o conteúdo trafegado, coisas como informar
a origem da aplicação, realizar o envio de chaves de autenticação e até mesmo informar a aplicação cliente sobre a política de cache do recurso.

Exemplos de cabeçalhos comuns

![image](Screenshot_20251212_103814.webp)

# Um caso de otimização por meio de uso de dados

## HATEOAS (Hipermídia como Motor do Estado da Aplicação)

Nesta conversa, o termo Hipermidia, mais precisamente o acrônomo Hypermedia as the Engine of Application State (HATEOAS), seria uma forma de implementação de arquitetura para REST API que, por meio das hipermídias, torna a consulta e
navegação pelos recursos mais dinâmica, conseguindo comunicar, por meio de metadados e padrões, formas de navegação e integração entre os recursos disponibilizados.

A principal e mais comum forma de implementação de HATEOAS em aplicações modernas é dada por meio da implementação de recursos com [HAL - Hypertext Application Language](https://en.wikipedia.org/wiki/Hypertext_Application_Language), onde adicionamos a resposta do dado, possíveis links relacionados a este, como o exemplo abaixo.

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

Além do **HAL**, outros formatos para implementar HATEOS seriam **JSON:API**, **Siren**, **Hydra (JSON-LD)**, **Collection+JSON** e **UBER**.

---

## **JSON:API**

```json
{
  "data": {
    "type": "book",
    "id": "1",
    "attributes": {
      "title": "O Senhor dos Anéis"
    },
    "links": {
      "self": "/books/1"
    },
    "relationships": {
      "author": {
        "links": {
          "related": "/books/1/author"
        }
      }
    }
  },
  "links": {
    "self": "/books"
  }
}
```

---

## **Siren**

```json
{
  "class": ["book"],
  "properties": {
    "id": 1,
    "title": "O Senhor dos Anéis"
  },
  "links": [
    { "rel": ["self"], "href": "/books/1" },
    { "rel": ["author"], "href": "/books/1/author" }
  ],
  "actions": [
    {
      "name": "update-book",
      "method": "PUT",
      "href": "/books/1",
      "type": "application/json",
      "fields": [
        { "name": "title", "type": "text" }
      ]
    }
  ]
}
```

---

## **Hydra (JSON-LD)**

```json
{
  "@context": "/contexts/Book.jsonld",
  "@id": "/books/1",
  "@type": "Book",
  "title": "O Senhor dos Anéis",
  "author": "/books/1/author",
  "hydra:operation": [
    {
      "@type": "hydra:UpdateResourceOperation",
      "hydra:method": "PUT",
      "hydra:expects": "http://schema.org/Book",
      "hydra:returns": "http://schema.org/Book",
      "hydra:target": "/books/1"
    }
  ]
}
```

---

## **Collection+JSON**

```json
{
  "collection": {
    "version": "1.0",
    "href": "/books",
    "items": [
      {
        "href": "/books/1",
        "data": [
          { "name": "id", "value": "1" },
          { "name": "title", "value": "O Senhor dos Anéis" }
        ],
        "links": [
          { "rel": "author", "href": "/books/1/author" }
        ]
      }
    ],
    "links": [
      { "rel": "self", "href": "/books" }
    ],
    "queries": [
      {
        "rel": "search",
        "href": "/books/search",
        "data": [
          { "name": "title", "value": "" }
        ]
      }
    ]
  }
}
```

---

## **UBER (Uber Hypermedia)**

```json
{
  "uber": { 
    "version": "1.0",
    "data": [
      {
        "id": "book",
        "name": "O Senhor dos Anéis",
        "rel": ["self"],
        "url": "/books/1",
        "data": [
          {
            "rel": ["author"],
            "url": "/books/1/author"
          }
        ]
      }
    ]
  }
}
```

## HATEOS é complicado, mas não deveria ser

A principal dificuldade dos formatos comuns para HATEOS gira em torno da dificuldade de serialização:

- A obrigatoriedade de serializar os resultados para obter metadados tornando toda operação de leitura de metadados bloqueante.
- Interferência no próprio retorno dos dados , tornando mais complicado a vida das aplicações clientes que consomen esta API
- Mesmo um resultado sem itens algum, geraria a necessidade de serializar o resultado para saber que este está sem itens no caso de listagem

A serialização mal otimizada pode dificultar a performance de aplicações dinâmicas, tais como feeds de redes sociais, leitura de dados em tempo real e procesos de digestão de alto volume de dados.

Outro problema menos evidente seria a obrigatoriedade de manter implementações sequenciais de problemas que seriam resolvidos de uma forma melhor por meio concorrência/paralelismo

### Como resolver o problema

A solução para as dificuldades geradas pela implementação de uma arquitetura HATEOS consiste em atender os seguintes pré-requisitos

- Metadados precisam estar separados dos dados.
- Metadados não precisam ser serializados.
- Precisamos saber a informação de itens na página atual (mínimo aceitável).
- Precisamos saber como informar a próxima página e a página anterior (independente da forma de paginação: saltos, páginas ou ponteiros).

A forma mais simples de resolver isso seria por meio da implementação da [RFC 8288 - Web Linking](https://datatracker.ietf.org/doc/html/rfc8288) para a paginação e demais informações por meio de cabeçalhos customizados.

> Ainda que muitos serviços usem o prefixo `X-` para headers especiais,
> atualmente isso é desencorajado especificamente pela [RFC 6648](https://datatracker.ietf.org/doc/html/rfc6648)

Desta forma, podemos recompor nosso exemplo de livros por meio do seguinte modelo para o corpo da resposta (Response Body) em uma simples lista de JSON.

```JSON
[
  {
    "id": 1,
    "title": "O Senhor dos Anéis",
    "author": "R. R. Tolkein"
  }
]
```

Por fim, podemos ter os seguintes cabeçalhos. Nem todos são obrigatórios por questões de performance, principalmente aqueles que realizam a contagem de itens, porém o `Items-Returned` é uma ótima forma de saber se a lista retornou sem item algum (vazia).

```http
HTTP/1.1 200 OK
Content-Type: application/json
Total-Count: 1000               # Total de itens no banco de dados
Total-Pages: 100                # Total de páginas (se você já calculou)
Items-Per-Page: 10              # Itens por página
Current-Page: 1                 # Página atual
Items-Returned: 1              # Total de itens retornados na página atual
Link: <https://api.exemplo.com/items?page=2>; rel="next",
      <https://api.exemplo.com/items?page=100>; rel="last",
      <https://api.exemplo.com/items?page=1>; rel="first"
      <https://api.exemplo.com/items?page=1>; rel="prev"
```

Considerando cenários de requisições de criação de dados, principalmente de objetos únicos, podemos usar o header `Location` caso este possua algum endpoint de consulta por meio de ID de referência que seja único e idempotente.

Outro ponto importante é que nem sempre poderemos configurar o domínio. Nossa API pode estar limitada por um API Gateway ou ferramenta de DNS. Nesses casos, é recomendado o uso de links relativos, isso cria um ônus para o cliente concatenar ao domínio original, mas este é disponibilizado no header Host.

Dessa forma, o exemplo que utilizamos anteriormente é capaz de evoluir para esse modelo:


```http
HTTP/1.1 200 OK
Content-Type: application/json
Total-Count: 1000               # Total de itens no banco de dados
Total-Pages: 100                # Total de páginas (se você já calculou)
Items-Per-Page: 10              # Itens por página
Current-Page: 1                 # Página atual
Items-Returned: 1              # Total de itens retornados na página atual
Link: </items?page=2>; rel="next",
      </items?page=100>; rel="last",
      </items?page=1>; rel="first"
      </items?page=1>; rel="prev"
```

O uso de contadores deve ser moderado, visto que em bases grandes de dados ou com mudanças constantes, essa operação pode custar muito recurso. Nesses casos, cabe ao desenvolvedor responsável avaliar as necessidades e capacidades do projeto.

# Teste de comparação: HATEOAS vs Headers com metadados

Para validar as vantagens da abordagem de separar dados de metadados usando headers HTTP, foram realizados testes de benchmark comparando ambas as implementações.

## Metodologia de Testes

Os testes foram divididos em duas categorias:

### 1. Teste de carga com `wrk`

Utilizamos o utilitário `wrk` para avaliar o desempenho do servidor sob carga, medindo:
- Tempo de resposta médio (latência)
- Total de requisições por segundo
- Configuração: 100 conexões concorrentes, 4 threads, duração de 10 segundos

```bash
#!/usr/bin/env bash
set -e

SERVER_URL="${SERVER_URL:-http://localhost:8000}"
DURATION="${DURATION:-10s}"
THREADS="${THREADS:-4}"
CONNECTIONS="${CONNECTIONS:-100}"

echo "=== REST API Server Benchmark (wrk) ==="
echo "Server: $SERVER_URL"
echo "Duration: $DURATION"
echo "Threads: $THREADS"
echo "Connections: $CONNECTIONS"
echo ""

echo "--- Benchmarking /feed/headers endpoint ---"
wrk -t$THREADS -c$CONNECTIONS -d$DURATION "$SERVER_URL/feed/headers?page=1&per_page=10"

echo ""
echo "--- Benchmarking /feed/hal endpoint ---"
wrk -t$THREADS -c$CONNECTIONS -d$DURATION "$SERVER_URL/feed/hal?page=1&per_page=10"

echo ""
echo "--- Benchmarking /feed/headers (empty page) ---"
wrk -t$THREADS -c$CONNECTIONS -d$DURATION "$SERVER_URL/feed/headers?page=10000&per_page=10"

echo ""
echo "--- Benchmarking /feed/hal (empty page) ---"
wrk -t$THREADS -c$CONNECTIONS -d$DURATION "$SERVER_URL/feed/hal?page=10000&per_page=10"

echo ""
echo "=== Benchmark complete ==="
```

### 2. Teste de cliente com Python/requests

Para avaliar o impacto no lado do cliente, foi implementado um benchmark que mede:
- Consumo de API
- Tempo médio para consultar lista paginada
- Tempo médio para consultar lista vazia
- Uso de RAM na serialização

#### Função de medição de parse JSON

```python
def measure_json_parse(data: str) -> tuple:
    tracemalloc.start()
    start = time.perf_counter()
    result = json.loads(data)
    parse_time = time.perf_counter() - start
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    return parse_time, peak / 1024, result
```

#### Benchmark para endpoint com Headers

```python
def benchmark_headers(self, page: int, per_page: int) -> dict:
    latencies = []
    parse_times = []
    mem_usage = []
    body_sizes = []
    items_count = 0

    for _ in range(self.warmup):
        self.http_client.get(
            f"{self.base_url}/feed/headers", params={"page": page, "per_page": per_page}
        )

    for _ in range(self.iterations):
        start = time.perf_counter()
        response = self.http_client.get(
            f"{self.base_url}/feed/headers", params={"page": page, "per_page": per_page}
        )
        http_latency = (time.perf_counter() - start) * 1000
        latencies.append(http_latency)
        body_sizes.append(len(response.content))

        items_count = int(response.headers.get("X-Total-Count", 0))

        if items_count > 0:
            parse_time, mem_kb, _ = measure_json_parse(response.text)
            parse_times.append(parse_time * 1000)
            mem_usage.append(mem_kb)
        else:
            parse_times.append(0)
            mem_usage.append(0)

    return {
        "latency_ms": {"mean": mean(latencies), "std": stdev(latencies) if len(latencies) > 1 else 0},
        "parse_ms": {"mean": mean(parse_times), "std": stdev(parse_times) if len(parse_times) > 1 else 0},
        "memory_kb": mean(mem_usage) if mem_usage else 0,
        "body_bytes": mean(body_sizes),
        "items_count": items_count,
    }
```

#### Benchmark para endpoint HAL

```python
def benchmark_hal(self, page: int, per_page: int) -> dict:
    latencies = []
    parse_times = []
    mem_usage = []
    body_sizes = []

    for _ in range(self.warmup):
        self.http_client.get(
            f"{self.base_url}/feed/hal", params={"page": page, "per_page": per_page}
        )

    for _ in range(self.iterations):
        start = time.perf_counter()
        response = self.http_client.get(
            f"{self.base_url}/feed/hal", params={"page": page, "per_page": per_page}
        )
        http_latency = (time.perf_counter() - start) * 1000
        latencies.append(http_latency)
        body_sizes.append(len(response.content))

        parse_time, mem_kb, _ = measure_json_parse(response.text)
        parse_times.append(parse_time * 1000)
        mem_usage.append(mem_kb)

    return {
        "latency_ms": {"mean": mean(latencies), "std": stdev(latencies) if len(latencies) > 1 else 0},
        "parse_ms": {"mean": mean(parse_times), "std": stdev(parse_times) if len(parse_times) > 1 else 0},
        "memory_kb": mean(mem_usage),
        "body_bytes": mean(body_sizes),
    }
```

#### Execução principal

```python
def main():
    import sys

    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    iterations = int(sys.argv[2]) if len(sys.argv) > 2 else 100

    benchmark = ClientBenchmark(base_url, iterations)

    print(f"=== Client-side Benchmark ===")
    print(f"Server: {base_url}")
    print(f"Iterations: {iterations}, Warm-up: 10")

    headers_result = benchmark.benchmark_headers(page=1, per_page=10)
    hal_result = benchmark.benchmark_hal(page=1, per_page=10)
    print_results(headers_result, hal_result, "Non-empty Page (page=1, per_page=10)")

    headers_empty = benchmark.benchmark_headers(page=1001, per_page=10)
    hal_empty = benchmark.benchmark_hal(page=1001, per_page=10)
    print_results(headers_empty, hal_empty, "Empty Page (page=1001, per_page=10)")
```

### Estrutura da API de teste

- Endpoint de health: `/feed/health`
- Endpoint com HAL: `/feed/hal`
- Endpoint com headers metadata: `/feed/headers`
- Documentação: `/docs`

Código completo e atualizado disponível em: [https://codeberg.org/v_raton/restapi-simplifcado-demo](https://codeberg.org/v_raton/restapi-simplifcado-demo)

## Resultados dos Testes

### Teste de carga (wrk)

#### Feed com dados (page=1, per_page=10)

| Endpoint | Latência Média | Req/Sec | Total Requests | Transferência |
|----------|----------------|---------|----------------|---------------|
| /feed/headers | 84.75ms | 1174.65 | 11760 | 2.38MB/s |
| /feed/hal | 96.27ms | 1033.43 | 10346 | 2.02MB/s |

#### Feed vazia (page=10000, per_page=10)

| Endpoint | Latência Média | Req/Sec | Total Requests | Transferência |
|----------|----------------|---------|----------------|---------------|
| /feed/headers | 76.90ms | 1295.31 | 12964 | 430.08KB/s |
| /feed/hal | 83.86ms | 1187.43 | 11892 | 398.90KB/s |

**Resumo do impacto no servidor:**
- Headers: ~12% mais rápido que HAL com dados, ~9% mais rápido em feed vazia
- Transfer: Headers transfere ~18% mais dados (metadados nos headers vs body)
- Vazia: HAL tem overhead de serialização mesmo sem dados

### Benchmark de cliente (Python)

#### Página com dados (page=1, per_page=10)

| Métrica | Headers | HAL |
|---------|---------|-----|
| HTTP latency (ms) | 2.55±0.27 | 2.56±0.23 |
| JSON parse (ms) | 0.1506 | 0.1626 |
| Memory (KB) | 3.93 | 4.59 |
| Response (bytes) | 1794 | 1925 |

#### Página vazia (page=1001, per_page=10)

| Métrica | Headers | HAL |
|---------|---------|-----|
| HTTP latency (ms) | 2.34±0.22 | 2.44±0.14 |
| JSON parse (ms) | 0.0000 | 0.0580 |
| Memory (KB) | 0.00 | 1.88 |
| Response (bytes) | 2 | 217 |

**Resumo do impacto no cliente:**
- **Com dados**: Headers ~7% mais rápido em parse JSON, ~14% menos memória
- **Vazia**: Headers evita realizar o parse completo, ~99% menos bytes transferidos
- **Economia total**: ~131 bytes por requisição com dados, ~215 bytes por requisição vazia

# Dicas e boas práticas para uso coerente de status code

- Quando uma operação como DELETE puder ser revertida por meio de um endpoint simples, ao realizar o DELETE, trazer a URL de undo nos headers.
- Evite escrever cabeçalhos customizados que podem ser sobrescritos por proxy, como headers referentes a timeout.
- Uma forma de prevenir ataques de força bruta automatizados é responder toda request de falha de autenticação com status 404 (*Gambiarra).
- 301 é muito comum para redirect quando você está em transição de domínios.
- Em aplicações fullstack ou servidores cujas respostas são visualizadas no browser e pelo usuário final de forma direta, tendem a responder com mensagens detalhadas e acessíveis possíveis infos de causa. 404 é bem comum vermos esse tipo de design.
- Resultado de requisição POST, PUT é recomendado 201.
- Resultado de requisição GET, HEAD é recomendado 200.
- Resultado de requisição DELETE é normalmente 204.

# Vídeo da Apresentação

Este artigo serve como material de referência para a apresentação "REST API: Por que você complica?". Assista ao vídeo completo abaixo:

<iframe style="width: 100%; aspect-ratio: 16/9;" src="https://www.youtube-nocookie.com/embed/vogBqPxwBCk?si=EHh-rnsSjEUjzHsg&amp;start=4890" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


# Referências

- [API REST - o que é API REST?](https://www.redhat.com/pt-br/topics/api/what-is-a-rest-api),
  Acessado em 06/12/2025.
- [WebGL: 2D and 3D Graphics for the web](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API),
  Acessado em 06/12/2025
- [OMDb API - The Open Movie Database](https://www.omdbapi.com/), Acessado em
  06/12/2025
- [HTTP Headers - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers),
  Acessado em 07/12/2025
- [Hypertext Application Language - Wikipedia](https://en.wikipedia.org/wiki/Hypertext_Application_Language),
  Acessado em 06/12/2025
- [RFC 8288 - Web Linking](https://datatracker.ietf.org/doc/html/rfc8288),
  Acessado em 11/12/2025
- [RFC 6648 - Deprecating the "X-" Prefix and Similar Constructs in Application Protocols](https://datatracker.ietf.org/doc/html/rfc6648),
  Acessado em 11/12/2025
- [A história de Ruby on Rails | Por quê deu certo?](https://www.youtube.com/watch?v=oEorhw5r2Do). Acessado em 12/12/2025
- [REST API: Por que você complica? - Vídeo da apresentação](https://www.youtube.com/live/vogBqPxwBCk?si=_r8Q-lAxXKqqeKOU&t=4890https://www.youtube.com/live/vogBqPxwBCk?si=_r8Q-lAxXKqqeKOU&t=4890), Acessado em 01/02/2025
- [Código fonte dos benchmarks](https://codeberg.org/v_raton/restapi-simplifcado-demo), Acessado em 01/02/2025 

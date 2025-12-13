+++
title = 'Vscode/Vscodium feature killer'
description = 'A feature que (ainda) não consegui no neovim'
date = 2024-06-29T17:39:00-03:00
draft = true
tags = ["python", "antiads", "vscodium", "vscode", "tool"]
+++

# Uma idéia meio estúpida

Há um tempo eu tive que sair para fazer exames adimissionais em uma empresa que
eu iria começar a trabalhar, como estava sem fazer nada por ter sido
recentemente demitido, decidi usufluir do transporte público em Salvador BA, e
precisava saber os horários dos ónibus que passavam pela região.

Fuçando no Google Maps e no aplicativo CittaMobi, eu me dei conta de uma coisa:
Não existe nenhuma solução atualmente com informações de transporte público de
forma transparente e open source, ao consultar as informações da rota de
transporte em questão no Google Maps ele me conduz para o site
[Mobilidade Salvador](http://www.mobilidade.salvador.ba.gov.br), o app do
CittaMobi, além de ser uma máquina de Ads , não tem informações nenhuma sobre
fonte de origem de dados, quando foram atualizados nem nada, um terror de
tranbsparência.

Então decidi começar a investigar como eu poderia criar uma base de dados para
futuramente por num app mais transparente.

O primeiro passo foi descobrir onde obter itinerários atualizados, o mais
atualziado que consegui foi no site de uma das empresass que compõem o sistema
rodoviário da capital baiana, a [Integra](https://www.integrasalvador.com.br/),
achei um arquivo de itinerários, uma grande tabela de duas colunas em um PDF,
parabéns aos envolvidos por escolherem a PIOR forma de distribuir essa
informação.

Mas eu sou dev , processar um PDF não deve ser dificíl né?

# Configurando o anbiente

Para evitar ficar sujando o código principal com testes antes da hora ou ficar
adicionando condicionais `if __name__ == "__main__":`, podemos adicionar o
launch no vscode/vscodium para o python e depois editar para que fique mais ou
menos assim:

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python Debugger: main.py",
      "type": "debugpy",
      "request": "launch",
      "program": "${workspaceFolder}/.vscode/main.py",
      "console": "integratedTerminal",
      "env": {
        "PYTHONPATH": "${workspaceFolder}"
      }
    }
  ]
}
```

As coisas que eu mudei foi o nome, além de adicionar o program para sempre ser
algo fixo, bastando criar esse programa em `.vscode/main.py`. Dessa forma ,
posso fazer a bagunça que eu precisar nesse arquivo sem poluir meu código-fonte,
ah e se atente para colocar o valor correto de `env`

# Processando arquivos PDF

Já tenho essa maravilha de arquivo pra processar, dai busquei por uma lib python
que tivesse suporte à extração de tabelas, inclusive uma dica, normalmente esses
perrengues de processar arquivos você vai ter muito mais suporte com Python,
tentei com Golang e daria muito trabalho pra um protótipo , então vamos ao
trabalho mal otinizado né....

Vamos então criar um módulo chamado salvadorintegra onde eu terei a função de
extrair as tabelas do arquivo e fazer o parse para depois colocar no banco de
dados , vamos começar com aquilo que já sabemos, uma classe que irá ter o método
de buscar os bytes do arquivo e outro quue use a lib `pdfplumber` para extrair
as tabelas de dentro do pdf

Neste projeto irei usar a blibioteca httpx , então lembrando de instalar as
dependências que estão presentes no `pyproject.toml`, mas a fim de demonstração
deixarei o link do repositório [Aqui](Link)

```python
import re
from typing import Dict, List

import httpx
import pdfplumber


class SourceExtractor:
    @staticmethod
    def get_file_content_by_url(
        url: str = "https://www.integrasalvador.com.br/wp-content/themes/integra/img/ITINERARIO_ONIBUS.pdf",
    ) -> bytes:
        response = httpx.get(url)
        response.raise_for_status()
        return response.content

    @staticmethod
    def get_tables_from_bytes(data: bytes) -> List[List[str]]:
        tables = []
        with pdfplumber.open(data) as pdf:
            for page in pdf.pages:
                inner_table = page.extract_table()
                if inner_table:
                    tables.extend(inner_table)
        return tables
```

Dai para testar podemos editar nosso arquivo `.vscode/main.py` para fazer a
bagunça que precisamoss.

```python
from salvadorintegra import SourceExtractor

service = SourceExtractor()
content = service.get_file_content_by_url()
print(len(content))
```

Agora é só criar breakpoints e debugar o que precisamos.

![image](./vscode-debug.png)

Mas agora vem a parte séria, inspirado por
[este vídeo](https://www.youtube.com/watch?v=1p7xa_BHYDs) do
[mCoding]https://www.youtube.com/channel/UCaiL2GDNpLYH6Wokkk1VNcg), decidi fazer
algo usando `itertools`

O primeiro ponto que precisamos entender é que ao ler o PDF e extrair as
tabelas, de fato o que obtemos é uma lista de listas ou matriz onde teremos
sempre as duas colunas e pra página , ou seja uma lista duas listas, sendo que
no nivél mais baixo da nossa lista teremos os itens a serem filtrados.

Dai pensei na seguinte lógica

- Utilizar o comando tee para gerar um iterator pra cada primeiro nivél e
  identificar os casos de coluna vazia ou com valor none de cara
- Buscar pelo pattern `r"(\d+°)"` para saber se o conteúdo da linha trata-se de
  uma rota de ónibus ou um ponto da rota
  - Se for uma rota adiciona como chave num dicionário
  - Se for o ponto de uma rota adiciona como item da última chave no dicionário

Transformando isso em código fica mais ou menos assim:

```python
import io
import re
from itertools import tee
from typing import Dict, List

import httpx
import pdfplumber


class SourceExtractor:
    
    @staticmethod
    def get_file_content_by_url(
        url: str = "https://www.integrasalvador.com.br/wp-content/themes/integra/img/ITINERARIO_ONIBUS.pdf",
    ) -> bytes:
        response = httpx.get(url)
        response.raise_for_status()
        return response.content

    @staticmethod
    def get_tables_from_bytes(data: bytes) -> List[List[str]]:
        tables = []
        with pdfplumber.open(io.BytesIO(data)) as pdf:
            for page in pdf.pages:
                inner_table = page.extract_table()
                if inner_table:
                    tables.extend(inner_table)
        return tables

    @staticmethod
    def parse_tables_to_dict(table: List[List[str]]) -> Dict[str, List[str]]:
        routes: Dict[str, List[str]] = {}
        regex_step = re.compile(r"(\d+°)")
        route_left = None
        route_right = None

        iter1, iter2 = tee(table)

        valid_rows = filter(lambda row: len(row) == 2, iter1)
        valid_rows = filter(
            lambda row: row[0] is not None and row[1] is not None, valid_rows
        )

        for left, right in valid_rows:
            if not regex_step.search(left):
                route_left = left
            elif route_left:
                routes.setdefault(route_left, []).append(left)

            if not regex_step.search(right):
                route_right = right
            elif route_right:
                routes.setdefault(route_right, []).append(right)

        return routes

    def execute(self) -> Dict[str, List[str]]:
        content = self.get_file_content_by_url()
        table = self.get_tables_from_bytes(content)
        return self.parse_tables_to_dict(table)
```

Agora basta criar alguns breakpoints e analisar se a minha lógica está correta,
vou ajustar o main.py, nosso entrypoint de debug, claro essa lógica não saiu de
primeira, fiquei testando esse processo várias vezes com o auxilio do debug para
entender como filtrar os valores de forma mais eficiente.

```python
from salvadorintegra import SourceExtractor

service = SourceExtractor()
result = service.execute()
print(len(result))
```

Ufa, essa foi rápida ein, no início desse projeto eu ficava commitando sem
querer blocos de código com testes e debugs, e sim poderia fazer o mesmo com
testes, mas penso que ter a opção de criar scripts específicos para debug sejam
mais fáceis de manter, principalmente em projetos que se precisa injetar muita
coisa para poder funcionar.

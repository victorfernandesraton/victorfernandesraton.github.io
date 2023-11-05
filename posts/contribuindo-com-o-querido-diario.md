---
title: Contribuindo com o Querido Diário
description: Como contribuir com open source usando meus limitados conhecimentos de RPA 
published_at: 2023-09-30
cover: /public/assets/img/qd-arch.png
tags: ["python", "scrapping", "open source","Open knowledge"]
---

# O projeto

Conheci o projeto Querido Diário na Python Nordeste de 2023 em Salvadoer, só conheci mesmo , pois por conta de burrice minha em pedir o almoço pelo iFood um pouco tarde , acabei não assistindo a palestra (No dia que eu escrevi isto ainda não foram publicado as palestras da PyNE23)

Mas fiquei encucado com essa coisa de open knowledge, sério eu , o chato do "use open source", não fazia ideia do que era isso.

Explicando (e não explicando) Open knowledge é uma iniciativa muito massa que consisteem trabalho voluntario com o objetivo de afiar os conhecimentos a medida que traga mais transparencia aos dados governamentas, que por sua vez irão possibilitar uma fácil análise de informações para as políticas publicas. Saiba mais sobre [Open knowledge](https://ok.org.br/) e [Querido Diário](https://queridodiario.ok.org.br/) 

Achei o projeto muito interessante, principalmente a parte da arquitetura, e mais impressionante ainda como é que eles fazuam para conseguir raspar dados de N sites com N formas de se interagir, dai nada melhor do que fazer para aprender

![image](/public/assets/img/qd-arch.png)

Então eu, o idiota que vos fala decidi usar meu não tão vasto conhecimento em extraćão e webcrawler de dados para adicionar o Diário Oficial da cidade dos meus pais Maragogipe , município do reconcavo Baiano

# Acesso ao site

Primeiro tentei descobrir se realmente havia uma versão digializada dos Diários Oficiais do muniípio de Maragogipe. Pesquisando no DuckDuckGo eu encontrei este site [aqui](https://sai.io.org.br/ba/maragojipe/Site/DiarioOficial).

Dai decidi verificar no site do Querido Diário se já havia sido cadastrado antes.

Como mostra captura de tela abaixo, eles possuem o link do diário oficial , mas não conseguem extrair o conteúdo, verificando o link, percebi que o mesmo estava errado.

Sem críticas ao projeto neste caso, pois acredito que algo mantido de forma voluntária tem a dificuldade em lhedar quando esse tipo de coisa muda, dependendo do trabalho ativo de alguém para notifica r esse tipo de coisa.

Então sabemos o site , sabemos que temos arquivos recentes disponivéis , verificamos que temos tanbêm os arquivos diários (por publicação) em PDF e os resumos mensais em JSON e PDF

# Instalando o projeto

Eu inicialmente não iria explicar o processo de instalação, apenas deixaria um link para o repositório, pois lá existe todas as instruções. Porêm, não sei se tem algo haver com a distro que uso (Atuaslmente NixOS-23.05) ou se é algo referente a versão do Python (testei com 3.10 e 3.8), mas houve um erro durante o processo de instalação.

No geral para instalar é bem simples:

1. SEMPRE verifique a versão do python, não estava explicita no projeto, mas por causa de uma das instruções em caso de falha, chuto que seja 3.6 ou >.

```bash
python --version
```

2. SEMPRE crie um anbiente virtual de desenvolvimento (principalmente se estiver num Debian da vida)

```bash
python -m venv .venv
```

3. Ative o source do seu terminal, no meu caso uso zsh, logo:

```bash
source .venv/bin/activate
```

4. Fazer a instalação das depedências

```bash
pip install -r data_collection/requirements-dev.in
```

5. Instalando o pre-commit

```bash
pre-commit install
```

# Desenvolvendo a solução

Antes de mais nada eu decidi dar uma explorada no site em questão, neste caos o diário oficial Maragogipe que é mantido pela plataforma SAI/IMAP.

Ao navegar pelo site de primeira eu percebi que não seria fácil extrair os conteúdos da página pois estavam agrupados os diários oficiais por arcodeôns mensais, ou seja eu teria que desenvolver uma estrutura que extraisse os dados da página, logo eu decidi análisar os daods enviados ao preencher uma pesquisa.

![image](/public/assets/img/site-maragojipe.png)

![image](/public/assets/img/request-post.png)

Como pode ver, basicamente ao preencher um formulário o diário oficial manda uma requisição post com algumas informações, ao transpor a requisição pro insominia ela ficaria mais ou menos assim:

![image](/public/assets/img/insominia-test.png)

ALgumas coisas que descobrir ao futucar a url:

- Podemos remover os parâmetros em branco ou com ""
- Ao mudar o campo `diarioOficial.tipoFormato` para o valor 1 , teremos a resp`sta em json, assim como 2 teremos a resposta em xml
- Podemos usar os campos `diarioOficial.dataInicial` e `diarioOficial.dataFinal` para definir períodos
- Precisamos sempre preencher o ano para que ele consiga trazer os diários oficiais para o mesmo ano, assim teremos que paginar as requisições por ano

# Gerando as urls de download

Primeiramente eu percebi que precisariamos gerar a url de download com base no dôminio do site, porém , como descobri posteriormente este dôminio poderia variar de duas formas, pois alguins estados contrataram a plataforma para mais de um município, enquanto outros contrataram por município, assim gerando dois tipos de dôminio:

- Dôminios com subpath , onde teremos o subpath estado/município, ex: https://sai.io.org.br/ba/maragojipe/Site/DiarioOficial
- Dôminios sem subpath , apenas para o municípo: https://www.igaci.al.gov.br/site/diariooficial

Dessa forma precisei investigar um pouco mais as requisições até descobrir que poderia usar o mesmo dôminio para gerar o link de download dos diários, dessa forma pude compor o link dessa forma:

```python
file_url = f"https://sai.io.org.br/Handler.ashx?f=diario&query={edition_number}&c={client_id}&m=0"
```
onde `edition_number` é o número da ediçĩo oficial e o `client_id` é o id do município no sistema SAI/IMAP extraido do própio site do município

# Resultado final
Juntando todas essas informações e alguns ajustes de review de código , foi gerado o seguinte código base para a implementação do uso dos portais SAI/IMAP
```python
#data_collection/gazette/spiders/base/sai.py
import datetime as dt

import scrapy

from gazette.items import Gazette
from gazette.spiders.base import BaseGazetteSpider


class SaiGazetteSpider(BaseGazetteSpider):
    """
    Base Spider for all cases with use SAI (Serviço de Acesso a Informação)
    Read more in https://imap.org.br/sistemas/sai/

    Attributes
    ----------
    base_url : str
        It must be defined in child classes.
        If the domain is sai.io.org.br you must add the subpat otherwise use the domain only
        e.g:
            - sai domain: https://sai.io.org.br/ba/maragojipe
            - other domain: https://www.igaci.al.gov.br/site/diariooficial

    start_date : datetime.date
        Must be get into execution from website
    """

    base_url = None
    start_date = None

    @property
    def _site_url(self):
        return f"{self.base_url}/Site/DiarioOficial"

    def start_requests(self):
        yield scrapy.Request(url=self._site_url, callback=self._pagination_requests)

    def _pagination_requests(self, response):
        client_id = response.xpath(
            "//select[@id='cod_cliente']/option[2]/@value"
        ).extract_first()

        if not self.start_date:
            first_year = int(
                response.xpath("//select[@id='ano']/option[last()]/@value")
                .extract_first()
                .strip()
            )
            self.start_date = dt.date(first_year, 1, 1)

        for year in range(self.start_date.year, self.end_date.year + 1):
            formdata = {
                "URL": "/Site/GetSubGrupoDiarioOficial",
                "diarioOficial.cod_cliente": f"{client_id}",
                "diarioOficial.tipoFormato": "1",
                "diarioOficial.ano": f"{year}",
                "diarioOficial.dataInicial": self.start_date.strftime("%Y-%m-%d"),
                "diarioOficial.dataFinal": self.end_date.strftime("%Y-%m-%d"),
            }

            yield scrapy.FormRequest(
                url=self._site_url,
                formdata=formdata,
                callback=self.parse_item,
                cb_kwargs={"client_id": client_id},
            )

    def parse_item(self, response, client_id):
        gazette_list = response.json()
        for gazette_item in gazette_list:
            edition_number = gazette_item["cod_documento"]
            date = dt.datetime.fromisoformat(gazette_item["dat_criacao"]).date()
            file_url = f"https://sai.io.org.br/Handler.ashx?f=diario&query={edition_number}&c={client_id}&m=0"
            yield Gazette(
                date=date,
                file_urls=[file_url],
                edition_number=edition_number,
                is_extra_edition=False,
                power="executive_legislative",
            )

```

Como trata-se de um site e uma implementação que pode funcionar para vários municípios eu criei esta classe base, dessa forma posso usar ela dessa forma:

```python
from gazette.spiders.base.sai import SaiGazetteSpider


class BaMaragogipeSpider(SaiGazetteSpider):
    TERRITORY_ID = "2920601"
    name = "ba_maragogipe"
    base_url = "https://sai.io.org.br/ba/maragojipe"

```

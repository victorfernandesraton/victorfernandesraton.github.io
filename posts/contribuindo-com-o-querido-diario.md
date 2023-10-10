---
title: Contribuindo com o Querido Diário
description: Como contribuir com open source usando meus limitados conhecimentos de RPA 
published_at: 2023-09-30
cover: /public/assets/img/nixos-rose-pine.png
---

# O projeto

Conheci o projeto Querido Diário na Python Nordeste de 2023 em Salvadoer, só conheci mesmo , pois por conta de burrice minha em pedir o almoço pelo iFood um pouco tarde , acabei não assistindo a palestra (No dia que eu escrevi isto ainda não foram publicado as palestras da PyNE23)

Mas fiquei encucado com essa coisa de open knologe, sério eu , o chato do "use open source", não fazia ideia do que era isso.

Explicando (e não explicando) Open Knologe é uma iniciativa muito massa que consisteem trabalho voluntario com o objetivo de afiar os conhecimentos a medida que traga mais transparencia aos dados governamentas, que por sua vez irão possibilitar uma fácil análise de informações para as políticas publicas. Saiba mais sobre open knologe e Querido Diário 

Então eu, o idiota que vos fala decidi usar meu não tão vasto conhecimento em extraćão e webcrawler de dados para adicionar o Diário Oficial da cidade dos meus pais Maragogipe , município do reconcavo Baiano

# Acesso ao site

Primeiro tentei descobrir se realmente havia uma versão digializada dos Diários Oficiais do muniípio de Maragogipe. Pesquisando no DuckDuckGo eu encontrei este site [aqui](https://sai.io.org.br/ba/maragojipe/Site/DiarioOficial).

Dai decidi verificar no site do Querido Diário se já havia sido cadastrado antes.

Como mostra captura de tela abaixo, eles possuem o link do diário oficial , mas não conseguem extrair o conteúdo, verificando o link, percebi que o mesmo estava errado.

[CAPTURA QUERIDO DIARIO]

[CAPTURA PÁGINA NÃO ENCONTRADA]

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

## Workarround

Foi aqui que aconteceu o erro, novamente não sei te haver com o sistema ou com a versão do python, mas ao executar o build das dependencias pelo setuptools e whel apareceu o seguinte erro:

```bash
Collecting PyYAML<5.5,>=3.10
  Using cached PyYAML-5.4.1.tar.gz (175 kB)
  Installing build dependencies ... done
  Getting requirements to build wheel ... error
  error: subprocess-exited-with-error

  × Getting requirements to build wheel did not run successfully.
  │ exit code: 1
  ╰─> [62 lines of output]
      /run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/config/setupcfg.py:293: _DeprecatedConfig: Deprecated config in `setup.cfg`
      !!

              ********************************************************************************
              The license_file parameter is deprecated, use license_files instead.

              By 2023-Oct-30, you need to update your project and remove deprecated calls
              or your builds will no longer be supported.

              See https://setuptools.pypa.io/en/latest/userguide/declarative_config.html for details.
              ********************************************************************************

      !!
        parsed = self.parsers.get(option_name, lambda x: x)(value)
      running egg_info
      writing lib3/PyYAML.egg-info/PKG-INFO
      writing dependency_links to lib3/PyYAML.egg-info/dependency_links.txt
      writing top-level names to lib3/PyYAML.egg-info/top_level.txt
      Traceback (most recent call last):
        File "/home/v_raton/git/querido-diario/.venv/lib/python3.10/site-packages/pip/_vendor/pyproject_hooks/_in_process/_in_process.py", line 353, in <module>
          main()
        File "/home/v_raton/git/querido-diario/.venv/lib/python3.10/site-packages/pip/_vendor/pyproject_hooks/_in_process/_in_process.py", line 335, in main
          json_out['return_val'] = hook(**hook_input['kwargs'])
        File "/home/v_raton/git/querido-diario/.venv/lib/python3.10/site-packages/pip/_vendor/pyproject_hooks/_in_process/_in_process.py", line 118, in get_requires_for_build_wheel
          return hook(config_settings)
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/build_meta.py", line 355, in get_requires_for_build_wheel
          return self._get_build_requires(config_settings, requirements=['wheel'])
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/build_meta.py", line 325, in _get_build_requires
          self.run_setup()
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/build_meta.py", line 341, in run_setup
          exec(code, locals())
        File "<string>", line 271, in <module>
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/__init__.py", line 103, in setup
          return distutils.core.setup(**attrs)
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/_distutils/core.py", line 185, in setup
          return run_commands(dist)
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/_distutils/core.py", line 201, in run_commands
          dist.run_commands()
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/_distutils/dist.py", line 969, in run_commands
          self.run_command(cmd)
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/dist.py", line 989, in run_command
          super().run_command(command)
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/_distutils/dist.py", line 988, in run_command
          cmd_obj.run()
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/command/egg_info.py", line 318, in run
          self.find_sources()
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/command/egg_info.py", line 326, in find_sources
          mm.run()
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/command/egg_info.py", line 548, in run
          self.add_defaults()
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/command/egg_info.py", line 586, in add_defaults
          sdist.add_defaults(self)
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/command/sdist.py", line 113, in add_defaults
          super().add_defaults()
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/_distutils/command/sdist.py", line 251, in add_defaults
          self._add_defaults_ext()
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/_distutils/command/sdist.py", line 336, in _add_defaults_ext
          self.filelist.extend(build_ext.get_source_files())
        File "<string>", line 201, in get_source_files
        File "/run/user/1000/pip-build-env-g0sx0w2i/overlay/lib/python3.10/site-packages/setuptools/_distutils/cmd.py", line 107, in __getattr__
          raise AttributeError(attr)
      AttributeError: cython_sources
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.
error: subprocess-exited-with-error

× Getting requirements to build wheel did not run successfully.
│ exit code: 1
╰─> See above for output.

note: This error originates from a subprocess, and is likely not a problem with pip.
```
Ainda não consegui entender exatamente o que foi, mas acredito ter haver com a falta de dependencia do cython, pesquisando aqui encontrei esse workarround abaixo nesta [Issue](https://github.com/yaml/pyyaml/issues/601)

```
pip install "cython<3.0.0" wheel && pip install pyyaml==5.4.1 --no-build-isolation
```
5. Instalando o pre-commit

```bash
pre-commit install
```

# Desenvolvendo o crowler

Analisando os exmplos de implementação, eu precisava extrair do site os arquivos dos diários oficiais e, diferente do Selenium que eu uso no dia a dia que é uma ferramenta que permite você fazer algo como bot-like, o scrapy meio que faz o proceso de raspagem em conteúdos estátiocs.

Este é o site que possui o diário oficial do município de Maragogipe, seria o portal do IMAP/SAI, aproveitei o fato de que havia uma issue referete a esta plataforma e decidi tocar.

[CAPTURA IMAP SAI]

Dai o famoso testa ali, usa o inspector do browser aculá, ao preencher o formulário eu descobri que é feito uma request do tipo POST passando algumas informaćões 

[CAPTURA REQUEST]

descobri tanbêm que após o uso do formulário, por algum motivo a página é atualizada para limitar a vizualização , trazendo os dados no formnato de breadcombs por mês em vez de uma tabela atualizada, como mostram as capuras de tela.

Fazendo testes aqui e aculá no Insominia, descobri que se eu mudar o parâmetro `diarioOficial.TipoFormato` para o valor 1 eu obteruia os resultados em array de json, bem como para o valor 2 XML, mas vamos ficar com o JSON.

Testando mais um pouco a requisição retirei alguns parâmetros e vualá! 

[CAPTURA INSOMINIA]

Agora vamos para o Python

Com as informações que tivemos, basta dar uma olhada no código das demais implementções, dai decidi criar uma classe padrão que recebe como parâmetro apenas 3 variáveis:

- `start_date` para data inicial , afinal não sabemos quando cada município adotou o SAI.
- `state_city_url_part` que basicamente é o path estado/municipio onde municipio segue um carnelCase
- `client_id` que se trata de um código do SAI que representa um município

Como mencionei antes, tive que pesquisar um pouco sobre scrapy para saber como ele faz para mandar requisições POST, cai nessa parte da documentação oficial.

Depois disso , foi desenvolver uma classe base para que seja implementado o raspador do site SAI , como mostra o código abaixo

```python
```

Neste código apenas fazemos um método principal que faz a requisição chamado de [NOME DO METODO] onde mandamos nossa requisição POST, em, seguida temos um segundo método que normaliza os dados de cada documento encontrado como resultado, e por fim mandamos eles por meio da entidade Gazette, bem simples.


# Problemas com o ruff

Se você chegou até aqui , deve está se perguntando, "Bem agora é so comitar e partir pro abraço certo?", entâo, sem nenhuma cerimônia fui fazer isso e adivinha, no último check do pre-commit, mais precisamente as verificações da blibioteca ´ruff´ decidiram não funcionar,...

[PRINT DO ERRO]

Mais precisamente o ruff nâo quis processar, o fato é que o mesmo não estava sendo encontrado na pasta ahabitual, isso pq o pre-commit gera uma pasta de .cache na home do seu sistenma , mas no meu caso do sistema imutavél isso nâo era feito, pesquisei, matutei e pesquisei de nvo, até que percebi que teria que compilar o ruff, dai sem mais delongas eu decidi escrever um flake.nix que configura um cli com os compilaodres e ferramentas que vi nessa Issue, torrei minha CPU compilando o ruff, e dessa vez funcionou.

Primeiro eu inicializei o flake com 
```bash
nix flake init
```
E em seguida alterei o arquivo flake.nix (Não se esqueça de evitar commitar ele como eu fiz em certo ponto)

```nix
{
    description = "Querido diário flake base";
    inputs = {
        nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    };
    outputs = { self, nixpkgs }:
        let 
        system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
    in {
        devShells.${system}.default = 
            pkgs.mkShell {
                buildInputs = [
                    pkgs.python310
                    pkgs.pre-commit
                    pkgs.rustc  # for ruff
                    pkgs.cargo  # for ruff
                ];
                shellHook = ''
                    export PIP_NO_BINARY="ruff"
                    '';
            };
    };
}

```

Não sabe o que é flake, dá uma olhada na documentacao oficial do nix e neste video sensacional 

Dai basta inicializar o shell de dev com o comando 

```bash
nix develop
```

Depois apontar para a source do virtual enviroment antes crtiado

```bash
source .venv/bin/activate
```

Depois disso basta instalar o ruff via pip, que ele será buidado localmente (torrando sua CPU)

```bash
pip install ruff
```

E depois disso basta verificar se está tudo ok com o comando 

```bash
pre-commit run
```

# Seguindo em frente: Conversando com o pessoal no discord do projeto, foi acordado que para fins de eficiencia, eu poderia ir já desenvolvendo os demais municípios a serem incluídos.

Entao para isso eu decidi investigar uma forma de extrair primeiro os dados de quais municipios usam este portal, depois iria verificar em cada página dos sites quais os ID's e as datas iniciais a serem consideradas, montaria uma tabela em excel e pronto.



# Lições aprendidas

- O scrpy e o conceito de spyders é bem diferente do que estou acostumado a faer no dia-a-dia com Selenium
- As vezes fuçar requests do network te ajuda a descobrir coisas insanas sobre como os dados são trocados dentro de um site
- O pessoal do Querido Diário está de parabéms, ainda que eu tenha tido problemas,  foram muito acolhedores, me responderam na comunidade e tentaram me ajudar da forma que cabia.


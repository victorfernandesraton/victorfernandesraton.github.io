+++
title = 'O vagabot está morto, a culpa é do python'
description = 'Migrando de python para Go por falta de paciência'
date = 2024-06-17T18:02:00-03:00
tags = ["python", "golang", "selenium", "chromedp"]



cover = 'cover.jpeg'
draft = true
+++

# Matando um projeto

Foi bom enquanto durou e aprendi bastante, mas hoje vou matar um projeto , mas não da forma que vocês costuman fazer ao adicionar typescript nele....

# Python é bom, mas...

Passei o último ano como desenvolvedor fulltime python + 3 meses fazendo e testando o vagabot, usando python como tecnologia-base e cheguei a conclusão obvia , Python é uma solução boa, mas tem seus porêms para determinados projetos onde:

- Você precisa distribuir em multiplas plataformas;
- Você precisa entregar uma solução de aplicativo Desktop;
- Você precisa lhedar com ferramentas de sistema operacional em nivél de Desktop.

Vou destrinchar o que aconteceu pra eu ter feito uma migração para golang como tecnologia-base.

# Write once , Debugging everywhere.

Sim essa é a eslogam do Java e da JVM de forma irônica, mas o mesmo se aplica aqui, fazer algo pra distribuir em Python vai te levar a dois infernos, o primeiro deles é o simples fato de a runtime mudar muita coisa básica sem muita preparação de tempos em tempos,e não estou falando de coisas como a diferença do python2 pro python3, estou falando das coisas pequenas como toda mudança de suporte ao `setuptools`, como podemos ver [aqui](https://github.com/python/cpython/issues/95299).

Isso não afetaria o vagabot diretamente, mas algumas coisas que eu previa fazer no futuro, agora eu teria que rever isso, mas claro isso não impediria o projeto de continuar caso faça um fork da última versão.

E acima disso tudo estaria o virtualenv e suas façanhas, no meu projeto eu uso o poetry para gerenciar as dependências, e ele é uma ferramenta bem poderosa e ok, mas por causa da forma que algumas blibiotecas eram versionadas e administradas, eu tinha um erro ao tentar compilar o projeto usando o pyinstaller no windows por causa do uso da blibioteca `fake-useragent`, que uso para mascarar mais o navegador.

O comportamento errático se dava pelo fato da blibioteca baixar um json para usar como referência, por;em ao compilar o path correto para esse aqruivo se perdia, em tese daria para consertar isso, mas ai quando corrigi o selenium começou a ter problemas, o negócio dificíl de funcionar, no finakl vi que apenas para fazer funcionar o mínimo eu teria que dar uma imensa volta.

Como em golang tudo refere-se a compilação e com o auxilio de features de compilar uma pasta de assets em seu binário na hora da distribuição, golang resolvia esses problemas "de fábrica".

# "Se não tem na lib padrão vista sua roupa de canguru e dê seus pulos"

O título é algo explicativo, mas basicamente isso aqui foi causado pela necessidade de criar arquivos de configurações , principalmente para evitar que o usuário ficasse digitando sua senha ou salvado ela en .env files, dai pensei em administrar isso usando os diretórios de armazenamento que cada sistema fornece, no caso do linux sempre em ~/.config/ e no windows o famoso %AppData%.

Claro que para isso existe blibioteca, mas como postei recentemente no linkedin , o golang tem isso builtin, somando com a blibioteca viper, eu consigo criar toda uma estrutura de configurações persistentes pra minha aplicação sem ter que onerar tempo pra isso. Como no título , poderia vestir minha roupa de canguru e dar meus pulos, mas em golang isso é de grátis....

# Sempre o windows

O último problema tem haver com o impacto do primeiro e do segundo em um sistema operacional que não possui um modo descentralizado de distribuição, imagina o inferno em ter que gerar um wizzard de windows pra a partir do executavél gerir algo que:

- Vai usar suas credenciais de uma rede social.
- Poderia vir a ter acesso a seu navegador de forma "irrestrita"
- Eu teria que gastar tempo com empacotamento.

Fato é que apps de cli e utilitários de sistemas em python são dificeis de integrar e complicados de compartilhar.

E sim eu poderia disponibilizar o source code e cada um que se vire, mas como pessoa que defende o open-source e a acessibilidade à tecnologia, não me sentiria feliz em saber que contribui em normalizar essa forma esdruxula e perigosa de entregar software a semi-leigos, "Compile isso aqui, coloque suas credenciais e confie que não vou te roubar nada, mesmo me dando permissão pra subir um container"

Por esses e outros fatores decidi usar golang, que me permite compilar de forma fácil um executavél para o windows, bastando você ter um navegador instalado.

O chromedp, framework chrome que uso intgrada ao golang para gerir o navegador, além de ser mais rápida, por não depender de uma bridge http como o selenium para comunicar-se , é menos invasivo pois sempre está no modo sandbox ativo, como usa o navegador do usuário não preciso me preocupar em expor um navegador "do meu jeito", tornando o uso do projeto para pessoas além da comuinicade dev, pois agora não precisava mais do docker para funcionar bem.

# Comparação

No final para este projeto o comportamento ficou mais simples de se fazer devido à estrutura de Tasks que o `chromedp` utiliza, como veremos no exemplo abaixo onde implementamos os trechos de fazer login e realizar a busca pelo conteúdo de postagem.

```go
package workflow

import (
	"context"

	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/chromedp"
	"github.com/chromedp/chromedp/kb"
)

const (
	domain         = "https://linkedin.com"
	login          = "https://linkedin.com/login"
	username_xpath = "//input[@id='username']"
	password_xpath = "//input[@id='password']"
	submit_xpath   = "//button[@type='submit']"
	search_xpath   = "//input[@placeholder='Search']"
	search_qs      = "#global-nav-typeahead > input"
	button_posts   = "//nav/*/ul/li/button[text() = 'Posts']"
	post_xpath     = "//ul[@role='list' and contains(@class, 'reusable-search__entity-result-list')]/li"
)

func Auth(username, password string) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.Navigate(domain),
		chromedp.Navigate(login),
		chromedp.WaitVisible(username_xpath),
		chromedp.SendKeys(username_xpath, username),
		chromedp.WaitVisible(password_xpath),
		chromedp.SendKeys(password_xpath, password),
		chromedp.Click(submit_xpath),
		chromedp.WaitVisible(search_xpath),
	}
}

func SearchForPosts(query string, outerHTML *[]string) chromedp.Tasks {
	return chromedp.Tasks{
		chromedp.SendKeys(search_xpath, query),
		chromedp.KeyEvent(kb.Enter),
		chromedp.WaitVisible(button_posts),
		chromedp.Click(button_posts),
		chromedp.WaitVisible(post_xpath),
	}
}
func ExtractOuterHTML(ctx context.Context) (outerHTML []string, err error) {
	var nodes []*cdp.Node
	if err := chromedp.Run(ctx, chromedp.Nodes(post_xpath, &nodes, chromedp.BySearch)); err != nil {
		return nil, err
	}

	for _, node := range nodes {
		var html string
		if err := chromedp.Run(ctx, chromedp.OuterHTML(node.FullXPath(), &html)); err != nil {
			return nil, err
		}
		outerHTML = append(outerHTML, html)
	}
	return outerHTML, nil
}


```

Enquanto isso em python era necessário muito mais código e tratamento de erro para fazer o login como mostra trecho de código abaixo

```python
import logging
import time

from selenium.common import exceptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

from .linkedin_workflow import LinkedinWorkflow


class LinkedinAuth(LinkedinWorkflow):
    USERNAME_INPUT_XPATH = "//input[@id='session_key']"
    PASSWORD_INPUT_XPATH = "//input[@id='session_password']"
    BUTTON_SUBMIT_XPATH = "//*[@id='main-content']/section/div/div/form/div/button"

    def execute(self, driver_key: str, username: str, password: str):
        logging.info("go to site")
        driver = self.browser_service.drivers[driver_key]
        driver.maximize_window()
        driver.get("https://www.linkedin.com")
        input_wait = WebDriverWait(self.browser_service.drivers[driver_key], timeout=30)
        logging.info("set input")
        input_list = {
            self.USERNAME_INPUT_XPATH: username,
            self.PASSWORD_INPUT_XPATH: password,
        }
        for xpath, value in input_list.items():
            try:
                txt_input = input_wait.until(
                    EC.presence_of_element_located((By.XPATH, xpath))
                )
                self.human_input_simulate(txt_input, value)
            except exceptions.TimeoutException:
                raise Exception(f"Not found {xpath} input")

        try:
            time.sleep(5)
            btn_submit = input_wait.until(
                EC.presence_of_element_located((By.XPATH, self.BUTTON_SUBMIT_XPATH))
            )

            btn_submit.click()
            logging.info("button clicked")
        except exceptions.TimeoutException:
            raise Exception("Not found button input")

```
No final do dia a estrutura de golang te permite tratar o erro de forma mais determinística por quem o provoca, além disso é visivél que a API do selenium é menos `error prume`

# Os bônus
- Pacote `net/http` muito mais extensivél;
- `gofmt`, `goimports`, `gopls` funcionam em qualquer lugar e não preciso decidir entre `flake8` ou `pylint`;
- Viper + Cobra = CLI com store de configuração;
- Tratamento de erro mais determinístico (post em breve sobre).
- Mais Performance, Menos Código

# Conclusão

O Python me ajudou a fazer uma exploração mais completa, e dado o estado atual de abandono da blibioteca do selenium do golang, eu recomendaria ainda o uso de python para esse tipo de soluçào se você depende do selenium, mas no meu caso o selenium é um meio e o chromedp se mostrou mais eficaz no que eu quero.

E nem por isso vou deixar de usar Python para outros projetos, ou sequer deixar de adotar como minha linguagem principal para desenvolvimento de software, principalmente para esses MVP malucos que tenho a mania de começar ~~e raramente terminar~~

No final do dia o que vale é usar a ferramenta adequada para resolver determinados problemas....

Por hoje é só , lembre-se de usar o comando `go mod tidy` para o bem da sua própria sanidade.

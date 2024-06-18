+++
title = 'O vagabot está morto, a culpa é do python'
description = 'Migrando de python para Go por falta de paciência'
date = 2024-06-13T18:02:00-03:00
tags = ["python", "golang", "selenium", "chromedp"]
cover = ""
draft = true
+++

# Python é bom, mas...

Passei o último ano como desenvolvedor fulltime python + 3 meses fazendo e testando o vagabot, usando python como tecnologia-base e cheguei a conclusão obvia , Python é uma solução boa, mas tem seus porêms para determinados projetos onde:

- Você precisa distribuir em multiplas plataformas;
- Você precisa entregar uma solução de aplicativo Desktop;
- Você precisa lhedar com ferramentas de sistema operacional em nivél de Desktop.

Vou destrinchar o que aconteceu pra eu ter feito uma migração para golang como tecnologia-base.

# Write once , Debugging everywhere.

Sim essa é a eslogam do Java e da JVM de forma irônica, mas o mesmo se aplica aqui, fazer algo pra distribuir em Python vai te levar a dois infernos, o primeiro deles é o simples fato de a runtime mudar muita coisa básica sem muita preparação de tempos em tempos,e não estou falando de coisas como a diferença do python2 pro python3, estou falando das coisas pequenas como toda mudança de suporte ao `setuptools`, como podemos ver [aqui](https://github.com/python/cpython/issues/95299).

Isso não afetaria o vagabot diretamente, mas algumas coisas que eu previa fazer no futuro, agora eu teria que rever isso, mas claro isso não impediria o projeto de continuar caso faça um fork da última versão.

E acima disso tudo estaria o virtualenv e suas façanhas, no meu projeto eu uso o poetry para gerenciar as dependências, e ele é uma ferramenta bem poderosa e ok, mas por causa da forma que algumas blibiotecas eram versionadas e administradas, eu tinha um erro ao tentar compilar o projeto usando o pyinstaller no windows por causa do uso da blibioteca fake-useragent, que uso para mascarar mais o navegador.

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

O chromedp, framework chrome que uso intgrada ao golang para gerir o navegador, além de ser mais rápida, por não depender de uma bridge http como o selenium para comunicar-se , é menos invasivo pois sempre está no modo sandbox ativo, como usa o navegador do usuário não preciso me preocupar em expor um navegador "do meu jeito", um pouco mais seguro para leigos.


# Um pouco sobre golang e erros.

Um ponto que eu gostaria de ressaltar aqui sobre o projeto de uma forma mais técnica diz respeito ao conceito de tratamento de erros em golang.

Muita gente reclama do conceito de tratamento de erros do golang girar em torno da idéia de erros como variavéis, em tese é mais verboso tratar erros, o seu código fica meio esquisito e nào tem forma de tratar "erros em tudo" como o famoso try... exception em todo projeto e dando print no erro.

Essa impressão se dá ao modelo de tratamento de erro que estamos mais habituados, sempre que algo possivélmente pode dar errado, usamos algo como try...excpetion ou try...catch para capturar esse erro , e quando capturado, criamos lógicas em cima do tipo de erro e suas propriedades.

Mas vamos reformular o nosso pensamento da seguinte forma:

Em vez de tentar adivinhar o erro , criamos uma forma quase determinística e atômica para quando ocorrer um erro em um determinado cenário , tratarmos esse erro com base na origem deste, ou seja, com base em quem causou o erro em vez do que ele se parece, em vez de adivinhar "se" o erro ocorre, agora somos obrigados a tomar decisões "quando" o erro ocorre.

Vamos dar um exemplo prático.

No vagabot ao tentar fazer o simples login no linkedin eu preciso realizar os seguintes passos

- Procurar o inpuit de usuario
- Digitar o nome do usuário
- Procurar o input de senha
- Digitar a senha
- Procurar o botão de submissão de formulário
- Esperar a página recarregar
- Procurar algo que evidencie o login.

Considerando estes passos vamos escrever o nosso pseudocódigo com os seguintes tratamentos

- Se não encontrar um dos elementos web, tentar buscar de novo
- Se não conseguir interagir com algo informar em um log: "Problemas com input"

em python teriamos o seguinte código

```python
import logging
import time

from selenium.common import exceptions
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.wait import WebDriverWait

from vagabot.workflows.linkedin_workflow import LinkedinWorkflow


class LinkedinAuth(LinkedinWorkflow):
    USERNAME_INPUT_XPATH = "//input[@id='session_key']"
    PASSWORD_INPUT_XPATH = "//input[@id='session_password']"
    BUTTON_SUBMIT_XPATH = "//*[@id='main-content']/section/div/div/form/div/button"

    def login(self, driver: WebDriver, username: str, password: str):
        logging.info("go to site")
        driver.maximize_window()
        driver.get("https://www.linkedin.com")
        input_wait = WebDriverWait(driver, timeout=30)
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

repare que precisamos tentar tratar dois erros usando o conceito de `TimeoutException`, para saber se os inputs estão disponiveis, isso porque eu fiz uma lógica interna, mas se houver outro erro, como por exemplo não conseguir clicar num botão, eu teria que simular este erro ou pesquisar na blibioteca qual tipo ded exceçào ele lança, ou criar uma coluna de try exception somente para o ato de clicar, acaba que ficando mais verboso se considerarmos um tratamento de exceção para interagir com o elemento e outro para achar ele na tela.

Esse mesmo código sendo reescrito em golang com uma estrutura similar ficaria mais ou menos assim:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/sclevine/agouti"
)

type LinkedinAuth struct {
	USERNAME_INPUT_XPATH string
	PASSWORD_INPUT_XPATH string
	BUTTON_SUBMIT_XPATH  string
}

func NewLinkedinAuth() *LinkedinAuth {
	return &LinkedinAuth{
		USERNAME_INPUT_XPATH: "//input[@id='session_key']",
		PASSWORD_INPUT_XPATH: "//input[@id='session_password']",
		BUTTON_SUBMIT_XPATH:  "//*[@id='main-content']/section/div/div/form/div/button",
	}
}

func (l *LinkedinAuth) Login(username, password string) error {
	driver := agouti.ChromeDriver(
		agouti.ChromeOptions("args", []string{
			"--headless", // Run Chrome in headless mode
		}),
	)
	defer driver.Stop()

	if err := driver.Start(); err != nil {
		return fmt.Errorf("failed to start driver: %v", err)
	}

	page, err := driver.NewPage(agouti.Browser("chrome"))
	if err != nil {
		return fmt.Errorf("failed to open page: %v", err)
	}

	if err := page.Navigate("https://www.linkedin.com"); err != nil {
		return fmt.Errorf("failed to navigate to LinkedIn: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	inputList := map[string]string{
		l.USERNAME_INPUT_XPATH: username,
		l.PASSWORD_INPUT_XPATH: password,
	}

	for xpath, value := range inputList {
		element := page.FindByXPath(xpath)
		if err := element.SendKeys(value); err != nil {
			return fmt.Errorf("failed to set input %s: %v", xpath, err)
		}
	}

	time.Sleep(5 * time.Second)

	btnSubmit := page.FindByXPath(l.BUTTON_SUBMIT_XPATH)
	if err := btnSubmit.Click(); err != nil {
		return fmt.Errorf("failed to click button: %v", err)
	}

	log.Println("Button clicked successfully")

	return nil
}

```

repare que agora se eu tiver que ter um tratamento de erro a mais para a açào de clicar separado da busca do elemento , eu consigo criar um resultado de erro diferente, sem ter que adivinhar que classe de erro eu teria que usar, apenas com a sua localidade, ou seja, o modelo deterministico do golang de tratamento de erro me permite fazer algo mesmo que eu não conheça o erro , apenas entendendo quem o causou para tomar decisões genéricas.

Como eu quis fazer algo um pouco mais genérico, eu decidi usar a blibioteca chromedp, nesta estruturamos a sequencia do que o navegador precisa fazer, e só ao executar os comandos é que precisamos tratar os erros, em tese esse mesmo código de login ficou mais ou menos assim.

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


```


sendo que agora eu só preciso tratar os passos diretamente ao executar, assim gerando um erro caso o login no geral falhe, ou poderia dividir essa execução em subtasks, mas com essa estrutura, eu sou obrigado a tratar os erros apenas quando a task do chrome é executada, deixando a responsabilidade de "quem solicitou" definir o que fazer quando houver erro.

Isso nos direciona a ficar adivinhando menos e controlando nossa aplicaçào com mais afinco.

# Conclusão

O Python me ajudou a fazer uma exploração mais completa, e dado o estado atual de abandono da blibioteca do selenium do golang, eu recomendaria ainda o uso de python para esse tipo de soluçào se você depende do selenium, mas no meu caso o selenium é um meio e o chromedp se mostrou mais eficaz no que eu quero.

Quem sai ganhando com essa história? Eu, pois pude refletir melhor sobre esse conceito de erro por usar duas abordagens e o usuário final seja lá quem for pois acabou com algo ligeiramente mais rápido e fácil de instalar.

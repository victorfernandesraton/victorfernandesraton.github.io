+++
title = 'NixOS - guia de update'
description = 'Como atualizar os pacotes do seu NixOS'
date = 2023-09-25T00:00:00-03:00
cover = "/images/nixos-rose-pine.png"
tags = ["so", "nix", "nixos"]
layout = 'post.tsx'
+++

Neste rápido e não verboso guia eu vou mostrar como eu faço para atualizar o meu NixOS, atualmente na versão 23.05

Aqui não explicarei o que é Nix ou NixOS, deixarei isso com os universitários e estrangeiros como pode ver neste [link](https://nixos.org) e [neste outro](https://tilvids.com/w/kNVby1VfBYz9vbn6Zbg5xW).

# Ordem de atualização

Irei seguir uma ordem de atualização dos pactoes conforme uma hierarquia que decidi usar que parte do principio do menos critico ao mais critico. Entenda como menos criticos , coisas que não me importo muito com a versão, apenas que esteja funcionando, já as coisas mais criticas são aquelas que garantem que meu sistema rode e que eu consiga performar as atividades mais corriqueiras.

Desse modo, neste guia irei atualizar pela seguinte ordem:

1. pacotes geridos via ´nix-env´
2. pacotes geridos via ´home-manager´
3. pacotes geridos via ´nixos-rebuild´ ou simplesmente coisas system-wide

# Antes do update verifique os seus channels

O nixos usa o conceito de channels para verificar a versão-base das builds compartilhadas, no meu caso tanbém uso home-manager, dai preciso ter um canal para gerir as versões dos pactoes pro meu home-manager que acredito que esteja standalone.

Para isso basta o comando abaixo:

```bash
sudo nix-channel --list
```

Como output você deve ter algo mais ou menos assim:

```bash
nixos https://nixos.org/channels/nixos-23.05
```

Dessa forma podemos realizar o upgrade do sistema atualizando os pacotes no mesmo canal de release.

```bash
sudo nix-channel --update
```

# Como atualizar pacotes instalados via nix-env

Para atualizar pacotes do ´nix-env´ usarei o comando abaixo

```bash
sudo nix-env -uv '*'
```

O que este comnaodo faz é atualizar todos os pacotes do ´nix-env´ mas usando a flag v para usar mensagens verbosas no output

# Atualizando o que é "system wide" e o home manager

Basicamente é a forma de atualizar ou executar as builds do nixOS, neste caso com o comando abaixo:

```bash
sudo nixos-rebuild switch --update
```

Em seguida basta fazer o mesmo para o home-manager

```bash
home-manager switch
```

E vualá! Agora é só usar o famoso ´neofetch´ e postar em suas redes sociais, "I use nix BTW" pra irritar a galera do Arch.


![image](/images/i-use-nix-btw.png)

# Errata

No dia 28/09/2023 o [Cássio Ávila](https://www.linkedin.com/in/c%C3%A1ssio-%C3%A1vila-569912152/) me alertou sobre o fato de que não precisamos usar `sudo` para fazer update do home-manager.

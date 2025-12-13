+++
title = "Expandindo armazenamento do meu homelab"
date = 2024-12-07T19:11:50-03:00
draft = false
description ="De 64GB a 1TB no Raspberry PI 5"
tags = ["raspberry", "linux", "cli", "hardware", "homelab"]
cover = "cover.jpg"
+++

# De volta pra me divertir

Já faz um tempo que não posto por aqui, ano complicado, reforma em casa,
trabalho novo, promoções e mudanças em perspectivas pessoais (passei fazer
academia e me tornei menos disposto a digitar minhas RANT's).

Alguns projetos foram pro lixo, outros vieram com força, em vez de coisas
promissoras e automações que não me levaram a lugar nenhum, decidi voltar a
fazer posts com coisas que gosto (Python, Open Source e Raspberry PI).

Hoje é apenas o primeiro passo de projetos atrasados que eu tinha pro meu
Raspberry, me arrependo um pouco de ter comprado a versão de 4GB de RAM, talvez
não dê pra fazer o hometeater que eu queria ou o NAS que eu planejei, mas 4GB de
RAM pra coisas como NextCloud são interessantes.

Com o tictac do final do ano batendo em minha porta, decidi fazer um post sobre
filesystens e hardwares, nem um pouco influenciado por esse post do Fábio Akita
[aqui](https://www.akitaonrails.com/2021/07/06/akitando-101-tudo-que-voce-queria-saber-sobre-dispositivos-de-armazenamento)

# O que eu precisei comprar pra fazer isso?

Para poder utilizar todo o poder do Raspberry, eu comprei um adaptador USB
3.0/Sata, esse tipo de adaptador só funciona para HDD de notebook (que é o meu
caso) e SSD, se você tem os HDD de computador mesmo, precisa de algo que possua
uma fonte de alimentação adequada.

O dispotivo que eu comprei , foi de fabricação genérica, mas um similar que
achei na internet foi
[este aqui](https://www.amazon.com/SABRENT-SATA-USB-Cable-Converter/dp/B011M8YACM/ref=sr_1_3?sr=8-3)

# Vamos começar

Eu vou considerar que você leu o meu post sobre
[LLM para coisas pequenas](../raspberry-and-low-ia/index.md) e j;a tem seu RPI
instalado e disponivél via SSH

E sim, esse é mais um post de sequencia de terminal.

# AVISO

Antes de começar , certifique-se de saber se seu HDD possui dados, pois no
processo iremos refazer a partição e formatar o mesmo para aplicar o filesystem
correto.

# Entendendo o HDD

Para termos detalhes do nosso HDD atualmente, ao conectar este na porta USB por
meio do adaptador SATA (por favor use adaptadores e portas USB 3.0), podemos ver
informações do nosso disco com o comando `lsblk`

No meu primeiro momento o output desse comando foi isso aqui:

```bash
v_raton@oberon:~$ lsblk                  
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 931.5G  0 disk 
|-sda1        8:1    0   512M  0 part 
`-sda2        8:2    0   931G  0 part /media/v_raton/5bf2ac1a-8132-4552-9a85-3223b6e84d64
                                      /media/devmon/sda2-usb-JMicron_Generic_
mmcblk0     179:0    0  29.7G  0 disk 
|-mmcblk0p1 179:1    0   512M  0 part /boot/firmware
`-mmcblk0p2 179:2    0  29.2G  0 part /
```

Podemos identificar o nosso HDD como `sda`, visto que `mmcblk0` representa o
nosso microSD onde o SO do RPI está alocado (32GB+-)

Curioso é que a partição `sda1` não foi montada de imediato, acredito que foi
algum tipo de warnup, visto que ao reconectar tudo pareceu normal em seguida
~~mas o seníl aqui esqueceu de copiar e colar o output~~.

# Desmontando as partições

Não vou entrar em muitos detalhes sobre o que é montagem de disco, pois o Post
do akita fala sobre isso, mas , a nivél de conhecimento, seria a idéia de que um
dispositivo de armazenamento quando conectado é entendido como tal, em seguida
os seus arquivos são "conectados" a um ponto do filesystem do sistema
operacional, isso seria em curtos termos o conceito de montagens, você pode não
ter ouvido falar dessa palavra, mas quando você clica em "Remover dispositivo
com segurança" no Windows, o que ele está fazendo é a desmontagem do volume do
disco conectado.

Para desmontar as partições, basta executar o comando
`sudo umount /dev/<alias_partition>` onde `<alias_partition>` seria o nome que
aparece no comando anterior, nesse meu caso, esse HDD estava com duas partições

No meu caso eu executo duas vezes para a partição `sda1` e `sda2`, assim tendo
os seguintes comandos:

```bash
sudo umount /dev/sda1
```

```bash
sudo umount /dev/sda2
```

Entre os comandos executados , você pode acompanhar o desmonte do disco, usando
o comando `lsblk`

```bash
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 931.5G  0 disk 
|-sda1        8:1    0   512M  0 part 
`-sda2        8:2    0   931G  0 part /media/devmon/sda2-usb-JMicron_Generic_
mmcblk0     179:0    0  29.7G  0 disk 
|-mmcblk0p1 179:1    0   512M  0 part /boot/firmware
`-mmcblk0p2 179:2    0  29.2G  0 part /
```

```bash
v_raton@oberon:~$ lsblk                
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 931.5G  0 disk 
|-sda1        8:1    0   512M  0 part 
`-sda2        8:2    0   931G  0 part 
mmcblk0     179:0    0  29.7G  0 disk 
|-mmcblk0p1 179:1    0   512M  0 part /boot/firmware
`-mmcblk0p2 179:2    0  29.2G  0 part /
```

# Apagando as partições

Após desmontar as partições, é preciso apagar as mesmas, para isso basta
utilizar a ferramenta `fsdik` no modo interativo.

Primeiro vamos executar esta ferramenta em modo interativo para o `sda` com o
seguinte comando:

```bash
sudo fsdik /dev/sda
```

Isso vai te levar a um prompt, não fique asustado, primeiro vamos usar o comando
`d` para apagar as partições, caso tenha mais de uma , selecione o nùmero da
partição e repita este passo até apagar todas as partições

Em seguida use o comando w para sobrescrever a tabela de partições com esse
ajuste.

Saindo deste shell e usando o comando `lsblk` vemos que as partições foram
apagadas:

```bash
``NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 931.5G  0 disk
mmcblk0     179:0    0  29.7G  0 disk
|-mmcblk0p1 179:1    0   512M  0 part /boot/firmware
`-mmcblk0p2 179:2    0  29.2G  0 part
```

# Criando uma nova partição

Essa partição que iremos criar , vai ser para o disco `sda`, vamos utilizar a
ferramenta `fdisk` novamente.

Após acessar o `fsdik`, iremos usar o comando `n` para criar uma nova partição.

Aqui você pode configurar como quiser, eu preferi configurar uma partição única
no disco inteiro , possa ser que ele pergunte sobre uma assinatura de partição
`vfat` a ser apagada, basta confirmar.

Eu usei todos os valores padrão.

```bash
v_raton@oberon:~ $ sudo fdisk /dev/sda

Welcome to fdisk (util-linux 2.38.1).
Changes will remain in memory only, until you decide to write them.
Be careful before using the write command.


Command (m for help): n
Partition number (1-128, default 1):
First sector (34-1953525134, default 2048):
Last sector, +/-sectors or +/-size{K,M,G,T,P} (2048-1953525134, default 1953523711):

Created a new partition 1 of type 'Linux filesystem' and of size 931.5 GiB.
Partition #1 contains a vfat signature.

Do you want to remove the signature? [Y]es/[N]o: y

The signature will be removed by a write command.

Command (m for help): w
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

Podemos ver o resultado com o já conhecido comando `fsblk`, mas podemos usar o
comando `fdisk` para ver as partições:

```bash
sudo fdisk -l /dev/sda
```

Normalmente irá aparecer os detalhes do disco no final, o meu ficou mais ou
menos assim:

```bash
Disk /dev/sda: 931.51 GiB, 1000204886016 bytes, 1953525168 sectors
Disk model: Generic
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 4096 bytes
I/O size (minimum/optimal): 4096 bytes / 4096 bytes
Disklabel type: gpt
Disk identifier: 9DAF71C9-BEA2-4C58-9A8F-AB015307915D

Device     Start        End    Sectors   Size Type
/dev/sda1   2048 1953523711 1953521664 931.5G Linux filesystem
```

Dessa forma temos o disco `sda` que pode ser localizado no path `/dev/sda`. e
sua respectiva única partição `sda1` que pode ser localizada em `/dev/sda1`,
isso significa que o nosso sistema operacional irá tratar o disco como um
dispositivo e a partição como outro dispositivo, curioso não?

# Criando um filesystem

Antes de realizar o nosso próximo passo temos que entender um pouco o que é um
filesystem.

Filesystem é uma definição de sistema de arquivos que vai determinar como o
sistema operacional irá interoperabilizar os arquivos.

Se você deseja criar algo que possa ser acessado via rede a partir de um
computador não-linux, pode-se usar o `nfs` , existem alguns tutoriais de como
fazer isso, mas neste meu caso , irei optar por um sistema de arquivos do tipo
`ext4`, já que meu Raspberry não possui tanto recurso pra ficar lhedando com
arquivo em rede, e não é do meu interesse visto que coisas como Syncthing
atendem muito melhor às minhas necessidades, porém `nfs` pode ser interessante
em casios de disco compartilhados em ambiente empresarial ou de automações.

Então sem mais delongas, vamos criar nosso sistema de arquivos:

```bash
sudo mkfs -t ext4 /dev/sda1
```

Estamos usando a partição `sda1` , que foi criada no passo anterior

O output desse comando pode demorar um pouco pra executar, no meu caso usando um
HDD de 750rpm Seagate Barracuda de 1TB que já tinha bastante tempo de uso foi
coisa de 10s, o resultado impresso em tela foi este:

```bash
mke2fs 1.47.0 (5-Feb-2023)
Creating filesystem with 244190208 4k blocks and 61054976 inodes
Filesystem UUID: 41ac6003-2512-477f-b774-78895106d83f
Superblock backups stored on blocks:
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
        4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968,
        102400000, 214990848

Allocating group tables: done
Writing inode tables: done
Creating journal (262144 blocks): done
Writing superblocks and filesystem accounting information: done
```

# Vamos montar!!!!

Esta é a penúltima etapa do nosso processo e a mais "complicada", assim como
desmontamos o disco, agora que temos nosso filesystem, precisamos montar ele de
novo, seria o equivalente à ligar, você pode pensar em desconectar e conectar de
novo, mas isso iria montar ele como device externo, queremos que essa montagem
seja feita de uma forma que possamos, no ùltimo passo, realizar a montagem
automática no boot do sistema.

Eu vou considerar que a esta altura do campeonato você já conhece os comandos
`mdkr`, `chown` e quais os usergroups.

Você deve tanbém ter de antemão o nome e o usergroup de seu usuário do
Raspberry, uma forma de descobrir isso é com o comando `who` para o username e
`id -Gn` para os nomes dos grupos, mas se você seguiu o que eu fiz no meu guia
de id [LLM para coisas pequenas](../raspberry-and-low-ia/index.md), basta usar o
username como grupo, no meu caso `v_raton`

Então vamos lá:

1. Criando pasta para montagem

```bash
sudo mkdir /mnt/hd1
```

2. Habilitando o owner

```bash
sudo chown -R v_raton:v_raton /mnt/hd1
```

3. Descobrindo o UUID da partição:

Este passo é importante, pois para cada disco, é criado um UUID, dessa forma,
poderemos no próximo passo configurar para que o sistema monte automaticamente a
partição com base no UUID.

```bash
sudo blkid | grep sda1
```

Este comando resulta em um output +- assim:

```bash
/dev/sda1: UUID="41ac6003-2512-477f-b774-78895106d83f" BLOCK_SIZE="4096" TYPE="ext4" PARTUUID="2225e7fe-b823-2a44-890f-0a3d6e942b13"
```

4. Atualizando o arquivo `fstab`

A parte legal do linux, é que de certa forma, tudo é um arquivo ou pasta, não
sendo diferente para as partições montadas no boot do sistema, e sim, em tese
daria pra deixar um "pendrive" como disco a ser montado no boot, de certa forma,
é assim que funcionam as live ISO de coisas como o Linux Mint.

Antes de ir para o próximo passo, certifique-se de ter instalado algum editor de
texto de linha de comando, eu , particulamente vou usar o `vim` que já vem no
Raspibian.

```bash
sudo vi /etc/fstab
```

# Editando o arquivo fstab

O arquivo fstab tem de ser editado com muito cuidado, primeiro ponto é que cada
linha, será iterada na inicialização para que seja feita a montagem de cada
disco.

O seu arquivo vai iniciar +- assim:

```text
proc            /proc           proc    defaults          0       0
PARTUUID=2cfd61b5-01  /boot/firmware  vfat    defaults          0       2
PARTUUID=2cfd61b5-02  /               ext4    defaults,noatime  0       1
# a swapfile is not a swap partition, no line here
#   use  dphys-swapfile swap[on|off]  for that
```

Vamos entender as colunas:

- `proc` seria a coluna usada para identificar o dispotivo, em nosso caso,
  adicionaremos na nova linha o valor UUID seguido pelo simbolo de igual e o
  valor do UUID gerado no passo 4 da montagem.
- `/proc` seria o path onde o dispotivo seria montado, em nosso caso `/mnt/hd1`
- `proc` seria o filesystem, em nosso caso `ext4`
- `defaults` seria o comportamento, em nosso caso `defaults` para que este
  filesystem seja tratado como o padrão de um sistema linux.
- `0` seria a prioridade referente a ativação de dump de backups por meio da
  ferramenta `dump`, em nosso caso nenhuma, ou seja `0`
- `0` novamente refere-se a checagem de erro na inicialização pela ferramenta
  `fsck`, em nosso caso nenhuma, ou seja `0`

Para entender mais sobre a `fstab`, existe
[esse blogpost do Diolinux](https://diolinux.com.br/sistemas-operacionais/discos-particoes-linux-fstab.html),
recomendo muito a leitura.

nossa linha ficará mais ou menos assim:

```text
UUID=41ac6003-2512-477f-b774-78895106d83f       /mnt/hd1        ext4    defaults        0       1
```

Por fim , nosso arquivo ficaria assim:

```text
proc            /proc           proc    defaults          0       0
PARTUUID=2cfd61b5-01  /boot/firmware  vfat    defaults          0       2
PARTUUID=2cfd61b5-02  /               ext4    defaults,noatime  0       1
UUID=41ac6003-2512-477f-b774-78895106d83f       /mnt/hd1        ext4    defaults        0       1
# a swapfile is not a swap partition, no line here
#   use  dphys-swapfile swap[on|off]  for that
```

Vamos montar com o comando `mount`:

```bash
sudo mount -a
```

Você pode receber o aviso sobre o `systemd` ainda não ter atualizado
corretamente as informações, isso é normal.

Mas agora podemos usar o `lsblk` para ver o resultado:

```bash
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0 931.5G  0 disk
`-sda1        8:1    0 931.5G  0 part /mnt/hd1
mmcblk0     179:0    0  29.7G  0 disk
|-mmcblk0p1 179:1    0   512M  0 part /boot/firmware
`-mmcblk0p2 179:2    0  29.2G  0 part /
```

Um detalhe para garantir que possamos manipular esse HDD, seria adicionar
permissões nele para nosso usuário, usando o comando abaixo:

```bash
sudo chmod -R 777 /mnt/hd1
```

# Testando 1, 2....

Agora vamos testar se conseguimos ler e escrever no disco.

Vamos criar um arquivo e escrever nele o output do nosso comando `screenfetch`
ou qualquer outra coisa como o `cowsay`:

```bash
screenfetch > /mnt/hd1/teste.txt
```

Vamos reiniciar o sistema para testar se conseguimos ler o conteúdo do arquivo:

```bash
sudo reboot
```

E vamos ver se conseguimos ler o conteúdo do arquivo após o reboot e a reconexão
ao sistema via SSH:

```bash
cat /mnt/hd1/teste.txt
```

E voualá! (No editor de texto fica certim, mas aqui no post a logo ficou toda
deformada KKKKK)

```bash
       _,met$$$$$gg.           v_raton@oberon
    ,g$$$$$$$$$$$$$$$P.        OS: Debian 12 bookworm
  ,g$$P""       """Y$$.".      Kernel: aarch64 Linux 6.6.51+rpt-rpi-2712
 ,$$P'              `$$$.      Uptime: 13d 20h 37m
',$$P       ,ggs.     `$$b:    Packages: 1657
`d$$'     ,$P"'   .    $$$     Shell: bash 5.2.15
 $$P      d$'     ,    $$P     Disk: 20G / 947G (3%)
 $$:      $$.   -    ,d$$'     CPU: ARM Cortex-A76 @ 4x 2.4GHz
 $$\;      Y$b._   _,d$P'      RAM: 1205MiB / 4045MiB
 Y$$.    `.`"Y$$$$P"'
 `$$b      "-.__
  `Y$$
   `Y$$.
     `$$b.
       `Y$$b.
          `"Y$b._
              `""""
```

# Conclusão

Sim, esse guia é bem genérico, eu particulamente não lembrava de todos os
comandos ou passos de cabeça (primeiro motivo pra ter feito o post em si), mas
com isso podemos utilizar algumas das ferramentas de gestão do linux, sem falar
que eu deixei algumas referências aos vídeos do Fàbio Akita e ao Diolinux, pois
me custaria um tempo explicar aqui do zero, algo que ambos fizeram com mais
detalhes e propriedade do que eu, porém eu pretendo realizar atualizações neste
post ou criando um novo para explicar com mais calma os gaps que deixei aqui,
afinal o objetivo desse guia é mostrar mesmo o quão poderoso e , ao mesmo tempo
simples o Linux é, imagino que pra refazer isso no Windows, bem seja impossivél
pois não me recordo de existir imagens do OS que suportem o Raspberry, MacOS nem
se comenta.....

# Referências

- Connect a HardDrive / USB Stick on a RaspberryPi (From Terminal) | 4K
  TUTORIAL - YouTube (https://www.youtube.com/embed/eQZdPlMH-X8) - Consultado
  em: 08/12/2024
- Como configurar discos e partições no Linux usando FSTAB - Diolinux
  (https://diolinux.com.br/como-configurar-discos-e-particoes-no-linux-usando-fstab/) -
  Consultado em: 08/12/2024

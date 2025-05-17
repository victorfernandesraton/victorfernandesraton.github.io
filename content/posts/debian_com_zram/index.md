+++
title = 'Debian & zram'
description = 'Aprimorando a performance e corrigindo meu install cagado'
date = 2025-05-17T00:00:00-03:00
tags = ["debian", "os", "fstab"]
cover = 'cover.png'
+++

# DISCLAIMER

Vale lembrar que o `ZRAM` se trata de um módulo do kernel, nesse caso eu estou assumindo que esta usando o kernel lts e defau;t do `Debian 12 (bookworm)`, portanto, se for fazer isso em algum ambeinte que use algum tipo de kernel customizado, __TENHA CUIDADO__ 

# Debian com zram

Um guia definitivo para usar zram no Debian 12 (bookworm)

## Um pouco de storytelling

Eu uso Debian a quase dois anos seguido a essa altura. Performance nunca foi um problema para minha install, ainda mais no meu hardware, atualmente um Intel i5 de 10 geração com 16GB de RAM e um ssd nvme, mas um papo com uns colegas esses dias e eu vi que o meu sistema estava usando a Swap demais , mesmo sem estar com memória em uso constante.

Eu poderia investiagar, mas deicidi aproveitar a oportunidade pra corrigir algo que eu tinha esquecido de fazer desde o install atual, configurar a ZRAM.

## O que é swap e zram

Swap ou área de troca é um mecanismo do linux que tem como principio fazer dump de dados que estão em memória para o disco, evitando que o sistema trave ou tenha mal funcionamento por ter alocado toda a RAM.

E sim, tecnicamente disco é mais lento, mesmo SSD , mas esse mecanismo é uma válvula de escape, principalmente para sistemas sem RAM.

ZRAM é o mesmo principio, mas usando a própria memória RAM, mas dessa vez é alocando uma determinada parte da RAM para ser essa área de troca, mas usando compressão de dados para ocupar menos memória.

O tradeoff é que agora o ZRAM depende mais de CPU para alocar esses blocos de memórias comprimidos na área de swap.


- Caso tenha swap , desative ela.
Remova a swap do sistema, parando ela
use o comando abaixo:
```bash
sudo swapoff -a
```

Remova a zram da fstab, comentando a entry dela 

```bash
sudo -E nvim /etc/fstab
```
Após comentar a linha da swap com # o resultado deve ficar +- assim:

```txt
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a device; this may
# be used with UUID= as a more robust way to name devices that works even if
# disks are added and removed. See fstab(5).
#
# <file system>             <mount point>  <type>  <options>  <dump>  <pass>
UUID=738D-1123                            /boot/efi      vfat    defaults,noatime 0 2
UUID=9757ad5c-2c4e-49af-9220-b8363a3c209c /              ext4    defaults,noatime,discard 0 1
# UUID=a9865266-3ecc-44a3-9090-6e510572d8c2 swap           swap    defaults,noatime,discard 0 0
UUID=d7e11dea-70d3-49c6-a74c-47ccaa74e9f2 /home          ext4    defaults,noatime,discard 0 2
tmpfs                                     /tmp           tmpfs   defaults,noatime,mode=1777 0 0
```

- Atualize as entries do initramfs para garantir que o sistema não vai usar mais swap novamente
sudo update-initramfs -u



- Checando antes de iniciar
O comando abaixo ajuda a verificar se a zram já está ativa como módulo do kernel
```bash
grep -E ZRAM /boot/config-6.1.0-34-amd64
```

O resultado para quando não está ativa , mas está presente como módulo do kernel
```txt
CONFIG_ZRAM=m
CONFIG_ZRAM_DEF_COMP_LZORLE=y
# CONFIG_ZRAM_DEF_COMP_ZSTD is not set
# CONFIG_ZRAM_DEF_COMP_LZ4 is not set
# CONFIG_ZRAM_DEF_COMP_LZO is not set
# CONFIG_ZRAM_DEF_COMP_LZ4HC is not set
CONFIG_ZRAM_DEF_COMP="lzo-rle"
CONFIG_ZRAM_WRITEBACK=y
CONFIG_ZRAM_MEMORY_TRACKING=y
```

> Se estiver usando algum tipo de compilação especial de kernel, chances disso aqui sequer funcionar

- Instalando ferramentas necessárias

```bash
sudo apt install zram-tools
```

Por fim checar após o download o comportamento da zram:


```bash
sudo zramswap status
```

O resultado esperado nessa etapa é que ainda esteja usando zram com lz4 por meio do swap do sistema.

```txt
NAME       ALGORITHM DISKSIZE DATA COMPR TOTAL STREAMS MOUNTPOINT
/dev/zram0 lz4           256M   4K   63B    4K       8 [SWAP]
```

- Configurando arquivo de comportamento de zram
Para mudarmos o comportamento usaremos o arquivo `/etc/default/zramswap`
Nele temos as configs que o zram vai usar.

Para editar precisa de sudo, utilize sudo -E + editor + /etc/default/zramswap, no caso trocando editor pelo seu editor de texto favorito, caso não tenha um, use vim ou nano

```bash
sudo -E nvim /etc/default/zramswap
```

- Reinicie o serviço
Use o comando abaixo para reiniciar o serviço de zram 
```bash
sudo zramswap restart
```

- Reativando o zswap 
Isso aqui é para poder continuar usando swap em disco , mas por meio do zram, eu não ligo para usar em disco, se quiser trocar e desligar a swap, eu uso com o valor zero
```bash
echo "1" | sudo tee /sys/module/zswap/parameters/enabled
```

# Referências

- Imagem de capa, Disponivél em [https://wiki.debian.org/DebianArt/Themes/onFire#Wallpapers](https://wiki.debian.org/DebianArt/Themes/onFire#Wallpapers), Consultado em 17 de Maio de 2025, 18:32 
- Ativação e configuração de Zram no Debian e derivados , Disponivél em [https://gist.github.com/LinuxDicasPro/28d96edd5775a244785291393a905e94](https://gist.github.com/LinuxDicasPro/28d96edd5775a244785291393a905e94), Consultado em 17 de Maio de 2025 , 14:30
- Como Aumentar a Performance do Debian usando ZRAM - LinuxDicasPro, Disponivél em [https://www.youtube.com/watch?v=5DqIhWVevww](https://www.youtube.com/watch?v=5DqIhWVevww) , Consultado em 17 de Maio de 2015, 13:40

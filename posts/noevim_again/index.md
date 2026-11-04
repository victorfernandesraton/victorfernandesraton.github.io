+++
title = 'Usando neovim de novo'
description = 'Um bom filho a home row retorna'
date = 2026-11-04T10:00:00-03:00
tags = ["ai", "llm", "lua", "opencode", "neovim"]
cover = "cover.jpg"
draft = false
+++

## O motivo de saida do zed

Há um tempo atrás , eu movi meu fluxo pessoal para poder usar o editor [Zed](https://zed.dev/) pois estava querendo algo que tivesse suporte a renderização de markdown e jupyter notebook , ao passo que não fosse o VScode, pois este estava apresentando problemas de performance, fora os desastres em sequência dos últimos anos da microsoft administrando a ferramenta que tem [vários problemas de segurança](https://app.opencve.io/cve/?product=visual_studio_code&vendor=microsoft) e vários lockins como os repositórios centralizados

O Zed cumpriu seu papel, é robusto, a parte que me importa é FOSS, e tem um ótimo fluxo para trabalhar com LLM, até suporte a worktree, vale a pena tentar. O problema é que o Zed é uma IDE, e o que eu quero um editor de texto

A forma que eu descobri que o que eu precisava era um editor de texto, foi o chá de revelação da incompatibilidade momentânia do plugin de ACP nativo com o [opencode v2](https://opencode.ai/v2/docs/migrate-v1), claro existia um workarround temporário que consistia em usar o opencode como acp externo OU fazer um PR que corrigia o erro no repositório do pluigin de ACP pra opencode, e então compilar uma versão com base nesse repo, foi ai que a ficha caiu.

Plugins no zed, estão presos a runtime e a um repositório de distribuição centralizado, fora que os plugins são escritos em rust e limitados a api exposta do zed, afinal trata-se de uma IDE.

Em conttrapartida, meu bom e velho neovim é apenas um editor de texto, eu consigo compilar local uma nova versão se precisar , e o sistema de plugins é descentralizado, podendo eu mesmo escrever um plugin ou um fork e usando lazy.nvim ou o próprio suporte do neovim a pacotes via vim.pack, o céu é o limite, ainda mais no momemnto que vivemos agora no mundo das LLM's.

Final do dia eu não queria um render de markdown, massa que você use, mas se eu quiser ler o markdown renderizado, eu abro o navegador, eu não quero um renderizador de jupyternotebook meia boca, apesar que no zed se tem suporte até a render de midia em script python, eu novamente não me importo, se eu precisar de jupyter, eu uso a interface nativa no navegador.

E pra você, usuario assiduo de LLM , que afirma que código foi resolvido (não foi), a questão do neovim não é apenas pra programação, eu preciso de um editor de texto, para escrever os pronpts de forma rápida ao passo que navega no código de forma rápida para linkar trechos no prompt se precisar, eu preciso de uma tool de diff fácil de usar como o [fugitive](https://github.com/tpope/vim-fugitive) e para anotações o [VimWiki](https://vimwiki.github.io/), afinal obsidiam depende de um render próprio e um aplicativo próprio, eu só quero textos em markdown genérico que qualqer ferramenta consiga indexar no mobile , desde que tenha suporte a links de markdown, o que é bem simples.

De bonus ainda ganho um fluxo de trabalho que não depende de big tech, compilo a versão do neovim na mão mesmo, a partir do source, o resto , como verão, passou a ser um config file.

Não é sobre encontrar um fluxo de trabalho perfeito, é sobre encontrar um fluxo de trabalho que eu posso portar pra qualquer lugar, ao meu bel prazer, e se algo parar de funcionar, eu mesmo conserto.

Usar o zed é como dirigir um carro elétrico, tem tudo o que você precisa e muito mais no sentido de ergonomia, câmera de ré, ar condicionado e direção hidráulica, usar neovim é como usar um Uno Fire de firma sem ar condicionado, desconfortavél e você passa um aperto, mas nenhuma big tech ou embargo de API vai fazer seu carro parar no meio da BR á meia-noite.

## Mas eu já estive por aqui

Até o início do ano , eu usava neovim, versão 0.11 sem suporte ao vim.pack, novidade que por si só paga a migraçõa, então , com toda a cara de pau do mundo , decidi analisar com meu llm favorito (GLM 5.3 flash free) como migrar para a versão 0.12, e no final deu certo, mas a jornada me reservou alguns momentos curiosos, por isso , esta postagem, para registrar em segunda mão, o processo migratório semi-automático.

Senta que lá vem markdown, digo, história.

# De lazy.nvim para `vim.pack`: a migração do meu Neovim 0.12

## TL;DR

Em um dia (31/10/2026), saí de um config com [**lazy.nvim puro + 29 arquivos de spec**](https://codeberg.org/v_raton/nvim) (um primeiro teste de `vim.pack.add` híbrido ficou apenas no working tree, sem commit) para um **`init.lua` único de ~1.500 linhas**, com **51 plugins geridos pelo `vim.pack` nativo do Neovim 0.12**, lockfile versionado no git e README documentando pré-requisitos do Debian Trixie e atalhos. Entre o início e o fim, os bugs mais caros **não foram sintáticos**: foram coisas que *passavam pelo boot mas explodiriam depois* (um `table.unpack` que não existe na runtime, entradas "sumidas" da lista de plugins, glifos de Nerd Font perdidos na transcrição).

| | Antes | Depois |
|---|---|---|
| Gestor de plugins | lazy.nvim (bootstrapado) | `vim.pack` (builtin 0.12+) |
| Organização | `init.lua` + `lua/vraton/plugins/*.lua` (29 specs) | `init.lua` único, 8 seções |
| Lazy-loading | `event` / `keys` / `cmd` / `ft` | nenhum (eager; vim.pack não lazy-loada) |
| Builds (`build =`) | campo do lazy | hook `PackChanged` |
| Lockfile | `lazy-lock.json` | `nvim-pack-lock.json` (versionado) |
| Config de plugin | spec declarativo | código inline no `init.lua` |

*Um registro técnico da migração, com hashes, auditoria de erros e os troubleshoots que quase viraram incidente.*

## De onde partimos — `91ba890` (2026-10-27), o lazy puro

O último commit antes da migração (`git show 91ba890:init.lua`, 94 linhas) **não tem uma única ocorrência de `vim.pack`**:

```lua
-- require('vim._core.ui2').enable()   -- nunca ativado
require("vraton.lazy")
```

- `lua/vraton/lazy.lua` bootstrapava o lazy.nvim e importava **29 specs** em cinco "imports" (`vraton.plugins`, `.lsp`, `.dap`, `.enviroment`).
- A linhagem de gestores é antiga: o **primeiro commit** do repo (`167a7b1`, 2023) já carrega um `packer_compiled.lua` (era packer.nvim); a era lazy se consolidou em 2025–2026 junto da atualização do nvim (`7737bb0` → 0.12; `d361952` → fallback do treesitter). A virada ao vim.pack é de 31/10/2026.
- Features do lazy que o config usava de verdade: `event` (BufReadPre, VeryLazy, InsertEnter), `keys`, `cmd`, `build` (`make`, `make build_generator`, `./install.sh`, `:MasonUpdate`), `tag`/`branch` (`0.1.8`, `harpoon2`), `dependencies` (aninhadas!), `init`, `config`, `opts`, `main`.

### O primeiro teste do vim.pack — o híbrido que nunca virou commit

Entre `91ba890` e o commit grande, o working tree carregou um experimento **sem commit**: um `vim.pack.add()` com 4 repositórios (everforest, plenary, vim-tmux-navigator, treesitter) convivendo no `init.lua`, **enquanto o lazy seguia instalando os mesmos plugins** em `~/.local/share/nvim/lazy/` — dois gestores, duas cópias no runtimepath.

Nunca chegou ao git: `git log -S "vim.pack.add" -- init.lua` lista *somente* `9d53400`. Para o post-mortem isso importa: **o primeiro contato com a API nova viveu apenas no working tree** — e o problema real do híbrido (cópia duplicada no rtp) existiu roda por rodas de teste, sem nunca ficar registrado no histórico. Mesmo assim, o aprendizado se materializou no "(lista do `add()` é o runtimepath; resto é disco)".

### Mapeamento campo a campo

| lazy | vim.pack / "manual" |
|---|---|
| `src`, `dependencies` | array único do `add()`, dep **antes** do dependente |
| `version`/`branch`/`tag` | campo único `version` (string = branch/tag/hash) |
| `build = :cmd` / `build = make` | hook no evento **`PackChanged`** (`install`/`update`) |
| `keys` | ⚠️ lazy **criava o keymap**; vim.pack não cria nada — é código manual |
| `event`/`ft`/`lazy` | não existe: eager é a escolha arquitetural do vim.pack |
| `:Lazy update/clean/restore/check` | `:packupdate`, `:packdel ++all`, reversão via lockfile, `vim.pack.get()` |
| `init` | código solto no `init.lua` antes do `add()` |

---

## A migração — commit `9d53400` "neovim single config" (2026-10-31)

O commit grande: **33 arquivos alterados, +1.701 / −1.670 linhas**.

O que aconteceu nele:

1. **Specs → código**: cada `lua/vraton/plugins/*.lua` de spec passou por módulo de setup (`return function() ... end`); por fim, tudo foi **inlineado no `init.lua`** em ordem de dependência. `lua/vraton/` inteira removida.
2. **`vim.pack.add()` único** com ~55 specs agrupados por categoria (base/UI/editing/git/picker/terminal/treesitter/LSP/DAP/testes/extras), dependências na frente — inclusive o `mason.nvim` que veio de `williamboman/` → `mason-org/`.
3. **Hook de build** registrado *antes* do `add()`:

```lua
local name, kind = ev.data.spec.name, ev.data.kind
if kind ~= "install" and kind ~= "update" then return end

local build = shell_builds[name] -- { "make" }, { "cargo", ... } etc.
if build then
    vim.system(build, { cwd = ev.data.path, cwd_behavior = "AppendPath" }):wait()
end
```

4. `nvim-pack-lock.json` (212 linhas) versionado — a nova "fonte da verdade" de revisões.

Commits seguintes, cada um pareado com os bugs que vou contar:

- `61af158` — dependências que faltaram na lista
- `dba11d2` — comandos de reload/restart (`so`/`sr`/`sR`)
- `5bdfaa2`/`1ce4a60` — README (pré-requisitos p/ Debian Trixie + atalhos)
- `3d0d2a7` — `.luarc.json` com `runtime.version` (história do `unpack` adiante)

---

## Os troubleshoots (a parte que vale o artigo)

### 3.1 "build = :TSUpdate" não tem equivalente

`vim.pack` **não tem** campo declarativo de build. O substituto é o evento `PackChanged` (kinds `install` / `update` / `delete`), disparado em bulk depois das ações. Para o treesitter, nem hook valeu: como o TSUpdate é idempotente e barato, virou uma chamada pós-`add()`

```lua
require("nvim-treesitter").setup({ auto_install = true })
pcall(vim.cmd, "TSUpdate")
```

(`pcall` porque na primeira instalação, sem parser algum, o comando pode falhar.)

### 3.2 `keys` do lazy não era só "gatilho de lazy-load" — era *o que criava os keymaps*

Este foi o tipo de bug mais traiçoeiro: **nada quebrou no boot**. O lazy, ao processar `keys = {...}`, registra o keymap quando o plugin carrega. Migrado para eager loading com vim.pack, **o keymap simplesmente não existia mais**. A varredura dos 5 specs que usavam `keys` encontrou:

- `trouble.nvim`: **6 keymaps** (`<leader>xx`, `xX`, `cs`, `cl`, `xL`, `xQ`)
- `codesnap.nvim`: `cc`/`cs` em modo **visual**
- `venv-selector`: `<leader>vs`
- `coverage`: já havia sido recriado
- `vimwiki`: `ww`/`wt` vinham do próprio plugin (ok)

Correção: recriar cada um de propósito com `vim.keymap.set` — e validação **em runtime** (ver 3.5).

**Moral da história:** nos specs declarativos, cada campo é comportamento, não açúcar. No vim.pack, 100% vira código seu, no seu arquivo, na sua ordem.

### 3.3 Entradas que "sumiram" da lista do `add()` — e que o boot não acusava

Na reescrita eu perdi **três entradas** do `add()`: `everforest-nvim` (o colorscheme!), `vim-tmux-navigator` e `render-markdown.nvim` (dep do opencode). Sintoma clássico:

```bash
E5113: Lua chunk: init.lua:183: module 'everforest' not found
```

Por quê: **a lista do `vim.pack.add()` é a fonte da verdade do runtimepath**. Plugin fora da lista = presente no disco, mas invisível ao `require()`. E o lockfile não te salva: ele só registra o que você pediu no `add()`.

Post-mortem interessante: confirmei em headless que `require('plenary')` após `add()` funcionava — a diferença era só que *plenary estava na lista e everforest não*. O diagnóstico "ui2/rtp não carregado" me tomou tempo desnecessário antes dessa obviamente simples.

### 3.4 Glifos de Nerd Font "sumiram" na transcrição

Ao reescrever os ícones do dap-ui num novo arquivo, os glifos de uso privado (U+EA50-ish) viraram strings vazias no copy/paste. Corrição: extração *bytewise* do `git show HEAD` + script Python que substituiu RHS-certo por chave (`disconnect = "\uead0"` → mesmo byte), incluindo os 5 `sign_define`, comparação final com `cat -A` (byte a byte contra o HEAD).

**Moral da história:** em migração de arquivo grande, qualquer caractere não-printável é suspeito. Persistência do original + diff de bytes > memória visual.

### 3.5 Validação "verde" que não era: scripts de check enganosos

**Trap A**: `nvim -l arquivo.lua` **executa** o arquivo. Minha checagem "sintática" inicial reportava `FAIL: init.lua` — falso alarme (o arquivo requeria o everforest e falhava por execução, não por sintaxe). O correto:

```bash
nvim --headless -u NONE +"lua local f,e = loadfile('init.lua')
  print(f and 'SYNTAX OK' or e)" +qa
```

**Trap B**: comparar keymaps por `nvim_get_keymap("n")` com lhs tipo `"<Leader>so"`: o runtime **expande o leader**, e o lhs vem como `" so"` (espaço). Resultado: minha primeira verificação deu **14 MISSING**, todas falsas.

**Trap C**: o `nvim_get_commands({})` não lista builtins em C — `:restart` (0.12.6, documentado em `:help restart`), é builtin e existe; sem aparecer na lista.

### 3.6 `[d` / `]d` de diagnóstico invertidos — e "herdados"

Os mappings saltam para diagnóstico com `vim.diagnostic.jump({ count = ... })`. Regra da runtime (confirma em `diagnostic.lua:1689` e doc do `vim.diagnostic.JumpOpts`): **count > 0 = forward**. No config original:

```lua
vim.keymap.set("n", "[d", function() vim.diagnostic.jump({ count = 1, ... })    -- PRA FRENTE
vim.keymap.set("n", "]d", function() vim.diagnostic.jump({ count = -1, ... })   -- PRA TRÁS
```

Ou seja: `]` (frente por convenção Vim) ia **pra trás**. Corrigido para `]d` = próximo (count=1), `[d` = anterior (count=-1).

### 3.7 rust-analyzer pelo mason — dois problemas empilhados

**Causa 1 — nomes: `rust-analyzer` (traço) vs `rust_analyzer` (underscore).** O `ensure_installed` do mason-lspconfig v2 exige **nomes de server do lspconfig** — e o server de Rust se chama `rust_analyzer` (underscore), enquanto o **pacote** do mason se chama `rust-analyzer` (traço). Eu escrevia `rust-analyzer` — mais "lógico", mas o nome errado de namespace, e o plugin avisa (verificado no fonte do plugin instalado, `features/ensure_installed.lua:34`):

    [mason-lspconfig.nvim] Server "rust-analyzer" is not a valid entry in
    ensure_installed. Make sure to only provide lspconfig server names.

A cadeia de resolução: o mapa `lspconfig_to_package` é invertido dos specs do **registry do mason**, onde cada pacote declara `neovim.lspconfig = "rust_analyzer"`. Traço vs underscore **não é estética — são namespaces distintos** (pacote vs server).

**Causa 2 — runtime: `Schema download timed out`.** Na época em que o nome resolvia (era lazy), o mason seguia o install e o download de schemas estourava — loop uninstall/install no mason.log:

    [ERROR] Failed to download schemas Package(name=rust-analyzer) Schema download timed out.

A decisão final saiu de dois dados:

- O pacote do mason (`0.3.3097-standalone`) era **mais antigo** que o `rust-analyzer` do rustup (`1.99.1`)
- Com `mason.setup({ PATH = "append" })`, o `~/.cargo/bin` já ganha prioridade na resolução do LSP

**Estado final: o LSP de Rust vem do rustup** (`rustup component add rust-analyzer`), fora do mason. Se um dia quiser voltar ao mason, o nome no `ensure_installed` é `rust_analyzer` — nunca o do pacote.

**Moral da história — três namespaces, três nomes:**

| Namespace | Nome | Onde aparece |
|---|---|---|
| pacote do mason | `rust-analyzer` | `:Mason`, mason.log |
| server do lspconfig | `rust_analyzer` | `ensure_installed` |
| config do `vim.lsp` | qualquer id (aqui: `rust-analyzer`) | `vim.lsp.config()` / `vim.lsp.enable()` |

### 3.8 `unpack` "deprecated" — a armadilha do `table.unpack`

O lua_ls marcava `unpack(...)` como deprecated ("Defined in Lua 5.1/LuaJIT, current is Lua 5.4.") nas 5 ocorrências (elixirls, handler do vue_ls, rust-analyzer).

O primeiro reflexo seria trocar por `table.unpack`. **Isso seria um bug de produção:**

```lua
--- no LuaJIT que o nvim 0.12 usa:
type(table.unpack)  --> nil  (!!)
type(unpack)        --> function
```

As 5 linhas alvo só executam quando LSPs de Elixir/Vue/Rust efetuam attach — **boot headless dava `ERRORS: none` com o código já quebrado**. Só o grep no runtime do próprio nvim (zero usos de `table.unpack`) e o teste direto do LuaJIT (2.1.1774638290) flagraram.

**Fix correto**: reversão para `unpack` + causa-raiz no **`.luarc.json`** (o lua_ls assumia Lua 5.4 porque não havia `runtime.version`). Agora declara a runtime que de fato executa:

```json
{ "runtime.version": "LuaJIT" }
```

com isso o diagnóstico some — e não de forma "sufocada". **Lição**: a declaração de runtime do lint precisa corresponder ao intérprete que roda — nunca deixe o default (Lua 5.4) vazar em config de nvim.

### 3.9 Bônus de higiene

- Bloco `do ... end` de **1.280 linhas** (só para dar escopo a 71 `local`s) → removido e dedentado (LuaJIT: limite de 200 locais por escopo, longe de ser ameaça).
- Keymaps de reload/restart consolidados: `so` re-source na sessão, `sr` = `:restart` (restaura sessão), `sR` = `:restart!` (descarta) — nenhum é extensão de outro (zero atraso de `timeoutlen` no prefixo).
- Conclusão sobre lazy-load: o vimwiki (e o resto) terminaram **eager** — o padrão manual "`:packadd` sob demanda" existe e é válido, mas no fim não compensou a manutenção extra (o custo de eager com esses ~51 plugins é pequeno). O padrão fica documentado para uso eventual.

---

## Onde chegamos — `3d0d2a7` (e `47768a5`, 01/11)

**`init.lua`**: 1.557 linhas, uma só, 8 seções numeradas (opções gerais, hooks de build, plugins agrupados por categoria em ~55 specs, colorscheme, treesitter, setups inline em ordem de dependência, keymaps gerais, reload/restart). O (`47768a5`, 2026-11-01) trouxe o codesnap **v2.1.1** pinado (`version = "v2.1.1"`) com a configuração nova de `snapshot_config` — release fixada para escapar quebras da v2.

**Runtime**: 51 plugins sob `~/.local/share/nvim/site/pack/core/opt/`, instalados/upgradeados pelo builtin `:packupdate` (buffer de confirmação com diff, `:write` confirma), lockfile versionado.

**Docs**: README com pré-requisitos para Debian Trixie (build nvim 0.12 da fonte, rustup, node, python+uv, go, Nerd Font, wl-clipboard...), tabela atualizada de atalhos, sessão de troubleshooting.

**Comandos de ciclo de vida** (vim.pack substituindo o dashboard do lazy):

```bash
:packupdate        # update com confirmação interativa
:packdel ++all     # remove órfãos
:checkhealth vim.pack
:restart           # builtin, aplica mudanças de LISTA de plugins
<leader>so         # re-source na sessão (edits de setup/keys)
```

---

## Aprendizados

1. **Specs declarativos compram comportamento invisível.** Cada campo de plugin manager (`keys`, `build`, `event`) implementa coisa que não existe por si só. Migrar é reimplementar, não renomear.
2. **A lista do `add()` é o runtimepath.** Plugin existente no disco mas fora dela é invisível. Palpável: o erro só aparece no `require` — e em código que roda *muito depois* do boot (exemplo: o caso do `table.unpack`).
3. **"Boot verde" não é validade.** O pior bug da migração (o `table.unpack`) sobreviveu a boot headless limpo. Complemento: caminhos que parecem iguais divergem — `vim.pack.add()` repetido é no-op na mesma sessão; `:packupdate` trilha outro caminho (o do lockfile). A validação precisa exercitar o mesmo caminho que a produção.
4. **Cheque o comportamento real, não o formato esperado.** `nvim -l` executa o arquivo (não apenas o lê); o lhs que `nvim_get_keymap` devolve já vem com o leader expandido (espaço); builtin `:restart` não aparece em `nvim_get_commands`. Suposição a menos = falso positivo/negativo a menos.
5. **Caractere não-printável é bug velado.** Glifos Nerd Font duplicados por transcrição estavam renderizando vazios — só byte-diff com o HEAD flagrou.
6. **O lint precisa ver o mundo que roda.** Lua 5.4 vs LuaJIT decide entre "deprecated" e quebra em produção. Declara `runtime.version: "LuaJIT"` e testa a runtime *de verdade* antes de "modernizar" APIs.
7. **vim.pack sem lazy-loading é decisão, e não carência.** O custo real de eager load com esses ~51 plugins é modesto; o que se ganha: todo o estado (rtp, keymaps, hooks) visível e replicável em um único arquivo.
8. **Commits pequenos preservam a trilha.** A sequência do dia (`9d53400` → `61af158` → `dba11d2` → `5bdfaa2` → `3d0d2a7` → `47768a5`) é o changelog de um disaster-recovery — e cada resgate de estado saiu de `git show <hash>:<path>` (fonte dos glifos originais, fonte do "antes" do artigo). Commits pequenos não são cerimônia: são a única forma de conhecer o estado exato no meio do incidente.

# Conclusão

Espero que este guia tenha lhe ajudado a tomar uma decisão similar, tenha lhe ajudado a entender que dominar o fluxo de trabalho é , acima de tudo, um trabalho árduo e vital, o que foi feito aqui foi feito por min e para min, sob medida, nem tudo pode funcionar da forma que você espera ou quer, essa config não é pra você ~roubar~ copiar, mas sinta-se livre para pilhar se for de seu interesse.

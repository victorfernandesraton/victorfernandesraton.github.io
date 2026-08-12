# Sessão de Troubleshoot — OpenCode

**Sessão:** ses_03687fa7dffeg1Gun9oO7z2Ay6
**Modelo:** DeepSeek V4 Pro (Plano Go)
**Data:** 03/08/2026
**Duração:** ~35 minutos

---

## Diagnóstico Inicial

- Lenovo/Dell notebook com Intel Iris Plus Graphics G1 (Ice Lake) + i915 driver
- LG ULTRAWIDE 2560x1080 conectado via HDMI 2.1
- KDE Wayland no Debian 13 Trixie, kernel 6.12.100
- Monitor detectado mas resolução máxima exposta: 1920x1080
- xrandr mostrava 1829x1029 com scaling 1.05 distorcido (XWayland emulation)

## Investigação

1. `edid-decode` confirmou que o EDID tem DTD 1 com 2560x1080@60Hz (181.25 MHz)
2. Modo existe no EDID mas `/sys/class/drm/card0-HDMI-A-1/modes` não lista 2560x1080
3. `CLOCK_HIGH` — driver i915 rejeita o modo por exceder o limite de 165 MHz do LSPCON (DP++ Type 1)

## Causa Raiz

O HDMI do Ice Lake é implementado via chip conversor DisplayPort→HDMI (LSPCON) com limite físico de **165 MHz TMDS clock**. Para 2560x1080@60Hz são necessários 181.25 MHz, excedendo o limite.

Referência: [nic0der-im/fix-ultrawide-intel-notebook-hdmi](https://github.com/nic0der-im/fix-ultrawide-intel-notebook-hdmi) — mesmo hardware, mesma solução.

## Solução Aplicada

1. **Patch do EDID**: substituir DTD 1 por 2560x1080@56Hz com reduced blanking (162.20 MHz, dentro dos 165 MHz)
2. **Initramfs hook**: incluir EDID patcheado no early boot
3. **Parâmetro de kernel**: `drm.edid_firmware=HDMI-A-1:edid/lg-ultrawide-2560x1080.bin`

## Resultado

- `2560x1080@56Hz` disponível como modo preferido no KDE
- Geometry 2560x1080, scale 1.0, pixel-perfect
- Persistente via initramfs, sobrevive a reboots

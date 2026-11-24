#!/usr/bin/env python3
"""Gera o QR code de um endereço do caderno digital.

Uso:
  python3 qa/gerar-qr.py <endereço> <nome-do-arquivo-sem-extensão> [pasta-de-saída]

Exemplo (use o endereço DEFINITIVO publicado pelo time):
  python3 qa/gerar-qr.py https://SEU-SITE/conecta50/avaliacao/index.html QR-avaliacao docs/qr

Gera <nome>.png (fundo branco, margem de 4 módulos, 1200 px) e <nome>.svg.
Depende de: pip install segno
"""
import os, sys
import segno

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(1)
    url, nome = sys.argv[1], sys.argv[2]
    pasta = sys.argv[3] if len(sys.argv) > 3 else '.'
    if not url.startswith('https://'):
        print('ERRO: use o endereço completo, começando com https://'); sys.exit(1)
    os.makedirs(pasta, exist_ok=True)
    # correção de erro Q: aguenta sujeira e impressão ruim sem deixar o código denso demais
    qr = segno.make(url, error='q', micro=False)
    png = os.path.join(pasta, nome + '.png')
    svg = os.path.join(pasta, nome + '.svg')
    qr.save(png, scale=max(1, 1200 // (qr.symbol_size(border=4)[0])), border=4, dark='#000000', light='#ffffff')
    qr.save(svg, scale=10, border=4, dark='#000000', light='#ffffff')
    print('Gerado:', png, 'e', svg)
    print('Endereço gravado:', url)

main()

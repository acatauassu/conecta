# Documentação do WIN Conecta 50+

Versão 1.0.0 · 05/11/2026. Código a que se refere: commit `ce95c69`. A etiqueta `v1.0.0` inclui também estes documentos.

| Documento | Para quem | O que traz |
| --- | --- | --- |
| `MANUAL-DA-METODOLOGIA.md` | Equipe de condução e quem criar novas edições | Parte 1: conduzir a noite com o caderno digital. Parte 2: a metodologia, para replicar |
| `DOCUMENTACAO-TECNICA.md` | Time de desenvolvimento | Arquitetura, código, dados guardados, acessibilidade, publicação e como estender |
| `CHECKLIST-DE-ENTREGA.md` | Time de desenvolvimento, Denis e Ely | O que confirmar, configurar e testar antes de abrir o site |
| `HISTORICO-DE-VERSOES.md` | Todos | O que entrou em cada versão, as mudanças de rumo e como publicar uma nova versão |

## Onde estão as versões em Word e PDF

Na pasta `entregaveis/`, com o nome `WIN-Conecta-50-<Documento>-v<versão>-<data>.docx` e `.pdf`. São gerados a partir dos arquivos Markdown, que são a **fonte de verdade**: edite o Markdown, não o Word nem o PDF.

## Como regenerar o Word e o PDF

Requisitos: `pandoc`, Python 3 com `python-docx`, Node.js com `playwright` e o Chromium instalado.

```bash
python3 docs/build/gerar.py
```

O script também confere se todas as chaves guardadas no aparelho, usadas no código do site, estão documentadas. Se faltar alguma, ele para e diz qual.

## Quando atualizar

* Mudou o código, um texto ou o comportamento de uma página: atualize o documento afetado.
* Nova versão: atualize `HISTORICO-DE-VERSOES.md` e o número `VERSAO` e a `DATA` em `build/gerar.py`, regenere e crie a etiqueta.
* Item do checklist concluído: marque no próprio arquivo e registre a versão publicada na última tabela.

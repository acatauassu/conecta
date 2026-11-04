# WIN Conecta 50+ · site do curso online

Páginas do caderno digital do **WIN Conecta, Edição Especial 50+**.

- **Evento:** 25/11/2026 (quarta-feira), das 17h às 22h, Nex Hall, Belém/PA.
- **Inscrição:** winnext.com.br/win-conecta
- **Formato:** HTML estático, sem build e sem dependências próprias. Cada módulo é uma pasta com um `index.html`.
- **Design:** WIN Conecta Design Book (cores, fonte Exo 2, componentes). Os valores estão em `assets/css/conecta.css`.

## O que já está pronto

| Pasta | Conteúdo | Situação |
| --- | --- | --- |
| `assets/` | CSS, JS e logos compartilhados | pronto |
| `connect-pack/` | Os 8 modelos de pedido, com campos, botão de copiar e cartão de contexto | pronto, falta o teste da equipe (ver abaixo) |
| `m1/` | Chegada e abertura: check de acesso, cartão de entrada, mapa da noite, combinados e apresentação na mesa | pronto |
| `m2/` a `m9/` | Demais módulos do caderno | em desenvolvimento, um por vez |

## Como publicar

1. Copie a pasta `site/` inteira para o servidor, mantendo a estrutura. Todos os links são relativos, então funciona em qualquer caminho (por exemplo, `winnext.com.br/win-conecta/curso/`).
2. O endereço do Connect Pack é `<caminho>/connect-pack/`. Use esse endereço no QR code do caderno impresso e do slide 6 do M9.
3. Também dá para embutir uma página em outra por `iframe`.

**Requisitos do servidor**

- **HTTPS.** O botão "Copiar" só funciona em endereço seguro. Em HTTP o texto fica selecionado para copiar à mão.
- **Fonte.** As páginas carregam Exo 2 de `fonts.googleapis.com` e `fonts.gstatic.com`. Se o site tiver uma política de segurança (CSP) restritiva, libere esses dois endereços ou hospede a fonte no próprio servidor. Sem a fonte, a página usa a fonte do sistema e continua legível.
- **Nenhum cookie, rastreador ou chamada a servidor.** Tudo o que a pessoa escreve fica no `localStorage` do navegador dela, com o prefixo `winconecta50:v1:`. A pessoa pode apagar tudo pelo link no rodapé de cada página.

## O que o time precisa fazer antes de divulgar

- **Testar os 8 modelos no ChatGPT** (plano gratuito e pago) e preencher `testadoEm` de cada um em `connect-pack/connect-pack-data.js`, no formato `"25/11/2026"`. Enquanto estiver `null`, a data não aparece na página.
- **Gerar o QR code** do endereço `connect-pack/` e substituir nos materiais.
- **Preencher o Wi-Fi** em `assets/js/config.js` (`wifiRede` e `wifiSenha`). Enquanto estiver vazio, o M1 mostra "A equipe informa na sala". Confira também a data, o horário e o local nesse arquivo.
- **Conferir os links das lojas** no passo 3 do M1 (App Store e Google Play do ChatGPT), porque os endereços das lojas podem mudar.
- **Abrir cada página** no celular e no notebook, pelo menos uma vez, antes de publicar.

## Como editar o texto dos modelos

Os textos dos 8 modelos estão em `connect-pack/connect-pack-data.js`, com instruções no topo do arquivo. Não é preciso mexer no HTML nem no JavaScript da página.

## Estrutura

```
site/
  assets/
    css/conecta.css      tokens, componentes e layout (todas as páginas usam)
    js/conecta.js        armazenamento local, copiar, avisos (window.WinConecta)
    js/config.js         data, horário, local e Wi-Fi do evento (editar aqui)
    img/                 logos WIN Conecta, PNG transparente
  m1/
    index.html           Módulo 1
    m1.js
  connect-pack/
    index.html
    connect-pack-data.js os 8 modelos
    connect-pack.js      monta a página
```

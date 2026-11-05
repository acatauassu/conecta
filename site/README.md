# WIN Conecta 50+ · site do curso online

Páginas do caderno digital do **WIN Conecta, Edição Especial 50+**.

- **Evento:** 25/11/2026 (quarta-feira), das 17h às 22h, Nex Hall, Belém/PA.
- **Inscrição:** winnext.com.br/win-conecta
- **Formato:** HTML estático, sem build e sem dependências próprias. Cada módulo é uma pasta com um `index.html`.
- **Design:** WIN Conecta Design Book (cores, fonte Exo 2, componentes). Os valores estão em `assets/css/conecta.css`.

## O que já está pronto

| Pasta | Conteúdo | Situação |
| --- | --- | --- |
| `index.html` | Página inicial: os 9 módulos na ordem da noite, com o progresso de cada um e o botão "Continuar de onde parei" | pronto |
| `meu-caderno/` | Tudo o que a pessoa escreveu, reunido: imprimir, salvar em PDF ou copiar como texto | pronto |
| `assets/` | CSS, JS e logos compartilhados | pronto |
| `connect-pack/` | Os 8 modelos de pedido, com campos, botão de copiar e cartão de contexto | pronto, falta o teste da equipe (ver abaixo) |
| `m1/` | Chegada e abertura: check de acesso, cartão de entrada, mapa da noite, combinados e apresentação na mesa | pronto |
| `m2/` | Como a IA funciona: buscador ou conversa, o mesmo pedido de dois jeitos, "pense nela como um estagiário", ela pode errar, cartão de descobertas | pronto |
| `m3/` | Os 4 C e o cartão de contexto: pedido montado a partir dos 4 C, cartão com 5 campos, teste do cartão | pronto |
| `m4/` | Tarefa 1, escrever com a minha voz: escolha do texto, pedido fraco e forte, pedido montado com o cartão, ajustes e "Meu prompt validado" | pronto |
| `m5/` | Conferir: Régua dos 5 interativa, golpes que usam IA, 3 regras, mitos e verdades, "o que a IA ainda não faz bem" | pronto |
| `m6/` | Tarefa 2, preparar a reunião: regras de pesquisa, pedido da pesquisa (pessoa ou só a empresa), Régua dos 5 com fontes, abertura de 2 minutos com cronômetro de ensaio | pronto |
| `m7/` | Panorama das outras IAs: mapa das 5 IAs, a mesma pergunta em duas IAs, jogo "Qual IA para quê?", cuidados | pronto |
| `m8/` | Tarefa 3, divulgar o meu trabalho: as 3 partes do post, cuidados com a imagem, 3 pedidos encadeados (ideias, post, calendário), régua antes de publicar, calendário de 7 dias e prompt validado | pronto |
| `m9/` | Connect Pack e fechamento: os 8 modelos, como adaptar, gratuito ou pago, escolha do primeiro, resumo da noite lido do aparelho, próxima semana, avaliação | pronto |

## Como publicar

1. Copie a pasta `site/` inteira para o servidor, mantendo a estrutura. Todos os links são relativos, então funciona em qualquer caminho (por exemplo, `winnext.com.br/win-conecta/curso/`).
2. A página inicial é `<caminho>/index.html`. O endereço do Connect Pack é `<caminho>/connect-pack/index.html`. Use esse endereço no QR code do caderno impresso e do slide 6 do M9.
3. Também dá para embutir uma página em outra por `iframe`.

**Requisitos do servidor**

- **HTTPS.** O botão "Copiar" só funciona em endereço seguro. Em HTTP o texto fica selecionado para copiar à mão.
- **Fonte.** As páginas carregam Exo 2 de `fonts.googleapis.com` e `fonts.gstatic.com`. Se o site tiver uma política de segurança (CSP) restritiva, libere esses dois endereços ou hospede a fonte no próprio servidor. Sem a fonte, a página usa a fonte do sistema e continua legível.
- **Nenhum cookie, rastreador ou chamada a servidor.** Tudo o que a pessoa escreve fica no `localStorage` do navegador dela, com o prefixo `winconecta50:v1:`. A pessoa pode apagar tudo pelo link no rodapé de cada página.

## O que o time precisa fazer antes de divulgar

- **Testar os 8 modelos no ChatGPT** (plano gratuito e pago) e preencher `testadoEm` de cada um em `connect-pack/connect-pack-data.js`, no formato `"25/11/2026"`. Enquanto estiver `null`, a data não aparece na página.
- **Gerar o QR code** do endereço `connect-pack/` e substituir nos materiais.
- **Preencher o Wi-Fi** em `assets/js/config.js` (`wifiRede` e `wifiSenha`). Enquanto estiver vazio, o M1 mostra "A equipe informa na sala". Confira também a data, o horário e o local nesse arquivo.
- **Preencher `avaliacaoUrl` e `proximosCursosUrl`** em `assets/js/config.js`. O M9 mostra o botão da avaliação e o dos próximos cursos só quando o endereço estiver preenchido.
- **Conferir os links das lojas** no passo 3 do M1 (App Store e Google Play do ChatGPT), porque os endereços das lojas podem mudar.
- **Confirmar o nome "Gemini Notebook"** (antes NotebookLM) no M7, e os endereços das outras IAs (chatgpt.com, perplexity.ai, gemini.google.com). Nomes e recursos mudam com frequência.
- **Imprimir o Meu caderno** em um navegador de verdade e conferir o PDF. A impressão é em preto e branco, sem menus.
- **Abrir cada página** no celular e no notebook, pelo menos uma vez, antes de publicar.

## Como editar o texto dos modelos

Os textos dos 8 modelos estão em `connect-pack/connect-pack-data.js`, com instruções no topo do arquivo. Não é preciso mexer no HTML nem no JavaScript da página.

## Estrutura

```
site/
  assets/
    css/conecta.css      tokens, componentes e layout (todas as páginas usam)
    js/conecta.js        armazenamento local, copiar, avisos (window.WinConecta)
    js/progresso.js      calcula o progresso de cada módulo, a partir do que a pessoa escreveu
    js/pedido.js         componente de pedido pronto para copiar, com campos (window.WinConecta.pedido)
    js/config.js         data, horário, local e Wi-Fi do evento (editar aqui)
    img/                 logos WIN Conecta, PNG transparente
  index.html, home.js    Página inicial
  meu-caderno/           Meu caderno (index.html e caderno.js)
  m1/ ... m9/            Módulos (index.html e um .js cada)
  connect-pack/
    index.html
    connect-pack-data.js os 8 modelos
    connect-pack.js      monta a página
```

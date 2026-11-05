---
title: "Checklist de entrega"
subtitle: "WIN Conecta 50+ · Caderno digital"
author: "WIN Business School"
date: "05/11/2026"
lang: pt-BR
---

# Controle deste documento

| Campo | Valor |
|----------|--------------------------------------------|
| Versão do documento | 1.0.0 |
| Data | 05/11/2026 |
| Código a que se refere | commit `ce95c69`; a etiqueta `v1.0.0` inclui também este documento |
| Para quem | Time de desenvolvimento da WIN, com apoio de Denis e Ely |

# Como usar este checklist

**Evento:** 25/11/2026 (quarta-feira), das 17h às 22h, Nex Hall, Belém/PA.
**Código:** pasta `site/`, branch `claude/keen-lovelace-47ook9` do repositório `acatauassu/conecta`.
**Para quem é:** o time de desenvolvimento da WIN, que publica o site, com apoio do Denis e da Ely para o que é de conteúdo.

Marque cada item ao concluir. Os itens com **[BLOQUEIA]** precisam estar prontos antes de abrir o link para os participantes.

---

## 1. Decisões e confirmações de conteúdo (Denis e Ely)

| # | Item | Onde | Situação |
| --- | --- | --- | --- |
| C1 | **[BLOQUEIA]** Confirmar o nome **"Gemini Notebook"** (antes NotebookLM). O material diz que mudou em julho de 2026, mas isso não foi verificado. Se o nome for outro, trocar em `site/m7/index.html` e `site/m7/m7.js` (busca e substituição). | M7, cartões e jogo | ☐ |
| C2 | **[BLOQUEIA]** Testar os **8 modelos do Connect Pack** no ChatGPT, nos planos gratuito e pago, e registrar a data em `testadoEm` de cada modelo (formato `"25/11/2026"`). Ajustar o texto dos modelos que falharem. | `site/connect-pack/connect-pack-data.js` | ☐ |
| C3 | Fazer **uma leitura completa** de todos os textos (ortografia, tom, termos do briefing). Não houve revisão ortográfica automática. | todas as páginas | ☐ |
| C4 | Aprovar os **textos de autoria nova**, que não vieram dos guias, slides ou caderno (tabela da seção 8). | ver seção 8 | ☐ |
| C5 | Confirmar que o **horário 17h às 22h** e a **data 25/11/2026** estão corretos (o folder diz 17h às 22h; houve menção a 16h às 21h no início). | `site/assets/js/config.js` | ☐ |
| C6 | Decidir a **data do contato de acompanhamento**. A data de 17/11 vinha do evento de 10/11 e ficou sem sentido. | plano de pós-evento | ☐ |

## 2. Configuração do evento (time de desenvolvimento)

Tudo em `site/assets/js/config.js`. Os campos vazios têm comportamento definido, e não aparece texto quebrado.

| # | Campo | O que preencher | Se ficar vazio | Situação |
| --- | --- | --- | --- | --- |
| K1 | `wifiRede`, `wifiSenha` | Rede e senha do Wi-Fi do Nex Hall (aparece no M1) | O M1 diz "A equipe informa na sala" | ☐ |
| K2 | `avaliacaoUrl` | Endereço do formulário de avaliação (o mesmo do QR do slide 9 do M9) | O M9 diz que a equipe passa o link na sala | ☐ |
| K3 | `proximosCursosUrl` | Página dos próximos cursos da WIN Business School | O botão não aparece | ☐ |
| K4 | `data`, `horario`, `local` | Conferir | Usa 25/11/2026 (quarta), 17h às 22h, Nex Hall, Belém/PA | ☐ |

## 3. Publicação e infraestrutura

| # | Item | Observação | Situação |
| --- | --- | --- | --- |
| P1 | **[BLOQUEIA]** Publicar a pasta `site/` inteira, mantendo a estrutura. Os links são relativos e funcionam em qualquer caminho. | Ex.: `winnext.com.br/win-conecta/curso/` | ☐ |
| P2 | **[BLOQUEIA]** Servir em **HTTPS**. Sem HTTPS o botão "Copiar" não funciona. | verificar o cadeado no navegador | ☐ |
| P3 | Liberar `fonts.googleapis.com` e `fonts.gstatic.com` na política de segurança (CSP), ou hospedar a fonte Exo 2 no servidor. Sem a fonte o site usa a fonte do sistema e continua legível. | | ☐ |
| P4 | Se o site for **embutido por iframe** em outra página, liberar o embutimento (cabeçalhos `X-Frame-Options` e `Content-Security-Policy: frame-ancestors`). | só se for usar iframe | ☐ |
| P5 | Conferir os tipos de arquivo (`.js`, `.css`, `.png`) e o cache: JS e CSS com cache curto durante o evento, para correções chegarem rápido. | | ☐ |
| P6 | Decidir se as páginas ficam **indexáveis** por buscadores antes e depois do evento. Hoje não há `noindex`. | `<meta name="robots">` | ☐ |
| P7 | **Não adicionar** cookies, análise de uso (analytics) ou formulários sem antes **atualizar o texto de privacidade**. Hoje o site diz, em todas as páginas, que nada é enviado a ninguém. | ver `docs/` | ☐ |
| P8 | Abrir `index.html`, `m1/` a `m9/`, `connect-pack/` e `meu-caderno/` no endereço final e conferir que nenhum link quebra. | `qa/percurso-completo.js` | ☐ |

## 4. Marca

| # | Item | Situação |
| --- | --- | --- |
| M1 | Se existir o **logo em SVG**, trocar os PNGs em `site/assets/img/`. Os PNGs têm 2000 px de largura e servem para tela. | ☐ |
| M2 | Conferir o uso do logo com o manual de marca da WIN, se existir. A regra de aplicação do design system é uma recomendação, não vem do manual. | ☐ |

## 5. QR codes e materiais

| # | Item | Situação |
| --- | --- | --- |
| Q1 | **[BLOQUEIA]** Gerar o QR code do **Connect Pack** (`<endereço>/connect-pack/index.html`) e colocar no **slide 6 do M9** e no caderno impresso. | ☐ |
| Q2 | Gerar o QR code da **avaliação** e colocar no **slide 9 do M9**. | ☐ |
| Q3 | Testar os QR codes em um iPhone e em um Android, com a câmera do aparelho. | ☐ |
| Q4 | Decidir o que fazer com o **caderno impresso**: ele substitui ou complementa o digital? Recomendação: manter **cadernos impressos de reserva** como plano B, caso a internet falhe. | ☐ |
| Q5 | Os slides (PPTX) continuam sendo projetados no telão. Conferir que nenhum slide cita o horário antigo (10/11 ou 16h às 21h). | ☐ |

## 6. Testes antes do evento

| # | Item | Como | Situação |
| --- | --- | --- | --- |
| T1 | **[BLOQUEIA]** Percurso completo do M1 ao M9 em **celular real**, de ponta a ponta. | manual, e `qa/percurso-completo.js` | ☐ |
| T2 | Testar no **iPhone (Safari)** e no **Android (Chrome)**, e em pelo menos **um aparelho antigo**. O site usa recursos modernos de CSS (como `:has()`). Em navegadores antigos, só o destaque visual do item marcado se perde. | | ☐ |
| T3 | Testar com **leitor de tela**: VoiceOver (iPhone) e TalkBack (Android). Só a estrutura foi verificada automaticamente. | | ☐ |
| T4 | Testar com a **fonte do aparelho aumentada** e com **zoom de 200%**. | | ☐ |
| T5 | Repetir a verificação automática de acessibilidade. Esperado: nenhuma violação. | `qa/acessibilidade-axe.js` | ☐ |
| T6 | Testar o **Meu caderno**: imprimir, salvar em PDF e copiar como texto, em Chrome e Safari. | | ☐ |
| T7 | Testar com **30 aparelhos** no Wi-Fi do Nex Hall, no local ou em condição parecida. As páginas são leves: 50 a 80 KB cada (HTML, JS e CSS), mais o logo (40 KB no cabeçalho dos módulos e 345 KB na abertura do Início, do M1 e do Connect Pack) e a fonte do Google. | | ☐ |
| T8 | **Aba anônima:** em alguns navegadores o armazenamento fica indisponível e o que a pessoa escreveu se perde ao recarregar. Orientar a **não usar aba anônima** (sugestão: avisar na recepção). | | ☐ |

## 7. Dia do evento

| # | Item | Quem | Situação |
| --- | --- | --- | --- |
| D1 | Preencher e publicar o Wi-Fi (`config.js`) com antecedência. | Dev | ☐ |
| D2 | Abrir o endereço do site em um aparelho da equipe, na sala, antes de abrir as portas. | Apoio | ☐ |
| D3 | Deixar o QR code do Connect Pack e o endereço escritos à mão, em papel, na mesa de recepção. | Apoio | ☐ |
| D4 | Ter roteador ou compartilhamento de internet de reserva (já previsto no guia do M1). | Equipe | ☐ |
| D5 | Ter uma pessoa do time técnico de plantão, com acesso para corrigir `config.js` ou um texto. | Dev | ☐ |
| D6 | Avisar os apoios de que **o caderno é salvo só no aparelho de cada pessoa**: se a pessoa trocar de aparelho ou de navegador, começa vazio. | Ely | ☐ |

## 8. Textos de autoria nova, para aprovação (C4)

Estes textos não vieram dos guias, dos slides nem do caderno. Foram escritos para a versão digital.

| Onde | Texto | Situação |
| --- | --- | --- |
| M2 | Mensagens que aparecem depois de marcar se a IA acertou tudo, quase tudo ou errou | ☐ |
| M4 | Frase do botão "Adaptar para outro público" | ☐ |
| M5 | Pedido "Para cada fato do texto, mostre a fonte com o endereço…" e o aviso de que **a página não tem campo para a palavra combinada com a família** | ☐ |
| M6 | Pedido do modo **"só a empresa"** e o texto da seção "Veja como é o pedido" | ☐ |
| M7 | Texto de comparação das IAs e as notas sobre login | ☐ |
| M8 | O **exemplo de post da Marta** (legenda, chamada e ideia da arte) | ☐ |
| M9 | O **resumo da noite** ("Feito" e "Fica para depois") e a mensagem de agradecimento | ☐ |
| Connect Pack | Marcadores mais claros no modelo 6 (`[valor dos custos fixos]` e `[valor que quer ganhar]`, no lugar de `[valor]` repetido) e `[preencher]` do modelo 4 mantido como texto literal | ☐ |
| Início e Meu caderno | Todos os textos das duas páginas | ☐ |

## 9. Pós-evento

| # | Item | Situação |
| --- | --- | --- |
| X1 | Decidir por quanto tempo o site fica no ar (os participantes levam o Connect Pack para casa). | ☐ |
| X2 | Enviar aos participantes o endereço do **Connect Pack** e do **Meu caderno** na mensagem de agradecimento. | ☐ |
| X3 | Colher as dúvidas que mais se repetiram e registrar melhorias para a próxima edição. | ☐ |

---

## Critério para liberar

O site está pronto para os participantes quando **todos os itens [BLOQUEIA] estão marcados**: C1, C2, P1, P2, Q1, T1. Os demais itens reduzem risco, mas não impedem a abertura.

## Versão e rastreio

Ao concluir, o time deve registrar a **versão publicada** (o código do commit ou a etiqueta) e a data, no próprio checklist ou no histórico de versões em `docs/`.

| Versão publicada | Data | Quem publicou |
| --- | --- | --- |
| | | |

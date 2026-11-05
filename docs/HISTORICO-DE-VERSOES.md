---
title: "Histórico de versões"
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
| Código a que se refere | commit `ce95c69`; a etiqueta `v1.0.0` inclui também estes documentos |
| Repositório | `acatauassu/conecta` |
| Branch | `claude/keen-lovelace-47ook9` |

# Como as versões são numeradas

O projeto usa três números: **MAIOR.MENOR.CORREÇÃO**.

| Número | Quando muda | Exemplo |
|----------|------------------------------------|----------------------------|
| MAIOR | Nova edição do curso ou mudança que quebra o que as pessoas já salvaram | Trocar o prefixo `winconecta50:v1:` do armazenamento |
| MENOR | Módulo ou recurso novo | Um novo módulo, uma nova página |
| CORREÇÃO | Ajuste de texto, estilo ou erro, sem novidade | Corrigir um tempo ou uma palavra |

**Importante:** as pessoas guardam o que escrevem no próprio aparelho, sob o prefixo `winconecta50:v1:`. Trocar esse prefixo faz todo mundo perder o que já escreveu. Só faça isso em uma versão MAIOR, e avise.

# Versão atual

**v1.0.0 · 05/11/2026 · entrega para o time de desenvolvimento.** Contém a base, o Connect Pack, os 9 módulos, a página inicial, o Meu caderno, a revisão de acessibilidade, o checklist de entrega, o manual, a documentação técnica e este histórico. Só a etiqueta `v1.0.0` existe no GitHub. As versões 0.x abaixo foram numeradas depois, a partir do histórico do código, para facilitar a leitura.

# Histórico

| Versão | Data | Commit | O que entrou |
|------|----------|---------|--------------------------------------------------|
| 0.0 | 04/11/2026 | `38166d0` | **Material de origem.** 25 arquivos enviados por Denis: proposta, esqueleto, briefing, caderno, 9 guias do facilitador e 9 decks. Ainda não era o site. |
| 0.1.0 | 04/11/2026 | `78267e8` | **Base e Connect Pack.** Estilos e funções compartilhadas, logos, os 8 modelos de pedido com campos, exemplo preenchido, botão de copiar e cartão de contexto. |
| 0.2.0 | 04/11/2026 | `cc4e9a5` | **Módulo 1.** Check de acesso, cartão de entrada, mapa da noite, combinados e apresentação na mesa com cronômetro. Configuração do evento. |
| 0.3.0 | 04/11/2026 | `f4baf48` | **Módulo 2.** Buscador ou conversa, o mesmo pedido de dois jeitos, estagiário e erro com segurança. Componente de pedido reutilizável. |
| 0.4.0 | 04/11/2026 | `9f5a96c` | **Módulo 3.** Os 4 C, o pedido montado a partir deles e o cartão de contexto com 5 campos, compartilhado com os outros módulos. |
| 0.5.0 | 05/11/2026 | `acd06a8` | **Módulo 4.** Tarefa 1, escrever com a minha voz, com o prompt validado. |
| 0.6.0 | 05/11/2026 | `ef597af` | **Módulo 5.** Régua dos 5 interativa, golpes, três regras e mitos. A palavra combinada com a família não é guardada na página. |
| 0.7.0 | 05/11/2026 | `8c5f049` | **Módulo 6.** Tarefa 2, preparar a reunião, só com informação pública e fonte. Cronômetro de ensaio. |
| 0.8.0 | 05/11/2026 | `18d497c` | **Módulo 7.** Panorama das outras IAs e o jogo "Qual IA para quê?". |
| 0.9.0 | 05/11/2026 | `709bf1f` | **Módulo 8.** Tarefa 3, divulgar o meu trabalho, com três pedidos encadeados e o calendário de 7 dias. |
| 0.10.0 | 05/11/2026 | `31e5bfd` | **Módulo 9.** Connect Pack e fechamento, com o resumo da noite lido do aparelho. |
| 0.11.0 | 05/11/2026 | `d1c0db6` | **Página inicial e Meu caderno.** Progresso por módulo, "continuar de onde parei", impressão em PDF e cópia como texto. Links entre páginas passam a apontar para `index.html`. |
| 0.12.0 | 05/11/2026 | `e5e29ce` | **Revisão de acessibilidade, consistência e desempenho.** Axe-core sem violações, alvos de toque de 44 px, texto mínimo de 16 px, demonstração do M6 e tempo do M7 corrigidos, logo pequeno (39 KB). Scripts de verificação em `qa/`. |
| 0.13.0 | 05/11/2026 | `ce95c69` | **Checklist de entrega** para o time de desenvolvimento. |
| **1.0.0** | 05/11/2026 | etiqueta `v1.0.0` | **Entrega.** Manual da metodologia, documentação técnica e este histórico. |

# Mudanças de rumo durante o projeto

Estas decisões mudaram o que estava no material de origem. Estão aqui para ninguém precisar redescobri-las.

| Data | Decisão | Motivo |
|----------|----------------------------------------|------------------------------|
| 04/11/2026 | O caderno online **complementa** o evento presencial. Mesas, facilitadores e cartões verde e amarelo continuam. | Decisão de Denis. |
| 04/11/2026 | O participante usa o **próprio ChatGPT**. Nenhuma IA roda dentro do site. | Sem custo de API, sem enviar dados a ninguém e alinhado ao plano gratuito. |
| 04/11/2026 | Entrega em **HTML estático**, sem servidor, login nem banco de dados. | O time de devs publica no site da WIN. Menos risco e menos manutenção. |
| 04/11/2026 | A data do evento passou de 10/11 para **25/11/2026**, das 17h às 22h. | Mudança de data. O horário de 16h às 21h, citado antes, foi corrigido por Denis. |
| 04/11/2026 | Visual a partir do **folder digital** (cor, fonte Exo 2, logo). Criado o WIN Conecta Design Book. | Nenhum design system existente combinava com o Conecta. |
| 05/11/2026 | A **palavra combinada com a família** não tem campo no site. | Uma palavra secreta guardada em um aparelho pode ser lida por outra pessoa. |
| 05/11/2026 | O **progresso** ("Feito") significa que a pessoa preencheu os pontos principais. Não é nota. | Evitar comparação e cobrança. |
| 05/11/2026 | Nenhum texto fica abaixo de **16 px**. | O folder usa menos, mas o público pede mais conforto. |

# Pendências conhecidas na v1.0.0

Estão detalhadas no `CHECKLIST-DE-ENTREGA.md`.

| Pendência | Onde |
|----------------------------------------|----------------------------|
| Confirmar o nome "Gemini Notebook" | M7 |
| Testar os 8 modelos no ChatGPT e preencher a data | `connect-pack-data.js` |
| Conferir os links das lojas de aplicativos | M1 |
| Preencher Wi-Fi, avaliação e próximos cursos | `config.js` |
| Revisão ortográfica completa | todas as páginas |
| Teste com leitor de tela e em aparelhos reais | todas as páginas |

# Outros artefatos versionados

| Artefato | Versão | Observação |
|--------------------------|-------------|-----------------------------------|
| WIN Conecta Design Book (design system) | v5 | Mantido na plataforma Claude, privado. Última mudança: selo de 15 px para 16 px. |
| Prévia do caderno digital | v11 | Cópia para revisão. A fonte de verdade é o repositório. |
| Esqueleto, proposta, briefing e caderno (DOCX/PDF) | material de origem | Na raiz do repositório, commit `38166d0`. |

# Como publicar uma nova versão

1. Faça a mudança e rode os scripts de `qa/` (axe, manual e percurso completo).
2. Atualize este histórico, o manual e a documentação técnica, se a mudança afetar o que eles descrevem.
3. Faça o commit e abra uma solicitação de mesclagem (pull request) para a `main`.
4. Depois de aprovada e publicada, crie a etiqueta da nova versão (por exemplo, `v1.1.0`).
5. Registre a versão publicada, a data e quem publicou na última tabela do `CHECKLIST-DE-ENTREGA.md`.

Para voltar a uma versão antiga, use a etiqueta. Por exemplo, para olhar o código exatamente como estava na v1.0.0:

```bash
git checkout v1.0.0
```

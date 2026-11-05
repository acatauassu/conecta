# Verificações de qualidade do site

Três scripts que o time pode repetir depois de qualquer mudança nas páginas.

| Script | O que verifica |
| --- | --- |
| `acessibilidade-axe.js` | Roda o axe-core (WCAG 2.1 A e AA) em todas as páginas, no computador e no celular, nos modos claro e escuro. Esperado: "Nenhuma violação encontrada". |
| `acessibilidade-manual.js` | Alvos de toque menores que 44px, texto menor que 16px, estrutura de títulos, link "Ir para o conteúdo" no primeiro Tab, contorno de foco, rolagem lateral a 320px e texto com espaçamento aumentado. |
| `percurso-completo.js` | Simula uma pessoa do M1 ao M9 no celular, pelos botões "Ir para o Módulo", e confere a página inicial e o Meu caderno no final. Apaga os dados no fim. |

## Como rodar

Em uma pasta fora do site, instale as ferramentas uma vez:

```bash
npm install playwright axe-core
npx playwright install chromium
```

Em outro terminal, sirva a pasta `site/`:

```bash
cd site
python3 -m http.server 8776
```

E rode, a partir da pasta onde instalou as ferramentas:

```bash
node caminho/para/qa/acessibilidade-axe.js
node caminho/para/qa/acessibilidade-manual.js
node caminho/para/qa/percurso-completo.js
```

Para testar outro endereço, defina `BASE`, por exemplo `BASE=https://meusite.com.br/win-conecta/ node ...`, sempre com a barra no final.

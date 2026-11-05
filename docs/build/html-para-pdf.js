// Converte um HTML em PDF com cabeçalho e rodapé. Usado por gerar.py.
// Uso: node html-para-pdf.js <entrada.html> <saida.pdf> "<título>" "<versão>" "<data>"
const { chromium } = require('playwright');
const [entrada, saida, titulo, versao, data] = process.argv.slice(2);
(async () => {
  const nav = await chromium.launch();
  const pg = await nav.newPage();
  await pg.goto('file://' + entrada);
  // O sumário fica logo abaixo da tabela de controle do documento.
  await pg.evaluate(() => {
    const toc = document.querySelector('nav#TOC');
    const tabela = document.querySelector('#controle-deste-documento + table');
    if (toc && tabela) tabela.after(toc);
    // tabelas pequenas não se dividem entre páginas
    document.querySelectorAll('table').forEach(t => { if (t.rows.length <= 9) t.style.breakInside = 'avoid'; });
  });
  const cab = '<div style="font-size:8px;color:#3b4d7d;width:100%;padding:0 16mm;font-family:Carlito,Arial,sans-serif">WIN Conecta 50+ · ' + titulo + '</div>';
  const rod = '<div style="font-size:8px;color:#3b4d7d;width:100%;padding:0 16mm;font-family:Carlito,Arial,sans-serif;display:flex;justify-content:space-between">' +
    '<span>Versão ' + versao + ' · ' + data + '</span><span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span></div>';
  await pg.pdf({
    path: saida, format: 'A4', printBackground: true, displayHeaderFooter: true,
    headerTemplate: cab, footerTemplate: rod,
    margin: { top: '20mm', bottom: '20mm', left: '16mm', right: '16mm' }
  });
  await nav.close();
})().catch(e => { console.error(e); process.exit(1); });

#!/usr/bin/env python3
"""Gera os documentos em Word (DOCX) e PDF a partir dos arquivos Markdown de docs/.

Uso, a partir da raiz do repositório:
    python3 docs/build/gerar.py

Requisitos: pandoc, python-docx, Node.js e o pacote playwright do Node (com o Chromium instalado).
Saída: docs/entregaveis/WIN-Conecta-50-<Documento>-v<versão>-<data>.docx e .pdf

Também monta a tabela de chaves guardadas no aparelho a partir do código do site e
FALHA se encontrar uma chave que não esteja documentada aqui.
"""
import fnmatch
import glob
import os
import re
import subprocess
import sys
import tempfile

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DOCS = os.path.join(RAIZ, 'docs')
SAIDA = os.path.join(DOCS, 'entregaveis')
CSS = os.path.join(DOCS, 'build', 'estilo-pdf.css')

VERSAO = '1.0.0'
DATA_BR = '05/11/2026'
DATA_ISO = '2026-11-05'

DOCUMENTOS = [
    ('MANUAL-DA-METODOLOGIA', 'Manual-da-Metodologia', 'Manual da metodologia WIN Conecta'),
    ('DOCUMENTACAO-TECNICA', 'Documentacao-Tecnica', 'Documentação técnica'),
    ('HISTORICO-DE-VERSOES', 'Historico-de-Versoes', 'Histórico de versões'),
    ('CHECKLIST-DE-ENTREGA', 'Checklist-de-Entrega', 'Checklist de entrega'),
]

# ---------------------------------------------------------------- chaves guardadas no aparelho
# (chaves, valor, o que guarda). Chaves aceitam {a,b,c} e {1..7}.
CHAVES = [
    ('Chaves comuns', [
        ('cartao', 'objeto `{quem, faco, escrevo, falo, evito}`', 'Cartão de contexto. Escrito no M3 e no Connect Pack, lido pelos pedidos dos outros módulos'),
        ('entrada.nome', 'texto', 'Nome da pessoa (M1). Também título do Meu caderno'),
        ('entrada.mesa', '`"1"` a `"6"`', 'Número da mesa'),
        ('entrada.nivel', '`"1"` a `"4"`', 'Quanto a pessoa usa IA'),
        ('entrada.plano', '`gratuito`, `pago` ou `sem-conta`', 'Plano do ChatGPT'),
        ('entrada.quero', 'texto', 'O que quer resolver com a IA'),
        ('entrada.dificil', 'texto', 'O que é mais difícil hoje'),
    ]),
    ('M1 · Chegada e abertura', [
        ('m1.acesso.{wifi,chatgpt,app,ola}', 'verdadeiro ou falso', 'Os 4 passos do check de acesso'),
    ]),
    ('M2 · Como a IA funciona', [
        ('m2.usos.{pesquisar,duvidas,escrever}', 'verdadeiro ou falso', 'Como a pessoa já usa a IA'),
        ('m2.mudou', 'texto', 'O que mudou entre os dois pedidos'),
        ('m2.acertou', '`tudo`, `quase` ou `errou`', 'Se a IA acertou sobre algo que a pessoa conhece'),
        ('m2.errado', 'texto', 'O que estava errado ou inventado'),
        ('m2.duvida', 'texto', 'Dúvida para o instrutor ou a mesa'),
        ('m2.p2', 'objeto `{pessoa, interesse, valor}`', 'Campos do pedido 2'),
        ('m2.p3', 'objeto `{assunto}`', 'Campo do pedido sobre algo que a pessoa conhece'),
    ]),
    ('M3 · Os 4 C e o cartão de contexto', [
        ('m3.situacao', '`convite`, `agradecimento` ou `aviso`', 'Situação escolhida'),
        ('m3.p1', 'objeto `{contexto, comando, criterios, conferencia}`', 'Os 4 C da pessoa'),
        ('m3.pronto.{salvei,testei,soou}', 'verdadeiro ou falso', 'Checklist "Meu cartão está pronto?"'),
    ]),
    ('M4 · Tarefa 1', [
        ('m4.tipo', '`email`, `whatsapp`, `proposta`, `convite` ou `redes`', 'Tipo de texto escolhido'),
        ('m4.melhorar', 'texto', 'O que a pessoa queria melhorar'),
        ('m4.p', 'objeto `{jeito, texto, tom, numero}`', 'Campos do pedido'),
        ('m4.ajuste1', 'texto', 'Primeiro ajuste pedido'),
        ('m4.ajuste2', 'texto', 'Segundo ajuste pedido'),
        ('m4.melhorou', 'texto', 'O que melhorou e onde a IA errou'),
        ('m4.validado', 'texto', 'Meu prompt validado'),
        ('m4.diferenca', 'texto', 'O ajuste que fez a diferença'),
        ('m4.usar', 'texto', 'Para que vai usar o pedido'),
        ('m4.aprendi', 'texto', 'O que aprendeu'),
    ]),
    ('M5 · Conferir', [
        ('m5.p', 'objeto `{texto}`', 'Texto colado no pedido da régua'),
        ('m5.regua.{nomes,numeros,fatos,promessas,jeito}', 'verdadeiro ou falso', 'Os 5 itens da Régua'),
        ('m5.encontrei', 'texto', 'O que encontrou no texto'),
        ('m5.corrigido', 'texto', 'Como ficou depois de corrigir'),
    ]),
    ('M6 · Tarefa 2', [
        ('m6.tipo', '`cliente`, `entrevista` ou `parceiro`', 'Situação da reunião'),
        ('m6.saber', 'texto', 'O que gostaria de saber antes de entrar na sala'),
        ('m6.modo', '`pessoa` ou `empresa`', 'O que quer pesquisar'),
        ('m6.p1', 'objeto `{nome, cargo, cidade, objetivo}`', 'Pedido da pesquisa de uma pessoa'),
        ('m6.p1e', 'objeto `{empresa, cidade, objetivo}`', 'Pedido da pesquisa só da empresa'),
        ('m6.regua.{nomes,numeros,fatos,promessas,jeito}', 'verdadeiro ou falso', 'Régua dos 5 aplicada à reunião'),
        ('m6.fonte{1,2}', 'verdadeiro ou falso', 'Abri a primeira e a segunda fonte'),
        ('m6.infos', 'texto', 'Informações com fonte que conferiu'),
        ('m6.perguntas', 'texto', 'Perguntas que podem fazer'),
        ('m6.propor', 'texto', 'O que pode propor'),
        ('m6.abertura', 'texto', 'Abertura de 2 minutos'),
        ('m6.ensaio.{li,troquei}', 'verdadeiro ou falso', 'Ensaiou em voz alta'),
        ('m6.funcionou', 'texto', 'O pedido que funcionou'),
        ('m6.util', 'texto', 'A informação mais útil'),
        ('m6.ajuste', 'texto', 'O ajuste que fez'),
    ]),
    ('M7 · Panorama das outras IAs', [
        ('m7.obs.{comparei,fonte,link}', 'verdadeiro ou falso', 'O que observou na comparação'),
        ('m7.jogo.{a,b,c,d}', 'nome da IA', 'Escolha em cada situação do jogo'),
        ('m7.jogo.revelado', 'verdadeiro ou falso', 'Se as respostas do jogo já foram abertas'),
        ('m7.testar', 'texto', 'Situação em que vai testar outra IA'),
    ]),
    ('M8 · Tarefa 3', [
        ('m8.descricao', 'texto', 'O que quer divulgar, em 5 linhas'),
        ('m8.p1', 'objeto `{profissao, faco, quem, oque}`', 'Pedido das 10 ideias'),
        ('m8.ideias', 'texto', 'As 3 ideias escolhidas'),
        ('m8.p2', 'objeto `{n, linhas}`', 'Pedido do post'),
        ('m8.legenda', 'texto', 'Legenda do post'),
        ('m8.chamada', 'texto', 'Chamada do post'),
        ('m8.arte', 'texto', 'Ideia da arte'),
        ('m8.pub.{promessas,numeros,fatos,imagem,jeito}', 'verdadeiro ou falso', 'Régua antes de publicar'),
        ('m8.p3', 'objeto `{oque}`', 'Pedido do calendário'),
        ('m8.cal.{1..7}.{c,h}', 'texto', 'Conteúdo (`c`) e chamada (`h`) de cada dia do calendário'),
        ('m8.p4', 'objeto `{n}`', 'Pedido do roteiro de vídeo (desafio extra)'),
        ('m8.validado', 'texto', 'Meu prompt validado'),
        ('m8.ajuste', 'texto', 'O ajuste que fez o post soar como a pessoa'),
    ]),
    ('M9 · Connect Pack e fechamento', [
        ('m9.modelo', '`"1"` a `"8"`', 'Modelo do Connect Pack que vai testar primeiro'),
        ('m9.s{1,2,3}', 'texto', 'As 3 situações da próxima semana'),
        ('m9.surpreendeu', 'texto', 'O que mais surpreendeu na noite'),
    ]),
    ('Connect Pack', [
        ('pack.m{1..8}', 'objeto com os campos do modelo', 'O que a pessoa preencheu em cada modelo'),
        ('pack.c{1..8}', 'objeto `{índice: verdadeiro ou falso}`', 'Itens de "Confira antes de usar" marcados em cada modelo'),
    ]),
]


def expandir(padrao):
    """Expande {a,b} e {1..7} em chaves concretas."""
    m = re.search(r'\{([^{}]+)\}', padrao)
    if not m:
        return [padrao]
    miolo = m.group(1)
    if '..' in miolo:
        a, b = miolo.split('..')
        opcoes = [str(i) for i in range(int(a), int(b) + 1)]
    else:
        opcoes = miolo.split(',')
    saida = []
    for o in opcoes:
        saida += expandir(padrao[:m.start()] + o + padrao[m.end():])
    return saida


def chaves_no_codigo():
    """Chaves usadas pelo site: data-salvar nos HTML e chaves gravadas nos JS."""
    achadas = set()
    for f in glob.glob(os.path.join(RAIZ, 'site', '**', '*.html'), recursive=True):
        achadas |= set(re.findall(r'data-salvar="([^"]+)"', open(f, encoding='utf-8').read()))
    for f in glob.glob(os.path.join(RAIZ, 'site', '**', '*.js'), recursive=True):
        t = open(f, encoding='utf-8').read()
        achadas |= set(re.findall(r"chave:\s*'([^']+)'", t))
        achadas |= set(re.findall(r"store\.(?:set|get|remove)\('([^']+)'", t))
        achadas |= set(re.findall(r"data-salvar=\"(m8\.cal\.)'", t))
    return achadas


def tabela_de_chaves():
    documentadas = set()
    for _, linhas in CHAVES:
        for padrao, _, _ in linhas:
            documentadas |= set(expandir(padrao))
    # prefixos dinâmicos montados em JS: pack.m + id, pack.c + id, m8.cal. + dia, m7.jogo. + letra
    dinamicos = {'pack.m', 'pack.c', 'm8.cal.', 'm7.jogo.'}
    faltando = sorted(k for k in chaves_no_codigo() if k not in documentadas and k not in dinamicos)
    if faltando:
        print('ERRO: chaves usadas no código e não documentadas em gerar.py:', faltando)
        sys.exit(1)
    sobrando = sorted(k for k in documentadas if not k.startswith(('pack.', 'm8.cal.')) and k not in chaves_no_codigo())
    if sobrando:
        print('AVISO: chaves documentadas que não aparecem no código:', sobrando)
    md = ''
    total = 0
    for grupo, linhas in CHAVES:
        md += '**%s**\n\n| Chave | Valor | O que guarda |\n|------------------|--------------|-----------------------|\n' % grupo
        for padrao, valor, desc in linhas:
            md += '| `%s` | %s | %s |\n' % (padrao, valor, desc)
            total += len(expandir(padrao))
        md += '\n'
    print('Chaves documentadas: %d (todas as usadas no código estão cobertas)' % total)
    return md


# ---------------------------------------------------------------- sumário para o Word
def sumario(md):
    linhas, dentro = [], False
    for l in md.split('\n'):
        if l.startswith('```'):
            dentro = not dentro
        if dentro:
            continue
        m = re.match(r'^(#{1,2}) (.+)$', l)
        if m and m.group(2) not in ('Controle deste documento', 'Sumário'):
            linhas.append(('' if len(m.group(1)) == 1 else '    ') + '* ' + m.group(2).replace('`', ''))
    return '# Sumário\n\n' + '\n'.join(linhas) + '\n\n'


def inserir_sumario(md):
    m = re.search(r'^# Controle deste documento.*?(?=^# )', md, re.S | re.M)
    if not m:
        return md
    return md[:m.end()] + sumario(md) + md[m.end():]


# ---------------------------------------------------------------- Word
def referencia_docx(cabecalho, destino):
    from docx import Document
    from docx.shared import Pt, RGBColor, Cm
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    tmp = destino + '.base.docx'
    with open(tmp, 'wb') as fh:
        subprocess.run(['pandoc', '--print-default-data-file', 'reference.docx'], stdout=fh, check=True)
    d = Document(tmp)
    azul, navy, suave = RGBColor(0x00, 0x58, 0xFC), RGBColor(0x00, 0x14, 0x4C), RGBColor(0x3B, 0x4D, 0x7D)

    def estilo(nome, tam=None, cor=None, negrito=None, antes=None, depois=None, fonte='Calibri', italico=None):
        try:
            s = d.styles[nome]
        except KeyError:
            return
        s.font.name = fonte
        rpr = s.element.get_or_add_rPr()
        rf = rpr.find(qn('w:rFonts'))
        if rf is None:
            rf = OxmlElement('w:rFonts'); rpr.append(rf)
        for a in ('w:ascii', 'w:hAnsi', 'w:cs', 'w:eastAsia'):
            rf.set(qn(a), fonte)
        if tam: s.font.size = Pt(tam)
        if cor is not None: s.font.color.rgb = cor
        if negrito is not None: s.font.bold = negrito
        if italico is not None: s.font.italic = italico
        if antes is not None: s.paragraph_format.space_before = Pt(antes)
        if depois is not None: s.paragraph_format.space_after = Pt(depois)

    corpo = RGBColor(0x1A, 0x1A, 0x1A)
    for n in ('Normal', 'Body Text', 'First Paragraph', 'Compact'):
        estilo(n, 11 if n != 'Compact' else 10, corpo, depois=6 if n != 'Compact' else 2)
    estilo('Title', 28, navy, True, 60, 6)
    estilo('Subtitle', 14, suave, False, 0, 8)
    estilo('Author', 10.5, suave, False, 0, 0)
    estilo('Date', 10.5, suave, False, 0, 12)
    estilo('Heading 1', 20, navy, True, 20, 8)
    estilo('Heading 2', 15, azul, True, 16, 6)
    estilo('Heading 3', 12.5, navy, True, 12, 4)
    estilo('Block Text', 10.5, suave, False, 4, 8, italico=True)
    for n in ('Source Code', 'Verbatim Char'):
        estilo(n, 9, corpo, fonte='Consolas')
    # tabela: bordas e linha de cabeçalho
    try:
        t = d.styles['Table']
        el = t.element
        tblpr = el.find(qn('w:tblPr'))
        if tblpr is None:
            tblpr = OxmlElement('w:tblPr'); el.append(tblpr)
        bordas = OxmlElement('w:tblBorders')
        for lado in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV'):
            b = OxmlElement('w:' + lado)
            b.set(qn('w:val'), 'single'); b.set(qn('w:sz'), '4'); b.set(qn('w:space'), '0'); b.set(qn('w:color'), 'C9D6EE')
            bordas.append(b)
        tblpr.append(bordas)
        cel = OxmlElement('w:tblCellMar')
        for lado, v in (('top', 50), ('left', 90), ('bottom', 50), ('right', 90)):
            c = OxmlElement('w:' + lado); c.set(qn('w:w'), str(v)); c.set(qn('w:type'), 'dxa'); cel.append(c)
        tblpr.append(cel)
        sp = OxmlElement('w:tblStylePr'); sp.set(qn('w:type'), 'firstRow')
        rpr = OxmlElement('w:rPr')
        neg = OxmlElement('w:b'); rpr.append(neg)
        cor = OxmlElement('w:color'); cor.set(qn('w:val'), '00144C'); rpr.append(cor)
        sp.append(rpr)
        tcpr = OxmlElement('w:tcPr'); shd = OxmlElement('w:shd')
        shd.set(qn('w:val'), 'clear'); shd.set(qn('w:color'), 'auto'); shd.set(qn('w:fill'), 'DCE6F8')
        tcpr.append(shd); sp.append(tcpr)
        el.append(sp)
    except KeyError:
        pass
    # página A4, margens, cabeçalho e rodapé com número de página
    for sec in d.sections:
        sec.page_width, sec.page_height = Cm(21), Cm(29.7)
        sec.left_margin = sec.right_margin = Cm(2)
        sec.top_margin, sec.bottom_margin = Cm(2.2), Cm(2.2)
        ph = sec.header.paragraphs[0]
        ph.text = 'WIN Conecta 50+ · ' + cabecalho
        for r in ph.runs:
            r.font.size = Pt(9); r.font.color.rgb = suave; r.font.name = 'Calibri'
        pf = sec.footer.paragraphs[0]
        pf.text = ''
        r = pf.add_run('Versão %s · %s · Página ' % (VERSAO, DATA_BR))
        r.font.size = Pt(9); r.font.color.rgb = suave; r.font.name = 'Calibri'
        r2 = pf.add_run()
        r2.font.size = Pt(9); r2.font.color.rgb = suave
        for tipo, txt in (('begin', None), (None, ' PAGE '), ('end', None)):
            if tipo:
                f = OxmlElement('w:fldChar'); f.set(qn('w:fldCharType'), tipo); r2._r.append(f)
            else:
                it = OxmlElement('w:instrText'); it.set(qn('xml:space'), 'preserve'); it.text = txt; r2._r.append(it)
    d.save(destino)
    os.remove(tmp)


def gerar_docx(md, titulo, destino):
    md = inserir_sumario(md)
    md = md.replace('\\newpage', '```{=openxml}\n<w:p><w:r><w:br w:type="page"/></w:r></w:p>\n```')
    with tempfile.TemporaryDirectory() as tmp:
        ref = os.path.join(tmp, 'ref.docx')
        referencia_docx(titulo, ref)
        entrada = os.path.join(tmp, 'doc.md')
        open(entrada, 'w', encoding='utf-8').write(md)
        subprocess.run(['pandoc', entrada, '-f', 'markdown+pipe_tables', '-o', destino, '--reference-doc=' + ref], check=True)


# ---------------------------------------------------------------- PDF
def gerar_pdf(md, titulo, destino):
    md = md.replace('\\newpage', '<div class="quebra"></div>')
    with tempfile.TemporaryDirectory() as tmp:
        entrada = os.path.join(tmp, 'doc.md')
        html = os.path.join(tmp, 'doc.html')
        open(entrada, 'w', encoding='utf-8').write(md)
        subprocess.run(['pandoc', entrada, '-f', 'markdown+pipe_tables', '-s', '--toc', '--toc-depth=2', '--embed-resources',
                        '-c', CSS, '--metadata', 'pagetitle=' + titulo, '-o', html], check=True)
        env = dict(os.environ)
        try:
            raiz_global = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True, check=True).stdout.strip()
            env['NODE_PATH'] = raiz_global + os.pathsep + env.get('NODE_PATH', '')
        except Exception:
            pass
        subprocess.run(['node', os.path.join(DOCS, 'build', 'html-para-pdf.js'), html, destino, titulo, VERSAO, DATA_BR], check=True, env=env)


def main():
    os.makedirs(SAIDA, exist_ok=True)
    tabela = tabela_de_chaves()
    for base, nome, titulo in DOCUMENTOS:
        md = open(os.path.join(DOCS, base + '.md'), encoding='utf-8').read()
        md = md.replace('{{CHAVES}}', tabela)
        stem = 'WIN-Conecta-50-%s-v%s-%s' % (nome, VERSAO, DATA_ISO)
        gerar_docx(md, titulo, os.path.join(SAIDA, stem + '.docx'))
        gerar_pdf(md, titulo, os.path.join(SAIDA, stem + '.pdf'))
        print('ok:', stem)


if __name__ == '__main__':
    main()

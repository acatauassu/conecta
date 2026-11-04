/* Connect Pack: os 8 modelos de pedido.
   Textos do Caderno do participante (páginas "Connect Pack · Modelo 1 a 8").

   Como editar:
   - "pedido" é o texto enviado à IA. Cada {{campo}} vira um campo para a pessoa preencher.
     Texto fora das chaves, inclusive colchetes como [preencher], é copiado exatamente como está.
   - "campos" descreve cada {{campo}}: rotulo (o que a pessoa vê), marcador (o que aparece no pedido
     enquanto está vazio), tipo (curto | longo | escolha | cartao), dica, opcoes (só em escolha),
     padrao (valor inicial opcional) e exemplo (usado no botão "Ver um exemplo preenchido").
   - "testadoEm": coloque a data do último teste da equipe, no formato "25/11/2026". Enquanto for null,
     a data não aparece na página. As ferramentas de IA mudam com frequência: atualize depois de testar.
   - "planoTipo": "gratuito" (funciona bem no plano gratuito) ou "pago" (funciona melhor no plano pago). */
window.CONNECT_PACK = [
  {
    id: 1,
    titulo: 'Escrever com a minha voz',
    planoTipo: 'gratuito',
    plano: 'Plano gratuito ou pago.',
    testadoEm: null,
    paraQue: 'Para escrever e-mails, mensagens e propostas que soam como você, e não como um texto de robô.',
    resultado: 'Um texto pronto, no seu tom, para você só revisar e enviar.',
    quando: ['Responder um cliente que pediu preço.', 'Escrever um convite ou um agradecimento.', 'Fazer uma cobrança educada.'],
    conferir: ['Nomes, valores e datas estão certos?', 'Não prometi nada que não posso cumprir?', 'Soa como eu falaria?'],
    seNaoFuncionar: 'Se o texto ficar genérico, cole mais um exemplo do seu jeito de escrever.',
    pedido: 'Meu cartão de contexto: {{cartao}}. Este é um texto que eu escrevi e mostra o meu jeito: {{texto}}. Agora escreva {{tipo}} para {{nome}} sobre {{assunto}}. Critérios: até {{numero}} linhas, tom {{tom}}. No fim, diga o que você supôs que eu não contei.',
    campos: {
      cartao: { tipo: 'cartao', marcador: '[cole aqui o seu cartão]' },
      texto: { tipo: 'longo', rotulo: 'Um texto seu, de 5 a 10 linhas', dica: 'Um e-mail ou mensagem que você já escreveu e de que gostou. Troque nomes e números de outras pessoas por [nome] ou XXX.', marcador: '[cole um texto seu, de 5 a 10 linhas]', exemplo: 'Oi, Dona Lúcia! Tudo bem por aí? Passando para lembrar da nossa consulta de quinta, às 15h. Se precisar remarcar, é só me avisar por aqui. Um abraço, Marta.' },
      tipo: { tipo: 'escolha', rotulo: 'O que você quer escrever', opcoes: ['um e-mail', 'uma mensagem', 'uma proposta'], marcador: '[um e-mail / uma mensagem / uma proposta]', exemplo: 'uma mensagem' },
      nome: { tipo: 'curto', rotulo: 'Para quem é', dica: 'O nome da pessoa.', marcador: '[nome da pessoa]', exemplo: 'Dona Lúcia' },
      assunto: { tipo: 'curto', rotulo: 'Sobre o quê', marcador: '[assunto]', exemplo: 'a consulta de quinta-feira, às 15h' },
      numero: { tipo: 'curto', rotulo: 'Quantas linhas, no máximo', marcador: '[número]', exemplo: '5' },
      tom: { tipo: 'escolha', rotulo: 'Tom', opcoes: ['carinhoso', 'profissional', 'direto'], marcador: '[carinhoso / profissional / direto]', exemplo: 'carinhoso' }
    }
  },
  {
    id: 2,
    titulo: 'Preparar a reunião com quem não conheço',
    planoTipo: 'pago',
    plano: 'Plano gratuito (a pesquisa tem limites). Pago é recomendado.',
    testadoEm: null,
    paraQue: 'Para chegar a uma reunião sabendo com quem vai falar: um cliente, uma entrevista, um fornecedor ou um possível parceiro.',
    resultado: 'Informações públicas com fonte, as perguntas e dúvidas prováveis, o que propor e um roteiro de abertura.',
    quando: ['Visitar um cliente para apresentar uma proposta.', 'Ir a uma entrevista de trabalho.', 'Conversar com um fornecedor ou parceiro novo.'],
    conferir: ['É a pessoa certa, e não um homônimo?', 'Cada informação tem fonte e abre?', 'O estilo da pessoa é só hipótese. Não trate como certeza.'],
    seNaoFuncionar: 'Se a IA não achar fontes, cole você mesmo o endereço do perfil profissional da pessoa e peça para ler a partir dele.',
    pedido: 'Vou ter uma reunião com {{nome}}, {{cargo}}, de {{cidade}}. O objetivo é {{objetivo}}. Pesquise na internet só informações profissionais públicas sobre a pessoa e a empresa. Cite a fonte de cada informação. Se houver mais de uma pessoa com esse nome, pergunte antes de seguir. Depois entregue: resumo em 5 linhas; 8 perguntas que ela pode me fazer; dúvidas e objeções prováveis, com sugestão de resposta; estilo provável de conversa, como hipótese; o que posso propor; e um roteiro de abertura de 2 minutos. Separe o que é fato com fonte do que é suposição.',
    campos: {
      nome: { tipo: 'curto', rotulo: 'Nome completo da pessoa', dica: 'Só informações profissionais e públicas. Nada da vida privada.', marcador: '[nome completo]', exemplo: 'Carlos Mendes' },
      cargo: { tipo: 'curto', rotulo: 'Cargo e empresa', marcador: '[cargo e empresa]', exemplo: 'diretor comercial da Rede Boa Mesa' },
      cidade: { tipo: 'curto', rotulo: 'Cidade', marcador: '[cidade]', exemplo: 'Belém' },
      objetivo: { tipo: 'escolha', rotulo: 'Objetivo da reunião', opcoes: ['apresentar uma proposta', 'entrevista', 'parceria'], marcador: '[apresentar uma proposta / entrevista / parceria]', exemplo: 'apresentar uma proposta' }
    }
  },
  {
    id: 3,
    titulo: 'Post e calendário de redes',
    planoTipo: 'gratuito',
    plano: 'Plano gratuito. A criação de imagem depende do plano.',
    testadoEm: null,
    paraQue: 'Para divulgar o seu trabalho com constância, sem ficar em branco diante da tela.',
    resultado: 'Um post completo, com legenda, chamada e ideia da arte, e um calendário de 7 dias.',
    quando: ['Divulgar um serviço ou um produto novo.', 'Manter o Instagram ou o LinkedIn ativos.', 'Anunciar uma data, uma oferta ou um evento.'],
    conferir: ['As informações sobre o meu serviço estão certas?', 'Eu postaria isso com o meu nome?', 'Há promessas, preços ou dados que preciso corrigir?'],
    seNaoFuncionar: 'Se a IA não criar a imagem, use a ideia da arte como briefing para um aplicativo de design ou para quem faz as suas artes.',
    pedido: 'Meu cartão de contexto: {{cartao}}. Quero divulgar {{produto}} para {{publico}} no {{rede}}. O objetivo é {{objetivo}}. Escreva 1 post completo, com legenda, chamada para ação e uma ideia de imagem. Depois monte um calendário de 7 dias, com o tema e o formato de cada dia. Tom {{tom}}. Não prometa resultados que eu não possa garantir.',
    campos: {
      cartao: { tipo: 'cartao', marcador: '[cole aqui o seu cartão]' },
      produto: { tipo: 'curto', rotulo: 'O que você quer divulgar', dica: 'Um produto ou um serviço.', marcador: '[produto ou serviço]', exemplo: 'consultas de reeducação alimentar para famílias' },
      publico: { tipo: 'curto', rotulo: 'Para quem', marcador: '[público]', exemplo: 'famílias de Belém' },
      rede: { tipo: 'escolha', rotulo: 'Em qual rede', opcoes: ['Instagram', 'LinkedIn'], marcador: '[Instagram / LinkedIn]', exemplo: 'Instagram' },
      objetivo: { tipo: 'escolha', rotulo: 'Objetivo', opcoes: ['conseguir contatos', 'mostrar o meu trabalho'], marcador: '[conseguir contatos / mostrar o meu trabalho]', exemplo: 'conseguir contatos' },
      tom: { tipo: 'escolha', rotulo: 'Tom', opcoes: ['próximo', 'profissional'], marcador: '[próximo / profissional]', exemplo: 'próximo' }
    }
  },
  {
    id: 4,
    titulo: 'Portfólio de 5 páginas',
    planoTipo: 'pago',
    plano: 'Pago é recomendado. No plano gratuito, a IA entrega o texto.',
    testadoEm: null,
    paraQue: 'Para apresentar o seu trabalho de forma simples e profissional.',
    resultado: 'A estrutura e o texto de um portfólio de 5 páginas: capa, quem sou, serviços, resultados e contato.',
    quando: ['Enviar a um cliente que pediu "um material".', 'Participar de uma seleção ou concorrência.', 'Ter uma apresentação sua pronta para consulta.'],
    conferir: ['Todos os resultados são reais e eu posso comprovar?', 'Não ficou nada inventado onde eu não informei?', 'Nome, contato e links estão corretos?'],
    seNaoFuncionar: 'Se não gerar o arquivo, copie o texto para o Word ou para um aplicativo de apresentações e monte as páginas.',
    pedido: 'Meu cartão de contexto: {{cartao}}. Monte o texto de um portfólio de 5 páginas: 1 capa; 2 quem sou; 3 o que ofereço; 4 resultados e exemplos; 5 contato. Use só as informações que eu forneço a seguir. Onde faltar algo, escreva [preencher] e não invente. Meus serviços: {{servicos}}. Meus resultados reais: {{resultados}}. Tom {{tom}}.',
    campos: {
      cartao: { tipo: 'cartao', marcador: '[cole aqui o seu cartão]' },
      servicos: { tipo: 'longo', rotulo: 'Seus serviços', dica: 'Liste, um por linha.', marcador: '[liste]', exemplo: 'Consultas de nutrição para famílias; palestras sobre alimentação para empresas.' },
      resultados: { tipo: 'longo', rotulo: 'Seus resultados reais', dica: 'Só o que você pode comprovar. Se não tiver, deixe em branco: a IA vai marcar [preencher].', marcador: '[liste]', exemplo: 'Mais de 20 anos de atendimento; centenas de famílias atendidas em Belém.' },
      tom: { tipo: 'escolha', rotulo: 'Tom', opcoes: ['profissional', 'acolhedor'], marcador: '[profissional / acolhedor]', exemplo: 'acolhedor' }
    }
  },
  {
    id: 5,
    titulo: 'Palestra de 10 slides',
    planoTipo: 'pago',
    plano: 'Pago é recomendado para gerar o arquivo. No gratuito, a IA entrega o roteiro.',
    testadoEm: null,
    paraQue: 'Para preparar uma palestra curta sobre o que você sabe.',
    resultado: 'O roteiro de 10 slides, com título, tópicos e uma sugestão de fala para cada um.',
    quando: ['Falar em um evento, uma associação ou uma turma.', 'Apresentar um assunto para a equipe.', 'Fazer uma aula ou oficina curta.'],
    conferir: ['Os números e as datas têm fonte confiável?', 'O conteúdo reflete o que eu realmente sei?', 'Cabe no tempo que tenho?'],
    seNaoFuncionar: 'Se a IA não gerar o arquivo, cole cada slide em um aplicativo de apresentações.',
    pedido: 'Quero uma palestra de {{minutos}} minutos sobre {{tema}} para {{publico}}. Use o meu cartão de contexto: {{cartao}}. Entregue 10 slides, cada um com título, 3 tópicos curtos e uma sugestão do que falar. Comece com uma abertura que prenda a atenção e termine com uma chamada para ação. Se faltar informação, pergunte antes. Não invente dados nem estatísticas.',
    campos: {
      minutos: { tipo: 'curto', rotulo: 'Duração, em minutos', marcador: '[20]', padrao: '20', exemplo: '20' },
      tema: { tipo: 'curto', rotulo: 'Tema', marcador: '[tema]', exemplo: 'alimentação saudável na rotina de quem trabalha' },
      publico: { tipo: 'curto', rotulo: 'Público', marcador: '[público]', exemplo: 'equipes de pequenas empresas' },
      cartao: { tipo: 'cartao', marcador: '[cole aqui o seu cartão]' }
    }
  },
  {
    id: 6,
    titulo: 'Planilha: preço do meu serviço',
    planoTipo: 'pago',
    plano: 'Pago é recomendado para gerar a planilha. No gratuito, a IA entrega a tabela em texto.',
    testadoEm: null,
    paraQue: 'Para descobrir quanto cobrar pelo seu serviço, com as contas à vista.',
    resultado: 'O valor da sua hora e um preço sugerido para cada serviço, com o cálculo passo a passo.',
    quando: ['Fixar o preço de um serviço novo.', 'Rever preços que não cobrem os seus custos.', 'Responder "quanto custa?" com mais segurança.'],
    conferir: ['Refaça uma conta com a calculadora.', 'Os números são realistas para o meu negócio?', 'Confirme o resultado com o seu contador, se tiver.'],
    seNaoFuncionar: 'Use números aproximados ou fictícios. Não envie dados bancários, senhas ou documentos.',
    pedido: 'Quero calcular o preço do meu serviço de {{servico}}. Use estes números aproximados: custos fixos por mês {{custos}}; horas que trabalho por mês {{horas}}; quanto quero ganhar por mês {{ganhar}}; impostos {{impostos}}; margem de segurança {{margem}}. Mostre o valor da minha hora e o preço sugerido para {{exemploServico}}, com as contas passo a passo. Explique em linguagem simples. Se preferir, use números fictícios.',
    campos: {
      servico: { tipo: 'curto', rotulo: 'Seu serviço', marcador: '[serviço]', exemplo: 'consulta de nutrição' },
      custos: { tipo: 'curto', rotulo: 'Custos fixos por mês', dica: 'Números aproximados bastam. Não envie dados bancários.', marcador: '[valor dos custos fixos]', exemplo: 'R$ 3.000' },
      horas: { tipo: 'curto', rotulo: 'Horas que você trabalha por mês', marcador: '[horas]', exemplo: '100' },
      ganhar: { tipo: 'curto', rotulo: 'Quanto quer ganhar por mês', marcador: '[valor que quer ganhar]', exemplo: 'R$ 8.000' },
      impostos: { tipo: 'curto', rotulo: 'Impostos, em %', marcador: '[%]', exemplo: '6%' },
      margem: { tipo: 'curto', rotulo: 'Margem de segurança, em %', marcador: '[% de margem]', exemplo: '10%' },
      exemploServico: { tipo: 'curto', rotulo: 'Um serviço para calcular', dica: 'Por exemplo: um serviço de 2 horas.', marcador: '[um serviço de X horas]', exemplo: 'uma consulta de 1 hora e meia' }
    }
  },
  {
    id: 7,
    titulo: 'Ideia, concorrentes e viabilidade',
    planoTipo: 'pago',
    plano: 'Pago é recomendado, pela pesquisa. No gratuito, a pesquisa é mais curta.',
    testadoEm: null,
    paraQue: 'Para testar uma ideia de negócio antes de gastar dinheiro com ela.',
    resultado: 'Um quadro com concorrentes, preços, diferenciais e riscos, mais perguntas para testar com clientes e uma sugestão: seguir, ajustar ou esperar.',
    quando: ['Pensar em abrir um negócio ou um novo serviço.', 'Entrar em um mercado diferente.', 'Decidir entre duas ideias.'],
    conferir: ['Os concorrentes existem de verdade e estão na minha região?', 'Os preços têm fonte e data?', 'Conversei com pessoas reais antes de decidir?'],
    seNaoFuncionar: 'Se a pesquisa vier fraca, cole você mesmo os endereços de 3 concorrentes e peça a comparação.',
    pedido: 'Tenho esta ideia de negócio: {{ideia}}, para {{publico}} em {{regiao}}. Pesquise na internet e cite a fonte: concorrentes próximos, preços praticados e diferenciais. Monte um quadro com concorrentes, preços, diferenciais, riscos e perguntas que eu devo fazer a 5 possíveis clientes. No fim, sugira: seguir, ajustar ou esperar, com os motivos. Separe o que é fato com fonte do que é suposição.',
    campos: {
      ideia: { tipo: 'longo', rotulo: 'Sua ideia, em 3 linhas', marcador: '[descreva em 3 linhas]', exemplo: 'Um serviço de marmitas saudáveis por assinatura semanal, entregues em casa' },
      publico: { tipo: 'curto', rotulo: 'Para quem', marcador: '[público]', exemplo: 'profissionais que trabalham em casa' },
      regiao: { tipo: 'curto', rotulo: 'Cidade ou região', marcador: '[cidade ou região]', exemplo: 'Belém, PA' }
    }
  },
  {
    id: 8,
    titulo: 'Assistente pessoal de rotina',
    planoTipo: 'gratuito',
    plano: 'Plano gratuito. Lembretes automáticos dependem do plano pago.',
    testadoEm: null,
    paraQue: 'Para organizar a sua semana sem se perder em tarefas e compromissos.',
    resultado: 'Um plano da semana, dia a dia, com as 3 prioridades e horários que você pode copiar para a agenda do celular.',
    quando: ['Planejar a semana no domingo à noite.', 'Dividir o tempo entre trabalho, família e saúde.', 'Voltar a se organizar depois de uma semana cheia.'],
    conferir: ['Os horários cabem na vida real?', 'Os compromissos fixos estão todos lá?', 'Deixei folga para imprevistos e descanso?'],
    seNaoFuncionar: 'Se a IA não criar lembretes, copie a lista para o aplicativo de lembretes ou agenda do celular.',
    pedido: 'Quero organizar a minha semana. Meus compromissos fixos: {{fixos}}. Minhas tarefas: {{tarefas}}. Tempo livre por dia: {{horas}}. Minhas 3 prioridades: {{prioridades}}. Monte um plano dia a dia, com horários, deixando folga para imprevistos. Se faltar informação, pergunte antes. No fim, escreva uma lista de lembretes curtos que eu possa copiar para o celular.',
    campos: {
      fixos: { tipo: 'longo', rotulo: 'Compromissos fixos', dica: 'Com dia e hora.', marcador: '[liste com dia e hora]', exemplo: 'segunda e quarta, 9h: consultas; sexta, 14h: reunião de família' },
      tarefas: { tipo: 'longo', rotulo: 'Tarefas da semana', marcador: '[liste]', exemplo: 'preparar a palestra; atualizar o Instagram; pagar as contas' },
      horas: { tipo: 'curto', rotulo: 'Tempo livre por dia, em horas', marcador: '[horas]', exemplo: '2' },
      prioridades: { tipo: 'longo', rotulo: 'Suas 3 prioridades', marcador: '[liste]', exemplo: 'palestra; Instagram; contas em dia' }
    }
  }
];

/* Cartão de contexto de exemplo (personagem fictícia do M3), usado só no botão de exemplo */
window.CONNECT_PACK_CARTAO_EXEMPLO = {
  quem: 'Marta, 58 anos, nutricionista em Belém',
  faco: 'Atendo famílias e pequenas empresas',
  escrevo: 'Clientes e conhecidos, de todas as idades',
  falo: 'Simples, acolhedora, sem termos difíceis',
  evito: 'Gírias e textos muito longos'
};

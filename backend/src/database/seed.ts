/*
  Prisma Seed

  Este arquivo insere dados iniciais usados para teste e desenvolvimento.
  O seed complementa as migrations: as migrations criam a estrutura do banco,
  e o seed popula a base com registros reais para validar rotas e o front-end.
*/

import db from './database.js';

async function runSeed() {
  console.log('▶ Iniciando seed...');
  const conn = await db.connect();

  await conn.run('PRAGMA foreign_keys = ON');

  console.log('  Inserindo usuários...');
  const usuarios = [
    [76554, 'Ana Ferreira',    'anaferreira@gmail.com', 'hylu',  '2° ano', '2019-08-09', 'aluno'],
    [43221, 'Pedro Torres',    'pedrotorres@gmail.com', 'ophj',  '1° ano', '2013-07-10', 'aluno'],
    [99530, 'Walesca Amaro',   'walesca@gmail.com',     'maqb',  null,     '2009-06-07', 'administrador'],
    [10267, 'Rayssa Priscila', 'rayssa@gmail.com',      'iikjr', null,     '2009-03-29', 'administrador'],
    [84721, 'Lucas Andrade',   'lucas@gmail.com',       'abc1',  '7° ano', '2012-04-15', 'aluno'],
    [59384, 'Marina Souza',    'marina@gmail.com',      'def2',  '6° ano', '2013-09-22', 'aluno'],
    [21097, 'Carlos Henrique', 'carlos@gmail.com',      'ghi3',  '4° ano', '2009-11-30', 'aluno'],
    [77652, 'Juliana Lima',    'juliana@gmail.com',     'jkl4',  '3° ano', '2011-01-08', 'aluno'],
    [43890, 'Bruno Martins',   'bruno@gmail.com',       'mno5',  '9° ano', '2010-05-18', 'aluno'],
    [65928, 'Fernanda Alves',  'fernanda@gmail.com',    'fna1',  '8° ano', '2011-07-25', 'aluno'],
  ];
  for (const u of usuarios) {
    await conn.run(
      `INSERT OR IGNORE INTO USUARIO
                (cod_usuario, nome, email, senha, grau_escolar, data_nasc, tipo)
             VALUES (?, ?, ?, ?, ?, ?, ?)`, u
    );
  }
  console.log(`  ✓ ${usuarios.length} usuários.`);

  console.log('  Inserindo disciplinas...');
  const disciplinas = [
    [82211, 'Matemática'],
    [44457, 'Português'],
    [90021, 'Ciências'],
    [57713, 'Inglês'],
    [76326, 'História'],
    [98743, 'Geografia'],
    [34512, 'Artes'],
  ];
  for (const d of disciplinas) {
    await conn.run(
      `INSERT OR IGNORE INTO disciplina (cod_disc, nome_disc) VALUES (?, ?)`, d
    );
  }
  console.log(`  ✓ ${disciplinas.length} disciplinas.`);

  console.log('  Inserindo suporte...');
  const suportes = [
    [11456, 'anaferreira@gmail.com', 'Dúvidas', 'Não entendi como funciona o sistema de metas'],
    [78231, 'pedrotorres@gmail.com', 'Erros',   'A página de exercícios não carrega'],
    [45987, 'lucas@gmail.com',       'Dúvidas', 'Como selecionar disciplinas para estudar?'],
    [90321, 'marina@gmail.com',      'Outros',  'Sugestão de adicionar mais exercícios'],
    [66745, 'juliana@gmail.com',     'Erros',   'Erro ao salvar anotação'],
  ];
  for (const s of suportes) {
    await conn.run(
      `INSERT OR IGNORE INTO suporte
                (cod_suporte, email, tipo_problema, descricao)
             VALUES (?, ?, ?, ?)`, s
    );
  }
  console.log(`  ✓ ${suportes.length} registros de suporte.`);

  console.log('  Inserindo relatórios...');
  const relatorios = [
    [84521, 10, 8,  80, 'Identificação de frações equivalentes',    'Resolução de operações com frações'],
    [19347, 15, 9,  60, 'Reconhecimento de regência verbal',        'Aplicação correta em frases'],
    [67230, 20, 17, 85, 'Uso do Simple Past em frases afirmativas', 'Formação de frases negativas'],
  ];
  for (const r of relatorios) {
    await conn.run(
      `INSERT OR IGNORE INTO relatorio
                (cod_relatorio, meta, total_acertos, percentual_acertos, pontos_fortes, areas_melhorias)
             VALUES (?, ?, ?, ?, ?, ?)`, r
    );
  }
  console.log(`  ✓ ${relatorios.length} relatórios.`);

  console.log('  Inserindo pastas...');
  const pastas = [
    [33441, 76554, '2023-12-06', 'minha_anot'],
    [11667, 43221, '2025-05-13', 'anot_mat'],
    [39001, 76554, '2026-02-10', 'anot_mendel'],
    [12785, 43221, '2023-05-16', 'english_anot'],
    [55234, 84721, '2024-03-12', 'anot_portugues'],
  ];
  for (const p of pastas) {
    await conn.run(
      `INSERT OR IGNORE INTO PASTA
                (cod_pasta, cod_usuario, data_criacao, nome_pasta)
             VALUES (?, ?, ?, ?)`, p
    );
  }
  console.log(`  ✓ ${pastas.length} pastas.`);

  console.log('  Inserindo questões...');
  const questoes = [
    [11154, 82211, 'Quanto é 8 + 7?',                          '13',                     '14',                  '15',                    '16',               'c', 'fácil'],
    [22468, 82211, 'Quanto é 50% de 200?',                     '50',                     '100',                 '150',                   '200',              'b', 'fácil'],
    [33791, 82211, 'Resolva: x + 3 = 7',                       '2',                      '3',                   '4',                     '5',                'c', 'fácil'],
    [34001, 82211, 'Qual é a fração equivalente a 0,75?',      '3/4',                    '7/10',                '1/2',                   '2/3',              'a', 'médio'],
    [35002, 82211, 'Qual o resultado de 12 × 3?',              '36',                     '30',                  '24',                    '32',               'a', 'fácil'],
    [36003, 82211, 'Qual é o valor de 5² + 3³?',               '52',                     '34',                  '45',                    '35',               'a', 'difícil'],
    [26667, 44457, 'Qual palavra está escrita corretamente?',   'Excessão',               'Exceção',             'Excesssão',             'Exeção',           'b', 'médio'],
    [44902, 44457, 'Qual alternativa tem erro de ortografia?',  'Casa',                   'Mesa',                'Caza',                  'Livro',            'c', 'fácil'],
    [55813, 44457, '"O menino correu." Isso é um exemplo de:',  'Frase nominal',          'Frase verbal',        'Interjeição',           'Pergunta',         'b', 'médio'],
    [46001, 44457, 'Qual é o plural de cidadão?',               'Cidadãos',               'Cidadaos',            'Cidadães',              'Cidadãoss',        'a', 'fácil'],
    [47002, 44457, 'Qual classe gramatical é rápido?',          'Adjetivo',               'Substantivo',         'Verbo',                 'Advérbio',         'a', 'médio'],
    [48003, 44457, 'Assinale o período por subordinação:',      'Fiz o dever e joguei',   'Ele estuda, ele dorme','Fui ao parque pois estava sol','Choveu e ventou','c','difícil'],
    [66924, 90021, 'Qual planeta é o mais próximo do Sol?',     'Terra',                  'Marte',               'Mercúrio',              'Júpiter',          'c', 'fácil'],
    [67001, 90021, 'Qual órgão bombeia sangue no corpo?',       'Pulmão',                 'Fígado',              'Coração',               'Rim',              'c', 'fácil'],
    [68002, 90021, 'Principal fonte de energia das plantas?',   'Luz solar',              'Água',                'Terra',                 'Ar',               'a', 'fácil'],
    [69003, 90021, 'Qual osso protege o cérebro?',              'Crânio',                 'Fêmur',               'Úmero',                 'Vértebra',         'a', 'médio'],
    [69004, 90021, 'Processo da lagarta em borboleta?',         'Metamorfose',            'Fotossíntese',        'Erosão',                'Digestão',         'a', 'difícil'],
    [77035, 57713, 'Complete: I ___ a student.',                'am',                     'is',                  'are',                   'be',               'a', 'fácil'],
    [78001, 57713, 'Como se diz olá em inglês?',                'Hello',                  'Hola',                'Bonjour',               'Ciao',             'a', 'fácil'],
    [79002, 57713, 'O que significa book em português?',        'Livro',                  'Mesa',                'Casa',                  'Carro',            'a', 'médio'],
    [79003, 57713, 'Qual expressão significa bom dia?',         'Good morning',           'Good evening',        'Good night',            'Bye bye',          'a', 'médio'],
    [79004, 57713, 'Complete: I ___ football every weekend.',   'play',                   'plays',               'played',                'playing',          'a', 'difícil'],
    [13579, 76326, 'Quem foi o 1º presidente do Brasil?',       'Getúlio Vargas',         'Deodoro da Fonseca',  'Juscelino Kubitschek',  'Dom Pedro II',     'b', 'médio'],
    [80001, 76326, 'Quem descobriu o Brasil em 1500?',          'Pedro Álvares Cabral',   'Cristóvão Colombo',   'Vasco da Gama',         'Fernão de Magalhães','a','fácil'],
    [81002, 76326, 'Principal atividade econômica colonial?',   'Cana-de-açúcar',         'Ouro',                'Café',                  'Soja',             'a', 'médio'],
    [82003, 76326, 'Quem foi Tiradentes?',                     'Líder da Inconfidência', 'Imperador do Brasil', 'Rei de Portugal',       'Governador de SP', 'a', 'médio'],
    [83004, 76326, 'Ano da Independência do Brasil?',         '1822',                   '1808',                '1889',                  '1815',             'a', 'difícil'],
    [96514, 98743, 'Maior país da América do Sul?',            'Argentina',              'Chile',               'Brasil',                'Peru',             'c', 'fácil'],
    [84001, 98743, 'Qual continente abriga o Brasil?',          'América do Sul',         'África',              'Ásia',                  'Europa',           'a', 'fácil'],
    [85002, 98743, 'Qual rio fica no Brasil?',                 'Amazonas',               'Nilo',                'Mississippi',           'Danúbio',          'a', 'médio'],
    [86003, 98743, 'Clima do sertão nordestino?',             'Semiárido',              'Tropical',            'Equatorial',            'Temperado',        'a', 'médio'],
    [87004, 98743, 'A Linha do Equador divide em:',           'Norte e Sul',            'Leste e Oeste',       'Norte e Leste',         'Sul e Oeste',      'a', 'difícil'],
    [88001, 34512, 'Para misturar tintas usa-se:',             'Pincel',                 'Furadeira',           'Serra',                 'Ralador',          'a', 'fácil'],
    [89002, 34512, 'A Mona Lisa foi pintada por:',             'Leonardo da Vinci',      'Pablo Picasso',       'Vincent van Gogh',      'Michelangelo',     'a', 'médio'],
    [90003, 34512, 'O que é perspectiva em desenho?',           'Técnica para profundidade','Tipo de tinta',     'Forma de cortar papel', 'Nome de pintura',  'a', 'difícil'],

    [100001, 82211, 'Qual é o resultado da expressão 15 + 3 × 4 - 8?', '64', '19', '27', '11', 'b', 'médio'],
    [100002, 82211, 'Uma pizza foi dividida em 8 pedaços iguais. João comeu 3 pedaços e Maria comeu 2. Qual fração da pizza sobrou?', '5/8', '3/8', '1/8', '4/8', 'b', 'médio'],
    [100003, 82211, 'Se um produto custa R$ 200,00 e recebe um desconto de 15%, qual será o seu novo valor?', 'R$ 185,00', 'R$ 170,00', 'R$ 150,00', 'R$ 180,00', 'b', 'médio'],
    [100004, 82211, 'Qual é o perímetro de um campo de futebol retangular que possui 90 metros de comprimento e 45 metros de largura?', '135 m', '270 m', '4050 m', '315 m', 'b', 'médio'],
    [100005, 82211, 'O Mínimo Múltiplo Comum (MMC) entre os números 12 e 15 é:', '30', '45', '60', '180', 'c', 'médio'],
    [100006, 82211, 'Resolva a equação do 1º grau: 3x - 5 = 10. O valor de x é:', '5', '15', '3', '4', 'a', 'médio'],
    [100007, 82211, 'Em uma sala de aula com 40 alunos, 60% são meninas. Quantos meninos há na sala?', '24', '16', '20', '14', 'b', 'médio'],
    [100008, 82211, 'Se 4 cadernos custam R$ 32,00, quanto custarão 7 cadernos iguais a esses?', 'R$ 56,00', 'R$ 48,00', 'R$ 64,00', 'R$ 42,00', 'a', 'médio'],
    [100009, 82211, 'Qual é a área de um quadrado cujo lado mede 8 cm?', '16 cm²', '32 cm²', '64 cm²', '80 cm²', 'c', 'médio'],
    [100010, 82211, 'Ao lançar um dado comum (de 1 a 6), qual é a probabilidade de cair um número par?', '1/6', '1/3', '1/4', '1/2', 'd', 'médio'],
    [100011, 82211, 'Resolva a equação do 2º grau: x² - 5x + 6 = 0. As raízes são:', '-2 e -3', '2 e 3', '-1 e 6', '1 e 5', 'b', 'difícil'],
    [100012, 82211, 'Em um estacionamento há carros e motos, totalizando 30 veículos e 82 rodas. Quantos carros e motos há, respectivamente?', '11 carros e 19 motos', '20 carros e 10 motos', '15 carros e 15 motos', '19 carros e 11 motos', 'a', 'difícil'],
    [100013, 82211, 'Um capital de R$ 2.000,00 é aplicado a juros simples com taxa de 3% ao mês. Qual será o montante após 5 meses?', 'R$ 2.150,00', 'R$ 2.300,00', 'R$ 2.600,00', 'R$ 3.000,00', 'b', 'difícil'],
    [100014, 82211, 'Uma máquina produz 100 peças em 2 horas. Quantas máquinas iguais a essa são necessárias para produzir 300 peças em 1 hora?', '3', '4', '5', '6', 'd', 'difícil'],
    [100015, 82211, 'Qual é a área de um círculo cujo raio mede 5 cm? (Considere π = 3,14)', '31,4 cm²', '78,5 cm²', '15,7 cm²', '100 cm²', 'b', 'difícil'],
    [100016, 82211, 'Em um triângulo retângulo, os catetos medem 6 cm e 8 cm. Qual é a medida da hipotenusa?', '10 cm', '12 cm', '14 cm', '100 cm', 'a', 'difícil'],
    [100017, 82211, 'Uma loja aumenta o preço de uma TV em 20%. No mês seguinte, faz uma promoção dando 20% de desconto sobre o novo preço. Em relação ao preço original, a TV ficou:', 'Com o mesmo preço', '4% mais barata', '4% mais cara', '2% mais barata', 'b', 'difícil'],
    [100018, 82211, 'O valor da expressão [√(81) + (2³) - (5²)] é:', '-8', '2', '-6', '8', 'a', 'difícil'],
    [100019, 82211, 'Lançando-se duas moedas simultaneamente, qual a probabilidade de saírem duas caras?', '50%', '25%', '75%', '33,3%', 'b', 'difícil'],
    [100020, 82211, 'A média das idades de um grupo de 4 pessoas é 25 anos. Se uma pessoa de 35 anos entrar no grupo, a nova média passará a ser:', '26', '27', '28', '30', 'b', 'difícil'],
    [100021, 57713, 'Choose the correct form of the verb to be: "She _____ my best friend."', 'am', 'is', 'are', 'be', 'b', 'médio'],
    [100022, 57713, 'What is the plural of the word "child"?', 'childs', 'children', 'childrens', 'childes', 'b', 'médio'],
    [100023, 57713, 'Complete the sentence: "I usually get up _____ 7 o\'clock."', 'in', 'on', 'at', 'to', 'c', 'médio'],
    [100024, 57713, 'Choose the correct negative form: "He plays soccer."', 'He not plays soccer.', 'He don\'t plays soccer.', 'He doesn\'t play soccer.', 'He doesn\'t plays soccer.', 'c', 'médio'],
    [100025, 57713, 'Which word indicates a color?', 'Table', 'Yellow', 'Window', 'Apple', 'b', 'médio'],
    [100026, 57713, 'What is the correct translation for "cachorro" and "gato"?', 'Dog / Cat', 'Bird / Fish', 'Mouse / Horse', 'Cat / Dog', 'a', 'médio'],
    [100027, 57713, '"_____ is your name?" - "My name is John."', 'How', 'Where', 'Who', 'What', 'd', 'médio'],
    [100028, 57713, 'Complete with the Present Continuous: "They _____ a book right now."', 'is reading', 'read', 'are reading', 'reading', 'c', 'médio'],
    [100029, 57713, 'Choose the correct possessive adjective: "We have a car. _____ car is blue."', 'His', 'Their', 'Our', 'My', 'c', 'médio'],
    [100030, 57713, 'What is the past simple of the regular verb "work"?', 'works', 'working', 'work', 'worked', 'd', 'médio'],
    [100031, 57713, 'What is the past simple of the irregular verb "go"?', 'goed', 'gone', 'went', 'going', 'c', 'difícil'],
    [100032, 57713, 'Complete with the Present Perfect: "She _____ to Paris many times."', 'has been', 'have been', 'goes', 'went', 'a', 'difícil'],
    [100033, 57713, 'Choose the correct option for the First Conditional: "If it rains tomorrow, we _____ at home."', 'stayed', 'will stay', 'would stay', 'stays', 'b', 'difícil'],
    [100034, 57713, 'Identify the Passive Voice sentence:', 'The dog bit the boy.', 'The boy is eating an apple.', 'The cake was made by Mary.', 'Mary makes beautiful cakes.', 'c', 'difícil'],
    [100035, 57713, 'Complete with the relative pronoun: "The man _____ lives next door is a doctor."', 'which', 'who', 'whom', 'whose', 'b', 'difícil'],
    [100036, 57713, 'What does the phrasal verb "give up" mean?', 'Continue', 'Start', 'Quit / Stop trying', 'Go up', 'c', 'difícil'],
    [100037, 57713, 'The word "pretend" is a false cognate. What does it actually mean in Portuguese?', 'Pretender', 'Fingir', 'Entender', 'Participar', 'b', 'difícil'],
    [100038, 57713, 'What is the superlative form of the adjective "good"?', 'gooder', 'the goodest', 'better', 'the best', 'd', 'difícil'],
    [100039, 57713, 'Complete the Tag Question: "You are a student, _____?"', 'are you', 'aren\'t you', 'don\'t you', 'isn\'t it', 'b', 'difícil'],
    [100040, 57713, 'Which modal verb is used to express strong obligation?', 'might', 'could', 'must', 'may', 'c', 'difícil'],
    [100041, 34512, 'Quais são as cores primárias?', 'Verde, Laranja e Roxo', 'Azul, Amarelo e Vermelho', 'Branco, Preto e Cinza', 'Rosa, Marrom e Azul', 'b', 'médio'],
    [100042, 34512, 'Misturando a cor amarela com a cor vermelha, obtemos qual cor secundária?', 'Verde', 'Roxo', 'Laranja', 'Marrom', 'c', 'médio'],
    [100043, 34512, 'Qual famosa artista brasileira pintou o quadro "Abaporu"?', 'Anita Malfatti', 'Tarsila do Amaral', 'Frida Kahlo', 'Lygia Clark', 'b', 'médio'],
    [100044, 34512, 'O ritmo, a melodia e a harmonia são os três elementos fundamentais de qual manifestação artística?', 'Teatro', 'Escultura', 'Fotografia', 'Música', 'd', 'médio'],
    [100045, 34512, 'Como é chamada a arte feita pelos homens pré-históricos nas paredes das cavernas?', 'Arte Moderna', 'Arte Gótica', 'Arte Rupestre', 'Arte Clássica', 'c', 'médio'],
    [100046, 34512, 'Na Grécia Antiga, o teatro foi dividido inicialmente em dois gêneros principais. Quais eram?', 'Drama e Terror', 'Comédia e Tragédia', 'Romance e Ação', 'Musical e Monólogo', 'b', 'médio'],
    [100047, 34512, 'O Bumba meu boi, o Frevo e o Maracatu fazem parte de qual universo cultural?', 'Arte Contemporânea', 'Folclore e Cultura Popular Brasileira', 'Arte Renascentista', 'Cultura Europeia', 'b', 'médio'],
    [100048, 34512, 'Romero Britto é um artista brasileiro muito conhecido. Qual característica marca o seu trabalho?', 'Pinturas hiper-realistas e em preto e branco.', 'Uso de cores vibrantes e padrões geométricos.', 'Esculturas feitas apenas com sucata.', 'Uso de tintas a óleo escuras para retratar o sofrimento.', 'b', 'médio'],
    [100049, 34512, 'O origami é uma arte tradicional de qual país?', 'China', 'Índia', 'Japão', 'Egito', 'c', 'médio'],
    [100050, 34512, 'Qual instrumento musical abaixo pertence à família das cordas?', 'Bateria', 'Flauta', 'Violino', 'Trompete', 'c', 'médio'],
    [100051, 34512, 'Qual artista do Renascimento pintou a obra "Monalisa" e "A Última Ceia"?', 'Michelangelo', 'Donatello', 'Rafael Sanzio', 'Leonardo da Vinci', 'd', 'difícil'],
    [100052, 34512, 'O Impressionismo foi um movimento artístico que focava muito em capturar:', 'A precisão anatômica dos corpos.', 'Os efeitos da luz solar sobre os objetos em diferentes horas do dia.', 'A geometria e a quebra da perspectiva tradicional.', 'Cenas de guerras históricas.', 'b', 'difícil'],
    [100053, 34512, 'Pablo Picasso e Georges Braque foram os fundadores de qual movimento de vanguarda europeia?', 'Cubismo', 'Surrealismo', 'Expressionismo', 'Fauvismo', 'a', 'difícil'],
    [100054, 34512, 'Qual evento ocorrido no Theatro Municipal de São Paulo marcou o início do Modernismo no Brasil?', 'Exposição Nacional de Belas Artes de 1908', 'Semana de Arte Moderna de 1922', 'Bienal de São Paulo de 1951', 'Tropicália de 1967', 'b', 'difícil'],
    [100055, 34512, 'Antônio Francisco Lisboa, o Aleijadinho, foi o maior expoente de qual estilo artístico no Brasil colônia?', 'Barroco Mineiro', 'Neoclassicismo', 'Romantismo', 'Rococó Francês', 'a', 'difícil'],
    [100056, 34512, 'Andy Warhol e Roy Lichtenstein utilizaram símbolos da cultura de massa (embalagens, histórias em quadrinhos) em qual movimento?', 'Dadaísmo', 'Minimalismo', 'Pop Art', 'Arte Conceitual', 'c', 'difícil'],
    [100057, 34512, 'A obra "A Persistência da Memória", conhecida pelos "relógios derretidos", pertence a qual artista surrealista?', 'René Magritte', 'Salvador Dalí', 'Joan Miró', 'Vincent van Gogh', 'b', 'difícil'],
    [100058, 34512, 'O "Auto da Barca do Inferno" é uma obra teatral de Gil Vicente que se insere no contexto de transição entre:', 'Idade Antiga e Idade Média', 'Classicismo e Romantismo', 'Idade Média e Renascimento (Humanismo)', 'Barroco e Arcadismo', 'c', 'difícil'],
    [100059, 34512, 'Qual compositor é o maior representante da fase final da música Barroca?', 'Wolfgang Amadeus Mozart', 'Johann Sebastian Bach', 'Ludwig van Beethoven', 'Frédéric Chopin', 'b', 'difícil'],
    [100060, 34512, 'O Expressionismo procurava retratar os sentimentos e angústias humanas. Qual obra abaixo é um ícone desse movimento?', 'A Criação de Adão, de Michelangelo', 'O Grito, de Edvard Munch', 'Guernica, de Picasso', 'Os Girassóis, de Van Gogh', 'b', 'difícil'],
    [100061, 76326, 'Em que ano os portugueses, liderados por Pedro Álvares Cabral, chegaram ao Brasil?', '1492', '1500', '1532', '1822', 'b', 'médio'],
    [100062, 76326, 'Para iniciar a colonização, o rei de Portugal dividiu o Brasil em grandes faixas de terra. Como elas eram chamadas?', 'Províncias Imperiais', 'Estados Federativos', 'Capitanias Hereditárias', 'Sesmarias Livres', 'c', 'médio'],
    [100063, 76326, 'Qual data marca a Independência do Brasil?', '7 de setembro', '15 de novembro', '21 de abril', '1º de maio', 'a', 'médio'],
    [100064, 76326, 'Zumbi foi um importante líder histórico no Brasil. Ele liderou o maior refúgio de escravizados, chamado:', 'Quilombo de Canudos', 'Quilombo dos Palmares', 'Revolta dos Malês', 'Cabanagem', 'b', 'médio'],
    [100065, 76326, 'Os faraós e as pirâmides são símbolos históricos de qual civilização da Antiguidade?', 'Fenícios', 'Mesopotâmia', 'Grécia Antiga', 'Egito Antigo', 'd', 'médio'],
    [100066, 76326, 'A cidade de Atenas, na Grécia Antiga, é considerada o berço da:', 'Democracia', 'República', 'Ditadura', 'Monarquia Absolutista', 'a', 'médio'],
    [100067, 76326, 'Qual sistema político e econômico predominou na Europa durante a Idade Média, baseado na relação entre senhores e servos?', 'Capitalismo', 'Socialismo', 'Feudalismo', 'Mercantilismo', 'c', 'médio'],
    [100068, 76326, 'Joaquim José da Silva Xavier, o Tiradentes, foi o principal mártir de qual movimento revoltoso no Brasil?', 'Revolução Farroupilha', 'Inconfidência Mineira', 'Conjuração Baiana', 'Guerra de Canudos', 'b', 'médio'],
    [100069, 76326, 'Quem foi o primeiro imperador do Brasil?', 'D. João VI', 'Princesa Isabel', 'D. Pedro II', 'D. Pedro I', 'd', 'médio'],
    [100070, 76326, 'Em 15 de novembro de 1889, Marechal Deodoro da Fonseca liderou um golpe que resultou na:', 'Abolição da Escravatura', 'Independência do Brasil', 'Proclamação da República', 'Descoberta do Ouro', 'c', 'médio'],
    [100071, 76326, 'A "Queda da Bastilha" em 1789 é o marco inicial de qual grande revolução?', 'Revolução Inglesa', 'Revolução Francesa', 'Revolução Americana', 'Revolução Industrial', 'b', 'difícil'],
    [100072, 76326, 'O assassinato do Arquiduque Francisco Ferdinando foi o estopim para o início de qual conflito?', 'Guerra Fria', 'Guerra dos Cem Anos', 'Segunda Guerra Mundial', 'Primeira Guerra Mundial', 'd', 'difícil'],
    [100073, 76326, 'Na Segunda Guerra Mundial, o "Eixo" era formado por quais países?', 'Estados Unidos, União Soviética e Inglaterra', 'Alemanha, Itália e Japão', 'França, Polônia e Bélgica', 'China, Coreia e Vietnã', 'b', 'difícil'],
    [100074, 76326, 'O período de tensão política, militar e ideológica que dividiu o mundo entre o Capitalismo (EUA) e o Socialismo (URSS) chamou-se:', 'Era Napoleônica', 'Imperialismo', 'Guerra Fria', 'Globalização', 'c', 'difícil'],
    [100075, 76326, 'O "Estado Novo" (1937-1945) foi um período ditatorial no Brasil liderado por:', 'Juscelino Kubitschek', 'Castelo Branco', 'Getúlio Vargas', 'João Goulart', 'c', 'difícil'],
    [100076, 76326, 'Durante a Ditadura Militar Brasileira, o decreto mais duro, que fechou o Congresso e cassou direitos políticos, foi o:', 'AI-1', 'AI-2', 'AI-5', 'Constituição de 1967', 'c', 'difícil'],
    [100077, 76326, 'A Revolução Industrial, que substituiu a manufatura pela maquinofatura, teve início no século XVIII em qual país?', 'França', 'Alemanha', 'Estados Unidos', 'Inglaterra', 'd', 'difícil'],
    [100078, 76326, 'O Iluminismo foi um movimento intelectual do século XVIII que defendia:', 'O absolutismo dos reis e o poder da Igreja.', 'A razão, a liberdade e o fim dos privilégios da nobreza.', 'O retorno às crenças da Idade Média.', 'A exploração das colônias sem questionamentos.', 'b', 'difícil'],
    [100079, 76326, 'Em 1917, uma revolução derrubou o regime dos Czares e implantou o primeiro estado socialista da história na:', 'China', 'Cuba', 'Rússia', 'Alemanha', 'c', 'difícil'],
    [100080, 76326, 'No Brasil Colonial, o Ciclo do Ouro no século XVIII teve como principal consequência:', 'O esvaziamento das regiões Centro-Sul do país.', 'A independência imediata de Portugal.', 'O deslocamento do eixo econômico e populacional do Nordeste para o Sudeste (Minas Gerais).', 'A abolição do trabalho escravo nas minas.', 'c', 'difícil'],
    [100081, 98743, 'O movimento que a Terra faz girando em torno de si mesma e que dura aproximadamente 24 horas é a:', 'Translação', 'Rotação', 'Precessão', 'Nutação', 'b', 'médio'],
    [100082, 98743, 'Quais são os quatro pontos cardeais?', 'Nordeste, Noroeste, Sudeste e Sudoeste', 'Norte, Sul, Leste e Oeste', 'Alto, Baixo, Esquerda e Direita', 'Trópico, Equador, Meridiano e Polo', 'b', 'médio'],
    [100083, 98743, 'Qual é o maior bioma do Brasil, conhecido pela sua imensa biodiversidade e floresta densa?', 'Cerrado', 'Caatinga', 'Pantanal', 'Amazônia', 'd', 'médio'],
    [100084, 98743, 'O clima predominante no semiárido nordestino e o bioma que o acompanha é a:', 'Mata Atlântica', 'Caatinga', 'Pampas', 'Floresta de Araucárias', 'b', 'médio'],
    [100085, 98743, 'O Brasil está localizado em qual continente?', 'Europa', 'África', 'América', 'Ásia', 'c', 'médio'],
    [100086, 98743, 'Qual é a atual capital do Brasil, inaugurada em 1960?', 'Rio de Janeiro', 'Salvador', 'São Paulo', 'Brasília', 'd', 'médio'],
    [100087, 98743, 'O Trópico de Capricórnio corta quais estados do Brasil?', 'Amazonas, Pará e Amapá', 'São Paulo, Paraná e Mato Grosso do Sul', 'Bahia, Sergipe e Alagoas', 'Rio Grande do Sul e Santa Catarina', 'b', 'médio'],
    [100088, 98743, 'Qual é a maior bacia hidrográfica do mundo em volume de água, localizada em parte no Brasil?', 'Bacia do Paraná', 'Bacia do São Francisco', 'Bacia do Tocantins-Araguaia', 'Bacia Amazônica', 'd', 'médio'],
    [100089, 98743, 'Segundo o IBGE, o Brasil é dividido em quantas grandes regiões?', '3', '4', '5', '6', 'c', 'médio'],
    [100090, 98743, 'Qual o nome do instituto brasileiro responsável pela contagem da população (Censo) e estatísticas do país?', 'FUNAI', 'IBAMA', 'INPE', 'IBGE', 'd', 'médio'],
    [100091, 98743, 'As linhas imaginárias horizontais e verticais que cruzam o globo e ajudam a localizar qualquer ponto na Terra são, respectivamente:', 'Meridianos e Paralelos', 'Equador e Trópicos', 'Paralelos e Meridianos', 'Fusos e Zonas', 'c', 'difícil'],
    [100092, 98743, 'O Meridiano de Greenwich divide a Terra em dois hemisférios:', 'Norte e Sul', 'Ocidental (Oeste) e Oriental (Leste)', 'Continental e Marítimo', 'Tropical e Polar', 'b', 'difícil'],
    [100093, 98743, 'O processo de integração econômica, cultural e política mundial, acelerado pela tecnologia da informação e transportes, chama-se:', 'Urbanização', 'Globalização', 'Favelização', 'Segregação Espacial', 'b', 'difícil'],
    [100094, 98743, 'O Mercosul é um bloco econômico formado originalmente por quais países?', 'Brasil, EUA, México e Canadá', 'Brasil, Argentina, Paraguai e Uruguai', 'Brasil, Chile, Bolívia e Peru', 'Brasil, Colômbia, Equador e Venezuela', 'b', 'difícil'],
    [100095, 98743, 'O movimento migratório de saída de pessoas do campo (área rural) para viver nas cidades (área urbana) é denominado:', 'Transumância', 'Movimento Pendular', 'Êxodo Rural', 'Diáspora', 'c', 'difícil'],
    [100096, 98743, 'A estrutura geológica do Brasil é antiga e não possui dobramentos modernos. Ela é formada basicamente por:', 'Vulcões ativos e falhas tectônicas.', 'Escudos Cristalinos e Bacias Sedimentares.', 'Cordilheiras e Geleiras.', 'Fossas abissais e dorsais.', 'b', 'difícil'],
    [100097, 98743, 'O fenômeno climático urbano em que a temperatura dos centros das cidades é maior do que a das áreas periféricas devido ao asfalto e concreto é chamado de:', 'Efeito Estufa', 'Inversão Térmica', 'Chuva Ácida', 'Ilha de Calor', 'd', 'difícil'],
    [100098, 98743, 'O fenômeno da "Transição Demográfica" no Brasil atual indica que:', 'A taxa de natalidade e a expectativa de vida estão caindo.', 'A população está ficando mais jovem.', 'A taxa de fecundidade está caindo e a população está envelhecendo.', 'As taxas de mortalidade infantil estão aumentando.', 'c', 'difícil'],
    [100099, 98743, 'Qual bloco econômico adotou uma moeda única (o Euro) para a maioria de seus países membros?', 'NAFTA (USMCA)', 'BRICS', 'União Europeia', 'APEC', 'c', 'difícil'],
    [100100, 98743, 'Se um mapa apresenta escala de 1:1.000.000, significa que 1 cm no mapa equivale, na realidade, a:', '1 quilômetro', '10 quilômetros', '100 quilômetros', '1000 quilômetros', 'b', 'difícil'],
    [100101, 90021, 'A mudança do estado líquido para o gasoso recebe o nome de:', 'Fusão', 'Solidificação', 'Condensação', 'Vaporização', 'd', 'médio'],
    [100102, 90021, 'O processo pelo qual as plantas utilizam a luz solar, água e gás carbônico para produzir seu alimento é a:', 'Respiração Celular', 'Fotossíntese', 'Fermentação', 'Digestão', 'b', 'médio'],
    [100103, 90021, 'Qual é o maior planeta do nosso Sistema Solar?', 'Terra', 'Marte', 'Saturno', 'Júpiter', 'd', 'médio'],
    [100104, 90021, 'Quais são os vasos sanguíneos responsáveis por levar o sangue do coração para o restante do corpo?', 'Veias', 'Capilares', 'Artérias', 'Brônquios', 'c', 'médio'],
    [100105, 90021, 'Qual gás é indispensável para a respiração da maioria dos seres vivos e é absorvido pelos pulmões?', 'Gás Carbônico', 'Gás Oxigênio', 'Gás Nitrogênio', 'Gás Hélio', 'b', 'médio'],
    [100106, 90021, 'Os animais que possuem coluna vertebral são classificados como:', 'Invertebrados', 'Pluricelulares', 'Vertebrados', 'Unicelulares', 'c', 'médio'],
    [100107, 90021, 'Os seres vivos que produzem o próprio alimento em uma cadeia alimentar (como as plantas) são chamados de:', 'Consumidores Primários', 'Decompositores', 'Produtores', 'Consumidores Secundários', 'c', 'médio'],
    [100108, 90021, 'Qual é o órgão do corpo humano responsável pelo bombeamento de sangue?', 'Pulmão', 'Estômago', 'Cérebro', 'Coração', 'd', 'médio'],
    [100109, 90021, 'Animais como o cão, o gato e o ser humano, que mamam quando filhotes e possuem pelos, são:', 'Répteis', 'Anfíbios', 'Mamíferos', 'Aves', 'c', 'médio'],
    [100110, 90021, 'Qual dos sentidos está diretamente relacionado ao órgão do olfato?', 'Visão', 'Audição', 'Cheiro/Olfato (Nariz)', 'Paladar (Língua)', 'c', 'médio'],
    [100111, 90021, 'As células que não possuem núcleo organizado (o material genético fica disperso no citoplasma), como as bactérias, são chamadas de:', 'Eucariontes', 'Procariontes', 'Somáticas', 'Gaméticas', 'b', 'difícil'],
    [100112, 90021, 'Quem é considerado o "Pai da Genética" pelos seus estudos com ervilhas, descobrindo as leis da hereditariedade?', 'Charles Darwin', 'Gregor Mendel', 'Louis Pasteur', 'Albert Einstein', 'b', 'difícil'],
    [100113, 90021, 'O naturalista Charles Darwin formulou a base da Teoria da Evolução, baseada no conceito de:', 'Lei do Uso e Desuso', 'Seleção Natural', 'Geração Espontânea', 'Criacionismo', 'b', 'difícil'],
    [100114, 90021, 'Em uma relação ecológica onde duas espécies se associam com benefício mútuo e dependência obrigatória para a sobrevivência (ex: líquens), temos um caso de:', 'Parasitismo', 'Comensalismo', 'Predatismo', 'Mutualismo', 'd', 'difícil'],
    [100115, 90021, 'O átomo é formado por partículas subatômicas. As partículas com carga elétrica positiva são os:', 'Elétrons', 'Nêutrons', 'Prótons', 'Fótons', 'c', 'difícil'],
    [100116, 90021, 'A 1ª Lei de Newton afirma que um corpo em repouso ou em movimento retilíneo uniforme tende a manter seu estado a menos que uma força atue sobre ele. Esta é a lei da:', 'Ação e Reação', 'Gravitação Universal', 'Inércia', 'Dinâmica', 'c', 'difícil'],
    [100117, 90021, 'Na Tabela Periódica, a grande maioria dos elementos químicos é classificada como:', 'Gases Nobres', 'Ametais', 'Halogênios', 'Metais', 'd', 'difícil'],
    [100118, 90021, 'As vacinas agem no corpo humano promovendo:', 'A cura imediata de sintomas virais.', 'A destruição de bactérias como um antibiótico.', 'A produção preventiva de anticorpos e memória imunológica.', 'O fornecimento de anticorpos já prontos contra venenos.', 'c', 'difícil'],
    [100119, 90021, 'Qual das doenças abaixo é causada por um VÍRUS?', 'Tuberculose', 'Tétano', 'Cólera', 'Dengue', 'd', 'difícil'],
    [100120, 90021, 'A energia associada ao movimento de um corpo (como um carro em velocidade) é chamada de:', 'Energia Potencial Gravitacional', 'Energia Cinética', 'Energia Térmica', 'Energia Nuclear', 'b', 'difícil'],
    [100121, 44457, 'A palavra "café" tem a última sílaba tônica, portanto é classificada como:', 'Paroxítona', 'Proparoxítona', 'Oxítona', 'Monossílaba átona', 'c', 'médio'],
    [100122, 44457, 'Qual é o substantivo coletivo de "peixes"?', 'Enxame', 'Cardume', 'Bando', 'Rebanho', 'b', 'médio'],
    [100123, 44457, 'Na frase "O menino esperto terminou a lição", a palavra "esperto" é:', 'Substantivo', 'Verbo', 'Adjetivo', 'Pronome', 'c', 'médio'],
    [100124, 44457, 'Qual par de palavras abaixo representa sinônimos?', 'Bom / Mau', 'Alegre / Feliz', 'Alto / Baixo', 'Rico / Pobre', 'b', 'médio'],
    [100125, 44457, 'A frase "Nós estudaremos amanhã" está em qual tempo verbal?', 'Presente', 'Pretérito Perfeito', 'Pretérito Imperfeito', 'Futuro do Presente', 'd', 'médio'],
    [100126, 44457, 'As palavras "chuva", "pássaro" e "carro" contêm, respectivamente, os dígrafos:', 'ch, ss, rr', 'v, p, c', 'hu, as, ar', 'Não contêm dígrafos', 'a', 'médio'],
    [100127, 44457, 'A regra geral de acentuação diz que "todas as palavras _________ são acentuadas". Complete:', 'Oxítonas', 'Paroxítonas', 'Proparoxítonas', 'Polissílabas', 'c', 'médio'],
    [100128, 44457, 'Qual sinal de pontuação é usado para indicar uma pergunta?', 'Ponto de exclamação', 'Vírgula', 'Ponto e vírgula', 'Ponto de interrogação', 'd', 'médio'],
    [100129, 44457, 'O pronome "Eu" pertence à classe dos:', 'Pronomes Possessivos', 'Pronomes Pessoais do Caso Reto', 'Pronomes Demonstrativos', 'Pronomes Indefinidos', 'b', 'médio'],
    [100130, 44457, 'Na palavra "Saguão", a união das três vogais "u-ã-o" na mesma sílaba forma um:', 'Hiato', 'Ditongo', 'Tritongo', 'Dígrafo', 'c', 'médio'],
    [100131, 44457, 'Na frase "Meu coração é um balde esvaziado", a figura de linguagem utilizada é a:', 'Metáfora', 'Símile / Comparação', 'Eufemismo', 'Hipérbole', 'a', 'difícil'],
    [100132, 44457, 'Qual alternativa indica o uso correto da crase?', 'Vou a pé para casa.', 'Entreguei o livro à aluna.', 'Começou a chover forte.', 'Estamos frente a frente.', 'b', 'difícil'],
    [100133, 44457, 'Na oração "Choveu muito ontem à noite", qual é a classificação do sujeito?', 'Sujeito Oculto', 'Sujeito Indeterminado', 'Sujeito Simples', 'Sujeito Inexistente (Oração sem sujeito)', 'd', 'difícil'],
    [100134, 44457, 'Qual frase apresenta um erro de concordância verbal?', 'Fazem dez anos que não o vejo.', 'Faz dez anos que não o vejo.', 'Haviam chegado os convidados.', 'Existiam muitas pessoas no local.', 'a', 'difícil'],
    [100135, 44457, 'Complete a frase corretamente: "Não entendi o ________ de tanta confusão. Você pode me explicar ________ estava tão nervosa?"', 'porque / porquê', 'porquê / por que', 'por que / porque', 'por quê / por que', 'b', 'difícil'],
    [100136, 44457, 'A função da linguagem cujo foco é o emissor (quem fala), expressando seus próprios sentimentos e emoções, é a:', 'Função Referencial', 'Função Fática', 'Função Emotiva ou Expressiva', 'Função Metalinguística', 'c', 'difícil'],
    [100137, 44457, 'Na frase "Precisa-se de funcionários", o sujeito é:', 'Simples', 'Oculto', 'Indeterminado', 'Composto', 'c', 'difícil'],
    [100138, 44457, 'O vício de linguagem que consiste na repetição de uma ideia de forma desnecessária (ex: "entrar para dentro") é o:', 'Pleonasmo', 'Ambiguidade', 'Eco', 'Neologismo', 'a', 'difícil'],
    [100139, 44457, 'Qual é a figura de linguagem presente em "Chorei rios de lágrimas"?', 'Eufemismo', 'Hipérbole', 'Antítese', 'Ironia', 'b', 'difícil'],
    [100140, 44457, 'A oração "É necessário que você estude" é classificada como:', 'Oração subordinada substantiva subjetiva', 'Oração subordinada adjetiva restritiva', 'Oração subordinada adverbial causal', 'Oração coordenada sindética aditiva', 'a', 'difícil'],
  ];
  for (const q of questoes) {
    await conn.run(
      `INSERT OR IGNORE INTO questao
                (cod_quest, cod_disc, enunciado, alternativa_A, alternativa_B,
                 alternativa_C, alternativa_D, alternativa_correta, dificuldade)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, q
    );
  }
  console.log(`  ✓ ${questoes.length} questões.`);

  console.log('  Inserindo conteúdos...');
  const conteudos = [
    [54411, 82211, 'Operações Básicas'],
    [66542, 82211, 'Porcentagem'],
    [77891, 82211, 'Equações do 1º grau'],
    [33478, 44457, 'Interpretação de texto'],
    [11356, 44457, 'Ortografia e Gramática'],
    [55667, 90021, 'Sistema solar'],
    [98334, 90021, 'Corpo Humano'],
    [22345, 57713, 'Verbo To Be e Simple Present'],
    [12298, 57713, 'Simple Past'],
    [91234, 76326, 'Brasil Colonial e Independência'],
    [43210, 98743, 'América do Sul e Clima brasileiro'],
    [65432, 34512, 'Técnicas artísticas e História da Arte'],
  ];
  for (const c of conteudos) {
    await conn.run(`INSERT OR IGNORE INTO conteudo (cod_conteudo, cod_disc, descricao) VALUES (?, ?, ?)`, c);
  }
  console.log(`  ✓ ${conteudos.length} conteúdos.`);

  console.log('  Inserindo histórico...');
  const historicos = [
    [121, 76554, 11154, '2024-07-14', 'Acertou'],
    [156, 43221, 26667, '2025-12-30', 'Acertou'],
    [458, 76554, 96514, '2025-06-09', 'Acertou'],
    [239, 43221, 13579, '2023-09-01', 'Errou'],
    [310, 84721, 22468, '2025-01-10', 'Acertou'],
  ];
  for (const h of historicos) {
    await conn.run(`INSERT OR IGNORE INTO historico
                (cod_resposta, cod_usuario, cod_quest, data_resposta, status)
             VALUES (?, ?, ?, ?, ?)`, h);
  }
  console.log(`  ✓ ${historicos.length} registros de histórico.`);

  console.log('  Inserindo estuda...');
  const estudas = [
    [76554, 82211, 20, '01:30:00'],
    [43221, 44457, 15, '01:00:00'],
    [43221, 90021, 25, '02:00:00'],
    [65928, 57713, 18, '01:20:00'],
    [84721, 76326, 12, '00:50:00'],
    [59384, 98743, 10, '00:45:00'],
    [21097, 34512, 14, '01:10:00'],
  ];
  for (const e of estudas) {
    await conn.run(`INSERT OR IGNORE INTO estuda
                (cod_usuario, cod_disc, meta, tempo)
             VALUES (?, ?, ?, ?)`, e);
  }
  console.log(`  ✓ ${estudas.length} registros de estuda.`);

  console.log('  Inserindo anotações...');
  const anotacoes = [
    [1001, 33441, 76554, 'Resumo de matemática', 'Anotei os principais conceitos de frações e porcentagem.', '2024-01-10'],
    [1002, 11667, 43221, 'Equações básicas',     'Resolver exercícios de primeiro grau para a prova.',       '2025-05-20'],
    [1003, 39001, 76554, 'Leis de Mendel',       'Primeira lei: segregação dos fatores hereditários.',       '2026-02-15'],
    [1004, 12785, 43221, 'Vocabulary',           'Estudar verbos irregulares em inglês.',                    '2023-05-20'],
    [1005, 55234, 84721, 'Análise sintática',    'Separar sujeito, verbo e predicado nas frases.',           '2024-03-18'],
  ];
  for (const a of anotacoes) {
    await conn.run(`INSERT OR IGNORE INTO anotacao
                (cod_anota, cod_pasta, cod_usuario, titulo, texto_anota, data_anota)
             VALUES (?, ?, ?, ?, ?, ?)`, a);
  }
  console.log(`  ✓ ${anotacoes.length} anotações.`);

  console.log('  Inserindo contem...');
  const contems = [
    [33441, 1001], [11667, 1002], [39001, 1003], [12785, 1004], [55234, 1005],
  ];
  for (const c of contems) {
    await conn.run(`INSERT OR IGNORE INTO contem (cod_pasta, cod_anota) VALUES (?, ?)`, c);
  }
  console.log(`  ✓ ${contems.length} registros em contem.`);

  console.log('  Inserindo possui...');
  const possuies = [
    [11154, 121], [26667, 156], [96514, 458], [13579, 239], [22468, 310],
  ];
  for (const p of possuies) {
    await conn.run(`INSERT OR IGNORE INTO possui (cod_quest, cod_resposta) VALUES (?, ?)`, p);
  }
  console.log(`  ✓ ${possuies.length} registros em possui.`);

  await conn.close();
  console.log('✅ Seed concluído com sucesso!');
}

runSeed().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
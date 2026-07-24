/*
  Prisma Seed

  Este arquivo insere dados iniciais usados para teste e desenvolvimento.
  O seed complementa as migrations: as migrations criam a estrutura do banco,
  e o seed popula a base com registros reais para validar rotas e o front-end.
*/

import { prisma } from '../lib/prisma.js';



async function runSeed() {
  console.log('▶ Iniciando seed...');

  console.log('  Inserindo usuários...');
  const usuarios = [
    { cod_usuario: 76554, nome: 'Ana Ferreira',    email: 'anaferreira@gmail.com', senha: 'hylu',  grau_escolar: '2° ano', data_nasc: new Date('2019-08-09'), tipo: 'aluno'          as const },
    { cod_usuario: 43221, nome: 'Pedro Torres',    email: 'pedrotorres@gmail.com', senha: 'ophj',  grau_escolar: '1° ano', data_nasc: new Date('2013-07-10'), tipo: 'aluno'          as const },
    { cod_usuario: 99530, nome: 'Walesca Amaro',   email: 'walesca@gmail.com',     senha: 'maqb',  grau_escolar: null,     data_nasc: new Date('2009-06-07'), tipo: 'administrador'  as const },
    { cod_usuario: 10267, nome: 'Rayssa Priscila', email: 'rayssa@gmail.com',      senha: 'iikjr', grau_escolar: null,     data_nasc: new Date('2009-03-29'), tipo: 'administrador'  as const },
    { cod_usuario: 84721, nome: 'Lucas Andrade',   email: 'lucas@gmail.com',       senha: 'abc1',  grau_escolar: '7° ano', data_nasc: new Date('2012-04-15'), tipo: 'aluno'          as const },
    { cod_usuario: 59384, nome: 'Marina Souza',    email: 'marina@gmail.com',      senha: 'def2',  grau_escolar: '6° ano', data_nasc: new Date('2013-09-22'), tipo: 'aluno'          as const },
    { cod_usuario: 21097, nome: 'Carlos Henrique', email: 'carlos@gmail.com',      senha: 'ghi3',  grau_escolar: '4° ano', data_nasc: new Date('2009-11-30'), tipo: 'aluno'          as const },
    { cod_usuario: 77652, nome: 'Juliana Lima',    email: 'juliana@gmail.com',     senha: 'jkl4',  grau_escolar: '3° ano', data_nasc: new Date('2011-01-08'), tipo: 'aluno'          as const },
    { cod_usuario: 43890, nome: 'Bruno Martins',   email: 'bruno@gmail.com',       senha: 'mno5',  grau_escolar: '9° ano', data_nasc: new Date('2010-05-18'), tipo: 'aluno'          as const },
    { cod_usuario: 65928, nome: 'Fernanda Alves',  email: 'fernanda@gmail.com',    senha: 'fna1',  grau_escolar: '8° ano', data_nasc: new Date('2011-07-25'), tipo: 'aluno'          as const },
  ];
  for (const u of usuarios) {
    await prisma.usuario.upsert({
      where:  { cod_usuario: u.cod_usuario },
      update: {},
      create: u,
    });
  }
  console.log(`  ✓ ${usuarios.length} usuários.`);

  console.log('  Inserindo disciplinas...');
  const disciplinas = [
    { cod_disc: 82211, nome_disc: 'Matemática' },
    { cod_disc: 44457, nome_disc: 'Português'  },
    { cod_disc: 90021, nome_disc: 'Ciências'   },
    { cod_disc: 57713, nome_disc: 'Inglês'     },
    { cod_disc: 76326, nome_disc: 'História'   },
    { cod_disc: 98743, nome_disc: 'Geografia'  },
    { cod_disc: 34512, nome_disc: 'Artes'      },
  ];
  for (const d of disciplinas) {
    await prisma.disciplina.upsert({
      where:  { cod_disc: d.cod_disc },
      update: {},
      create: d,
    });
  }
  console.log(`  ✓ ${disciplinas.length} disciplinas.`);

  console.log('  Inserindo suporte...');
  const suportes = [
    { cod_suporte: 11456, email: 'anaferreira@gmail.com', tipo_problema: 'Dúvidas', descricao: 'Não entendi como funciona o sistema de metas'  },
    { cod_suporte: 78231, email: 'pedrotorres@gmail.com', tipo_problema: 'Erros',   descricao: 'A página de exercícios não carrega'             },
    { cod_suporte: 45987, email: 'lucas@gmail.com',       tipo_problema: 'Dúvidas', descricao: 'Como selecionar disciplinas para estudar?'      },
    { cod_suporte: 90321, email: 'marina@gmail.com',      tipo_problema: 'Outros',  descricao: 'Sugestão de adicionar mais exercícios'          },
    { cod_suporte: 66745, email: 'juliana@gmail.com',     tipo_problema: 'Erros',   descricao: 'Erro ao salvar anotação'                        },
  ];
  for (const s of suportes) {
    await prisma.suporte.upsert({
      where:  { cod_suporte: s.cod_suporte },
      update: {},
      create: s,
    });
  }
  console.log(`  ✓ ${suportes.length} registros de suporte.`);

  console.log('  Inserindo relatórios...');
  const relatorios = [
    { cod_relatorio: 84521, meta: 10, total_acertos: 8,  percentual_acertos: 80, pontos_fortes: 'Identificação de frações equivalentes',    areas_melhorias: 'Resolução de operações com frações'  },
    { cod_relatorio: 19347, meta: 15, total_acertos: 9,  percentual_acertos: 60, pontos_fortes: 'Reconhecimento de regência verbal',        areas_melhorias: 'Aplicação correta em frases'          },
    { cod_relatorio: 67230, meta: 20, total_acertos: 17, percentual_acertos: 85, pontos_fortes: 'Uso do Simple Past em frases afirmativas', areas_melhorias: 'Formação de frases negativas'         },
  ];
  for (const r of relatorios) {
    await prisma.relatorio.upsert({
      where:  { cod_relatorio: r.cod_relatorio },
      update: {},
      create: r,
    });
  }
  console.log(`  ✓ ${relatorios.length} relatórios.`);

  console.log('  Inserindo pastas...');
  const pastas = [
    { cod_pasta: 33441, cod_usuario: 76554, data_criacao: new Date('2023-12-06'), nome_pasta: 'minha_anot'     },
    { cod_pasta: 11667, cod_usuario: 43221, data_criacao: new Date('2025-05-13'), nome_pasta: 'anot_mat'       },
    { cod_pasta: 39001, cod_usuario: 76554, data_criacao: new Date('2026-02-10'), nome_pasta: 'anot_mendel'    },
    { cod_pasta: 12785, cod_usuario: 43221, data_criacao: new Date('2023-05-16'), nome_pasta: 'english_anot'   },
    { cod_pasta: 55234, cod_usuario: 84721, data_criacao: new Date('2024-03-12'), nome_pasta: 'anot_portugues' },
  ];
  for (const p of pastas) {
    await prisma.pasta.upsert({
      where:  { cod_pasta: p.cod_pasta },
      update: {},
      create: p,
    });
  }
  console.log(`  ✓ ${pastas.length} pastas.`);

  console.log('  Inserindo questões...');
  const questoes = [
    { cod_quest: 11154, cod_disc: 82211, enunciado: 'Quanto é 8 + 7?',                          alternativa_A: '13',                     alternativa_B: '14',                   alternativa_C: '15',                     alternativa_D: '16',                alternativa_correta: 'c', dificuldade: 'fácil'   },
    { cod_quest: 22468, cod_disc: 82211, enunciado: 'Quanto é 50% de 200?',                     alternativa_A: '50',                     alternativa_B: '100',                  alternativa_C: '150',                    alternativa_D: '200',               alternativa_correta: 'b', dificuldade: 'fácil'   },
    { cod_quest: 33791, cod_disc: 82211, enunciado: 'Resolva: x + 3 = 7',                       alternativa_A: '2',                      alternativa_B: '3',                    alternativa_C: '4',                      alternativa_D: '5',                 alternativa_correta: 'c', dificuldade: 'fácil'   },
    { cod_quest: 34001, cod_disc: 82211, enunciado: 'Qual é a fração equivalente a 0,75?',      alternativa_A: '3/4',                    alternativa_B: '7/10',                 alternativa_C: '1/2',                    alternativa_D: '2/3',               alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 35002, cod_disc: 82211, enunciado: 'Qual o resultado de 12 × 3?',              alternativa_A: '36',                     alternativa_B: '30',                   alternativa_C: '24',                     alternativa_D: '32',                alternativa_correta: 'a', dificuldade: 'fácil'   },
    { cod_quest: 36003, cod_disc: 82211, enunciado: 'Qual é o valor de 5² + 3³?',               alternativa_A: '52',                     alternativa_B: '34',                   alternativa_C: '45',                     alternativa_D: '35',                alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 26667, cod_disc: 44457, enunciado: 'Qual palavra está escrita corretamente?',   alternativa_A: 'Excessão',               alternativa_B: 'Exceção',              alternativa_C: 'Excesssão',              alternativa_D: 'Exeção',            alternativa_correta: 'b', dificuldade: 'médio'   },
    { cod_quest: 44902, cod_disc: 44457, enunciado: 'Qual alternativa tem erro de ortografia?',  alternativa_A: 'Casa',                   alternativa_B: 'Mesa',                 alternativa_C: 'Caza',                   alternativa_D: 'Livro',             alternativa_correta: 'c', dificuldade: 'fácil'   },
    { cod_quest: 55813, cod_disc: 44457, enunciado: '"O menino correu." Isso é um exemplo de:', alternativa_A: 'Frase nominal',          alternativa_B: 'Frase verbal',         alternativa_C: 'Interjeição',            alternativa_D: 'Pergunta',          alternativa_correta: 'b', dificuldade: 'médio'   },
    { cod_quest: 46001, cod_disc: 44457, enunciado: 'Qual é o plural de cidadão?',               alternativa_A: 'Cidadãos',               alternativa_B: 'Cidadaos',             alternativa_C: 'Cidadães',               alternativa_D: 'Cidadãoss',         alternativa_correta: 'a', dificuldade: 'fácil'   },
    { cod_quest: 47002, cod_disc: 44457, enunciado: 'Qual classe gramatical é rápido?',          alternativa_A: 'Adjetivo',               alternativa_B: 'Substantivo',          alternativa_C: 'Verbo',                  alternativa_D: 'Advérbio',          alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 48003, cod_disc: 44457, enunciado: 'Assinale o período por subordinação:',      alternativa_A: 'Fiz o dever e joguei',   alternativa_B: 'Ele estuda, ele dorme',alternativa_C: 'Fui ao parque pois estava sol', alternativa_D: 'Choveu e ventou', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 66924, cod_disc: 90021, enunciado: 'Qual planeta é o mais próximo do Sol?',     alternativa_A: 'Terra',                  alternativa_B: 'Marte',                alternativa_C: 'Mercúrio',               alternativa_D: 'Júpiter',           alternativa_correta: 'c', dificuldade: 'fácil'   },
    { cod_quest: 67001, cod_disc: 90021, enunciado: 'Qual órgão bombeia sangue no corpo?',       alternativa_A: 'Pulmão',                 alternativa_B: 'Fígado',               alternativa_C: 'Coração',                alternativa_D: 'Rim',               alternativa_correta: 'c', dificuldade: 'fácil'   },
    { cod_quest: 68002, cod_disc: 90021, enunciado: 'Principal fonte de energia das plantas?',   alternativa_A: 'Luz solar',              alternativa_B: 'Água',                 alternativa_C: 'Terra',                  alternativa_D: 'Ar',                alternativa_correta: 'a', dificuldade: 'fácil'   },
    { cod_quest: 69003, cod_disc: 90021, enunciado: 'Qual osso protege o cérebro?',              alternativa_A: 'Crânio',                 alternativa_B: 'Fêmur',                alternativa_C: 'Úmero',                  alternativa_D: 'Vértebra',          alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 69004, cod_disc: 90021, enunciado: 'Processo da lagarta em borboleta?',         alternativa_A: 'Metamorfose',            alternativa_B: 'Fotossíntese',         alternativa_C: 'Erosão',                 alternativa_D: 'Digestão',          alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 77035, cod_disc: 57713, enunciado: 'Complete: I ___ a student.',                alternativa_A: 'am',                     alternativa_B: 'is',                   alternativa_C: 'are',                    alternativa_D: 'be',                alternativa_correta: 'a', dificuldade: 'fácil'   },
    { cod_quest: 78001, cod_disc: 57713, enunciado: 'Como se diz olá em inglês?',                alternativa_A: 'Hello',                  alternativa_B: 'Hola',                 alternativa_C: 'Bonjour',                alternativa_D: 'Ciao',              alternativa_correta: 'a', dificuldade: 'fácil'   },
    { cod_quest: 79002, cod_disc: 57713, enunciado: 'O que significa book em português?',        alternativa_A: 'Livro',                  alternativa_B: 'Mesa',                 alternativa_C: 'Casa',                   alternativa_D: 'Carro',             alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 79003, cod_disc: 57713, enunciado: 'Qual expressão significa bom dia?',         alternativa_A: 'Good morning',           alternativa_B: 'Good evening',         alternativa_C: 'Good night',             alternativa_D: 'Bye bye',           alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 79004, cod_disc: 57713, enunciado: 'Complete: I ___ football every weekend.',   alternativa_A: 'play',                   alternativa_B: 'plays',                alternativa_C: 'played',                 alternativa_D: 'playing',           alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 13579, cod_disc: 76326, enunciado: 'Quem foi o 1º presidente do Brasil?',       alternativa_A: 'Getúlio Vargas',         alternativa_B: 'Deodoro da Fonseca',   alternativa_C: 'Juscelino Kubitschek',   alternativa_D: 'Dom Pedro II',      alternativa_correta: 'b', dificuldade: 'médio'   },
    { cod_quest: 80001, cod_disc: 76326, enunciado: 'Quem descobriu o Brasil em 1500?',          alternativa_A: 'Pedro Álvares Cabral',   alternativa_B: 'Cristóvão Colombo',    alternativa_C: 'Vasco da Gama',          alternativa_D: 'Fernão de Magalhães',alternativa_correta: 'a', dificuldade: 'fácil'   },
    { cod_quest: 81002, cod_disc: 76326, enunciado: 'Principal atividade econômica colonial?',   alternativa_A: 'Cana-de-açúcar',         alternativa_B: 'Ouro',                 alternativa_C: 'Café',                   alternativa_D: 'Soja',              alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 82003, cod_disc: 76326, enunciado: 'Quem foi Tiradentes?',                      alternativa_A: 'Líder da Inconfidência', alternativa_B: 'Imperador do Brasil',   alternativa_C: 'Rei de Portugal',        alternativa_D: 'Governador de SP',  alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 83004, cod_disc: 76326, enunciado: 'Ano da Independência do Brasil?',           alternativa_A: '1822',                   alternativa_B: '1808',                 alternativa_C: '1889',                   alternativa_D: '1815',              alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 96514, cod_disc: 98743, enunciado: 'Maior país da América do Sul?',             alternativa_A: 'Argentina',              alternativa_B: 'Chile',                alternativa_C: 'Brasil',                 alternativa_D: 'Peru',              alternativa_correta: 'c', dificuldade: 'fácil'   },
    { cod_quest: 84001, cod_disc: 98743, enunciado: 'Qual continente abriga o Brasil?',          alternativa_A: 'América do Sul',         alternativa_B: 'África',               alternativa_C: 'Ásia',                   alternativa_D: 'Europa',            alternativa_correta: 'a', dificuldade: 'fácil'   },
    { cod_quest: 85002, cod_disc: 98743, enunciado: 'Qual rio fica no Brasil?',                  alternativa_A: 'Amazonas',               alternativa_B: 'Nilo',                 alternativa_C: 'Mississippi',            alternativa_D: 'Danúbio',           alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 86003, cod_disc: 98743, enunciado: 'Clima do sertão nordestino?',               alternativa_A: 'Semiárido',              alternativa_B: 'Tropical',             alternativa_C: 'Equatorial',             alternativa_D: 'Temperado',         alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 87004, cod_disc: 98743, enunciado: 'A Linha do Equador divide em:',             alternativa_A: 'Norte e Sul',            alternativa_B: 'Leste e Oeste',        alternativa_C: 'Norte e Leste',          alternativa_D: 'Sul e Oeste',       alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 88001, cod_disc: 34512, enunciado: 'Para misturar tintas usa-se:',              alternativa_A: 'Pincel',                 alternativa_B: 'Furadeira',            alternativa_C: 'Serra',                  alternativa_D: 'Ralador',           alternativa_correta: 'a', dificuldade: 'fácil'   },
    { cod_quest: 89002, cod_disc: 34512, enunciado: 'A Mona Lisa foi pintada por:',              alternativa_A: 'Leonardo da Vinci',      alternativa_B: 'Pablo Picasso',        alternativa_C: 'Vincent van Gogh',       alternativa_D: 'Michelangelo',      alternativa_correta: 'a', dificuldade: 'médio'   },
    { cod_quest: 90003, cod_disc: 34512, enunciado: 'O que é perspectiva em desenho?',           alternativa_A: 'Técnica para profundidade', alternativa_B: 'Tipo de tinta',     alternativa_C: 'Forma de cortar papel',  alternativa_D: 'Nome de pintura',   alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100001, cod_disc: 82211, enunciado: 'Qual é o resultado da expressão 15 + 3 × 4 - 8?', alternativa_A: '64', alternativa_B: '19', alternativa_C: '27', alternativa_D: '11', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100002, cod_disc: 82211, enunciado: 'Uma pizza foi dividida em 8 pedaços iguais. João comeu 3 pedaços e Maria comeu 2. Qual fração da pizza sobrou?', alternativa_A: '5/8', alternativa_B: '3/8', alternativa_C: '1/8', alternativa_D: '4/8', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100003, cod_disc: 82211, enunciado: 'Se um produto custa R$ 200,00 e recebe um desconto de 15%, qual será o seu novo valor?', alternativa_A: 'R$ 185,00', alternativa_B: 'R$ 170,00', alternativa_C: 'R$ 150,00', alternativa_D: 'R$ 180,00', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100004, cod_disc: 82211, enunciado: 'Qual é o perímetro de um campo de futebol retangular que possui 90 metros de comprimento e 45 metros de largura?', alternativa_A: '135 m', alternativa_B: '270 m', alternativa_C: '4050 m', alternativa_D: '315 m', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100005, cod_disc: 82211, enunciado: 'O Mínimo Múltiplo Comum (MMC) entre os números 12 e 15 é:', alternativa_A: '30', alternativa_B: '45', alternativa_C: '60', alternativa_D: '180', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100006, cod_disc: 82211, enunciado: 'Resolva a equação do 1º grau: 3x - 5 = 10. O valor de x é:', alternativa_A: '5', alternativa_B: '15', alternativa_C: '3', alternativa_D: '4', alternativa_correta: 'a', dificuldade: 'médio' },
    { cod_quest: 100007, cod_disc: 82211, enunciado: 'Em uma sala de aula com 40 alunos, 60% são meninas. Quantos meninos há na sala?', alternativa_A: '24', alternativa_B: '16', alternativa_C: '20', alternativa_D: '14', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100008, cod_disc: 82211, enunciado: 'Se 4 cadernos custam R$ 32,00, quanto custarão 7 cadernos iguais a esses?', alternativa_A: 'R$ 56,00', alternativa_B: 'R$ 48,00', alternativa_C: 'R$ 64,00', alternativa_D: 'R$ 42,00', alternativa_correta: 'a', dificuldade: 'médio' },
    { cod_quest: 100009, cod_disc: 82211, enunciado: 'Qual é a área de um quadrado cujo lado mede 8 cm?', alternativa_A: '16 cm²', alternativa_B: '32 cm²', alternativa_C: '64 cm²', alternativa_D: '80 cm²', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100010, cod_disc: 82211, enunciado: 'Ao lançar um dado comum (de 1 a 6), qual é a probabilidade de cair um número par?', alternativa_A: '1/6', alternativa_B: '1/3', alternativa_C: '1/4', alternativa_D: '1/2', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100011, cod_disc: 82211, enunciado: 'Resolva a equação do 2º grau: x² - 5x + 6 = 0. As raízes são:', alternativa_A: '-2 e -3', alternativa_B: '2 e 3', alternativa_C: '-1 e 6', alternativa_D: '1 e 5', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100012, cod_disc: 82211, enunciado: 'Em um estacionamento há carros e motos, totalizando 30 veículos e 82 rodas. Quantos carros e motos há, respectivamente?', alternativa_A: '11 carros e 19 motos', alternativa_B: '20 carros e 10 motos', alternativa_C: '15 carros e 15 motos', alternativa_D: '19 carros e 11 motos', alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100013, cod_disc: 82211, enunciado: 'Um capital de R$ 2.000,00 é aplicado a juros simples com taxa de 3% ao mês. Qual será o montante após 5 meses?', alternativa_A: 'R$ 2.150,00', alternativa_B: 'R$ 2.300,00', alternativa_C: 'R$ 2.600,00', alternativa_D: 'R$ 3.000,00', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100014, cod_disc: 82211, enunciado: 'Uma máquina produz 100 peças em 2 horas. Quantas máquinas iguais a essa são necessárias para produzir 300 peças em 1 hora?', alternativa_A: '3', alternativa_B: '4', alternativa_C: '5', alternativa_D: '6', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100015, cod_disc: 82211, enunciado: 'Qual é a área de um círculo cujo raio mede 5 cm? (Considere π = 3,14)', alternativa_A: '31,4 cm²', alternativa_B: '78,5 cm²', alternativa_C: '15,7 cm²', alternativa_D: '100 cm²', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100016, cod_disc: 82211, enunciado: 'Em um triângulo retângulo, os catetos medem 6 cm e 8 cm. Qual é a medida da hipotenusa?', alternativa_A: '10 cm', alternativa_B: '12 cm', alternativa_C: '14 cm', alternativa_D: '100 cm', alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100017, cod_disc: 82211, enunciado: 'Uma loja aumenta o preço de uma TV em 20%. No mês seguinte, faz uma promoção dando 20% de desconto sobre o novo preço. Em relação ao preço original, a TV ficou:', alternativa_A: 'Com o mesmo preço', alternativa_B: '4% mais barata', alternativa_C: '4% mais cara', alternativa_D: '2% mais barata', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100018, cod_disc: 82211, enunciado: 'O valor da expressão [√(81) + (2³) - (5²)] é:', alternativa_A: '-8', alternativa_B: '2', alternativa_C: '-6', alternativa_D: '8', alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100019, cod_disc: 82211, enunciado: 'Lançando-se duas moedas simultaneamente, qual a probabilidade de saírem duas caras?', alternativa_A: '50%', alternativa_B: '25%', alternativa_C: '75%', alternativa_D: '33,3%', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100020, cod_disc: 82211, enunciado: 'A média das idades de um grupo de 4 pessoas é 25 anos. Se uma pessoa de 35 anos entrar no grupo, a nova média passará a ser:', alternativa_A: '26', alternativa_B: '27', alternativa_C: '28', alternativa_D: '30', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100021, cod_disc: 57713, enunciado: 'Choose the correct form of the verb to be: "She _____ my best friend."', alternativa_A: 'am', alternativa_B: 'is', alternativa_C: 'are', alternativa_D: 'be', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100022, cod_disc: 57713, enunciado: 'What is the plural of the word "child"?', alternativa_A: 'childs', alternativa_B: 'children', alternativa_C: 'childrens', alternativa_D: 'childes', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100023, cod_disc: 57713, enunciado: 'Complete the sentence: "I usually get up _____ 7 o\'clock."', alternativa_A: 'in', alternativa_B: 'on', alternativa_C: 'at', alternativa_D: 'to', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100024, cod_disc: 57713, enunciado: 'Choose the correct negative form: "He plays soccer."', alternativa_A: 'He not plays soccer.', alternativa_B: 'He don\'t plays soccer.', alternativa_C: 'He doesn\'t play soccer.', alternativa_D: 'He doesn\'t plays soccer.', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100025, cod_disc: 57713, enunciado: 'Which word indicates a color?', alternativa_A: 'Table', alternativa_B: 'Yellow', alternativa_C: 'Window', alternativa_D: 'Apple', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100026, cod_disc: 57713, enunciado: 'What is the correct translation for "cachorro" and "gato"?', alternativa_A: 'Dog / Cat', alternativa_B: 'Bird / Fish', alternativa_C: 'Mouse / Horse', alternativa_D: 'Cat / Dog', alternativa_correta: 'a', dificuldade: 'médio' },
    { cod_quest: 100027, cod_disc: 57713, enunciado: '"_____ is your name?" - "My name is John."', alternativa_A: 'How', alternativa_B: 'Where', alternativa_C: 'Who', alternativa_D: 'What', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100028, cod_disc: 57713, enunciado: 'Complete with the Present Continuous: "They _____ a book right now."', alternativa_A: 'is reading', alternativa_B: 'read', alternativa_C: 'are reading', alternativa_D: 'reading', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100029, cod_disc: 57713, enunciado: 'Choose the correct possessive adjective: "We have a car. _____ car is blue."', alternativa_A: 'His', alternativa_B: 'Their', alternativa_C: 'Our', alternativa_D: 'My', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100030, cod_disc: 57713, enunciado: 'What is the past simple of the regular verb "work"?', alternativa_A: 'works', alternativa_B: 'working', alternativa_C: 'work', alternativa_D: 'worked', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100031, cod_disc: 57713, enunciado: 'What is the past simple of the irregular verb "go"?', alternativa_A: 'goed', alternativa_B: 'gone', alternativa_C: 'went', alternativa_D: 'going', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100032, cod_disc: 57713, enunciado: 'Complete with the Present Perfect: "She _____ to Paris many times."', alternativa_A: 'has been', alternativa_B: 'have been', alternativa_C: 'goes', alternativa_D: 'went', alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100033, cod_disc: 57713, enunciado: 'Choose the correct option for the First Conditional: "If it rains tomorrow, we _____ at home."', alternativa_A: 'stayed', alternativa_B: 'will stay', alternativa_C: 'would stay', alternativa_D: 'stays', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100034, cod_disc: 57713, enunciado: 'Identify the Passive Voice sentence:', alternativa_A: 'The dog bit the boy.', alternativa_B: 'The boy is eating an apple.', alternativa_C: 'The cake was made by Mary.', alternativa_D: 'Mary makes beautiful cakes.', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100035, cod_disc: 57713, enunciado: 'Complete with the relative pronoun: "The man _____ lives next door is a doctor."', alternativa_A: 'which', alternativa_B: 'who', alternativa_C: 'whom', alternativa_D: 'whose', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100036, cod_disc: 57713, enunciado: 'What does the phrasal verb "give up" mean?', alternativa_A: 'Continue', alternativa_B: 'Start', alternativa_C: 'Quit / Stop trying', alternativa_D: 'Go up', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100037, cod_disc: 57713, enunciado: 'The word "pretend" is a false cognate. What does it actually mean in Portuguese?', alternativa_A: 'Pretender', alternativa_B: 'Fingir', alternativa_C: 'Entender', alternativa_D: 'Participar', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100038, cod_disc: 57713, enunciado: 'What is the superlative form of the adjective "good"?', alternativa_A: 'gooder', alternativa_B: 'the goodest', alternativa_C: 'better', alternativa_D: 'the best', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100039, cod_disc: 57713, enunciado: 'Complete the Tag Question: "You are a student, _____?"', alternativa_A: 'are you', alternativa_B: 'aren\'t you', alternativa_C: 'don\'t you', alternativa_D: 'isn\'t it', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100040, cod_disc: 57713, enunciado: 'Which modal verb is used to express strong obligation?', alternativa_A: 'might', alternativa_B: 'could', alternativa_C: 'must', alternativa_D: 'may', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100041, cod_disc: 34512, enunciado: 'Quais são as cores primárias?', alternativa_A: 'Verde, Laranja e Roxo', alternativa_B: 'Azul, Amarelo e Vermelho', alternativa_C: 'Branco, Preto e Cinza', alternativa_D: 'Rosa, Marrom e Azul', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100042, cod_disc: 34512, enunciado: 'Misturando a cor amarela com a cor vermelha, obtemos qual cor secundária?', alternativa_A: 'Verde', alternativa_B: 'Roxo', alternativa_C: 'Laranja', alternativa_D: 'Marrom', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100043, cod_disc: 34512, enunciado: 'Qual famosa artista brasileira pintou o quadro "Abaporu"?', alternativa_A: 'Anita Malfatti', alternativa_B: 'Tarsila do Amaral', alternativa_C: 'Frida Kahlo', alternativa_D: 'Lygia Clark', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100044, cod_disc: 34512, enunciado: 'O ritmo, a melodia e a harmonia são os três elementos fundamentais de qual manifestação artística?', alternativa_A: 'Teatro', alternativa_B: 'Escultura', alternativa_C: 'Fotografia', alternativa_D: 'Música', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100045, cod_disc: 34512, enunciado: 'Como é chamada a arte feita pelos homens pré-históricos nas paredes das cavernas?', alternativa_A: 'Arte Moderna', alternativa_B: 'Arte Gótica', alternativa_C: 'Arte Rupestre', alternativa_D: 'Arte Clássica', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100046, cod_disc: 34512, enunciado: 'Na Grécia Antiga, o teatro foi dividido inicialmente em dois gêneros principais. Quais eram?', alternativa_A: 'Drama e Terror', alternativa_B: 'Comédia e Tragédia', alternativa_C: 'Romance e Ação', alternativa_D: 'Musical e Monólogo', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100047, cod_disc: 34512, enunciado: 'O Bumba meu boi, o Frevo e o Maracatu fazem parte de qual universo cultural?', alternativa_A: 'Arte Contemporânea', alternativa_B: 'Folclore e Cultura Popular Brasileira', alternativa_C: 'Arte Renascentista', alternativa_D: 'Cultura Europeia', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100048, cod_disc: 34512, enunciado: 'Romero Britto é um artista brasileiro muito conhecido. Qual característica marca o seu trabalho?', alternativa_A: 'Pinturas hiper-realistas e em preto e branco.', alternativa_B: 'Uso de cores vibrantes e padrões geométricos.', alternativa_C: 'Esculturas feitas apenas com sucata.', alternativa_D: 'Uso de tintas a óleo escuras para retratar o sofrimento.', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100049, cod_disc: 34512, enunciado: 'O origami é uma arte tradicional de qual país?', alternativa_A: 'China', alternativa_B: 'Índia', alternativa_C: 'Japão', alternativa_D: 'Egito', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100050, cod_disc: 34512, enunciado: 'Qual instrumento musical abaixo pertence à família das cordas?', alternativa_A: 'Bateria', alternativa_B: 'Flauta', alternativa_C: 'Violino', alternativa_D: 'Trompete', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100051, cod_disc: 34512, enunciado: 'Qual artista do Renascimento pintou a obra "Monalisa" e "A Última Ceia"?', alternativa_A: 'Michelangelo', alternativa_B: 'Donatello', alternativa_C: 'Rafael Sanzio', alternativa_D: 'Leonardo da Vinci', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100052, cod_disc: 34512, enunciado: 'O Impressionismo foi um movimento artístico que focava muito em capturar:', alternativa_A: 'A precisão anatômica dos corpos.', alternativa_B: 'Os efeitos da luz solar sobre os objetos em diferentes horas do dia.', alternativa_C: 'A geometria e a quebra da perspectiva tradicional.', alternativa_D: 'Cenas de guerras históricas.', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100053, cod_disc: 34512, enunciado: 'Pablo Picasso e Georges Braque foram os fundadores de qual movimento de vanguarda europeia?', alternativa_A: 'Cubismo', alternativa_B: 'Surrealismo', alternativa_C: 'Expressionismo', alternativa_D: 'Fauvismo', alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100054, cod_disc: 34512, enunciado: 'Qual evento ocorrido no Theatro Municipal de São Paulo marcou o início do Modernismo no Brasil?', alternativa_A: 'Exposição Nacional de Belas Artes de 1908', alternativa_B: 'Semana de Arte Moderna de 1922', alternativa_C: 'Bienal de São Paulo de 1951', alternativa_D: 'Tropicália de 1967', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100055, cod_disc: 34512, enunciado: 'Antônio Francisco Lisboa, o Aleijadinho, foi o maior expoente de qual estilo artístico no Brasil colônia?', alternativa_A: 'Barroco Mineiro', alternativa_B: 'Neoclassicismo', alternativa_C: 'Romantismo', alternativa_D: 'Rococó Francês', alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100056, cod_disc: 34512, enunciado: 'Andy Warhol e Roy Lichtenstein utilizaram símbolos da cultura de massa (embalagens, histórias em quadrinhos) em qual movimento?', alternativa_A: 'Dadaísmo', alternativa_B: 'Minimalismo', alternativa_C: 'Pop Art', alternativa_D: 'Arte Conceitual', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100057, cod_disc: 34512, enunciado: 'A obra "A Persistência da Memória", conhecida pelos "relógios derretidos", pertence a qual artista surrealista?', alternativa_A: 'René Magritte', alternativa_B: 'Salvador Dalí', alternativa_C: 'Joan Miró', alternativa_D: 'Vincent van Gogh', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100058, cod_disc: 34512, enunciado: 'O "Auto da Barca do Inferno" é uma obra teatral de Gil Vicente que se insere no contexto de transição entre:', alternativa_A: 'Idade Antiga e Idade Média', alternativa_B: 'Classicismo e Romantismo', alternativa_C: 'Idade Média e Renascimento (Humanismo)', alternativa_D: 'Barroco e Arcadismo', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100059, cod_disc: 34512, enunciado: 'Qual compositor é o maior representante da fase final da música Barroca?', alternativa_A: 'Wolfgang Amadeus Mozart', alternativa_B: 'Johann Sebastian Bach', alternativa_C: 'Ludwig van Beethoven', alternativa_D: 'Frédéric Chopin', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100060, cod_disc: 34512, enunciado: 'O Expressionismo procurava retratar os sentimentos e angústias humanas. Qual obra abaixo é um ícone desse movimento?', alternativa_A: 'A Criação de Adão, de Michelangelo', alternativa_B: 'O Grito, de Edvard Munch', alternativa_C: 'Guernica, de Picasso', alternativa_D: 'Os Girassóis, de Van Gogh', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100061, cod_disc: 76326, enunciado: 'Em que ano os portugueses, liderados por Pedro Álvares Cabral, chegaram ao Brasil?', alternativa_A: '1492', alternativa_B: '1500', alternativa_C: '1532', alternativa_D: '1822', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100062, cod_disc: 76326, enunciado: 'Para iniciar a colonização, o rei de Portugal dividiu o Brasil em grandes faixas de terra. Como elas eram chamadas?', alternativa_A: 'Províncias Imperiais', alternativa_B: 'Estados Federativos', alternativa_C: 'Capitanias Hereditárias', alternativa_D: 'Sesmarias Livres', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100063, cod_disc: 76326, enunciado: 'Qual data marca a Independência do Brasil?', alternativa_A: '7 de setembro', alternativa_B: '15 de novembro', alternativa_C: '21 de abril', alternativa_D: '1º de maio', alternativa_correta: 'a', dificuldade: 'médio' },
    { cod_quest: 100064, cod_disc: 76326, enunciado: 'Zumbi foi um importante líder histórico no Brasil. Ele liderou o maior refúgio de escravizados, chamado:', alternativa_A: 'Quilombo de Canudos', alternativa_B: 'Quilombo dos Palmares', alternativa_C: 'Revolta dos Malês', alternativa_D: 'Cabanagem', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100065, cod_disc: 76326, enunciado: 'Os faraós e as pirâmides são símbolos históricos de qual civilização da Antiguidade?', alternativa_A: 'Fenícios', alternativa_B: 'Mesopotâmia', alternativa_C: 'Grécia Antiga', alternativa_D: 'Egito Antigo', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100066, cod_disc: 76326, enunciado: 'A cidade de Atenas, na Grécia Antiga, é considerada o berço da:', alternativa_A: 'Democracia', alternativa_B: 'República', alternativa_C: 'Ditadura', alternativa_D: 'Monarquia Absolutista', alternativa_correta: 'a', dificuldade: 'médio' },
    { cod_quest: 100067, cod_disc: 76326, enunciado: 'Qual sistema político e econômico predominou na Europa durante a Idade Média, baseado na relação entre senhores e servos?', alternativa_A: 'Capitalismo', alternativa_B: 'Socialismo', alternativa_C: 'Feudalismo', alternativa_D: 'Mercantilismo', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100068, cod_disc: 76326, enunciado: 'Joaquim José da Silva Xavier, o Tiradentes, foi o principal mártir de qual movimento revoltoso no Brasil?', alternativa_A: 'Revolução Farroupilha', alternativa_B: 'Inconfidência Mineira', alternativa_C: 'Conjuração Baiana', alternativa_D: 'Guerra de Canudos', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100069, cod_disc: 76326, enunciado: 'Quem foi o primeiro imperador do Brasil?', alternativa_A: 'D. João VI', alternativa_B: 'Princesa Isabel', alternativa_C: 'D. Pedro II', alternativa_D: 'D. Pedro I', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100070, cod_disc: 76326, enunciado: 'Em 15 de novembro de 1889, Marechal Deodoro da Fonseca liderou um golpe que resultou na:', alternativa_A: 'Abolição da Escravatura', alternativa_B: 'Independência do Brasil', alternativa_C: 'Proclamação da República', alternativa_D: 'Descoberta do Ouro', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100071, cod_disc: 76326, enunciado: 'A "Queda da Bastilha" em 1789 é o marco inicial de qual grande revolução?', alternativa_A: 'Revolução Inglesa', alternativa_B: 'Revolução Francesa', alternativa_C: 'Revolução Americana', alternativa_D: 'Revolução Industrial', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100072, cod_disc: 76326, enunciado: 'O assassinato do Arquiduque Francisco Ferdinando foi o estopim para o início de qual conflito?', alternativa_A: 'Guerra Fria', alternativa_B: 'Guerra dos Cem Anos', alternativa_C: 'Segunda Guerra Mundial', alternativa_D: 'Primeira Guerra Mundial', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100073, cod_disc: 76326, enunciado: 'Na Segunda Guerra Mundial, o "Eixo" era formado por quais países?', alternativa_A: 'Estados Unidos, União Soviética e Inglaterra', alternativa_B: 'Alemanha, Itália e Japão', alternativa_C: 'França, Polônia e Bélgica', alternativa_D: 'China, Coreia e Vietnã', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100074, cod_disc: 76326, enunciado: 'O período de tensão política, militar e ideológica que dividiu o mundo entre o Capitalismo (EUA) e o Socialismo (URSS) chamou-se:', alternativa_A: 'Era Napoleônica', alternativa_B: 'Imperialismo', alternativa_C: 'Guerra Fria', alternativa_D: 'Globalização', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100075, cod_disc: 76326, enunciado: 'O "Estado Novo" (1937-1945) foi um período ditatorial no Brasil liderado por:', alternativa_A: 'Juscelino Kubitschek', alternativa_B: 'Castelo Branco', alternativa_C: 'Getúlio Vargas', alternativa_D: 'João Goulart', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100076, cod_disc: 76326, enunciado: 'Durante a Ditadura Militar Brasileira, o decreto mais duro, que fechou o Congresso e cassou direitos políticos, foi o:', alternativa_A: 'AI-1', alternativa_B: 'AI-2', alternativa_C: 'AI-5', alternativa_D: 'Constituição de 1967', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100077, cod_disc: 76326, enunciado: 'A Revolução Industrial, que substituiu a manufatura pela maquinofatura, teve início no século XVIII em qual país?', alternativa_A: 'França', alternativa_B: 'Alemanha', alternativa_C: 'Estados Unidos', alternativa_D: 'Inglaterra', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100078, cod_disc: 76326, enunciado: 'O Iluminismo foi um movimento intelectual do século XVIII que defendia:', alternativa_A: 'O absolutismo dos reis e o poder da Igreja.', alternativa_B: 'A razão, a liberdade e o fim dos privilégios da nobreza.', alternativa_C: 'O retorno às crenças da Idade Média.', alternativa_D: 'A exploração das colônias sem questionamentos.', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100079, cod_disc: 76326, enunciado: 'Em 1917, uma revolução derrubou o regime dos Czares e implantou o primeiro estado socialista da história na:', alternativa_A: 'China', alternativa_B: 'Cuba', alternativa_C: 'Rússia', alternativa_D: 'Alemanha', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100080, cod_disc: 76326, enunciado: 'No Brasil Colonial, o Ciclo do Ouro no século XVIII teve como principal consequência:', alternativa_A: 'O esvaziamento das regiões Centro-Sul do país.', alternativa_B: 'A independência imediata de Portugal.', alternativa_C: 'O deslocamento do eixo econômico e populacional do Nordeste para o Sudeste (Minas Gerais).', alternativa_D: 'A abolição do trabalho escravo nas minas.', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100081, cod_disc: 98743, enunciado: 'O movimento que a Terra faz girando em torno de si mesma e que dura aproximadamente 24 horas é a:', alternativa_A: 'Translação', alternativa_B: 'Rotação', alternativa_C: 'Precessão', alternativa_D: 'Nutação', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100082, cod_disc: 98743, enunciado: 'Quais são os quatro pontos cardeais?', alternativa_A: 'Nordeste, Noroeste, Sudeste e Sudoeste', alternativa_B: 'Norte, Sul, Leste e Oeste', alternativa_C: 'Alto, Baixo, Esquerda e Direita', alternativa_D: 'Trópico, Equador, Meridiano e Polo', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100083, cod_disc: 98743, enunciado: 'Qual é o maior bioma do Brasil, conhecido pela sua imensa biodiversidade e floresta densa?', alternativa_A: 'Cerrado', alternativa_B: 'Caatinga', alternativa_C: 'Pantanal', alternativa_D: 'Amazônia', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100084, cod_disc: 98743, enunciado: 'O clima predominante no semiárido nordestino e o bioma que o acompanha é a:', alternativa_A: 'Mata Atlântica', alternativa_B: 'Caatinga', alternativa_C: 'Pampas', alternativa_D: 'Floresta de Araucárias', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100085, cod_disc: 98743, enunciado: 'O Brasil está localizado em qual continente?', alternativa_A: 'Europa', alternativa_B: 'África', alternativa_C: 'América', alternativa_D: 'Ásia', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100086, cod_disc: 98743, enunciado: 'Qual é a atual capital do Brasil, inaugurada em 1960?', alternativa_A: 'Rio de Janeiro', alternativa_B: 'Salvador', alternativa_C: 'São Paulo', alternativa_D: 'Brasília', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100087, cod_disc: 98743, enunciado: 'O Trópico de Capricórnio corta quais estados do Brasil?', alternativa_A: 'Amazonas, Pará e Amapá', alternativa_B: 'São Paulo, Paraná e Mato Grosso do Sul', alternativa_C: 'Bahia, Sergipe e Alagoas', alternativa_D: 'Rio Grande do Sul e Santa Catarina', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100088, cod_disc: 98743, enunciado: 'Qual é a maior bacia hidrográfica do mundo em volume de água, localizada em parte no Brasil?', alternativa_A: 'Bacia do Paraná', alternativa_B: 'Bacia do São Francisco', alternativa_C: 'Bacia do Tocantins-Araguaia', alternativa_D: 'Bacia Amazônica', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100089, cod_disc: 98743, enunciado: 'Segundo o IBGE, o Brasil é dividido em quantas grandes regiões?', alternativa_A: '3', alternativa_B: '4', alternativa_C: '5', alternativa_D: '6', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100090, cod_disc: 98743, enunciado: 'Qual o nome do instituto brasileiro responsável pela contagem da população (Censo) e estatísticas do país?', alternativa_A: 'FUNAI', alternativa_B: 'IBAMA', alternativa_C: 'INPE', alternativa_D: 'IBGE', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100091, cod_disc: 98743, enunciado: 'As linhas imaginárias horizontais e verticais que cruzam o globo e ajudam a localizar qualquer ponto na Terra são, respectivamente:', alternativa_A: 'Meridianos e Paralelos', alternativa_B: 'Equador e Trópicos', alternativa_C: 'Paralelos e Meridianos', alternativa_D: 'Fusos e Zonas', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100092, cod_disc: 98743, enunciado: 'O Meridiano de Greenwich divide a Terra em dois hemisférios:', alternativa_A: 'Norte e Sul', alternativa_B: 'Ocidental (Oeste) e Oriental (Leste)', alternativa_C: 'Continental e Marítimo', alternativa_D: 'Tropical e Polar', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100093, cod_disc: 98743, enunciado: 'O processo de integração econômica, cultural e política mundial, acelerado pela tecnologia da informação e transportes, chama-se:', alternativa_A: 'Urbanização', alternativa_B: 'Globalização', alternativa_C: 'Favelização', alternativa_D: 'Segregação Espacial', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100094, cod_disc: 98743, enunciado: 'O Mercosul é um bloco econômico formado originalmente por quais países?', alternativa_A: 'Brasil, EUA, México e Canadá', alternativa_B: 'Brasil, Argentina, Paraguai e Uruguai', alternativa_C: 'Brasil, Chile, Bolívia e Peru', alternativa_D: 'Brasil, Colômbia, Equador e Venezuela', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100095, cod_disc: 98743, enunciado: 'O movimento migratório de saída de pessoas do campo (área rural) para viver nas cidades (área urbana) é denominado:', alternativa_A: 'Transumância', alternativa_B: 'Movimento Pendular', alternativa_C: 'Êxodo Rural', alternativa_D: 'Diáspora', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100096, cod_disc: 98743, enunciado: 'A estrutura geológica do Brasil é antiga e não possui dobramentos modernos. Ela é formada basicamente por:', alternativa_A: 'Vulcões ativos e falhas tectônicas.', alternativa_B: 'Escudos Cristalinos e Bacias Sedimentares.', alternativa_C: 'Cordilheiras e Geleiras.', alternativa_D: 'Fossas abissais e dorsais.', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100097, cod_disc: 98743, enunciado: 'O fenômeno climático urbano em que a temperatura dos centros das cidades é maior do que a das áreas periféricas devido ao asfalto e concreto é chamado de:', alternativa_A: 'Efeito Estufa', alternativa_B: 'Inversão Térmica', alternativa_C: 'Chuva Ácida', alternativa_D: 'Ilha de Calor', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100098, cod_disc: 98743, enunciado: 'O fenômeno da "Transição Demográfica" no Brasil atual indica que:', alternativa_A: 'A taxa de natalidade e a expectativa de vida estão caindo.', alternativa_B: 'A população está ficando mais jovem.', alternativa_C: 'A taxa de fecundidade está caindo e a população está envelhecendo.', alternativa_D: 'As taxas de mortalidade infantil estão aumentando.', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100099, cod_disc: 98743, enunciado: 'Qual bloco econômico adotou uma moeda única (o Euro) para a maioria de seus países membros?', alternativa_A: 'NAFTA (USMCA)', alternativa_B: 'BRICS', alternativa_C: 'União Europeia', alternativa_D: 'APEC', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100100, cod_disc: 98743, enunciado: 'Se um mapa apresenta escala de 1:1.000.000, significa que 1 cm no mapa equivale, na realidade, a:', alternativa_A: '1 quilômetro', alternativa_B: '10 quilômetros', alternativa_C: '100 quilômetros', alternativa_D: '1000 quilômetros', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100101, cod_disc: 90021, enunciado: 'A mudança do estado líquido para o gasoso recebe o nome de:', alternativa_A: 'Fusão', alternativa_B: 'Solidificação', alternativa_C: 'Condensação', alternativa_D: 'Vaporização', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100102, cod_disc: 90021, enunciado: 'O processo pelo qual as plantas utilizam a luz solar, água e gás carbônico para produzir seu alimento é a:', alternativa_A: 'Respiração Celular', alternativa_B: 'Fotossíntese', alternativa_C: 'Fermentação', alternativa_D: 'Digestão', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100103, cod_disc: 90021, enunciado: 'Qual é o maior planeta do nosso Sistema Solar?', alternativa_A: 'Terra', alternativa_B: 'Marte', alternativa_C: 'Saturno', alternativa_D: 'Júpiter', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100104, cod_disc: 90021, enunciado: 'Quais são os vasos sanguíneos responsáveis por levar o sangue do coração para o restante do corpo?', alternativa_A: 'Veias', alternativa_B: 'Capilares', alternativa_C: 'Artérias', alternativa_D: 'Brônquios', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100105, cod_disc: 90021, enunciado: 'Qual gás é indispensável para a respiração da maioria dos seres vivos e é absorvido pelos pulmões?', alternativa_A: 'Gás Carbônico', alternativa_B: 'Gás Oxigênio', alternativa_C: 'Gás Nitrogênio', alternativa_D: 'Gás Hélio', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100106, cod_disc: 90021, enunciado: 'Os animais que possuem coluna vertebral são classificados como:', alternativa_A: 'Invertebrados', alternativa_B: 'Pluricelulares', alternativa_C: 'Vertebrados', alternativa_D: 'Unicelulares', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100107, cod_disc: 90021, enunciado: 'Os seres vivos que produzem o próprio alimento em uma cadeia alimentar (como as plantas) são chamados de:', alternativa_A: 'Consumidores Primários', alternativa_B: 'Decompositores', alternativa_C: 'Produtores', alternativa_D: 'Consumidores Secundários', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100108, cod_disc: 90021, enunciado: 'Qual é o órgão do corpo humano responsável pelo bombeamento de sangue?', alternativa_A: 'Pulmão', alternativa_B: 'Estômago', alternativa_C: 'Cérebro', alternativa_D: 'Coração', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100109, cod_disc: 90021, enunciado: 'Animais como o cão, o gato e o ser humano, que mamam quando filhotes e possuem pelos, são:', alternativa_A: 'Répteis', alternativa_B: 'Anfíbios', alternativa_C: 'Mamíferos', alternativa_D: 'Aves', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100110, cod_disc: 90021, enunciado: 'Qual dos sentidos está diretamente relacionado ao órgão do olfato?', alternativa_A: 'Visão', alternativa_B: 'Audição', alternativa_C: 'Cheiro/Olfato (Nariz)', alternativa_D: 'Paladar (Língua)', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100111, cod_disc: 90021, enunciado: 'As células que não possuem núcleo organizado (o material genético fica disperso no citoplasma), como as bactérias, são chamadas de:', alternativa_A: 'Eucariontes', alternativa_B: 'Procariontes', alternativa_C: 'Somáticas', alternativa_D: 'Gaméticas', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100112, cod_disc: 90021, enunciado: 'Quem é considerado o "Pai da Genética" pelos seus estudos com ervilhas, descobrindo as leis da hereditariedade?', alternativa_A: 'Charles Darwin', alternativa_B: 'Gregor Mendel', alternativa_C: 'Louis Pasteur', alternativa_D: 'Albert Einstein', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100113, cod_disc: 90021, enunciado: 'O naturalista Charles Darwin formulou a base da Teoria da Evolução, baseada no conceito de:', alternativa_A: 'Lei do Uso e Desuso', alternativa_B: 'Seleção Natural', alternativa_C: 'Geração Espontânea', alternativa_D: 'Criacionismo', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100114, cod_disc: 90021, enunciado: 'Em uma relação ecológica onde duas espécies se associam com benefício mútuo e dependência obrigatória para a sobrevivência (ex: líquens), temos um caso de:', alternativa_A: 'Parasitismo', alternativa_B: 'Comensalismo', alternativa_C: 'Predatismo', alternativa_D: 'Mutualismo', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100115, cod_disc: 90021, enunciado: 'O átomo é formado por partículas subatômicas. As partículas com carga elétrica positiva são os:', alternativa_A: 'Elétrons', alternativa_B: 'Nêutrons', alternativa_C: 'Prótons', alternativa_D: 'Fótons', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100116, cod_disc: 90021, enunciado: 'A 1ª Lei de Newton afirma que um corpo em repouso ou em movimento retilíneo uniforme tende a manter seu estado a menos que uma força atue sobre ele. Esta é a lei da:', alternativa_A: 'Ação e Reação', alternativa_B: 'Gravitação Universal', alternativa_C: 'Inércia', alternativa_D: 'Dinâmica', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100117, cod_disc: 90021, enunciado: 'Na Tabela Periódica, a grande maioria dos elementos químicos é classificada como:', alternativa_A: 'Gases Nobres', alternativa_B: 'Ametais', alternativa_C: 'Halogênios', alternativa_D: 'Metais', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100118, cod_disc: 90021, enunciado: 'As vacinas agem no corpo humano promovendo:', alternativa_A: 'A cura imediata de sintomas virais.', alternativa_B: 'A destruição de bactérias como um antibiótico.', alternativa_C: 'A produção preventiva de anticorpos e memória imunológica.', alternativa_D: 'O fornecimento de anticorpos já prontos contra venenos.', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100119, cod_disc: 90021, enunciado: 'Qual das doenças abaixo é causada por um VÍRUS?', alternativa_A: 'Tuberculose', alternativa_B: 'Tétano', alternativa_C: 'Cólera', alternativa_D: 'Dengue', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100120, cod_disc: 90021, enunciado: 'A energia associada ao movimento de um corpo (como um carro em velocidade) é chamada de:', alternativa_A: 'Energia Potencial Gravitacional', alternativa_B: 'Energia Cinética', alternativa_C: 'Energia Térmica', alternativa_D: 'Energia Nuclear', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100121, cod_disc: 44457, enunciado: 'A palavra "café" tem a última sílaba tônica, portanto é classificada como:', alternativa_A: 'Paroxítona', alternativa_B: 'Proparoxítona', alternativa_C: 'Oxítona', alternativa_D: 'Monossílaba átona', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100122, cod_disc: 44457, enunciado: 'Qual é o substantivo coletivo de "peixes"?', alternativa_A: 'Enxame', alternativa_B: 'Cardume', alternativa_C: 'Bando', alternativa_D: 'Rebanho', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100123, cod_disc: 44457, enunciado: 'Na frase "O menino esperto terminou a lição", a palavra "esperto" é:', alternativa_A: 'Substantivo', alternativa_B: 'Verbo', alternativa_C: 'Adjetivo', alternativa_D: 'Pronome', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100124, cod_disc: 44457, enunciado: 'Qual par de palavras abaixo representa sinônimos?', alternativa_A: 'Bom / Mau', alternativa_B: 'Alegre / Feliz', alternativa_C: 'Alto / Baixo', alternativa_D: 'Rico / Pobre', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100125, cod_disc: 44457, enunciado: 'A frase "Nós estudaremos amanhã" está em qual tempo verbal?', alternativa_A: 'Presente', alternativa_B: 'Pretérito Perfeito', alternativa_C: 'Pretérito Imperfeito', alternativa_D: 'Futuro do Presente', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100126, cod_disc: 44457, enunciado: 'As palavras "chuva", "pássaro" e "carro" contêm, respectivamente, os dígrafos:', alternativa_A: 'ch, ss, rr', alternativa_B: 'v, p, c', alternativa_C: 'hu, as, ar', alternativa_D: 'Não contêm dígrafos', alternativa_correta: 'a', dificuldade: 'médio' },
    { cod_quest: 100127, cod_disc: 44457, enunciado: 'A regra geral de acentuação diz que "todas as palavras _________ são acentuadas". Complete:', alternativa_A: 'Oxítonas', alternativa_B: 'Paroxítonas', alternativa_C: 'Proparoxítonas', alternativa_D: 'Polissílabas', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100128, cod_disc: 44457, enunciado: 'Qual sinal de pontuação é usado para indicar uma pergunta?', alternativa_A: 'Ponto de exclamação', alternativa_B: 'Vírgula', alternativa_C: 'Ponto e vírgula', alternativa_D: 'Ponto de interrogação', alternativa_correta: 'd', dificuldade: 'médio' },
    { cod_quest: 100129, cod_disc: 44457, enunciado: 'O pronome "Eu" pertence à classe dos:', alternativa_A: 'Pronomes Possessivos', alternativa_B: 'Pronomes Pessoais do Caso Reto', alternativa_C: 'Pronomes Demonstrativos', alternativa_D: 'Pronomes Indefinidos', alternativa_correta: 'b', dificuldade: 'médio' },
    { cod_quest: 100130, cod_disc: 44457, enunciado: 'Na palavra "Saguão", a união das três vogais "u-ã-o" na mesma sílaba forma um:', alternativa_A: 'Hiato', alternativa_B: 'Ditongo', alternativa_C: 'Tritongo', alternativa_D: 'Dígrafo', alternativa_correta: 'c', dificuldade: 'médio' },
    { cod_quest: 100131, cod_disc: 44457, enunciado: 'Na frase "Meu coração é um balde esvaziado", a figura de linguagem utilizada é a:', alternativa_A: 'Metáfora', alternativa_B: 'Símile / Comparação', alternativa_C: 'Eufemismo', alternativa_D: 'Hipérbole', alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100132, cod_disc: 44457, enunciado: 'Qual alternativa indica o uso correto da crase?', alternativa_A: 'Vou a pé para casa.', alternativa_B: 'Entreguei o livro à aluna.', alternativa_C: 'Começou a chover forte.', alternativa_D: 'Estamos frente a frente.', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100133, cod_disc: 44457, enunciado: 'Na oração "Choveu muito ontem à noite", qual é a classificação do sujeito?', alternativa_A: 'Sujeito Oculto', alternativa_B: 'Sujeito Indeterminado', alternativa_C: 'Sujeito Simples', alternativa_D: 'Sujeito Inexistente (Oração sem sujeito)', alternativa_correta: 'd', dificuldade: 'difícil' },
    { cod_quest: 100134, cod_disc: 44457, enunciado: 'Qual frase apresenta um erro de concordância verbal?', alternativa_A: 'Fazem dez anos que não o vejo.', alternativa_B: 'Faz dez anos que não o vejo.', alternativa_C: 'Haviam chegado os convidados.', alternativa_D: 'Existiam muitas pessoas no local.', alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100135, cod_disc: 44457, enunciado: 'Complete a frase corretamente: "Não entendi o ________ de tanta confusão. Você pode me explicar ________ estava tão nervosa?"', alternativa_A: 'porque / porquê', alternativa_B: 'porquê / por que', alternativa_C: 'por que / porque', alternativa_D: 'por quê / por que', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100136, cod_disc: 44457, enunciado: 'A função da linguagem cujo foco é o emissor (quem fala), expressando seus próprios sentimentos e emoções, é a:', alternativa_A: 'Função Referencial', alternativa_B: 'Função Fática', alternativa_C: 'Função Emotiva ou Expressiva', alternativa_D: 'Função Metalinguística', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100137, cod_disc: 44457, enunciado: 'Na frase "Precisa-se de funcionários", o sujeito é:', alternativa_A: 'Simples', alternativa_B: 'Oculto', alternativa_C: 'Indeterminado', alternativa_D: 'Composto', alternativa_correta: 'c', dificuldade: 'difícil' },
    { cod_quest: 100138, cod_disc: 44457, enunciado: 'O vício de linguagem que consiste na repetição de uma ideia de forma desnecessária (ex: "entrar para dentro") é o:', alternativa_A: 'Pleonasmo', alternativa_B: 'Ambiguidade', alternativa_C: 'Eco', alternativa_D: 'Neologismo', alternativa_correta: 'a', dificuldade: 'difícil' },
    { cod_quest: 100139, cod_disc: 44457, enunciado: 'Qual é a figura de linguagem presente em "Chorei rios de lágrimas"?', alternativa_A: 'Eufemismo', alternativa_B: 'Hipérbole', alternativa_C: 'Antítese', alternativa_D: 'Ironia', alternativa_correta: 'b', dificuldade: 'difícil' },
    { cod_quest: 100140, cod_disc: 44457, enunciado: 'A oração "É necessário que você estude" é classificada como:', alternativa_A: 'Oração subordinada substantiva subjetiva', alternativa_B: 'Oração subordinada adjetiva restritiva', alternativa_C: 'Oração subordinada adverbial causal', alternativa_D: 'Oração coordenada sindética aditiva', alternativa_correta: 'a', dificuldade: 'difícil' },
  ];
  for (const q of questoes) {
    await prisma.questao.upsert({
      where:  { cod_quest: q.cod_quest },
      update: {},
      create: q,
    });
  }
  console.log(`  ✓ ${questoes.length} questões.`);

  console.log('  Inserindo conteúdos...');
  const conteudos = [
    { cod_conteudo: 54411, cod_disc: 82211, descricao: 'Operações Básicas'                },
    { cod_conteudo: 66542, cod_disc: 82211, descricao: 'Porcentagem'                      },
    { cod_conteudo: 77891, cod_disc: 82211, descricao: 'Equações do 1º grau'              },
    { cod_conteudo: 33478, cod_disc: 44457, descricao: 'Interpretação de texto'           },
    { cod_conteudo: 11356, cod_disc: 44457, descricao: 'Ortografia e Gramática'           },
    { cod_conteudo: 55667, cod_disc: 90021, descricao: 'Sistema solar'                    },
    { cod_conteudo: 98334, cod_disc: 90021, descricao: 'Corpo Humano'                     },
    { cod_conteudo: 22345, cod_disc: 57713, descricao: 'Verbo To Be e Simple Present'     },
    { cod_conteudo: 12298, cod_disc: 57713, descricao: 'Simple Past'                      },
    { cod_conteudo: 91234, cod_disc: 76326, descricao: 'Brasil Colonial e Independência'  },
    { cod_conteudo: 43210, cod_disc: 98743, descricao: 'América do Sul e Clima brasileiro'},
    { cod_conteudo: 65432, cod_disc: 34512, descricao: 'Técnicas artísticas e História da Arte' },
  ];
  for (const c of conteudos) {
    await prisma.conteudo.upsert({
      where:  { cod_conteudo: c.cod_conteudo },
      update: {},
      create: c,
    });
  }
  console.log(`  ✓ ${conteudos.length} conteúdos.`);

  console.log('  Inserindo histórico...');
  const historicos = [
    { cod_resposta: 121, cod_usuario: 76554, cod_quest: 11154, data_resposta: new Date('2024-07-14'), status: 'Acertou' },
    { cod_resposta: 156, cod_usuario: 43221, cod_quest: 26667, data_resposta: new Date('2025-12-30'), status: 'Acertou' },
    { cod_resposta: 458, cod_usuario: 76554, cod_quest: 96514, data_resposta: new Date('2025-06-09'), status: 'Acertou' },
    { cod_resposta: 239, cod_usuario: 43221, cod_quest: 13579, data_resposta: new Date('2023-09-01'), status: 'Errou'   },
    { cod_resposta: 310, cod_usuario: 84721, cod_quest: 22468, data_resposta: new Date('2025-01-10'), status: 'Acertou' },
  ];
  for (const h of historicos) {
    await prisma.historico.upsert({
      where:  { cod_resposta: h.cod_resposta },
      update: {},
      create: h,
    });
  }
  console.log(`  ✓ ${historicos.length} registros de histórico.`);

  console.log('  Inserindo estuda...');
  const estudas = [
    { cod_usuario: 76554, cod_disc: 82211, meta: 20, tempo: '01:30:00' },
    { cod_usuario: 43221, cod_disc: 44457, meta: 15, tempo: '01:00:00' },
    { cod_usuario: 43221, cod_disc: 90021, meta: 25, tempo: '02:00:00' },
    { cod_usuario: 65928, cod_disc: 57713, meta: 18, tempo: '01:20:00' },
    { cod_usuario: 84721, cod_disc: 76326, meta: 12, tempo: '00:50:00' },
    { cod_usuario: 59384, cod_disc: 98743, meta: 10, tempo: '00:45:00' },
    { cod_usuario: 21097, cod_disc: 34512, meta: 14, tempo: '01:10:00' },
  ];
  for (const e of estudas) {
    await prisma.estuda.upsert({
      where:  { cod_usuario_cod_disc: { cod_usuario: e.cod_usuario, cod_disc: e.cod_disc } },
      update: {},
      create: e,
    });
  }
  console.log(`  ✓ ${estudas.length} registros de estuda.`);

  console.log('  Inserindo anotações...');
  const anotacoes = [
    { cod_anota: 1001, cod_pasta: 33441, cod_usuario: 76554, titulo: 'Resumo de matemática', texto_anota: 'Anotei os principais conceitos de frações e porcentagem.', data_anota: new Date('2024-01-10') },
    { cod_anota: 1002, cod_pasta: 11667, cod_usuario: 43221, titulo: 'Equações básicas',     texto_anota: 'Resolver exercícios de primeiro grau para a prova.',       data_anota: new Date('2025-05-20') },
    { cod_anota: 1003, cod_pasta: 39001, cod_usuario: 76554, titulo: 'Leis de Mendel',       texto_anota: 'Primeira lei: segregação dos fatores hereditários.',       data_anota: new Date('2026-02-15') },
    { cod_anota: 1004, cod_pasta: 12785, cod_usuario: 43221, titulo: 'Vocabulary',           texto_anota: 'Estudar verbos irregulares em inglês.',                    data_anota: new Date('2023-05-20') },
    { cod_anota: 1005, cod_pasta: 55234, cod_usuario: 84721, titulo: 'Análise sintática',    texto_anota: 'Separar sujeito, verbo e predicado nas frases.',           data_anota: new Date('2024-03-18') },
  ];
  for (const a of anotacoes) {
    await prisma.anotacao.upsert({
      where:  { cod_anota: a.cod_anota },
      update: {},
      create: a,
    });
  }
  console.log(`  ✓ ${anotacoes.length} anotações.`);

  console.log('  Inserindo contem...');
  const contems = [
    { cod_pasta: 33441, cod_anota: 1001 },
    { cod_pasta: 11667, cod_anota: 1002 },
    { cod_pasta: 39001, cod_anota: 1003 },
    { cod_pasta: 12785, cod_anota: 1004 },
    { cod_pasta: 55234, cod_anota: 1005 },
  ];
  for (const c of contems) {
    await prisma.contem.upsert({
      where:  { cod_pasta_cod_anota: { cod_pasta: c.cod_pasta, cod_anota: c.cod_anota } },
      update: {},
      create: c,
    });
  }
  console.log(`  ✓ ${contems.length} registros em contem.`);

  console.log('  Inserindo possui...');
  const possuies = [
    { cod_quest: 11154, cod_resposta: 121 },
    { cod_quest: 26667, cod_resposta: 156 },
    { cod_quest: 96514, cod_resposta: 458 },
    { cod_quest: 13579, cod_resposta: 239 },
    { cod_quest: 22468, cod_resposta: 310 },
  ];
  for (const p of possuies) {
    await prisma.possui.upsert({
      where:  { cod_quest_cod_resposta: { cod_quest: p.cod_quest, cod_resposta: p.cod_resposta } },
      update: {},
      create: p,
    });
  }
  console.log(`  ✓ ${possuies.length} registros em possui.`);

  await prisma.$disconnect();
  console.log('✅ Seed concluído com sucesso!');
}

runSeed().catch(async (err) => {
  console.error('❌ Erro no seed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
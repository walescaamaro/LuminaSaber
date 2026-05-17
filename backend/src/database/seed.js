// seed.js
// Popula o banco com dados iniciais para testes e desenvolvimento.
// Execute com: npm run seed  (sempre APÓS npm run migrate)

import db from './database.js';

async function runSeed() {
    console.log('▶ Iniciando seed...');
    const conn = await db.connect();

    await conn.run('PRAGMA foreign_keys = ON');

    // ── 1. USUARIO ──────────────────────────────────────────────────────────
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
        [43890, 'Bruno Martins',   'bruno@gmail.com',       'mno5',  '9° ano', '2018-06-19', 'aluno'],
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

    // ── 2. disciplina ────────────────────────────────────────────────────────
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

    // ── 3. suporte ───────────────────────────────────────────────────────────
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

    // ── 4. relatorio ─────────────────────────────────────────────────────────
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

    // ── 5. PASTA ─────────────────────────────────────────────────────────────
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

    // ── 6. questao ───────────────────────────────────────────────────────────
    // ATENÇÃO: alternativa_correta SEMPRE em minúsculo ('a','b','c','d')
    console.log('  Inserindo questões...');
    const questoes = [
        // Matemática (82211)
        [11154, 82211, 'Quanto é 8 + 7?',                          '13',                     '14',                  '15',                    '16',               'c', 'fácil'],
        [22468, 82211, 'Quanto é 50% de 200?',                     '50',                     '100',                 '150',                   '200',              'b', 'fácil'],
        [33791, 82211, 'Resolva: x + 3 = 7',                       '2',                      '3',                   '4',                     '5',                'c', 'fácil'],
        [34001, 82211, 'Qual é a fração equivalente a 0,75?',      '3/4',                    '7/10',                '1/2',                   '2/3',              'a', 'médio'],
        [35002, 82211, 'Qual o resultado de 12 × 3?',              '36',                     '30',                  '24',                    '32',               'a', 'fácil'],
        [36003, 82211, 'Qual é o valor de 5² + 3³?',               '52',                     '34',                  '45',                    '35',               'a', 'difícil'],
        // Português (44457)
        [26667, 44457, 'Qual palavra está escrita corretamente?',   'Excessão',               'Exceção',             'Excesssão',             'Exeção',           'b', 'médio'],
        [44902, 44457, 'Qual alternativa tem erro de ortografia?',  'Casa',                   'Mesa',                'Caza',                  'Livro',            'c', 'fácil'],
        [55813, 44457, '"O menino correu." Isso é um exemplo de:',  'Frase nominal',          'Frase verbal',        'Interjeição',           'Pergunta',         'b', 'médio'],
        [46001, 44457, 'Qual é o plural de cidadão?',               'Cidadãos',               'Cidadaos',            'Cidadães',              'Cidadãoss',        'a', 'fácil'],
        [47002, 44457, 'Qual classe gramatical é rápido?',          'Adjetivo',               'Substantivo',         'Verbo',                 'Advérbio',         'a', 'médio'],
        [48003, 44457, 'Assinale o período por subordinação:',      'Fiz o dever e joguei',   'Ele estuda, ele dorme','Fui ao parque pois estava sol','Choveu e ventou','c','difícil'],
        // Ciências (90021)
        [66924, 90021, 'Qual planeta é o mais próximo do Sol?',     'Terra',                  'Marte',               'Mercúrio',              'Júpiter',          'c', 'fácil'],
        [67001, 90021, 'Qual órgão bombeia sangue no corpo?',       'Pulmão',                 'Fígado',              'Coração',               'Rim',              'c', 'fácil'],
        [68002, 90021, 'Principal fonte de energia das plantas?',   'Luz solar',              'Água',                'Terra',                 'Ar',               'a', 'fácil'],
        [69003, 90021, 'Qual osso protege o cérebro?',              'Crânio',                 'Fêmur',               'Úmero',                 'Vértebra',         'a', 'médio'],
        [69004, 90021, 'Processo da lagarta em borboleta?',         'Metamorfose',            'Fotossíntese',        'Erosão',                'Digestão',         'a', 'difícil'],
        // Inglês (57713)
        [77035, 57713, 'Complete: I ___ a student.',                'am',                     'is',                  'are',                   'be',               'a', 'fácil'],
        [78001, 57713, 'Como se diz olá em inglês?',                'Hello',                  'Hola',                'Bonjour',               'Ciao',             'a', 'fácil'],
        [79002, 57713, 'O que significa book em português?',        'Livro',                  'Mesa',                'Casa',                  'Carro',            'a', 'médio'],
        [79003, 57713, 'Qual expressão significa bom dia?',         'Good morning',           'Good evening',        'Good night',            'Bye bye',          'a', 'médio'],
        [79004, 57713, 'Complete: I ___ football every weekend.',   'play',                   'plays',               'played',                'playing',          'a', 'difícil'],
        // História (76326)
        [13579, 76326, 'Quem foi o 1º presidente do Brasil?',       'Getúlio Vargas',         'Deodoro da Fonseca',  'Juscelino Kubitschek',  'Dom Pedro II',     'b', 'médio'],
        [80001, 76326, 'Quem descobriu o Brasil em 1500?',          'Pedro Álvares Cabral',   'Cristóvão Colombo',   'Vasco da Gama',         'Fernão de Magalhães','a','fácil'],
        [81002, 76326, 'Principal atividade econômica colonial?',   'Cana-de-açúcar',         'Ouro',                'Café',                  'Soja',             'a', 'médio'],
        [82003, 76326, 'Quem foi Tiradentes?',                      'Líder da Inconfidência', 'Imperador do Brasil', 'Rei de Portugal',       'Governador de SP', 'a', 'médio'],
        [83004, 76326, 'Ano da Independência do Brasil?',           '1822',                   '1808',                '1889',                  '1815',             'a', 'difícil'],
        // Geografia (98743)
        [96514, 98743, 'Maior país da América do Sul?',             'Argentina',              'Chile',               'Brasil',                'Peru',             'c', 'fácil'],
        [84001, 98743, 'Qual continente abriga o Brasil?',          'América do Sul',         'África',              'Ásia',                  'Europa',           'a', 'fácil'],
        [85002, 98743, 'Qual rio fica no Brasil?',                  'Amazonas',               'Nilo',                'Mississippi',           'Danúbio',          'a', 'médio'],
        [86003, 98743, 'Clima do sertão nordestino?',               'Semiárido',              'Tropical',            'Equatorial',            'Temperado',        'a', 'médio'],
        [87004, 98743, 'A Linha do Equador divide em:',             'Norte e Sul',            'Leste e Oeste',       'Norte e Leste',         'Sul e Oeste',      'a', 'difícil'],
        // Artes (34512)
        [88001, 34512, 'Para misturar tintas usa-se:',              'Pincel',                 'Furadeira',           'Serra',                 'Ralador',          'a', 'fácil'],
        [89002, 34512, 'A Mona Lisa foi pintada por:',              'Leonardo da Vinci',      'Pablo Picasso',       'Vincent van Gogh',      'Michelangelo',     'a', 'médio'],
        [90003, 34512, 'O que é perspectiva em desenho?',           'Técnica para profundidade','Tipo de tinta',     'Forma de cortar papel', 'Nome de pintura',  'a', 'difícil'],
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

    // ── 7. conteudo ──────────────────────────────────────────────────────────
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
        await conn.run(
            `INSERT OR IGNORE INTO conteudo (cod_conteudo, cod_disc, descricao) VALUES (?, ?, ?)`, c
        );
    }
    console.log(`  ✓ ${conteudos.length} conteúdos.`);

    // ── 8. historico ─────────────────────────────────────────────────────────
    console.log('  Inserindo histórico...');
    const historicos = [
        [121, 76554, 11154, '2024-07-14', 'Acertou'],
        [156, 43221, 26667, '2025-12-30', 'Acertou'],
        [458, 76554, 96514, '2025-06-09', 'Acertou'],
        [239, 43221, 13579, '2023-09-01', 'Errou'],
        [310, 84721, 22468, '2025-01-10', 'Acertou'],
    ];
    for (const h of historicos) {
        await conn.run(
            `INSERT OR IGNORE INTO historico
                (cod_resposta, cod_usuario, cod_quest, data_resposta, status)
             VALUES (?, ?, ?, ?, ?)`, h
        );
    }
    console.log(`  ✓ ${historicos.length} registros de histórico.`);

    // ── 9. estuda ────────────────────────────────────────────────────────────
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
        await conn.run(
            `INSERT OR IGNORE INTO estuda
                (cod_usuario, cod_disc, meta, tempo)
             VALUES (?, ?, ?, ?)`, e
        );
    }
    console.log(`  ✓ ${estudas.length} registros de estuda.`);

    // ── 10. anotacao ─────────────────────────────────────────────────────────
    console.log('  Inserindo anotações...');
    const anotacoes = [
        [1001, 33441, 76554, 'Resumo de matemática', 'Anotei os principais conceitos de frações e porcentagem.', '2024-01-10'],
        [1002, 11667, 43221, 'Equações básicas',     'Resolver exercícios de primeiro grau para a prova.',       '2025-05-20'],
        [1003, 39001, 76554, 'Leis de Mendel',       'Primeira lei: segregação dos fatores hereditários.',       '2026-02-15'],
        [1004, 12785, 43221, 'Vocabulary',           'Estudar verbos irregulares em inglês.',                    '2023-05-20'],
        [1005, 55234, 84721, 'Análise sintática',    'Separar sujeito, verbo e predicado nas frases.',           '2024-03-18'],
    ];
    for (const a of anotacoes) {
        await conn.run(
            `INSERT OR IGNORE INTO anotacao
                (cod_anota, cod_pasta, cod_usuario, titulo, texto_anota, data_anota)
             VALUES (?, ?, ?, ?, ?, ?)`, a
        );
    }
    console.log(`  ✓ ${anotacoes.length} anotações.`);

    // ── 11. contem ───────────────────────────────────────────────────────────
    console.log('  Inserindo contem...');
    const contems = [
        [33441, 121], [11667, 156], [39001, 458], [12785, 239], [55234, 310],
    ];
    for (const c of contems) {
        await conn.run(
            `INSERT OR IGNORE INTO contem (cod_pasta, cod_resposta) VALUES (?, ?)`, c
        );
    }
    console.log(`  ✓ ${contems.length} registros em contem.`);

    // ── 12. possui ───────────────────────────────────────────────────────────
    console.log('  Inserindo possui...');
    const possuies = [
        [11154, 121], [26667, 156], [96514, 458], [13579, 239], [22468, 310],
    ];
    for (const p of possuies) {
        await conn.run(
            `INSERT OR IGNORE INTO possui (cod_quest, cod_resposta) VALUES (?, ?)`, p
        );
    }
    console.log(`  ✓ ${possuies.length} registros em possui.`);

    await conn.close();
    console.log('✅ Seed concluído com sucesso!');
}

runSeed().catch((err) => {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
});
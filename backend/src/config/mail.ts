import nodemailer from 'nodemailer';

// Guarda a conta de teste do Ethereal em memória, criada uma única vez por
// execução do servidor (ver mailConfig abaixo).
let contaTesteCache: ReturnType<typeof nodemailer.createTestAccount> | null = null;

/**
 * Configuração de transporte SMTP.
 *
 * É uma função `async` — e não um objeto estático — porque em desenvolvimento
 * (NODE_ENV=development) criamos, em tempo de execução, uma conta de teste
 * descartável no Ethereal (https://ethereal.email). Essa criação é uma
 * chamada de rede, então a configuração precisa ser assíncrona.
 *
 * Em produção, as credenciais vêm só de variáveis de ambiente — nenhuma
 * senha fica no código-fonte nem é versionada no repositório.
 */
async function mailConfig() {
  const config = {
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  if (process.env.NODE_ENV === 'development' && !config.host) {
    // Cria a conta de teste do Ethereal só na PRIMEIRA vez que alguém se
    // cadastra nesta execução do servidor. As próximas chamadas reaproveitam
    // a mesma conta (guardada em memória), em vez de fazer uma nova chamada
    // de rede a cada cadastro — é isso que deixava o cadastro lento.
    if (!contaTesteCache) {
      contaTesteCache = nodemailer.createTestAccount();
    }
    const contaTeste = await contaTesteCache;

    return {
      host: contaTeste.smtp.host,
      port: contaTeste.smtp.port,
      secure: contaTeste.smtp.secure,
      auth: { user: contaTeste.user, pass: contaTeste.pass },
    };
  }

  return config;
}

export default mailConfig;
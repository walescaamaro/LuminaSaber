import nodemailer from 'nodemailer';

import mailConfig from '../config/mail.js';

/**
 * Serviço de envio de e-mail transacional.
 *
 * Cada função exposta descreve a INTENÇÃO do envio (ex.: "avise que a conta
 * foi criada"), não o transporte. Quem chama este serviço não escolhe
 * assunto, remetente nem formato da mensagem — isso fica concentrado aqui.
 * Nenhum outro arquivo do projeto (rotas, controllers, models) importa
 * "nodemailer" diretamente.
 */

const REMETENTE = 'LuminaSaber <naoresponda@luminasaber.app>';

async function enviar(destinatario: string, assunto: string, texto: string, html: string) {
  const config = await mailConfig();

  // Sem SMTP configurado (ex.: em teste automatizado) o envio é apenas
  // registrado no log — não derruba quem chamou.
  if (!config.host) {
    console.warn(`[e-mail] SMTP não configurado: mensagem para ${destinatario} não enviada.`);
    return;
  }

  const transporte = nodemailer.createTransport(config);

  const info = await transporte.sendMail({
    from: REMETENTE,
    to: destinatario,
    subject: assunto,
    // A mensagem vai nos dois formatos: clientes de e-mail que não
    // renderizam HTML caem no texto puro. É a norma no envio transacional.
    text: texto,
    html,
  });

  if (process.env.NODE_ENV === 'development') {
    // Conta de teste do Ethereal: imprime a URL de prévia no terminal.
    // Nada é entregue a um destinatário real.
    console.log(`[e-mail] Prévia da mensagem: ${nodemailer.getTestMessageUrl(info)}`);
  }
}

/**
 * Dispara o e-mail de boas-vindas logo após o cadastro ser concluído com
 * sucesso. Deve ser chamado DEPOIS de o usuário já existir no banco — não
 * faz sentido avisar sobre uma conta que falhou ao ser criada.
 */
async function boasVindas(destinatario: string, nome: string) {
  const primeiroNome = nome.trim().split(/\s+/)[0] || nome;

  const texto =
    `Olá, ${primeiroNome}!\n\n` +
    'Sua conta no LuminaSaber foi criada com sucesso.\n' +
    'Agora você já pode entrar na plataforma e começar a estudar.\n\n' +
    'Equipe LuminaSaber';

  const html = `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #16323d;">
      <h1 style="font-size: 20px;">Olá, ${primeiroNome}! 🎉</h1>
      <p style="font-size: 14.5px; line-height: 1.6;">
        Sua conta no <strong>LuminaSaber</strong> foi criada com sucesso.
        Agora você já pode entrar na plataforma e começar a estudar.
      </p>
      <p style="font-size: 12.5px; color: #6b7a80; margin-top: 24px;">
        Se você não criou esta conta, pode ignorar esta mensagem.
      </p>
    </div>`;

  await enviar(destinatario, 'Conta criada no LuminaSaber 🎉', texto, html);
}

export const SendMail = { boasVindas };
export default SendMail;
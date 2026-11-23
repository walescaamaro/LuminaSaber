import { randomUUID } from 'node:crypto';
import { expect, test } from './fixtures.js';

test('SUCESSO E2E: cadastra usuário e cria, edita e exclui anotação pela interface', async ({ page }) => {
  const identificador = randomUUID();
  const email = `e2e-${identificador}@luminasaber.test`;
  const titulo = `Anotação E2E ${identificador}`;

  await page.goto('/cadastro');
  await page.getByLabel('Nome', { exact: true }).fill('Estudante E2E');
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill('E2e!Senha2026');
  await page.getByLabel('Confirme a senha').fill('E2e!Senha2026');
  await page.getByLabel('Grau escolar').selectOption({ label: '8º ano' });
  await page.getByLabel('Data de nascimento').fill('2000-01-01');
  await page.getByRole('button', { name: 'Cadastrar' }).click();

  await expect(page).toHaveURL(/\/painel$/);
  await page.goto('/anotacoes');
  await expect(page.getByRole('heading', { name: 'Minhas anotações' })).toBeVisible();

  const nomePasta = `Pasta E2E ${identificador}`;
  await page.getByRole('button', { name: '+ Nova pasta' }).click();
  const dialogPasta = page.getByRole('dialog', { name: 'Nova pasta' });
  await dialogPasta.getByRole('textbox', { name: 'Ex: Matemática' }).fill(nomePasta);
  await dialogPasta.getByRole('button', { name: 'Criar pasta' }).click();
  await expect(page.locator('#listaPastas').getByText(nomePasta, { exact: true })).toBeVisible();

  await page.getByPlaceholder('Título da anotação').fill(titulo);
  await page.getByPlaceholder('Digite suas ideias...').fill('Conteúdo criado no fluxo de ponta a ponta.');
  await page.getByLabel('Pasta da nova anotação').selectOption({ label: nomePasta });
  await page.getByRole('button', { name: 'Salvar anotação' }).click();

  const cardOriginal = page.locator('.card').filter({ hasText: titulo });
  await expect(cardOriginal).toBeVisible();
  await expect(cardOriginal.locator('p.texto')).toHaveText('Conteúdo criado no fluxo de ponta a ponta.');
  await expect(cardOriginal.getByText(nomePasta, { exact: true }).first()).toBeVisible();

  await cardOriginal.getByRole('button', { name: 'Editar' }).click();
  await cardOriginal.getByRole('textbox', { name: 'Título da anotação' }).fill(`${titulo} editada`);
  await cardOriginal.getByRole('textbox', { name: 'Texto da anotação' }).fill('Conteúdo revisado pela interface.');
  await cardOriginal.getByRole('button', { name: 'Salvar alterações' }).click();

  const cardEditado = page.locator('.card').filter({ hasText: `${titulo} editada` });
  await expect(cardEditado.locator('p.texto')).toHaveText('Conteúdo revisado pela interface.');
  await cardEditado.getByRole('button', { name: 'Excluir' }).click();
  const dialogExclusao = page.getByRole('dialog', { name: 'Excluir anotação' });
  await expect(dialogExclusao).toBeVisible();
  await dialogExclusao.getByRole('button', { name: 'Excluir permanentemente' }).click();
  await expect(page.getByText('Nenhuma anotação por aqui ainda.')).toBeVisible();

  await page.goto('/loja');
  await expect(page.getByRole('heading', { name: 'Loja Estelar' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Comprar' }).first()).toBeDisabled();
});

test('ERRO E2E: login com credenciais incorretas exibe mensagem acessível', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('E-mail', { exact: true }).fill('nao-existe@luminasaber.test');
  await page.getByLabel('Senha', { exact: true }).fill('SenhaErrada1!');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();

  await expect(page.getByText(/incorreto|não encontrado/i)).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

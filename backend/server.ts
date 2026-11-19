import 'dotenv/config';
import app from './app.js';

console.log('Groq key carregada?', !!process.env.GROQ_API_KEY);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

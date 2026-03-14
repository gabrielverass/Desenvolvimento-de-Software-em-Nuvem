import express from 'express';
import userRoutes from './routes/userRoutes.js';
import cursoRoutes from './routes/cursoRoutes.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('./swagger.json');


const app = express();

// Adiciona as depenpendencias.
app.use(

  express.json(), // Para interpretar JSON .
  cors(), //Para permitir requisições de outros domínios.
  '/api-docs', // Rota para acessar a documentação da API.
  swaggerUi.serve, //Middleware para servir a interface do Swagger UI. 
  swaggerUi.setup(swaggerDocument) //Configura o Swagger UI com o documento de especificação da API.

);

//Acessa todas as rotas
app.use('/', userRoutes, cursoRoutes);


// Inicia o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});

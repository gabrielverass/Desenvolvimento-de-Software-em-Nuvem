import express from 'express';
import router from './routes.js';
import cors from 'cors';


const app = express();

// Adiciona as depenpendencias.
app.use(

  express.json(), 
  cors()

);

//Acessa todas as rotas definidas em routes.js
app.use('/', router);


// Inicia o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});

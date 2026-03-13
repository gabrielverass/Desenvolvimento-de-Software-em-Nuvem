import express from 'express';
import userRoutes from './routes/userRoutes.js';
import cursoRoutes from './routes/cursoRoutes.js';
import cors from 'cors';


const app = express();

// Adiciona as depenpendencias.
app.use(

  express.json(), 
  cors()

);

//Acessa todas as rotas
app.use('/', userRoutes, cursoRoutes);


// Inicia o servidor
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});

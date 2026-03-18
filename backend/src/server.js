import express from 'express';
import userRoutes from './routes/userRoutes.js';
import ativosRoutes from './routes/ativosRoutes.js';
import cors from 'cors';
import swaggerUI from 'swagger-ui-express';
import { swaggerDocument } from './swagger.js';


const app = express();

// Adiciona as depenpendencias.
app.use(

  express.json(), // Para interpretar JSON .
  cors() //Para permitir requisições de outros domínios.
);

app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//Acessa todas as rotas
app.use('/', userRoutes, ativosRoutes);


// Inicia o servidor
app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

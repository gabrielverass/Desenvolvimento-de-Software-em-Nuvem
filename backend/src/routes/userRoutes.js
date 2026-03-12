import express from 'express';
import { efetuarCadastro } from '../controller/usercontroller.js';


const router = express.Router();


//cadastro de usuário
router.post('/auth/register', efetuarCadastro);

//Login de usuário
router.post('/auth/login', (req, res) => {
  // Lógica para autenticar o usuário
  res.json({ message: 'Usuário autenticado com sucesso!' });
});

export default router;
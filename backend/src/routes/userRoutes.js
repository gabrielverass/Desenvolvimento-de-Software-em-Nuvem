import express from 'express';
import { efetuarCadastro, loginUsuario } from '../controller/usercontroller.js';

const router = express.Router();

//cadastro de usuário
router.post('/auth/register', efetuarCadastro);

//Login de usuário
router.post('/auth/login', loginUsuario);

export default router;
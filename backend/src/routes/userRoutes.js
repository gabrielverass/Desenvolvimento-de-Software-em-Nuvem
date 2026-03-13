import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import { efetuarCadastro, loginUsuario } from '../controller/usercontroller.js';

const router = express.Router();

//cadastro de usuário
router.post('/auth/register', efetuarCadastro);

//Login de usuário
router.post('/auth/login', loginUsuario);

router.get('/estaLogado', authMiddleware, (req, res) => {

    return res.status(200).json({ message: 'Usuário autenticado!' });

});

export default router;
import express from 'express';
import {authMiddleware, adminMiddleware} from '../middleware/authMiddleware.js';
import { efetuarCadastro, loginUsuario } from '../controller/usercontroller.js';

const router = express.Router();



//Login de usuário
router.post('/auth/login', loginUsuario);

//cadastro de usuário
router.post('/auth/register', authMiddleware, adminMiddleware, efetuarCadastro);

//rota para editar perfil do usuário com autenticação e autorização de admin.
router.put('/editarusuario/:id', authMiddleware, adminMiddleware, editarUsuario);

//rota para deletar usuário com autenticação e autorização de admin.
router.delete('/deletarusuario/:id', authMiddleware, adminMiddleware, deletarUsuario);


export default router;
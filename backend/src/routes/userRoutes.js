import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {adminMiddleware} from '../middleware/adminMiddleware.js';
import { efetuarCadastro, loginUsuario, editarUsuario, deletarUsuario, listarTodosUsuarios } from '../controller/usercontroller.js';

const router = express.Router();

//Login de usuário
router.post('/login', loginUsuario);

//cadastro de usuário
router.post('/cadastrarusuario', efetuarCadastro);

//rota para editar perfil do usuário com autenticação e autorização de admin.
router.patch('/editarusuario/:id', editarUsuario);

//rota para deletar usuário com autenticação e autorização de admin.
router.delete('/deletarusuario/:id', deletarUsuario);

//rota para listar todos os usuários, apenas para admins.
router.get('/listarusuarios', listarTodosUsuarios);


export default router;
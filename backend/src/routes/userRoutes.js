import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {adminMiddleware} from '../middleware/adminMiddleware.js';
import { efetuarCadastro, loginUsuario, editarUsuario, deletarUsuario, listarTodosUsuarios, alterarSenha } from '../controller/usercontroller.js';

const router = express.Router();

//Login de usuário
router.post('/login', loginUsuario);

//cadastro de usuário
router.post('/cadastrarusuario', efetuarCadastro);

//rota para editar perfil do usuário com autenticação e autorização de admin.
router.put('/editarusuario/:id', editarUsuario);

//rota para deletar usuário com autenticação e autorização de admin.
router.delete('/deletarusuario/:id', deletarUsuario);

//rota para listar todos os usuários, apenas para admins.
router.get('/listarusuarios', listarTodosUsuarios);

//rota para editar senha do usuário, apenas para o próprio usuário ou admin.
router.put('/editarsenha/:id', alterarSenha);


export default router;
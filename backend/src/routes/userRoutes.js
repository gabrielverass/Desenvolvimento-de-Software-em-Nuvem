import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {adminMiddleware} from '../middleware/adminMiddleware.js';
import { efetuarCadastro, loginUsuario, editarUsuario, deletarUsuario, listarTodosUsuarios, alterarSenha } from '../controller/usercontroller.js';

const router = express.Router();

//Login de usuário, rota pública, sem autenticação necessária.
router.post('/login', loginUsuario);

//cadastro de usuário, rota protegida, apenas admins podem cadastrar novos usuários.
router.post('/cadastrarusuario', authMiddleware, adminMiddleware, efetuarCadastro);

//rota para editar perfil do usuário com autenticação e autorização de admin.
router.put('/editarusuario/:id', authMiddleware, adminMiddleware, editarUsuario);

//rota para deletar usuário com autenticação e autorização de admin.
router.delete('/deletarusuario/:id', authMiddleware, adminMiddleware, deletarUsuario);

//rota para listar todos os usuários, apenas para admins.
router.get('/listarusuarios', authMiddleware, adminMiddleware, listarTodosUsuarios);

//rota para editar senha do usuário, apenas para o admin.
router.put('/editarsenha/:id', authMiddleware, adminMiddleware, alterarSenha);


export default router;
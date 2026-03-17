import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {adminMiddleware} from '../middleware/adminMiddleware.js';
import {criarNovoAtivo, listarAtivos, buscarAtivoPorCampo, editarAtivo, deletarAtivo} from '../controller/ativosController.js';

const router = express.Router();

//rota para criar um novo ativo, protegida por autenticação e autorização de admin.
router.post('/cadastrarequipamento', criarNovoAtivo);

//rota para buscar um ativo por patrimônio, protegida por autenticação e autorização de admin.
router.get('/buscarequipamento/:patrimonio', buscarAtivoPorCampo);

//rota para listar todos os ativos, protegida por autenticação e autorização de admin.
router.get('/listarequipamentos', listarAtivos);

//rota para editar um ativo, protegida por autenticação e autorização de admin.
router.put('/editarequipamento/:id', editarAtivo);

//rota para deletar um ativo, protegida por autenticação e autorização de admin.
router.delete('/deletarequipamento/:id', deletarAtivo);


export default router;
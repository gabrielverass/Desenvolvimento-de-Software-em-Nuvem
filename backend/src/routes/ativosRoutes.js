import express from 'express';
import {authMiddleware} from '../middleware/authMiddleware.js';
import {criarNovoAtivo, listarAtivos, buscarAtivoPorCampo, editarAtivo, deletarAtivo} from '../controller/ativosController.js';

const router = express.Router();

//rota para criar um novo ativo, protegida por autenticação .
router.post('/cadastrarequipamento', authMiddleware, criarNovoAtivo);

//rota para buscar um ativo por patrimônio, protegida por autenticação.
router.get('/buscarequipamento/:patrimonio', authMiddleware, buscarAtivoPorCampo);

//rota para listar todos os ativos, protegida por autenticação.
router.get('/listarequipamentos', authMiddleware, listarAtivos);

//rota para editar um ativo, protegida por autenticação.
router.put('/editarequipamento/:id', authMiddleware, editarAtivo);

//rota para deletar um ativo, protegida por autenticação.
router.delete('/deletarequipamento/:id', authMiddleware, deletarAtivo);


export default router;
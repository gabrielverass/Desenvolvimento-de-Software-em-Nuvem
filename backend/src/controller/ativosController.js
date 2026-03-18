import {criarAtivo, listarTodosAtivos, buscarAtivo, deletarAtivoPorId, editarAtivoPorId} from '../service/ativosServices.js';

export const criarNovoAtivo = async (req, res) => {

    try {

        const ativo = req.body;

        const resultado = await criarAtivo(ativo);

        if (resultado.error) { 
            return res.status(400).json({ success: false, error: "Erro ao criar ativo" });
        }

        return res.status(201).json({ success: true, message: "Ativo criado com sucesso!" });

    } catch (error) {

        res.status(500).json({ success: false, error: 'Ocorreu um erro ao criar o ativo.' });

    };

};

export const listarAtivos = async (req, res) => {

    try {

        const resultado = await listarTodosAtivos();

        if (resultado.error) { 
            return res.status(400).json({ message: resultado.message,});
        }

        return res.status(200).json({ message: resultado.message, data: resultado.data });

    } catch (error) {

        console.error('Erro ao listar ativos:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao listar os ativos.' });
    }

};

export const buscarAtivoPorCampo = async (req, res) => {

    try {

        const { campo, valor } = req.params;

        const resultado = await buscarAtivo(campo, valor);

        if (resultado.error) {
            return res.status(400).json({ message: resultado.message,});
        }

        return res.status(200).json({ resultado });

    } catch (error) { 
        console.error('Erro ao buscar ativo:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao buscar o ativo.' });
    }
};

export const editarAtivo = async (req, res) => {

    try {

        const id = req.params.id;

        const dadosAtualizados = req.body;

        const resultado = await editarAtivoPorId(id, dadosAtualizados);

        if (resultado.error) { 
            return res.status(400).json({ message: resultado.message,});
        }

        return res.status(200).json({ message: resultado.message });

    } catch (error) {

        console.error('Erro ao editar ativo:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao editar o ativo.' });

    }
};

export const deletarAtivo = async (req, res) => {

    try {

        const id = req.params.id;

        const resultado = await deletarAtivoPorId(id);

        if (resultado.error) { 
            return res.status(400).json({ message: resultado.message,});
        }

        return res.status(200).json({ message: resultado.message });

    } catch (error) {

        console.error('Erro ao deletar ativo:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao deletar o ativo.' });

    }
};
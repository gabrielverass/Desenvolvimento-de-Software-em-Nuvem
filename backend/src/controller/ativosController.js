import {criarAtivo, listarTodosAtivos, buscarAtivo, deletarAtivoPorId, editarAtivoPorId} from '../service/ativosServices.js';

export const criarNovoAtivo = async (req, res) => {

    try {

        const ativo = req.body;

        const resultado = await criarAtivo(ativo);

        if (resultado.error) { 
            return res.status(400).json({error: 'Ocorreu um erro ao criar o ativo.' });
        }

        return res.status(201).json({message: "Ativo criado com sucesso!" });

        } catch (error) {

            res.status(500).json({error: 'Ocorreu um erro ao criar o ativo.' });

        };

};

export const listarAtivos = async (req, res) => {

    try {

        const resultado = await listarTodosAtivos();

        if (resultado.error) { 
            return res.status(400).json({ error: 'Ocorreu um erro ao listar os ativos.'});
        }

        return res.status(200).json({ message: resultado.message, data: resultado.data });

    } catch (error) {

        res.status(500).json({ error: 'Ocorreu um erro ao listar os ativos.' });
    }

};

export const buscarAtivoPorPatrimonio = async (req, res) => {

    try {

        const valor = req.params.patrimonio;

        const resultado = await buscarAtivo("patrimonio", valor);

        if (resultado.error) {
            return res.status(400).json({ error: 'Ocorreu um erro ao buscar o ativo.'});
        }

        return res.status(200).json({ resultado });

    } catch (error) { 

        res.status(500).json({ error: 'Ocorreu um erro ao buscar o ativo.' });
    }
};

export const editarAtivo = async (req, res) => {

    try {

        const id = req.params.id;

        const dadosAtualizados = req.body;

        const resultado = await editarAtivoPorId(id, dadosAtualizados);

        if (resultado.error) { 
            return res.status(400).json({ error: "Ocorreu um erro ao editar o ativo." });
        }

        return res.status(200).json({ message: resultado.message });

    } catch (error) {

        res.status(500).json({ error: 'Ocorreu um erro ao editar o ativo.' });

    }
};

export const deletarAtivo = async (req, res) => {

    try {

        const id = req.params.id;

        const resultado = await deletarAtivoPorId(id);

        if (resultado.error) { 
            return res.status(400).json({ error: 'Ocorreu um erro ao deletar o ativo.'});
        }

        return res.status(200).json({ message: resultado.message });

    } catch (error) {

        res.status(500).json({ error: 'Ocorreu um erro ao deletar o ativo.' });

    }
};
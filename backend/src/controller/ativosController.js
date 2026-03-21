//Camada função do controller é responsável por lidar com a requisição, chamar a função de serviço correspondente e enviar a resposta adequada para o cliente. 
// O controller atua como uma camada intermediária entre as rotas e os serviços, garantindo que a lógica de negócios seja separada da lógica de manipulação de requisições e respostas.

import {criarAtivo, listarTodosAtivos, buscarAtivo, deletarAtivoPorId, editarAtivoPorId} from '../service/ativosServices.js';

//Função para criar um novo ativo, recebe os dados do ativo no corpo da requisição, chama a função de serviço para criar o ativo e retorna a resposta adequada.
export const criarNovoAtivo = async (req, res) => {

    try {

        const ativo = req.body;

        const resultado = await criarAtivo(ativo);

        if (resultado.error) { 
            return res.status(400).json({error: resultado.message || 'Ocorreu um erro ao criar o ativo.'});
        }

        return res.status(201).json({message: "Ativo criado com sucesso!" });

        } catch (error) {

            res.status(500).json({error: error || 'Ocorreu um erro ao criar o ativo.' });

        };

};

//Função para listar todos os ativos, chama a função de serviço para listar os ativos e retorna a resposta adequada.
export const listarAtivos = async (req, res) => {

    try {

        const resultado = await listarTodosAtivos();

        if (resultado.error) { 
            return res.status(400).json({ error: resultado.message || 'Ocorreu um erro ao listar os ativos.' });
        }

        return res.status(200).json({ message: resultado.message, data: resultado.data });

    } catch (error) {

        res.status(500).json({ error: error || 'Ocorreu um erro ao listar os ativos.'});
    }

};

//Função para buscar um ativo por patrimônio, recebe o patrimônio como parâmetro na URL, chama a função de serviço para buscar o ativo e retorna a resposta adequada.
export const buscarAtivoPorPatrimonio = async (req, res) => {

    try {

        const valor = req.params.patrimonio;

        const resultado = await buscarAtivo("patrimonio", valor);

        if (resultado.error) {
            return res.status(400).json({ error: resultado.message || 'Ocorreu um erro ao buscar o ativo.'});
        }

        return res.status(200).json({ message: resultado.message, data: resultado.data });

    } catch (error) { 

        res.status(500).json({ error: error || 'Ocorreu um erro ao buscar o ativo.' });
    }
};

//Função para editar um ativo, recebe o ID do ativo como parâmetro na URL e os dados atualizados no corpo da requisição, chama a função de serviço para editar o ativo e retorna a resposta adequada.
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

//Função para deletar um ativo, recebe o ID do ativo como parâmetro na URL, chama a função de serviço para deletar o ativo e retorna a resposta adequada.
export const deletarAtivo = async (req, res) => {

    try {

        const id = req.params.id;

        const resultado = await deletarAtivoPorId(id);

        if (resultado.error) { 
            return res.status(400).json({ error: resultado.message || 'Ocorreu um erro ao deletar o ativo.'});
        }

        return res.status(200).json({ message: resultado.message });

    } catch (error) {

        res.status(500).json({ error: error || 'Ocorreu um erro ao deletar o ativo.' });

    }
};
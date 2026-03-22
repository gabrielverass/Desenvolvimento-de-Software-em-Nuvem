import {inserirAtivo, buscarAtivoPorCampo, deletarAtivo, editarAtivo, listarAtivos, limparTabelaAtivos} from '../database/functions/ativosHelpers.js';
import {ativoExiste} from '../database/validators/ativosValidator.js';
import {errorLogger} from '../logger/logger.js';


//Função para criar um novo ativo, verificando se o ativo já existe antes de tentar criar.
export async function criarAtivo(ativo) {

    try {

        //verifica se o ativo já existe no db.
        const ativoExistente = await ativoExiste(ativo.patrimonio);

        //caso ocorra um erro, retorna o erro.
        if(ativoExistente.error) {

            errorLogger.error(`Erro ao verificar existência do ativo: ${ativoExistente.error}`);

            return {
                message: 'Erro ao verificar existência do ativo.', 
                error: true 
            }
        };

        //caso exista, retorna uma mensagem de erro e sai da função antes de tentar enviar os dados para o db.

        if (ativoExistente.exists) { 
            return { 
                message: 'Equipamento já cadastrado.',
                error: true
            };
        };

        //Tenta inserir o ativo no banco de dados.
        const resultado = await inserirAtivo(ativo);

        //Caso ocorra um erro, retorna o erro.
        if (resultado.error) {
            errorLogger.error(`Erro ao criar ativo: ${resultado.error}`);
            return { 
                message: 'Erro ao criar ativo.', 
                error: true 
            }
        };

        return {
            message: resultado.message,
            status: resultado.status
        };

    } catch (error) {

        errorLogger.error(`Erro ao criar ativo: ${error.message}`);

        return { 
            message: 'Erro ao criar ativo.',
            error: true
        };

    }
};

//Função para listar todos os ativos, retornando uma mensagem de erro caso ocorra algum erro durante a consulta ao banco de dados.
export const listarTodosAtivos = async () => {

    try {

        const resultado = await listarAtivos();

        if (resultado.error) {
            errorLogger.error(`Erro ao listar ativos: ${resultado.error}`); 
            return {
                message: 'Erro ao listar ativos.', 
                error: true 
            }
        };

        return { 
            message:resultado.message,
            data: resultado.data 
        };

    } catch (error) {

        errorLogger.error(`Erro ao listar ativos: ${error.message}`);

        return {
            message: 'Erro ao listar ativos.', 
            error: true 
        };

    }
};

//Função para buscar um ativo por um campo específico, retornando uma mensagem de erro caso ocorra algum erro durante a consulta ao banco de dados
export const buscarAtivo = async (campo, valor) => {

    try {

        const resultado = await buscarAtivoPorCampo(campo, valor);

        if (resultado.error) {
            errorLogger.error(`Erro ao buscar ativo: ${resultado.error}`);
            return { 
                message: 'Erro ao buscar ativo.',
                error: true 
            }
        };

        if (!resultado.data) { 
            return { 
                message: 'Ativo não encontrado.',
                error: true
            }};

        return { 
            message: 'Ativo encontrado com sucesso!',
            data: resultado.data
        };

    } catch (error) {

        errorLogger.error(`Erro ao buscar ativo: ${error.message}`);

        return { 
            message: 'Erro ao buscar ativo.',
            error: true,  
        };

    }
};

//Função para deletar um ativo por id
export const deletarAtivoPorId = async (id) => {

    try {

        //tenta localizar o ativo antes de tentar deletar.
        const ativo = await buscarAtivoPorCampo('id', id);

        if (ativo.error) {
            errorLogger.error(`Erro ao verificar existência do ativo: ${ativo.error}`);
            return {
                message: 'Erro ao verificar existência do ativo.',
                error: true
            }
        };

        if (!ativo.data) {
            return {
                message: 'Ativo não encontrado.',
                error: true
            }
        };

        //tenta deletar o ativo do banco de dados.
        const resultado = await deletarAtivo(id);

        if (resultado.error) {
            errorLogger.error(`Erro ao deletar ativo: ${resultado.error}`);
            return { 
                message: 'Erro ao deletar ativo.',
                error: true
            }
        };
        return { 
            message: resultado.message,
            status: resultado.status
        };
    } catch (error) {

        errorLogger.error(`Erro ao deletar ativo: ${error.message}`);
        return { 
            message: 'Erro ao deletar ativo.',
            error: true
        };
    }
};

//Função para editar um ativo por id, verificando se o ativo existe antes de tentar editar, 
// e verificando se o patrimônio foi alterado, caso tenha sido, verifica se o novo patrimônio já existe no banco de dados.
export const editarAtivoPorId = async (id, ativo) => {

    try {

        //tenta localizar o ativo antes de tentar editar.
        const ativoExistente = await buscarAtivoPorCampo('id', id);

        if (ativoExistente.error) {

            errorLogger.error(`Erro ao verificar existência do ativo para edição: ${ativoExistente.error}`);

            return {
                message: 'Erro ao verificar existência do ativo.',
                error: true
            }
        };

        if (!ativoExistente.data) {
            return {
                message: 'Ativo não encontrado.',
                error: true
            }
        }

        //verifica se o patrimônio foi alterado, caso tenha sido, verifica se o novo patrimônio já existe no banco de dados.
        if(ativo.patrimonio !== ativoExistente.data.patrimonio) {
            const patrimonioExistente = await ativoExiste(ativo.patrimonio);

            if (patrimonioExistente.error) {

                errorLogger.error(`Erro ao verificar existência do patrimônio para edição: ${patrimonioExistente.error}`);

                return {
                    message: 'Erro ao verificar existência do patrimônio.',
                    error: true
                }
            }

            if (patrimonioExistente.exists) {
                return {
                    message: 'Patrimônio já cadastrado.',
                    error: true
                }
            }
        }

        //tenta editar o ativo no banco de dados.
        const resultado = await editarAtivo(id, ativo);

        if (resultado.error) {

            errorLogger.error(`Erro ao editar ativo: ${resultado.error}`);

            return {
                message: 'Erro ao editar ativo.',
                error: true
            }
        };
        return {
            message: resultado.message,
            data: resultado.data
        };

    } catch (error) {

        errorLogger.error(`Erro ao editar ativo: ${error.message}`);

        return {
            message: 'Erro ao editar ativo.',
            error: true
        };
    };
};

//Função para limpar a tabela de ativos, usada para garantir que os testes sejam executados em um ambiente limpo.
export const limparAtivos = async () => {

    try {

        const resultado = await limparTabelaAtivos();

        if (resultado.error) {

            errorLogger.error(`Erro ao limpar tabela de ativos: ${resultado.error}`);

            return {
                message: 'Erro ao limpar tabela de ativos.',
                error: true
            }
        }
        return {
            message: resultado.message,
            status: resultado.status
        };

    } catch (error) {

        errorLogger.error(`Erro ao limpar tabela de ativos: ${error.message}`);

        return {
            message: 'Erro ao limpar tabela de ativos.',
            error: true
        };
    }
};
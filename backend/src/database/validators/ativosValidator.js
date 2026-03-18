import {buscarAtivoPorCampo} from "../functions/ativosHelpers.js";


export const ativoExiste = async (patrimonio) => {

    const resultado = await buscarAtivoPorCampo('patrimonio', patrimonio);

    if (resultado.error) {
        return {
            error: resultado.error,
            message: 'Erro ao verificar existência do ativo.'
        };
    }

    return { 
        exists: resultado.data ? true : false,
        error: null
    };
    
};
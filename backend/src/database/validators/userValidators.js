import { buscarUsuarioPorCampo} from '../functions/userHelpers.js';

//Verifica se o cpf já existe no db.
export const cpfCadastrado = async (cpf) => {


    const resultado = await buscarUsuarioPorCampo('cpf', cpf);
    
    if (resultado.error) {
        return {
            error: resultado.error,
            message: 'Erro ao verificar CPF.'
        };
    }

    return { 
        exists: resultado.data ? true : false,
        error: null
    };

};

export const emailCadastrado = async (email) => {

    const resultado = await buscarUsuarioPorCampo('email', email);

    if (resultado.error) {
        return {
            error: resultado.error,
            message: 'Erro ao verificar email.'
        };
    };

    return { 
        exists: resultado.data ? true : false,
        error: null
    };
};
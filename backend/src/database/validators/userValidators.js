import { buscarUsuarioPorCampo} from '../functions/userHelpers.js';

//Verifica se o cpf já existe no db.
export const cpfCadastrado = async (cpf) => {

    return await buscarUsuarioPorCampo("cpf", cpf)
        .then(result => {
            if (result.data) {
                return true; // CPF já existe
            } else {
                return false; // CPF não existe
            }
        })
        .catch(error => {
            console.error('Erro ao verificar CPF:', error);
            return false; // Em caso de erro, assume que o CPF não existe
        });
};

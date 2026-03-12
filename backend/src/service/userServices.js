import bcrypt from 'bcryptjs';
import { inserirUsuario } from '../database/functions/userHelpers.js';
import { cpfCadastrado } from '../database/validators/userValidators.js';

export const cadastrarUsuario = async (user) => {

    //define o salt para a criptografia da senha, o uso do await é importante para garantir que o servidor consiga responder a outras requisições
    // sem ser bloqueado durante o processo de criptografia.
    const salt = await bcrypt.genSalt(10);
    
    //criptografa a senha do usuario
    user.hash = await bcrypt.hash(user.senha, salt);
    
    //verifica se o cpf já existe no db.
    const cpfExistente = await cpfCadastrado(user.cpf);

    //caso exista, retorna uma mensagem de erro e sai da função antes de tentar enviar os dados para o db.
    if (cpfExistente) {
        return { error: 'usuario já cadastrado.' };
    };

    try {

        const resultado = await inserirUsuario(user)

        if (resultado.error) {
            return { error: resultado.error };
        }

        return { message: resultado.message, status: resultado.status };

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return { error: 'Ocorreu um erro ao cadastrar o usuário.' };
    };


};
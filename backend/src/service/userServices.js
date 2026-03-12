import bcrypt from 'bcryptjs';
import { inserirUsuario, buscarUsuarioPorCampo } from '../database/functions/userHelpers.js';
import { cpfCadastrado } from '../database/validators/userValidators.js';
import jwt from 'jsonwebtoken';

export const cadastrarUsuario = async (user) => {

    //define o salt para a criptografia da senha, o uso do await é importante para garantir que o servidor consiga responder a outras requisições
    // sem ser bloqueado durante o processo de criptografia.
    const salt = await bcrypt.genSalt(10);
    
    //criptografa a senha do usuario
    user.hash = await bcrypt.hash(user.senha, salt);
    
    //verifica se o cpf já existe no db.
    const cpfExistente = await cpfCadastrado(user.cpf);

    //caso exista, retorna uma mensagem de erro e sai da função antes de tentar enviar os dados para o db.
    if (cpfExistente) {return { error: 'usuario já cadastrado.' }};

    try {

        const resultado = await inserirUsuario(user)

        //Caso ocorra um erro, interrompe a função e retorna o erro.
        if (resultado.error) {return { error: resultado.error }}

        //Em caso de sucesso, retorna a mensagem de sucesso e o status.
        return { message: resultado.message, status: resultado.status };

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return { error: 'Ocorreu um erro ao cadastrar o usuário.' };
    };


};

export const validarUsuario = async (user) => {

    try {

        const resultado = await buscarUsuarioPorCampo('email', user.email);

        //caso ocorra um erro, retorna o erro.
        if (resultado.error) { return { error: resultado.error }};
        //Caso não encontre um usuário, retorna uma mensagem de erro.
        if (!resultado.data) {return { error: 'Usuário não encontrado.' };

        //Caso encontre um usuário, compara a senha fornecida com a senha armazenada no banco de dados.
        const validarSenha = await bcrypt.compare(user.senha, resultado.data.hash);

        //Caso a senha seja inválida, retorna uma mensagem de erro.
        if (!validarSenha) {return { error: 'Senha incorreta.' }};

        //gera o token jwt e retorna para o controller.
        const token = jwt.sign({ id: resultado.data.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { message: 'Usuário autenticado com sucesso!', token };
        
    }

    } catch (error) {
        console.error('Erro ao validar usuário:', error);
        return { error: 'Ocorreu um erro ao validar o usuário.' };
    }

}
//Camada de serviços, responsável pela lógica de negócios e comunicação entre controller e a database.

import bcrypt from 'bcryptjs';
import { inserirUsuario, buscarUsuarioPorCampo, editarUsuario, excluirUsuario, editarSenha } from '../database/functions/userHelpers.js';
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
        //busca o usuário no banco de dados usando o email fornecido.
        const resultado = await buscarUsuarioPorCampo('email', user.email);

        //caso ocorra um erro, retorna o erro.
        if (resultado.error) { return { error: resultado.error }};
        //Caso não encontre um usuário, retorna uma mensagem de erro.
        if (!resultado.data) {return { error: 'Usuário não encontrado.' }};

        //Caso encontre um usuário, compara a senha fornecida com a senha armazenada no banco de dados.
        const validarSenha = await bcrypt.compare(user.senha, resultado.data.hash);

        //Caso a senha seja inválida, retorna uma mensagem de erro.
        if (!validarSenha) {return { error: 'Senha incorreta.' }};

        //gera o token jwt e retorna para o controller.
        const token = jwt.sign({ id: resultado.data.id, cargo: resultado.data.cargo }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { message: 'Usuário autenticado com sucesso!', token };
        
    } catch (error) {
        console.error('Erro ao validar usuário:', error);
        return { error: 'Ocorreu um erro ao validar o usuário.' };
    }

}

export const editarUsuario = async (id, dados) => {

    try {
        const resultado = await editarUsuario(id, dados);

        if (resultado.error) { return { error: resultado.error }};
        return { message: 'Usuário editado com sucesso!' };

    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        return { error: 'Ocorreu um erro ao editar o usuário.' };

    }

};

export const deletarUsuario = async (id) => {

    try {

        const resultado = await excluirUsuario(id);

        if (resultado.error) { return { error: resultado.error }};

        return { message: 'Usuário deletado com sucesso!' };

    } catch (error) {

        console.error('Erro ao deletar usuário:', error);
        return { error: 'Ocorreu um erro ao deletar o usuário.' };

    }

};

export const editarSenha = async (id, novaSenha) => {

    try {
        const resultado = await editarSenha(id, novaSenha);

        if (resultado.error) { return { error: resultado.error }};
        return { message: 'Senha editada com sucesso!' };

    } catch (error) {
        console.error('Erro ao editar senha:', error);
        return { error: 'Ocorreu um erro ao editar a senha.' };
    }

};
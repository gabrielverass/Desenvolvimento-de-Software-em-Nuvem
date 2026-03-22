//Camada de serviços, responsável pela lógica de negócios e comunicação entre controller e a database.

import bcrypt from 'bcryptjs';
import { inserirUsuario, buscarUsuarioPorCampo, editarUsuario, 
    excluirUsuario, editarSenha, listarUsuarios, contarAdmins, limparTabelaUsuarios } from '../database/functions/userHelpers.js';
import { cpfCadastrado, emailCadastrado } from '../database/validators/userValidators.js';
import jwt from 'jsonwebtoken';

//adiciona o logger
import {accessLogger, errorLogger} from '../logger/logger.js';

//Função para cadastrar um usuário, usada no controller para cadastrar um novo usuário.
export const cadastrarUsuario = async (user) => {

        //Efetua uma validação simples da presença de todos os dados necessários.
        if (!user.nome || !user.cpf || !user.dataNascimento || !user.email || !user.senha) { 
            //Caso algum dado esteja ausente, retorna um status de erro junto da mensagem.
            return {
                message: 'Todos os campos são obrigatórios.',
                error: true 
            };
        };

    try {

        //define o salt para a criptografia da senha, o uso do await é importante para garantir que o servidor consiga responder a outras requisições
        // sem ser bloqueado durante o processo de criptografia.
        const salt = await bcrypt.genSalt(10);
        
        //criptografa a senha do usuario
        user.hash = await bcrypt.hash(user.senha, salt);
        
        //verifica se o usuario já existe no db.
        const cpfExistente = await cpfCadastrado(user.cpf);
        const emailExistente = await emailCadastrado(user.email);

        if(cpfExistente.error) {

            errorLogger.error(`Erro ao verificar existência do CPF: ${cpfExistente.error}`); 

            return { 
                message: "Erro ao verificar existência do CPF.", 
                error: true      
            } 
        };

        if(emailExistente.error) { 

            errorLogger.error(`Erro ao verificar existência do email: ${emailExistente.error}`); 

            return { 
                message: "Erro ao verificar existência do email." ,
                error: true             
            } 
        };

        //caso exista, retorna uma mensagem de erro e sai da função antes de tentar enviar os dados para o db.
        if (cpfExistente.exists || emailExistente.exists) {return { error: true, message: 'Usuário já cadastrado.' }};

        //Caso o cargo não seja fornecido, define o cargo como 'usuario' por padrão por questões de segurança.
        if (!user.cargo) { user.cargo = 'USER' };

        const resultado = await inserirUsuario(user)

        //Caso ocorra um erro, interrompe a função e retorna o erro.
        if (resultado.error) {
            return { 
                message: "Erro ao cadastrar usuário." ,
                error: true                
            }
        };

        //Em caso de sucesso, retorna a mensagem de sucesso e o status.
        return { message: resultado.message, status: resultado.status };

    } catch (error) {

        errorLogger.error(`Erro ao cadastrar usuário: ${error.message}`);

        return { 
            message: 'Ocorreu um erro ao cadastrar o usuário.',
            error: true 
        };
    };


};

//Função para validar o usuário, usada no controller para validar o login do usuário.
export const validarUsuario = async (user) => {

    try {
        //busca o usuário no banco de dados usando o email fornecido.
        const resultado = await buscarUsuarioPorCampo('email', user.email);

        //caso ocorra um erro, retorna o erro.
        if (resultado.error) { 
            errorLogger.error(`Erro ao buscar usuário: ${resultado.error}`);
            return {
                message: 'Erro ao buscar usuário.',
                error: true
            }
        };

        //Caso não encontre um usuário, retorna uma mensagem de erro.
        if (!resultado.data) {
            return {
                message: 'Usuário não encontrado.',
                error: true
            }
        };

        //Caso encontre um usuário, compara a senha fornecida com a senha armazenada no banco de dados.
        const validarSenha = await bcrypt.compare(user.senha, resultado.data.hash);

        resultado.data.hash = undefined; // remove o campo de hash para não expor a senha criptografada

        //Caso a senha seja inválida, retorna uma mensagem de erro.
        if (!validarSenha) {
            return {
                message: 'Senha incorreta.',
                error: true
            }
        }

        //gera o token jwt e retorna para o controller.
        const token = jwt.sign({ id: resultado.data.id, cargo: resultado.data.cargo }, process.env.JWT_SECRET, { expiresIn: '1h' });

        //Registra o acesso do usuário autenticado no logger de acesso.
        accessLogger.info(`Usuário ${resultado.data.id} autenticado com sucesso.`);

        return {
            user: resultado.data,
            token: token
        };
        
    } catch (error) {

        errorLogger.error(`Erro ao validar usuário: ${error.message}`);
        return { 
            message: 'Ocorreu um erro ao validar o usuário.',
            error: true
        };
    }

}

//Função para editar um usuário, usada no controller para permitir que o admin edite outros usuários.
export const editUsuario = async (id, dados) => {

    try {

        //Verificar se o usuário existe antes de tentar editar
        const usuarioexiste = await buscarUsuarioPorCampo('id', id);

        if (usuarioexiste.error) { 
            errorLogger.error(`Erro ao buscar usuário: ${usuarioexiste.error}`);
            return { 
                message: 'Erro ao buscar usuário.',
                error: true 
            }
        };

        if (!usuarioexiste.data) { 
            return { 
                message: 'Usuário não encontrado.',
                error: true 
            }
        };

        //Verificar se o novo email ou cpf já estão cadastrados em outro usuário
        const emailExistente = await buscarUsuarioPorCampo("email", dados.email);

        if (emailExistente.error) { 
            errorLogger.error(`Erro ao verificar existência do email: ${emailExistente.error}`);
            return { 
                message: "Erro ao verificar existência do email.",
                error: true
            }  
        };

        if (!!emailExistente.exists && emailExistente.exists.id !== id) { 
            return { 
                message: 'Email já cadastrado.',
                error: true
            } 
        };

        //Verificar se o novo cpf já está cadastrado em outro usuário
        const cpfExistente = await buscarUsuarioPorCampo("cpf", dados.cpf);

        if (cpfExistente.error) { 
            errorLogger.error(`Erro ao verificar existência do CPF: ${cpfExistente.error}`);
            return { 
                message: "Erro ao verificar existência do CPF.",
                error: true
            } 
        };

        if (!!cpfExistente.exists && cpfExistente.exists.id !== id) { 
            return { 
                message: 'CPF já cadastrado.', 
                error: true 
            } 
        };

        const resultado = await editarUsuario(id, dados);

        if (resultado.error) { 
            errorLogger.error(`Erro ao editar usuário: ${resultado.error}`);
            return { 
                message: 'Ocorreu um erro ao editar o usuário.',
                error: true 
            }
        };

        return { 
            message: 'Usuário editado com sucesso!',
            status: resultado.status
        };

    } catch (error) {
        errorLogger.error(`Erro ao editar usuário: ${error.message}`);
        return { 
            message: 'Ocorreu um erro ao editar o usuário.',
            error: true
        };
    }

};

//Função para deletar um usuário, usada no controller para permitir que o admin delete outros usuários.
export const deleteUsuario = async (id) => {

    try {

        //Verificar se o usuário existe antes de tentar deletar
        const usuarioexiste = await buscarUsuarioPorCampo('id', id);

        if (usuarioexiste.error) { 
            errorLogger.error(`Erro ao buscar usuário: ${usuarioexiste.error}`);
            return { 
                message: 'Erro ao buscar usuário.',
                error: true
            }
        }

        if (!usuarioexiste.data) { 
            return { 
                message: 'Usuário não encontrado.',
                error: true
            }
        };

        const resultado = await excluirUsuario(id);

        if (resultado.error) { 
            errorLogger.error(`Erro ao deletar usuário: ${resultado.error}`);
            return { 
                message: 'Ocorreu um erro ao deletar o usuário.',
                error: true 
            }
        };

        return { 
            message: 'Usuário deletado com sucesso!',
            status: resultado.status
         };

    } catch (error) {

        errorLogger.error(`Erro ao deletar usuário: ${error.message}`);

        return { 
            message: 'Ocorreu um erro ao deletar o usuário.',
            error: true
        };

    }

};

//Função para editar a senha do usuário, usada no controller para permitir que o admin edite a senha de outros usuários.
export const editSenha = async (id, novaSenha) => {

    try {

        const salt = await bcrypt.genSalt(10);
        
        //criptografa a senha do usuario
        const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

        
        const resultado = await editarSenha(id, senhaCriptografada);

        if (resultado.error) { 
            errorLogger.error(`Erro ao editar senha: ${resultado.error}`);
            return { 
                message: 'Ocorreu um erro ao editar a senha.',
                error: true 
            }
        };

        return { 
            message: 'Senha editada com sucesso!',
            status: resultado.status 
        };

    } catch (error) {

        errorLogger.error(`Erro ao editar senha: ${error.message}`);

        return { 
            message: 'Ocorreu um erro ao editar a senha.',
            error: true
        };
        
    }

};

//Função para listar todos os usuários, usada no controller para retornar a lista de usuários para o admin.
export const todosUsuarios = async () => {

    try {

        const resultado = await listarUsuarios();

        if (resultado.error) {
             return { 
                message: 'Ocorreu um erro ao listar os usuários.',
                error: true 
            }
        };

        return { 
            message: 'Usuários listados com sucesso!', 
            data: resultado.data
         };

    } catch (error) {

        errorLogger.error(`Erro ao listar usuários: ${error.message}`);

        return { 
            message: 'Ocorreu um erro ao listar os usuários.',
            error: true 
        };
    }
};

//Função para verificar se o usuário é admin, usada no middleware de admin para proteger rotas exclusivas para administradores.
export const isadmin = async (id) => {

    try {
        const resultado = await buscarUsuarioPorCampo('id', id);

        if (resultado.error) { return { error: resultado.error }}

        if (!resultado.data) { return { error: 'Usuário não encontrado.' }};

        return { isAdmin: resultado.data.cargo === 'ADMIN' ? true : false };
    } catch (error) {
        errorLogger.error(`Erro ao verificar se o usuário é admin: ${error.message}`);
        return { error: 'Ocorreu um erro ao verificar se o usuário é admin.' };
    }
};

//função usada para contar a quantidade de admins, usada para configuração inicial do sistema, para garantir que sempre haja pelo menos um admin cadastrado.
export const qtdAdmins = async () => {

    try {

        const resultado = await contarAdmins();

        if (resultado.error) { return { count: null }};

        return { count: resultado.count };

    } catch (error) {

        errorLogger.error(`Erro ao contar administradores: ${error.message}`);

        return { error: 'Ocorreu um erro ao contar os administradores.' };
    }
};

//função usada para criar um admin sem validação de dados, usada para configuração inicial do sistema e usuarios de teste
export const criarUsuarioSemValidacao = async (admin) => {

    try {

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(admin.senha, salt);
        admin.hash = hash;
        admin.senha = undefined;

        const resultado = await inserirUsuario(admin);

        if (resultado.error) {
            errorLogger.error(`Erro ao criar admin padrão: ${resultado.error}`); 
            return false
        }

        return true;

    } catch (error) {

        errorLogger.error(`Erro ao criar admin padrão: ${error.message}`);
        return false;
    }

};

//Função usada para limpar a tabela de usuários do banco de testes.
export const limparUsuarios = async () => {

    try {

        const resultado = await limparTabelaUsuarios();
        if (resultado.error) { 
            errorLogger.error(`Erro ao limpar usuários de teste: ${resultado.error}`);
            return { 
                error: resultado.error 
            }
        };

        return { message: 'Usuários de teste limpos com sucesso!' };

    } catch (error) {

        errorLogger.error(`Erro ao limpar usuários de teste: ${error.message}`);
        return { error: 'Ocorreu um erro ao limpar os usuários de teste.' };

    }

};

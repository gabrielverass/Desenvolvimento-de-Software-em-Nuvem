import { qtdAdmins, criarAdminPadrao } from "../service/userServices.js";
import { errorLogger } from "../logger/logger.js";

//Função para configuração inicial do sistema, usada para verificar se há pelo menos um admin cadastrado, e caso não haja, criar um admin padrão.
export const primeiroAcesso = async () => {

    console.log('Verificando configuração inicial...');

    try {

        //consulta a quantidade de admins cadastrados no banco de dados.
        const resultado = await qtdAdmins();

        //se houver um erro na consulta, a função é encerrada, e o erro é logado.
        if (resultado.error) { return { error: resultado.error }};

        //Se houver pelo menos um admin cadastrado, a função é encerrada, caso contrário, um admin padrão é criado.
        if (resultado.count > 0) {
            return { message: 'Admin já cadastrado, configuração inicial concluída.' };
        }

        const adminPadrao = {     
                nome: 'Admin Padrão',
                cpf: '00000000000',
                dataNascimento: '2000-01-01',
                email: process.env.ADMIN_EMAIL || 'admin@admin.com',
                senha: process.env.ADMIN_PASSWORD || 'admin123',
                cargo: 'ADMIN'
            };

        //Criação do admin padrão.
        const resultadoCriacao = await criarAdminPadrao(adminPadrao);

        if (resultadoCriacao.error) {
            errorLogger.error(`Erro ao criar admin padrão: ${resultadoCriacao.error}`);
            return { error: 'Ocorreu um erro ao criar o admin padrão.' };
        };

        return { message: 'Admin padrão criado com sucesso!' };

    }
    catch (error) {
        errorLogger.error(`Erro na configuração inicial: ${error.message}`);
        return {error: 'Ocorreu um erro na configuração inicial.' };
    }

};
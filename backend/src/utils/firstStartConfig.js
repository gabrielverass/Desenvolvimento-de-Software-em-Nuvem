import { qtdAdmins, criarUsuarioSemValidacao } from "../service/userServices.js";
import { errorLogger } from "../logger/logger.js";

//Função para configuração inicial do sistema, usada para verificar se há pelo menos um admin cadastrado, e caso não haja, criar um admin padrão.
export const primeiroAcesso = async () => {

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
                email: process.env.ADMIN_EMAIL,
                senha: process.env.ADMIN_PASSWORD,
                cargo: 'ADMIN'
            };

        //Validação para garantir que o email e senha do admin padrão estejam definidos nas variáveis de ambiente.
        if (!adminPadrao.email || !adminPadrao.senha) {
            errorLogger.error('Email ou senha do admin padrão não definidos nas variáveis de ambiente.');
            return { error: 'Email ou senha do admin padrão não definidos.' };
        }

        //Criação do admin padrão.
        const resultadoCriacao = await criarUsuarioSemValidacao(adminPadrao);

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
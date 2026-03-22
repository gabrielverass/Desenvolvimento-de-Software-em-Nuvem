import { limparUsuarios, criarUsuarioSemValidacao } from '../service/userServices.js';
import {limparAtivos} from '../service/ativosServices.js';
import { errorLogger } from '../logger/logger.js';

export async function criarUsuariosDeTeste() {

    //Criação de um usuário e um admin para testes, com email e senha definidos nas variáveis de ambiente.
    const TesteAdmin = {
        nome: 'Admin de testes',
        cpf: '00000000000',
        dataNascimento: '2000-01-01',
        email: process.env.TEST_ADMIN_EMAIL,
        senha: process.env.TEST_ADMIN_PASSWORD,
        cargo: 'ADMIN'
    };

    const TesteUsuario = {
        nome: 'Usuário de testes',
        cpf: '11111111111',
        dataNascimento: '2000-01-01',
        email: process.env.TEST_USER_EMAIL,
        senha: process.env.TEST_USER_PASSWORD,
        cargo: 'USER'
    };

    //Validação para garantir que o email e senha dos usuários de teste estejam definidos nas variáveis de ambiente.
    if (!TesteAdmin.email || !TesteAdmin.senha || !TesteUsuario.email || !TesteUsuario.senha) {
        errorLogger.error('Email ou senha dos usuários de teste não definidos nas variáveis de ambiente.');
        return { error: 'Email ou senha dos usuários de teste não definidos.' };
    }

    //Validação para garantir que os emails dos usuários de teste sejam diferentes.
    if(TesteAdmin.email === TesteUsuario.email) {
        errorLogger.error('Email dos usuários de teste não pode ser o mesmo.');
        return { error: 'Email dos usuários de teste não pode ser o mesmo.' };
    }

    //tenta criar os usuários de teste, e caso haja algum erro, o erro é logado, e a função retorna um objeto de erro.

    const criarAdmin = await criarUsuarioSemValidacao(TesteAdmin);

    if(criarAdmin.error) {
        errorLogger.error('Erro ao criar usuário de teste admin:', criarUsuarioSemValidacao.error);
        return { error: 'Erro ao criar usuário de teste admin.' };
    }

    const criarUsuario = await criarUsuarioSemValidacao(TesteUsuario);

    if(criarUsuario.error) {
        errorLogger.error('Erro ao criar usuário de teste padrão:', criarUsuario.error);
        return { error: 'Erro ao criar usuário de teste padrão.' };
    }

    return {message: 'Usuários de teste criados com sucesso.'};

};

export async function LimparBancoDeTestes() {
    
    if(process.env.TEST_ENV !== 'TRUE') {
        errorLogger.error('Erro ao limpar banco de testes. TEST_ENV não está definido como "TRUE".');
        return { error: 'TEST_ENV não está definido como "TRUE".' };
    }

    const apagarUsuarios = await limparUsuarios();
    const apagarAtivos = await limparAtivos();

    if(apagarUsuarios.error) {
        errorLogger.error('Erro ao limpar usuários de teste:', apagarUsuarios.error);
        return { error: 'Erro ao limpar usuários de teste.' };
    }

    if(apagarAtivos.error) {
        errorLogger.error('Erro ao limpar ativos de teste:', apagarAtivos.error);
        return { error: 'Erro ao limpar ativos de teste.' };
    }

    return { message: 'Banco de testes limpo com sucesso!' };

};

export async function prepararAmbienteDeTeste() {

    //Função para configurar o ambiente de teste, como criar usuários de teste, limpar o banco de dados, etc.
    if(process.env.TEST_ENV !== 'TRUE') {
        errorLogger.error('Erro ao configurar ambiente de teste. TEST_ENV não está definido como "TRUE".');
        return;
    }

   await LimparBancoDeTestes();
   await criarUsuariosDeTeste();
};
import {cadastrarUsuario} from '../service/userServices.js';

export const efetuarCadastro = async (req, res) => {
    try {

        const dadosUsuario = req.body;

        //Efetua uma validação simples da presença de todos os dados necessários.
        if (!dadosUsuario.nome || !dadosUsuario.cpf || !dadosUsuario.dataNascimento || !dadosUsuario.email || !dadosUsuario.senha) { 

            //Caso algum dado esteja ausente, retorna um status de erro junto da mensagem.
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        };

        //Chama a função de cadastro do service.
        const resultado = await cadastrarUsuario(dadosUsuario);

        //Caso a função retorne um erro, envia o status de erro e a mensagem.
        if(resultado.error) {
            return res.status(400).json({ error: resultado.error });
        }

        //caso a operação seja bem sucedida, retorna o status e a mensagem de sucesso.
        return res.status(201).json({ message: resultado.message, status : resultado.status });

    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o usuário.' });
    }
    
};

export const loginUsuario = async (req, res) => {
    try {
        const dadosLogin = req.body;
        // Lógica para autenticar o usuário
        // Aqui você pode verificar as credenciais do usuário e gerar um token de autenticação, por exemplo.
        res.json({ message: 'Usuário autenticado com sucesso!' });


    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ error: 'Ocorreu um erro ao autenticar o usuário.' });
    }
};
import {cadastrarUsuario, validarUsuario, editUsuario, deleteUsuario, editSenha, todosUsuarios} from '../service/userServices.js';

export const efetuarCadastro = async (req, res) => {
    try {

        const dadosUsuario = req.body;

        //Efetua uma validação simples da presença de todos os dados necessários.
        if (!dadosUsuario.nome || !dadosUsuario.cpf || !dadosUsuario.dataNascimento || !dadosUsuario.email || !dadosUsuario.senha) { 

            //Caso algum dado esteja ausente, retorna um status de erro junto da mensagem.
            return res.status(400).json({success: false, error: 'Todos os campos são obrigatórios.' });
        };


        //Chama a função de cadastro do service.
        const resultado = await cadastrarUsuario(dadosUsuario);

        //Caso a função retorne um erro, envia o status de erro e a mensagem.
        if(resultado.error) {
            return res.status(400).json({success: false, error: resultado.error});
        }

        //caso a operação seja bem sucedida, retorna o status e a mensagem de sucesso.
        return res.status(201).json({success: true, message: resultado.message, status : resultado.status });

    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({success: false, error: 'Ocorreu um erro ao cadastrar o usuário.' });
    }
    
};

export const loginUsuario = async (req, res) => {

    try {
        const dadosLogin = req.body;

        // Verifica as credenciais de usuário e retorna o resultado da validação.
        const resultado = await validarUsuario(dadosLogin);

        //Caso a função retorne um erro, envia o status de erro e a mensagem.
        if(resultado.error) {return res.status(400).json({ error: resultado.error })};

        //caso a operação seja bem sucedida, retorna o status, o token e a mensagem de sucesso.
        return res.status(201).json({ success: true, message: resultado.message, resultado });


    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ success: false, error: 'Ocorreu um erro ao autenticar o usuário.' });
    }

};

export const editarUsuario = async (req, res) => {

    try {

        const id = req.params.id;

        const dadosAtualizados = req.body;

        const resultado = await editUsuario(id, dadosAtualizados);

        if (resultado.error) { return res.status(400).json({ success: false, error: "Erro ao editar usuário" })};

        return res.status(200).json({ success: true, message: "Usuário editado com sucesso!" });

    } catch (error) {

        res.status(500).json({ success: false, error: 'Ocorreu um erro ao editar o usuário.' });
        
    }

};

export const deletarUsuario = async (req, res) => { 
    try {

        const id = req.params.id;

        const resultado = await deleteUsuario(id);

        if (resultado.error) { return res.status(400).json({success: false, error: "Erro ao deletar usuário" })};

        return res.status(200).json({ success: true, message: "Usuário deletado com sucesso!" });

    } catch (error) {

        res.status(500).json({ success: false, error: 'Ocorreu um erro ao deletar o usuário.' });

    }
};

export const listarTodosUsuarios = async (req, res) => {

    try {

        const resultado = await todosUsuarios();

        if (resultado.error) { return res.status(400).json({ success: false, error: "Erro ao listar os usuários" })};

        return res.status(200).json({ success: true, message: resultado.message, data: resultado.data });
        
    } catch (error) {

        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ success: false, error: 'Ocorreu um erro ao listar os usuários.' });

    }
};

export const alterarSenha = async (req, res) => {

    try {

        const id = req.params.id;
        const novaSenha = req.body.novaSenha;
        const resultado = await editSenha(id, novaSenha);

        if (resultado.error) { return res.status(400).json({ success: false, error: "Erro ao alterar senha" })};

        return res.status(200).json({ success: true, message: resultado.message });

    } catch (error) {
        
        console.error('Erro ao alterar senha:');
        res.status(500).json({ success: false, error: 'Ocorreu um erro ao alterar a senha.' });
    }
};
import {supabase} from "../conn.js";

//Função para inserir um novo usuário no banco de dados.
export const inserirUsuario = async (user) => {

    const {error, status} = await supabase
        .from('users')
        .insert([{ nome: user.nome, cpf: user.cpf, dataNascimento: user.dataNascimento, email: user.email, hash: user.hash, cargo: user.cargo}]);
    
    if (error) {
        return { 
            message: 'Erro ao criar usuário!',
            error: error.message 
        }
    };

    return { 
        message: "Usuário cadastrado com sucesso!", 
        status: status
    };
};

//função para buscar um usuário por email no banco de dados.
export const buscarUsuarioPorEmail = async (email) => {
    
    //tenta buscar o usuário no banco de dados usando o email fornecido.
    const {data, error} = await supabase
        .from('users')
        .select('id, nome, cpf, dataNascimento, email, cargo')
        .eq('email', email)
        .maybeSingle()
        .omit('hash');

    if (error) { 
        return { 
            message: 'Erro ao buscar usuário!',
            error: error.message 
        }
    };

    return { 
        message: 'Usuário encontrado com sucesso!',
        data: data
    };

};

//função para buscar um um usuário por um campo específico.
export const buscarUsuarioPorCampo = async (campo, valor) => {

    //tenta buscar o usuário no banco de dados usando o campo e valor fornecidos.
    const {data, error} = await supabase
        .from('users')
        .select('id, nome, cpf, dataNascimento, email, cargo')
        .eq(campo, valor)
        .maybeSingle()
        .omit('hash');;

    //caso ocorra um erro, retorna o erro.
    if (error) {
        return { 
            message: 'Erro ao buscar usuário!',
            error: error.message 
        }
    };

    //em caso de sucesso, retorna os dados do usuário encontrado.
    return { 
        message: 'Usuário encontrado com sucesso!',
        data: data
    };

};

//função para editar um usuário no banco de dados.
export const editarUsuario = async (id, dados) => {

    const {status, error} = await supabase
        .from('users')
        .update({ nome: dados.nome, cpf: dados.cpf, dataNascimento: dados.dataNascimento, email: dados.email, cargo: dados.cargo })
        .eq('id', id);

    if (error) { 
        return { 
            message: 'Erro ao editar usuário!',
            error: error.message 
        }};

    return { 
        message: 'Usuário editado com sucesso!',
        status: status
     };

};

//função para deletar um usuário do banco de dados.
export const excluirUsuario = async (id) => {

    const {status, error} = await supabase
        .from('users')
        .delete()
        .eq('id', id);

    if (error) {
        return { 
            message: 'Erro ao excluir usuário!',
            error: error.message 
        };
    };

        return { 
            message: 'Usuário deletado com sucesso!',
            status: status
         };

};

//função para editar a senha de um usuário no banco de dados.
export const editarSenha = async (id, novaSenha) => {

    const {status, error} = await supabase
        .from('users')
        .update({ hash: novaSenha })
        .eq('id', id);
    
    if (error) { 
        return { 
            message: 'Erro ao editar senha!',
            error: error.message 
        }
    };

    return { 
        message: 'Senha editada com sucesso!',
        status: status
    };

};

//função para listar todos os usuários do banco de dados.
export const listarUsuarios = async () => {

    const {data, error} = await supabase
        .from('users')
        .select('id, nome, cpf, dataNascimento, email, cargo');

    if (error) {
        return { 
            message: 'Erro ao listar usuários!',
            error: error.message 
        }
    };

    return { 
        message: 'Usuários listados com sucesso!',
        data: data

    };
};

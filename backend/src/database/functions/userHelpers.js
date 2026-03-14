import {supabase} from "../conn.js";

//Função para inserir um novo usuário no banco de dados.
export const inserirUsuario = async (user) => {

    const {error, status} = await supabase
        .from('users')
        .insert([{ nome: user.nome, cpf: user.cpf, dataNascimento: user.dataNascimento, email: user.email, hash: user.hash}]);
    
    if (error) {return { error: error.message }};

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
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (error) { return { error: error.message }};

    return { data };

};

//função para buscar um um usuário por um campo específico.
export const buscarUsuarioPorCampo = async (campo, valor) => {

    //tenta buscar o usuário no banco de dados usando o campo e valor fornecidos.
    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq(campo, valor)
        .maybeSingle();

    //caso ocorra um erro, retorna o erro.
    if (error) {return { error: error.message }};

    //em caso de sucesso, retorna os dados do usuário encontrado.
    return { data };

};

//função para editar um usuário no banco de dados.
export const editarUsuario = async (id, dados) => {

    const {status, error} = await supabase
        .from('users')
        .update({ nome: dados.nome, cpf: dados.cpf, dataNascimento: dados.dataNascimento, email: dados.email, cargo: dados.cargo })
        .eq('id', id);

    if (error) { return { error: error.message }};

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
        return { error: error.message };
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
    
    if (error) { return { error: error.message }}; 

        return { 
            message: 'Senha editada com sucesso!',
            status: status
         };

};
import {supabase} from "../conn.js";


export const inserirUsuario = async (user) => {

    //Tenta enviar os dados para o banco de dados.
    const {error, status} = await supabase
        .from('users')
        .insert([{ nome: user.nome, cpf: user.cpf, dataNascimento: user.dataNascimento, email: user.email, hash: user.hash}]);
    
    //caso ocorra um erro, retorna o erro.
    if (error) { 
        
        return { error: error.message };
        
    //caso contrário, retorna uma mensagem de sucesso.
    } else {

        return { 
            message: "Usuário cadastrado com sucesso!", 
            status: status
        };

    }

};

export const buscarUsuarioPorEmail = async (email) => {

    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (error) {

        return { error: error.message };
    }

    return { data };

}

export const buscarUsuarioPorCampo = async (campo, valor) => {

    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq(campo, valor)
        .maybeSingle();

    if (error) {

        return { error: error.message };

    }

    return { data };

}
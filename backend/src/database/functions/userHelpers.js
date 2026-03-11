import {supabase} from "../conn.js";
//importa o bcrypt para criptografar as senhas de administr usuário.
import bcrypt from 'bcryptjs';

//Função para criar um novo usuário
export const cadastrarUsuario = async (user) => {

    const {data, error} = await supabase
        .from('usuarios')
        .insert({ nome: user.nome, cpf: user.cpf, dataNascimento: user.dataNascimento, email: user.email, senha: crypto(user.senha) });
    if (error) {
        
    } else {
        
    }

};
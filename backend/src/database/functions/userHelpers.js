import {supabase} from "../conn.js";
//importa o bcrypt para criptografar as senhas de administr usuário.
import bcrypt from 'bcryptjs';

//Função para criar um novo usuário
export const cadastrarUsuario = async (user) => {

    //define o salt para a criptografia da senha
    const salt = bcrypt.genSaltSync(10);
    //criptografa a senha do usuario
    const hash = bcrypt.hashSync(user.senha, salt);

    const {data, error} = await supabase
        .from('usuarios')
        .insert([{ nome: user.nome, cpf: user.cpf, dataNascimento: user.dataNascimento, email: user.email, senha: hash}]);
    if (error) {
        
    } else {
        
    }

};

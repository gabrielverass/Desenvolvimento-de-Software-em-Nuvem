import {supabase} from "../conn.js";

//Função para inserir um novo ativo no banco de dados.
export async function inserirAtivo(ativo) {

    const {error, status} = await supabase
        .from('ativos')
        .insert([{patrimonio: ativo.patrimonio, tipo : ativo.tipo, nome: ativo.nome, 
            setor: ativo.setor, propriedade: ativo.propriedade, status: ativo.status, valor: ativo.valor}])
        .select();

    if (error) {    
        return {
            message: 'Erro ao criar ativo!',
            error: error.message
        };
    }

    return {
        message: 'Ativo criado com sucesso!',
        status: status
    };
}

//função para listar todos os ativos do banco de dados.
export async function listarAtivos() {

    const {data, error} = await supabase
        .from('ativos')
        .select('*');

    if (error) {  
        return {   
            message: 'Erro ao listar ativos!',
            error: error.message
        };
    }

    return {
        message: 'Ativos listados com sucesso!',
        data: data
    };
}

//função para buscar um ativo por um campo específico no banco de dados.
export async function buscarAtivoPorCampo(campo, valor) {

    const {data, error} = await supabase
        .from('ativos')
        .select('*')
        .eq(campo, valor)
        .maybeSingle();

    if (error) {
        return {
            message: 'Erro ao buscar ativo!',
            error: error.message
        }
    };

    return{
        message: 'Ativo encontrado com sucesso!',
        data: data
    };
};

//função para editar um ativo no banco de dados.
export async function editarAtivo(id, ativo) {

    const {error, status} = await supabase
        .from('ativos')
        .update({patrimonio: ativo.patrimonio, tipo : ativo.tipo, nome: ativo.nome, 
            setor: ativo.setor, propriedade: ativo.propriedade, status: ativo.status, valor: ativo.valor})
        .eq('id', id)
        .select();

    if (error) {
        return {
            message: 'Erro ao editar ativo!',
            error: error.message
        };
    };

    return {
        message: 'Ativo editado com sucesso',
        status: status
    };
};

//função para deletar um ativo do banco de dados.
export async function deletarAtivo(id) {

    const {error, status} = await supabase
        .from('ativos')
        .delete()
        .eq('id', id);
    
    if (error) {
        return {
            message: 'Erro ao deletar ativo!',
            error: error.message
        };
    };

    return {
        message: 'Ativo deletado com sucesso',
        status: status
    };
}

//função usada para limpar a tabela de ativos do banco de testes.
export async function limparTabelaAtivos() {

    const {error, status} = await supabase
        .from('ativos')
        .delete()
        .neq('id', 0);
    
    if (error) {
        return {
            message: 'Erro ao limpar ativos!',
            error: error.message
        };
    };

    return {
        message: 'Ativos limpos com sucesso',
        status: status
    };

}
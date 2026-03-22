import {isadmin} from '../service/userServices.js';


export const adminMiddleware = async (req, res, next) => {
    
    // armazena o id de usuário
    const userId = req.userId;

    // checa se o usuário é admin, utilizando a função isAdmin que retorna true ou false.
    const resultado = await isadmin(userId); 
    
    // se o usuário não for admin, retorna acesso negado.
    if (!resultado.isAdmin) {
        return res.status(403).json({ message: 'Acesso negado! Área restrita.'});
    }

    next();
};
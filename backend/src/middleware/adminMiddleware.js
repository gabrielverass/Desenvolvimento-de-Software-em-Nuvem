import {isadmin} from '../services/userService.js';
import jwt from 'jsonwebtoken';

export const adminMiddleware = async (req, res, next) => {
    try {

        const userId = req.userId;
        const userToken = req.userToken;

       //verifica se o token e o id estão presentes
        if (!userId || !userToken) {
            return res.status(401).json({ message: 'Sessão inválida ou ausente!' });
        }

        //Verifica o Token
        const decodedToken = jwt.verify(userToken, process.env.JWT_SECRET);

        // Verifica se o token é válido e se o id do token corresponde ao id do usuário
        if (!decodedToken || decodedToken.id !== userId) {
            return res.status(401).json({ message: 'Token de identificação inválido!' });
        };

        // Verifica se o usuário é admin
        const eAdmin = await isadmin(userId); 
        if (!eAdmin) {
            return res.status(403).json({ message: 'Acesso negado! Recurso exclusivo para administradores.'});
        }

        // Se passou por tudo, libera para o Controller
        next();

    } catch (error) {
        // Verifica se o erro é devido a um token expirado e retorna uma mensagem específica para isso
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Sua sessão expirou. Faça login novamente.' });
        }
        return res.status(401).json({ message: 'Falha na autenticação.' });
    }
};
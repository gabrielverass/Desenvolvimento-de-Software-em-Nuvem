import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {

    // armazena o token que vem no header da requisição
    const token = req.headers.authorization;

    // se o token não existir, retorna acesso negado
    if (!token) {
        return res.status(401).json({ message: 'Acesso Negado' });
    }

    try {

        // verifica se o token é válido e decodifica, caso seja inválido, lança um erro que é capturado no catch.
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        //Adiciona o id e o cargo do usuário na requisição.
        req.userId = decoded.id;
        req.cargo = decoded.cargo;

        // se tudo estiver ok, passa para a proxima função.
        return next(); 

    } catch (error) {
        // O return aqui impede que o código continue
        return res.status(401).json({ message: 'Acesso Negado ou Token Expirado' });
    }
};
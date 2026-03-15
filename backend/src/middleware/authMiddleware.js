import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {

    //Resgata o token do header e remove o prefixo.
    const token = req.headers.authorization;

    //Se o token for inexistentem, retorna um status de acesso negado.
    if (!token) {return res.status(401).json({ message: 'Acesso Negado' })};

    // Verifica o token
    try {
        //Verifica se o token é válido.
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);

        //Se o token for válido, adiciona o id e cargo do usuário ao objeto de requisição.
        req.userId = decoded.id;
        req.cargo = decoded.cargo;

    } catch (error) {
        res.status(401).json({ message: 'Acesso Negado' });
    }

    //Se o token for válido, chama a proxima função.
    next();
}
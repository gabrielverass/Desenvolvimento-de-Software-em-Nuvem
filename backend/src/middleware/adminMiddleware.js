
export const adminMiddleware = (req, res, next) => {

    //Verifica se o usuário é admin
    if (req.user.cargo !== 'admin') {
        return res.status(403).json({ message: 'Acesso Negado' });
    }
    next();
};
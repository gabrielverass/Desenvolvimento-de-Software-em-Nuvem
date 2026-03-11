import express from 'express';

const router = express.Router();


//cadastro de usuário
router.post('/auth/register', (req, res) => {

  // Extrai os dados da requisição para um objeto.
  const cadastro = {
    nome : req.body.nome,
    cpf : req.body.cpf,
    dataNascimento : req.body.dataNascimento,
    email  : req.body.email,
    senha : req.body.senha
  }

  // Validação básica dos campos
  if (!cadastro.nome || !cadastro.cpf || !cadastro.dataNascimento || !cadastro.email || !cadastro.senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  //verifica se o email e/ou cpf já estão cadastrados
  
  

  // Lógica para salvar o usuário no banco de dados



    res.json({ message: `Usuário ${cadastro.nome} cadastrado com sucesso!` });

});


//Login de usuário
router.post('/auth/login', (req, res) => {
  // Lógica para autenticar o usuário
  res.json({ message: 'Usuário autenticado com sucesso!' });
});

export default router;
import express from 'express';

const router = express.Router();


//cria um curso
router.post('/cursos', (req, res) => {
  // Lógica para criar um novo curso
  res.json({ message: 'Curso criado com sucesso!' });
}); 

//obter a lista de cursos
router.get('/cursos', (req, res) => {
  // Lógica para obter a lista de cursos
});


export default router;
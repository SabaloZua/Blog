const express=require('express');
const router=express.Router();
const {logado}=require('../helpers/Logado')
const Controller=require("../Controllers/CadastroUsuarios");

// Rota que leva a pagina de Cadastro de Usuarios
router.get('/Cadastrar',Controller.PaginaCadastro);

// Rota que leva a pagina para editar usuario
router.get('/Editar',logado,Controller.Paginaeditar);

// rota que faz a inserção do usario na base de dados;
router.post('/cadastrar',Controller.Cadastro);

// rota que actuliza os dados do usuario
router.post('/actulizar/:id',logado,Controller.Actulizar);

module.exports=router;
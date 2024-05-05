const express=require('express');
const Router=express.Router();
const Controller=require('../Controllers/Admin-Controller');
const {admin}=require('../helpers/Logado');
Router.get('/',admin,Controller.PaginaAdmin);
Router.get('/eliminar/:id', admin,Controller.EliminarPost);
Router.get('/users', admin,Controller.PaginaGestaoUsuarios);

Router.get('/users/Eliminar/:id',admin,Controller.EliminarUser);
Router.get('/comentario/eliminar/:id',admin,Controller.EliminarComentario);
Router.get('/pesq',admin,Controller.PesquisaPost);
Router.get('/post/:id', admin,Controller.getpost);


module.exports=Router;
const express=require('express');
const Router=express.Router();
const Controller=require('../Controllers/Admin-Controller');
const {admin}=require('../helpers/Logado');
Router.get('/',admin,Controller.PaginaAdmin);
Router.get('/eliminar/:id', admin,Controller.EliminarPost);
Router.get('/users', admin,Controller.PaginaGestaoUsuarios);

module.exports=Router;
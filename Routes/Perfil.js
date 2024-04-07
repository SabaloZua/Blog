const express=require('express');
const router=express.Router();
const {logado}=require('../helpers/Logado')
const Contoller=require('../Controllers/Perfil-Controller');

//Rota que leva a pagina do perfi principal
router.get('/',logado,Contoller.PaginalPerfil);

//Rota que leva a pagina do perfil onde é mostrado todos o comentarios do usuario
router.get('/Comentario',logado,Contoller.PaginalPerfilComentario);


//Rota que leva a pagina do perfil onde é mostrado todos a Publicações do usuario
router.get('/publicacao',logado,Contoller.PaginalPublica);


module.exports=router;

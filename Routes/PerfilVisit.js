const express=require('express');
const router=express.Router();
const Controller=require('../Controllers/PerfilVisit-Controller');

router.get('/:nome',Controller.PaginalPerfil)
router.get('/:nome/Comentarios',Controller.PaginalPerfilComentario);
router.get('/:nome/Publicacao',Controller.PaginalPublica);


module.exports=router
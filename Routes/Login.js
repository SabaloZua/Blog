const express=require('express');
const router=express.Router();
const Controller=require('../Controllers/Login-Controller');

// Rota que busca a pagina de Login
router.get("/",Controller.PaginaLogin);
 
//Rota que inciar sessão de usuario 
router.post('/',Controller.Iniciar_Sessao);

router.get('/TerminarSessao',(req,res)=>{
    req.logOut((err)=>{
       console.log(err)
    });
    req.flash('success_msg',"Sessão terminado com Sucesso.")
    res.redirect('/');
});

module.exports=router;

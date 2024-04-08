const express=require('express');
const router=express.Router();
const Controller=require('../Controllers/Login-Controller');
const db=require('../Modules/db');
// Rota que busca a pagina de Login
router.get("/",Controller.PaginaLogin);
 
//Rota que inciar sessão de usuario 
router.post('/',Controller.Iniciar_Sessao);

router.get('/TerminarSessao',(req,res)=>{
    req.logOut((err)=>{
        console.log(err);
    });
    const sessionId = req.sessionID;
        db.query('DELETE FROM session WHERE id = $1', [sessionId], function(err) {
           if (err) {
             console.error('Erro ao remover a sessão do banco de dados:', err);
           }
        });
    req.flash('success_msg',"Sessão terminado com Sucesso.")
    res.redirect('/');
});

module.exports=router;

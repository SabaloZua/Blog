const express=require('express');
const router=express.Router();
const Controller=require('../Controllers/Login-Controller');
const db=require('../Modules/db');
// Rota que busca a pagina de Login
router.get("/",Controller.PaginaLogin);
 
//Rota que inciar sessão de usuario 
router.post('/',Controller.Iniciar_Sessao);

router.get('/TerminarSessao', async(req,res)=>{
    // Remover os dados da sessão do banco de dados
    req.logOut((err)=>{
       console.log(err)
       
    });
    try {
        await db.query('DELETE FROM sessions WHERE sid = $1', [req.sessionID]);
        res.clearCookie('connect.sid', { path: '/' });
        req.flash('success_msg',"Sessão terminada com Sucesso.")
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
    
});

module.exports=router;

module.exports={
    logado:function(req,res,next){
        if(req.isAuthenticated()){
           return next(); 
        }else{

            req.flash("error_msg","Você deve estar autenticado!")
            res.redirect('/');
        }
    },
    admin:function(req,res,next){
        if(req.isAuthenticated() && req.user.n_id_tipousuario==2){
            return next(); 
         }else{
 
             req.flash("error_msg","Você deve ser um usuario de tipo admin para acessar está pagina!");
             res.redirect('/');
         }
    }
}
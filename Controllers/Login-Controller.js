const passport=require('passport');


// Controller que renderizar a pagina de Login
exports.PaginaLogin=(req,res)=>{
// obs este objecto Style contendo um arry de objectos Link e para criar dimamicamente links na pagina
res.render('Login',{style:[
    {Link:"css/Login.css"},]});
};

// Cotroller que inicia uma sessao do usuario
exports.Iniciar_Sessao=async(req,res,next)=>{
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
          // Armazena a mensagem de erro usando req.flash
          req.flash('error_msg', info.message);
          return res.redirect('/Login');
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          // Redireciona para a rota apropriada com base no tipo de usuário
          if(user.n_id_tipousuario==2){
            return res.redirect('/admin');
          }
          else {
            return res.redirect('/');
          }
        });
     })(req, res, next);
};
const passport = require('passport');
const db=require('./db');
const bcrypt=require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

// Estratégia de autenticação local
module.exports=(passport)=>{
passport.use(new LocalStrategy(
    function(username, password, done) {
       db.query('SELECT * FROM tb_usuario WHERE t_nome = $1', [username.replace(/\s+/g, '')], function(err, results) {
            if (err) { return done(err); }
           
            if (results.rows.length ==  0) {
                return done(null, false, { message: 'Conta não encontrada! tente novamente' });
            }
            bcrypt.compare(password,results.rows[0].t_senha,(erro,iguais)=>{
                if(iguais){
                    return done(null, results.rows[0]);
                }else{
                    return done(null, false, { message: 'Senha incorreta tente novamente' });
                }
            }) 
        });
    }
));

// Serialização e desserialização do usuário
passport.serializeUser(function(user, done) {
    done(null, user.n_id_usuario);
});

passport.deserializeUser( function(id, done) {
    db.query('SELECT * FROM tb_usuario WHERE n_id_usuario = $1', [id], function(err, results) {
        
        done(err, results.rows[0]);
    });
    
});
}

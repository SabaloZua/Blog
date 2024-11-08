const client = require('../Modules/db.js')
const { sendTestEmail } = require("../Modules/Email.js");
const bcrypt = require('bcryptjs');
//Controller que renderiza a Pagina Principal
exports.PaginaCadastro = async (req, res) => {
    const sqlquery = 'Select * from tb_curso';

    await client.query(sqlquery, (err, result) => {
        if (!err) {
            res.render('User/CadastroUsuario', { curso: result.rows });
        }
    });

   
};

//Controller que renderiza a Pagina para editar usuario
exports.Paginaeditar = async (req, res) => {
    if (req.isAuthenticated()) {
        const userId = req.session.passport.user;

        let id = userId;

        let sqlquery = 'Select * from tb_usuario where n_id_usuario=$1';
        await client.query(sqlquery, [id], (err, result) => {
            if (!err) {
                res.render('User/EditarUsuario', { usuario: result.rows[0] });
            }
        });

        
    }
};

// Controller responsavel pelo cadastro de usuarios
exports.Cadastro = async (req, res) => {

    var erros = [];
    let nome = req.body.nomeusario.replace(/\s+/g, '');
    let senha = req.body.senhausuario;
    let email = req.body.emailusuario;
    let bio = req.body.dsc;
    let curso = req.body.cursos;
    let senha2 = req.body.senhausuario2;
    let Data_hoje = new Date();
    // visa buscar um usuario que já tenha o mesmo nome
    const nomesUsuario= await client.query('select t_nome from tb_usuario where t_nome=$1',[nome]);

    if (nome == "" || senha == "" ||  email =="" || curso == "" || curso==undefined) {
        erros.push('Um dos campos não foi preênchido')
    }
    if (senha != senha2) {
        erros.push('As senhas  digitadas são diferentes' );
    }
    if(senha.length < 8){
        erros.push('Senha muito Curta! A sua senha tem de ter no mínimo 8 caracteres');
    }
    // verificação para saber se já exite um usuario com o mesmo nome
    if(nomesUsuario.rows.length > 0){
        erros.push('Já existe um Usuario com o mesmo Nome Tente um outro');
    }
    if (erros.length > 0) {
        
            // enviar uma mensagem com o erro a pagina 
            req.flash('error_msg',erros[0]);
       
        res.redirect('/Usuario/Cadastrar');
        return;
    }
    else {
        // dados do usuario para envio do email de boas vindas
        let dados_email = {
            email_clinent: email,
            nome_Client: nome
        }
        bcrypt.genSalt(10, (erro, salt) => {
            bcrypt.hash(senha, salt, async (erro, hash) => {
                if (erro) {
                    req.flash('error_msg', "Houve um erro salvamento do usuario");
                    res.redirect('/');
                }

                senha = hash;
                let sqlquery = `insert into tb_usuario (t_nome,t_senha,t_email,n_idcurso,t_descricao,t_data_cadastro,n_id_tipousuario)
                                        values
                                        ($1,$2,$3,$4,$5,$6,1);`


                await client.query(sqlquery, [nome, senha, email, curso, bio,Data_hoje], (err, result) => {
                    if (!err) {
                        req.flash('success_msg', 'Cadastro efectuado com Sucesso. Visite o seu email deixamos uma mensagem especial para si');
                        res.redirect('/Login');
                        // função para enviar o email
                        sendTestEmail(dados_email);
                    } else {
                        console.log(`erro na insercao ${err}`);
                    }
                });

                
            })


        })
    }


};

// Controller que actuliza os dados do usuario 
exports.Actulizar = async (req, res) => {
    const id = req.params.id;
    const nomeU = req.body.nome.replace(/\s+/g, '');
    const email = req.body.email;
    const dsc = req.body.dsc;
    var erros=[];
    if (nomeU != "" && email != "") {
        
        // verificação para saber se já exite um usuario com o mesmo nome
        const nomesUsuario= await client.query('select t_nome from tb_usuario where t_nome=$1 and n_id_usuario!=$2',[nomeU,id]);
        if(nomesUsuario.rows.length > 0){
            // se existir preenche o array erros
            erros.push('Já existe um Usuário com o mesmo Nome Tente um outro');
        }

        if (erros.length > 0) {
          
            req.flash('error_msg',erros[0]);
            res.redirect('/Usuario/Editar');
            return;
        }
        
        const sqlquery = 'update tb_usuario set t_nome=$1, t_email=$2, t_descricao=$3 where n_id_usuario=$4 ';
        await client.query(sqlquery, [nomeU, email, dsc, id], (err, result) => {
            if (!err) {
                res.redirect('/');
            }
        });
    }
}

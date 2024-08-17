const client = require('../Modules/db.js')
const fs = require('fs');
const path = require('path');


// controller que faz a busca da pagina de publicar conteudo
exports.Paginapostadd = (req, res) => {

   // obs este objecto Style contendo um arry de objectos Link e para criar dimamicamente links na pagina
   res.render('Posts/PostsAdd', {
      style: [
         { Link: "css/PostCdrakmod.css" },
         { Link: "myesy/easymde.min.css" },

      ],
      // obs este objecto scrpit contendo um arry de objectos LinkScript e para criar dimamicamente links na pagina
      script: [

         { linkScrpt: 'myesy/easymde.min.js' },
         { linkScrpt: 'scripts/easy.js' },

      ]
   }
   );
}

// controller para bucar um post especifico
exports.getpost = async (req, res) => {
 
   const id=req.params.id
   let sqlqueryPost = `select tbp.n_id_post,tbp.t_titulo_post,tbp.t_conteudo_post,tbp.t_data,tbu.t_nome
                            from tb_post as tbp
                     inner join tb_usuario as tbu on tbu.n_id_usuario=tbp.n_id_usuario
                         where tbp.n_id_post=$1`;

   let sqlqueryComent = `select tbc.t_conteudo_post,tbc.t_data,tbu.t_nome from tb_comentario tbc 
                         inner join tb_post as tbp on tbp.n_id_post=tbc.n_id_post
                         inner join tb_usuario as tbu on tbu.n_id_usuario=tbc.n_id_usuario
                where  tbc.n_id_post=$1`

   const DadosPost = await client.query(sqlqueryPost, [id]);

   const DadosComent = await client.query(sqlqueryComent, [ await DadosPost.rows[0].n_id_post]);


   // Renderizar o template Handlebars com o conteúdo HTML
   res.render('Posts/Posts', {
      style: [
         { Link: "css/estilosPost.css" },
         { Link: "myesy/easymde.min.css" }
      ],
      script: [

         { linkScrpt: 'myesy/easymde.min.js' },
         { linkScrpt: 'scripts/esayComent.js' },
         { linkScrpt: 'scripts/estrelar.js' },
      ],
      Posts: DadosPost.rows[0],
      Coment: DadosComent.rows

   }
   );
}
// Conrtroller que faz a publicação de post 
exports.publicar = async (req, res) => {
   var erros = [];
   const titulo_post = req.body.post_titulo;
   const Conteudo = req.body.conteudo_post;
   let Data_hoje = new Date();
   if (titulo_post == "" || typeof titulo_post == undefined || titulo_post == null) {
      erros.push("titulo invalido");

   }
   if (Conteudo == "" || typeof Conteudo == undefined || Conteudo == null) {
      erros.push("Conteudo invalido");
   }
   if (erros.length > 0) {
      req.flash('error_msg', erros[0])
      res.redirect('/postagens/add');

   } else if (erros.length <= 0) {

      const idUser = req.session.passport.user;
      let sqlquery = `insert into tb_post (t_titulo_post,t_conteudo_post,t_data,n_id_usuario)
                                       values
                                       ($1,$2,$3,$4)`
      await client.query(sqlquery, [titulo_post, Conteudo, Data_hoje, idUser], (err, result) => {
         if (!err) {
            res.redirect("/");
         } else {
            req.flash('error_msg', "Houve um erro ao publicar o seu post, tente novamente")
         }
      });
   }
};
exports.Coment = async (req, res) => {
 var erros=[];
   try{
   let conteudo = req.body.Comentario;
   const idUser = req.session.passport.user;
   let Data_hoje = new Date();
   const idpost = req.params.id;
   

   if(conteudo=="" || typeof conteudo===undefined || conteudo===null){
      erros.push('Ocorreu algum erro tente de novo');
   }
   if (erros.length > 0) {
      req.flash('error_msg', erros[0]);
      // res.redirect(`/postagens/post/${nomeUser}/${titulo}`);
      res.redirect(`/postagens/post/${idpost}`);
      return;
   } 
   let sql = `insert into tb_comentario (t_conteudo_post,t_data,n_id_usuario,n_id_post) values 
                              ($1,$2,$3,$4)`;

   await client.query(sql, [conteudo, Data_hoje, idUser, idpost]);
      req.flash('success_msg','Comentario efectudo com sucesso');
      res.redirect(`/postagens/post/${idpost}`);
   }catch(err){
      throw err;
   };
};

exports.PesquisaPost=async(req,res)=>{
 const busca=req.query.busca;
     const posts = await getPosts(busca);
     res.render('Posts/PostsPesq', {
      posts,
     })
};

const getPosts = async ( busca="") => {
   const query = `select tbp.n_id_post,tbp.t_titulo_post,tbp.t_data,tbu.t_nome,
   (select count(tbc.n_id_comentario) from tb_comentario as tbc where tbc.n_id_post=tbp.n_id_post) ,
    (select count(tbl.n_id_like) from tb_like_post as tbl where tbl.n_id_post=tbp.n_id_post) as es
               from tb_post as tbp     
               inner join tb_usuario tbu  on tbu.n_id_usuario=tbp.n_id_usuario 
                 where  tbp.t_titulo_post ILIKE '%' || $1 || '%'`;
   const values = [busca];
   const res = await client.query(query, values);
   return res.rows;
}


/// estrelar post

// rotina que vair inserir estrelas em um post
exports.estrelar= async(req,res)=>{
try{
   if(await !req.isAuthenticated()){
      return;
   }

   const idUser = req.session.passport.user;
   const id_post=req.params.idp;

   const sql2= `select * from tb_like_post where n_id_usuario=$1 and n_id_post=$2`
   const resl= await client.query(sql2,[idUser,id_post]);
   if(resl.rows.length==1){
      return
   }
   const sql=`insert into tb_like_post (n_id_usuario,n_id_post) values ($1,$2)`
   await client.query(sql,[idUser,id_post]);
   res.redirect(`/postagens/post/${id_post}`);
}catch(err){
   throw err;
}
}

exports.verificaEstrela=async(req,res)=>{
   if(await!req.isAuthenticated()){
      res.json({estado:'NL'});
      return;
   }
   const idUser = req.session.passport.user;
   const id_post=req.params.idp;
    const sql= `select * from tb_like_post where n_id_usuario=$1 and n_id_post=$2` 
    const resl= await client.query(sql,[idUser,id_post]);
    if(resl.rows.length == 1){
      res.json({estado:'ES'});
      return;
    }

}
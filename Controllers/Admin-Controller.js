const db=require('../Modules/db');
const Pots = require('../Modules/Paginacao');


exports.PaginaAdmin=async(req,res)=>{
    //Obtém o número da página atual da query string da URL. Se não estiver presente, assume 1 como padrão
    const page = parseInt(req.query.page) || 1;
    //Obtém os posts para a página atual
    const posts = await Pots.getPosts(page);
    const totalPosts = await Pots.getTotalPosts(); // Função para obter o total de posts
    const totalPages = Math.ceil(totalPosts / 20); //  exibir 20 posts por página

    res.render('Admin/PaginaAdmin', { posts, page, totalPages })
};

 
exports.EliminarPost=async(req,res)=>{
    const idpost=req.params.id;
    const sql=`delete from tb_post where n_id_post=$1`
    try{
        await db.query(sql,[idpost]);
        req.flash('success_msg', 'Post eliminado com Sucesso');
        res.redirect('/admin');
    }catch(erro){
        throw erro;
    }
}



//Controller que leva a pagina de Gestão de usuarios
exports.PaginaGestaoUsuarios=async(req,res)=>{
    const sql=`select tbu.n_id_usuario,tbu.t_nome,tbu.t_email,tbc.t_dsccurso
        from tb_usuario as tbu
        inner join tb_curso as tbc on tbc.n_idcurso=tbu.n_idcurso                
        where tbu.n_id_tipousuario=1`
    const dadosUser=await db.query(sql);
    res.render('Admin/PaginaGestUser',{UsersG:dadosUser.rows,
        style: [
            { Link: "css/dvgUser.css" },

         ],script: [
            { linkScrpt: 'scripts/Filtro.js' },
        ]
    });
}

exports.TornarAdmin=async(req,res)=>{
    const idusuario=req.params.id;
    let sqlquery = ` update tb_usuario set n_id_tipousuario=1`
    
}
exports.EliminarUser=async(req,res)=>{
    try{
    const idusuario=req.params.id;
    let sqlquery = ` delete from tb_usuario where n_id_usuario=$1`
    await db.query(sqlquery,[idusuario]);
    req.flash('success_msg', 'usuario eliminado com Sucesso');
    res.redirect('/admin/users');
    }catch(e){
        console.log(e);
    }
}
exports.EliminarComentario=async(req,res)=>{
    const idComent=req.params.id;
    const sql=`delete from tb_comentario where n_id_comentario=$1`
    try{
        await db.query(sql,[idComent]);
        req.flash('success_msg', 'Comentario eliminado com Sucesso');
        res.redirect('/admin');
    }catch(erro){
        throw erro;
    }
}

// ---------------------------bloco para pesquisa do post----------------------------------
exports.PesquisaPost=async(req,res)=>{
    const busca=req.query.busca;
        const posts = await getPosts(busca);
        res.render('Admin/PostsPesqADM', {
         posts,
        })
   };
   const getPosts = async ( busca="") => {
      const query = `select tbp.n_id_post,tbp.t_titulo_post,tbp.t_data,tbu.t_nome,
      (select count(tbc.n_id_comentario) from tb_comentario as tbc where tbc.n_id_post=tbp.n_id_post),
       (select count(tbl.n_id_like) from tb_like_post as tbl where tbl.n_id_post=tbp.n_id_post) as es
                  from tb_post as tbp     
                  inner join tb_usuario tbu  on tbu.n_id_usuario=tbp.n_id_usuario 
                    where  tbp.t_titulo_post ILIKE '%' || $1 || '%'`;
      const values = [busca];
      const res = await db.query(query, values);
      return res.rows;
   }
   
// ---------------------------bloco para pesquisa do post---------------------------------------------------


// controller para bucar um post especifico
exports.getpost = async (req, res) => {
 
    const id=req.params.id
    let sqlqueryPost = `select tbp.n_id_post,tbp.t_titulo_post,tbp.t_conteudo_post,tbp.t_data,tbu.t_nome,
     (select count(tbl.n_id_like) from tb_like_post as tbl where tbl.n_id_post=tbp.n_id_post) as es
                             from tb_post as tbp
                      inner join tb_usuario as tbu on tbu.n_id_usuario=tbp.n_id_usuario
                          where tbp.n_id_post=$1`;
 
    let sqlqueryComent = `select  tbc.n_id_comentario, tbc.t_conteudo_post,tbc.t_data,tbu.t_nome from tb_comentario tbc 
                          inner join tb_post as tbp on tbp.n_id_post=tbc.n_id_post
                          inner join tb_usuario as tbu on tbu.n_id_usuario=tbc.n_id_usuario
                 where  tbc.n_id_post=$1`;
 
    const DadosPost = await db.query(sqlqueryPost, [id]);
 
    const DadosComent = await db.query(sqlqueryComent, [ await DadosPost.rows[0].n_id_post]);
 
 
    // Renderizar o template Handlebars com o conteúdo HTML
    res.render('Admin/PostsADM', {
       style: [
          { Link: "css/estilosPost.css" },
          { Link: "myesy/easymde.min.css" }
       ],
       script: [
 
          { linkScrpt: 'myesy/easymde.min.js' },
          { linkScrpt: 'scripts/esayComent.js' },
          { linkScrpt: 'scripts/estrelar.js' }
       ],
       Posts: DadosPost.rows[0],
       Coment: DadosComent.rows
 
    }
    );
 }
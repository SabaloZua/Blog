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
    res.redirect('/');
    }catch(e){
        console.log(e);
    }
}

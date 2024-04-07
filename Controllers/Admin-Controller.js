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
    const sql=`select * from tb_usuario where n_id_tipousuario=2`
    const dadosUser=await db.query(sql);
    res.render('Admin/PaginaGestUser',{User:dadosUser.rows});
}
const conecao = require('../Modules/db');

//Controller que leva a pagina do perfil 
exports.PaginalPerfil = async (req, res) => {
    const userId = req.session.passport.user;
    let id = userId;

    const DadosUsuario = await conecao.query('select t_nome, t_descricao,  from tb_usuario where n_id_usuario=$1', [id]);

    res.render('UsuarioPerfil/Perfil', {
        style: [
            { Link: "css/perfil.css" },],
        Usuario: DadosUsuario.rows[0],
    });
}
//Controller que leva a pagina do perfil onde é mostrado todos o comentarios do usuario
exports.PaginalPerfilComentario = async (req, res) => {
    const userId = req.session.passport.user;
    let id = userId;

    const DadosUsuario = await conecao.query('select t_nome from tb_usuario where n_id_usuario=$1', [id]);
    
    res.render('UsuarioPerfil/PerfilComentarios', {
        style: [
            { Link: "css/perfil.css" },],
        Usuario: DadosUsuario.rows[0],
    });
}

//Controller que leva a pagina do perfil onde é mostrado todos as Publicações do usuario
exports.PaginalPublica = async (req, res) => {
    const userId = req.session.passport.user;
    //Obtém o número da página atual da query string da URL. Se não estiver presente, assume 1 como padrão
    const page = parseInt(req.query.page) || 1;
    //Obtém os posts para a página atual
    const posts = getPosts(page,userId);
    const totalPosts =  getTotalPosts(userId); // Função para obter o total de posts
    const totalPages = Math.ceil(totalPosts / 4); //  exibir 5 posts por página

    let sql2 = 'select t_nome from tb_usuario where n_id_usuario=$1';
    const DadosUsuario =  await conecao.query(sql2, [userId]);

    res.render('UsuarioPerfil/PerfilPublicacoes', {
        style: [
            { Link: "css/perfil.css" },],
        Usuario: DadosUsuario.rows[0],
        posts,
        totalPages,
        page
    });

}



/*
getPost Busca os post
page: Representa o número da página atual que o usuário deseja visualizar. Por exemplo, se o usuário estiver na página 2 page será 2
limit: Representa o número máximo de registros que se deseja exibir por página. Por exemplo, se  deseja exibir 5 posts por página limit será 5.
(page - 1): Subtrai 1 do número da página atual. Isso é feito porque a contagem de páginas começa em 1, mas a indexação de registros em uma consulta SQL começa em 0. Portanto, para obter o primeiro registro de uma página específica, você precisa subtrair 1 do número da página.
* limit: Multiplica o resultado da subtração pelo número máximo de registros por página (limit). Isso calcula o número de registros que devem ser ignorados (ou "pulados") para chegar ao primeiro registro da página atual.
*/

const getPosts = async (page = 1, id=0,limit = 3) => {

    const offset = (page - 1) * limit;

    const query = `select tbp.n_id_post,tbp.t_titulo_post,tbp.t_data,tbu.t_nome,
    (select count(tbc.n_id_comentario) from tb_comentario as tbc where tbc.n_id_post=tbp.n_id_post) 
                from tb_post tbp     
                inner join tb_usuario tbu  on tbu.n_id_usuario=tbp.n_id_usuario 
                  where tbp.n_id_usuario=$1
                  ORDER BY tbp.t_data desc
                  LIMIT $2 OFFSET $3`;
    const values = [id, limit, offset];

    const res = await conecao.query(query, values);

    return res.rows;
}

const getTotalPosts = async (id=0) => {

    const res = await conecao.query('SELECT COUNT(*) FROM tb_post where n_id_usuario=$1', [id]);
    return parseInt(res.rows[0].count);
}
const conecao = require('../Modules/db');

exports.PaginalPerfil = async (req, res) => {
    const nome = req.params.nome;

    const DadosUsuario = await conecao.query('select t_descricao,t_nome from tb_usuario where t_nome=$1', [nome]);

    res.render('PerfilVisit/Perfil', {
        style: [
            { Link: "css/perfil.css" },],
        Usuario: DadosUsuario.rows[0],
    });
}

//Controller que leva a pagina do perfil onde é mostrado todos o comentarios do usuario
exports.PaginalPerfilComentario = async (req, res) => {
    const nome = req.params.nome;

    const DadosUsuario = await conecao.query('select t_nome from tb_usuario where t_nome=$1', [nome]);
    const ComentariosUsuario = await conecao.query(`select tbc.t_conteudo_post,tbc.t_data from tb_comentario as tbc 
                                                    inner join tb_usuario as tbu on tbu.n_id_usuario=tbc.n_id_usuario
                                                    where tbu.t_nome=$1`, [nome]);

    res.render('PerfilVisit/PerfilComentarios', {
        style: [
            { Link: "css/perfil.css" },],
        Usuario: DadosUsuario.rows[0],
        Comentario: ComentariosUsuario.rows
    });
}

//Controller que leva a pagina do perfil onde é mostrado todos as Publicações do usuario
exports.PaginalPublica = async (req, res) => {

    const nome = req.params.nome;
    //Obtém o número da página atual da query string da URL. Se não estiver presente, assume 1 como padrão
    const page = parseInt(req.query.page) || 1;
    //Obtém os posts para a página atual
    const posts = await getPosts(page,nome);
    const totalPosts = await getTotalPosts(nome); // Função para obter o total de posts
    const totalPages = Math.ceil(totalPosts / 3); //  exibir 5 posts por página

   
    let sql2 = 'select t_nome,n_id_usuario from tb_usuario where t_nome=$1';
    const DadosUsuario = await conecao.query(sql2, [nome]);

    res.render('PerfilVisit/PerfilPublicacoes', {
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

const getPosts = async (page = 1, nome="",limit = 3) => {

    const offset = (page - 1) * limit;

    const query = `select tbp.n_id_post,tbp.t_titulo_post,tbp.t_data,tbu.t_nome,
    (select count(tbc.n_id_comentario) from tb_comentario as tbc where tbc.n_id_post=tbp.n_id_post) 
                from tb_post tbp     
                inner join tb_usuario tbu  on tbu.n_id_usuario=tbp.n_id_usuario 
                where tbu.t_nome=$1
                  ORDER BY tbp.t_data desc
                  LIMIT $2 OFFSET $3`;
    const values = [nome, limit, offset];

    const res = await conecao.query(query, values);

    return res.rows;
}

const getTotalPosts = async (nome="") => {

    const res = await conecao.query(`SELECT COUNT(*) FROM tb_post as tbp
                                    inner join tb_usuario tbu  on tbu.n_id_usuario=tbp.n_id_usuario 
                                        where tbu.t_nome=$1`, [nome]);
    return parseInt(res.rows[0].count);
}
/*
page: Representa o número da página atual que o usuário deseja visualizar. Por exemplo, se o usuário estiver na página 2 page será 2

limit: Representa o número máximo de registros que se deseja exibir por página. Por exemplo, se  deseja exibir 5 posts por página limit será 5.
(page - 1): Subtrai 1 do número da página atual. Isso é feito porque a contagem de páginas começa em 1, mas a indexação de registros em uma consulta SQL começa em 0. Portanto, para obter o primeiro registro de uma página específica, você precisa subtrair 1 do número da página.
* limit: Multiplica o resultado da subtração pelo número máximo de registros por página (limit). Isso calcula o número de registros que devem ser ignorados (ou "pulados") para chegar ao primeiro registro da página atual.
*/
const client=require('./db');
 exports.getPosts=async(page = 1, limit = 20)=> {
    const offset = (page - 1) * limit;
    const query = `
    select tbp.n_id_post,tbp.t_titulo_post,tbp.t_data,tbu.t_nome,
    (select count(tbc.n_id_comentario) from tb_comentario as tbc where tbc.n_id_post=tbp.n_id_post) 
                from tb_post tbp     
                inner join tb_usuario tbu  on tbu.n_id_usuario=tbp.n_id_usuario  
                ORDER BY tbp.t_data desc
            LIMIT $1 OFFSET $2
    `;
    const values = [limit, offset];
  
    const res = await client.query(query, values);

    return res.rows;
   }

    exports.getTotalPosts=async()=> {
    const res = await client.query('SELECT COUNT(*) FROM tb_post');
    return parseInt(res.rows[0].count);
   }
   
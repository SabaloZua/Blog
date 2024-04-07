const express = require("express");
const app = express();
const path = require("path");
const hbs = require('handlebars')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const remark=require('remark');
const html = require('remark-html');
const port=process.env.PORT ? Number(process.env.PORT) : 3000;


require('dotenv').config();
require('./Modules/PassaporConfig')(passport);
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

//CONFIGURAÇÕES
//configuração da sessao

app.use(session({
    secret: process.env.SENHA_Sessao,
    resave: true,
    saveUninitialized: true
}));

// Configuração do Passport.js
app.use(passport.initialize());
app.use(passport.session());

// metodo para messagens temporarias 
app.use(flash());


//variaveis globais
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
})


// add as tecnologias
app.use('/bootstrap', express.static("./node_modules/bootstrap/dist"));
app.use('/bootstrap-i', express.static("./node_modules/bootstrap-icons/font"));
app.use('/myesy', express.static("./node_modules/easymde/dist/"));
app.use('/css', express.static('./css'));
app.use('/scrpit', express.static("./scripts"));


//  Pasta public 
app.use(express.static(path.join(__dirname, "public")));

//importando modulo express-hadlebars
const { engine } = require('express-handlebars');


// importando Rotas
const Post = require('./Routes/Post');
const Sobre = require("./Routes/sobre");
const Usuario = require("./Routes/Usuarios");
const Login = require('./Routes/Login');
const Perfil = require('./Routes/Perfil');
const PerfilVist = require('./Routes/PerfilVisit');
const Admin=require('./Routes/Admin');
// modulos
const client = require("./Modules/db");
const conversorHora = require('./Modules/Data');
const Pots = require('./Modules/Paginacao');
//config do express handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');


// configurendo Helpers
hbs.registerHelper('getTimeAgo', conversorHora);

 // remark converte o conteudo markdown em html.use()-> recebe o pluging 
hbs.registerHelper('Mark',(conteudo)=>{
   const comentario= remark()
   .use(html)
   .processSync(conteudo)
   .toString();
   return comentario
})

hbs.registerHelper('gt', function (value, compare) {
    return value > compare;
});

hbs.registerHelper('lt', function (value, compare) {
    return value < compare;
});

hbs.registerHelper('eq', function (value, compare) {
    return value === compare;
});

hbs.registerHelper('add', function (value, add) {
    return value + add;
});

hbs.registerHelper('subtract', function (value, subtract) {
    return value - subtract;
});

hbs.registerHelper('range', function (start, end) {
    return Array.from({ length: (end - start + 1) }, (_, i) => start + i);
});

// Rota Principal
app.get('/', async (req, res) => {
    //Obtém o número da página atual da query string da URL. Se não estiver presente, assume 1 como padrão
    const page = parseInt(req.query.page) || 1;
    //Obtém os posts para a página atual
    const posts = await Pots.getPosts(page);
    const totalPosts = await Pots.getTotalPosts(); // Função para obter o total de posts
    const totalPages = Math.ceil(totalPosts / 20); //  exibir 20 posts por página
    
    res.render('index', { posts, page, totalPages })

});

// Rotas
app.use('/postagens', Post);
app.use('/Sobre-nos', Sobre);
app.use('/Usuario', Usuario);
app.use('/Login', Login);
app.use('/Perfil', Perfil);
app.use('/perfil', PerfilVist);
app.use('/admin',Admin);

app.listen(port, () => {
    console.log("servidor ligado");
});
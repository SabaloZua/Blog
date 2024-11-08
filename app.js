const express = require("express");
const app = express();
const path = require("path");
const cors=require('cors')
const hbs = require('handlebars')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const remark=require('remark');
const pgSession = require('connect-pg-simple')(session);
const html = require('remark-html');
const port=process.env.PORT ? Number(process.env.PORT) : 3000;
require('dotenv').config();
require('./Modules/PassaporConfig')(passport);
app.use(cors({credentials: true}));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


//CONFIGURAÇÕES
//configuração da sessao
const oneDay = 24 * 60 * 60 * 1000; // 1 dia em milissegundos
const expires = new Date(Date.now() + oneDay);
app.use(session({
    store:new pgSession({conString:process.env.POSTGRES_URL,tableName: 'sessions',}),
    secret: process.env.SENHA_Sessao,
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: expires
    }
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
app.use('/myesy', express.static(path.join(__dirname,"node_modules/easymde/dist/")));
app.use('/css', express.static('./css'));
app.use('/scrpit', express.static("./scripts"));
app.use('/Imgs', express.static('./public/Imagens'));


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
const Denucias=require('./Routes/Denucias');
const Termos=require('./Routes/Termos');
// modulos
const client = require("./Modules/db");
const conversorHora = require('./Modules/Data');
const Pots = require('./Modules/Paginacao');
//config do express handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


// configurendo Helpers
hbs.registerHelper('getTimeAgo', conversorHora);

 // remark converte o conteudo markdown em html.use()-> recebe o pluging 
hbs.registerHelper('Mark',(conteudo)=>{
   const comentario= remark()
   .use(html,{sanitize:true} )
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


hbs.registerHelper('Uppercase', function(str) {
        return str.replace(/([A-Z])/g, ' $1');
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
app.use('/Termos-uso',Termos);
app.use('/Denuciar',Denucias);
app.use('/admin',Admin);


app.listen(port, () => {
    console.log("servidor ligado");
});
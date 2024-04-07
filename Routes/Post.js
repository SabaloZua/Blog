const express=require("express");
const Controller=require('../Controllers/Posts-controllers')
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {logado}=require('../helpers/Logado')

let CaminhoPastaIMG=path.join(__dirname, '..', 'public', 'Imgs');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, CaminhoPastaIMG);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
// Rota que leva ao pagina para publicar uma Postagem
router.get('/add',logado,Controller.Paginapostadd);

// Rota que busca uma unica potagem 
router.get('/post/:nome/:titulo',Controller.getpost);

//Rota que adiciona uma  publucação
router.post("/publicar",logado,Controller.publicar);

router.post('/upload', upload.single('image'),(req,res)=>{
    res.json({ filepath: `/Imgs/${req.file.filename}` });
})

router.post('/Comentario/:id',Controller.Coment);

router.get('/pesq',Controller.PesquisaPost);
module.exports = router
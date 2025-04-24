const express=require("express");
const Controller=require('../Controllers/Posts-controllers')
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {logado}=require('../helpers/Logado')
const {initializeApp}=require('firebase/app');
const { getStorage,ref, uploadBytes, getDownloadURL } = require("firebase/storage");
require('dotenv').config();


const firebaseApp=initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
})
const storageFirebase=getStorage(firebaseApp);

//multer

const upload=multer({
    storage:multer.memoryStorage()
})



// Rota que leva ao pagina para publicar uma Postagem
router.get('/add',logado,Controller.Paginapostadd);

// Rota que busca uma unica potagem 
router.get('/post/:id',Controller.getpost);

//Rota que adiciona uma  publucação
router.post("/publicar",logado,Controller.publicar);

router.post('/upload', upload.single('image'), async (req,res)=>{
    console.log(req.file); // Log para verificar o arquivo recebido
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const StoregeRef=ref(storageFirebase,`Images/${req.file.originalname}`)
    await uploadBytes(StoregeRef,req.file.buffer,{
        contentType:req.file.mimetype,
        
    });
    const caminho= await getDownloadURL(StoregeRef);
    res.json({ filepath: caminho });
})

router.post('/Comentario/:id',logado,Controller.Coment);

router.get('/pesq',Controller.PesquisaPost);
router.post('/estrelar/:idp',logado,Controller.estrelar);
router.get('/verficarEst/:idp',Controller.verificaEstrela);

module.exports = router;
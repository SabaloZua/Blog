const express=require('express');
const Router=express.Router();


Router.get('/',(req,res)=>{
    res.render('PoliticaTermos/Termos');
});




module.exports=Router
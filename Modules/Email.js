require('dotenv').config()
const nodemailer=require('nodemailer');
// objecto que recebe os dados do email como o email e o nome do usuario
const DadosEmail={
    email_clinent:"",
    nome_Client:""
}
// Metodo de criação do Email
let transporter=nodemailer.createTransport({
    host: "gmail",
    port:465,
    secure:true,
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.SENHA }});

 // Metodo para envio do Email       
const sendTestEmail=async(DadosEmail)=>{
 await transporter.sendMail({
    from:process.env.EMAIL,
    to:DadosEmail.email_clinent,
    subject:`Bem-vindo ao Blog IMEL!`,
    text:``,
    html:` <h2>Caro(a) ${DadosEmail.nome_Client}</h2>
    <p>É com grande satisfação que lhe damos as boas-vindas ao nosso blog.<br>
     Aqui, você encontrará um espaço para compartilhar ideias, informações e experiências com outros alunos.<br>
     Nosso objectivo é criar um ambiente colaborativo onde todos possam aprender e crescer juntos.</p>
    
   <p> Sinta-se à vontade para explorar os artigos, comentar, fazer perguntas e interagir com a comunidade.<br>
    Estamos ansiosos para ver suas contribuições e tornar o Blog IMEL um lugar vibrante e enriquecedor.</p>
     <br>
     <br>
    <p>Atenciosamente, Equipe da Astronautas,SA levando a tecnologia e inovação ao infinito e mais além 🚀</p> `
}).then(msg=>{
console.log(msg)
}).catch(err=>{
    console.log(`erro ao enviar`+err)
})
}
module.exports = { sendTestEmail };
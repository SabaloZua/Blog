
const estrela=document.querySelector("#estrela");
const lab=document.querySelector('#lb')
const url=document.URL;
var id=new URL(url)
let estado="";

estrela.addEventListener('click',(e)=>{
    if(estado == 'NL' || estado =='ES' ){
        return;
    } 
    const idPost=id.pathname.split('/')[3]
    fetch(`/postagens/estrelar/${idPost}`,{
        method:'POST'
    })
    .then(res=>{
        estrela.classList.replace('bi-star','bi-star-fill');
        lab.innerHTML="Só um minutinho....";
        estado='ES';
    })
     lab.innerHTML="Pronto estrela enviada com sucesso"
});

document.addEventListener("DOMContentLoaded", ()=> {
    const idPost=id.pathname.split('/')[3]
    fetch(`/postagens/verficarEst/${idPost}`,{ 
        method: 'GET'
    })
    .then(res => res.json())
    .then(res=>{
        if(res.estado=='ES'){
            estrela.classList.replace('bi-star','bi-star-fill');
            lab.innerHTML="Já enviou uma estrela ao post"
            console.log(res.estado);
            estado='ES';
        }else{
            console.log(res.estado);
            estado='NL';
        }
    }
    )
  });
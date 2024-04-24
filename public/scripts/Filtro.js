const f_filtragem=document.getElementById('filtrar')

f_filtragem.addEventListener('keyup',(evt)=>{
    const linhas=[...document.querySelectorAll('.dgv_linha')];
    let input,texto,filtragem;
    input=evt.target;
    filtragem=input.value.toUpperCase();
    for(let  i=0; i<linhas.length; i++){
      texto=linhas[i].children[1].innerHTML;
      if(texto.toUpperCase().indexOf(filtragem)>-1){
        linhas[i].classList.remove('ocultarlinhagrid')
      }else{
        linhas[i].classList.add('ocultarlinhagrid')
      }
    }

})
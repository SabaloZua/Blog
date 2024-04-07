const estrela=document.getElementById("estrela");


estrela.addEventListener('click',(evnt)=>{
	evnt.target.classList.remove('bi-star')
	evnt.target.classList.toggle('bi-star-fill')
})
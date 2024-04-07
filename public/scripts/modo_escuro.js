const ch=document.getElementById('ch')

// toogle drark
loandtheme();
function toogleDarkmode(){
    document.body.classList.toggle('dark')
} 

// loand light ou dark
function loandtheme(){
   const darkMode=localStorage.getItem('dark')

   if(darkMode){
    toogleDarkmode();
   }
}



ch.addEventListener("change",()=>{
    toogleDarkmode();
    
    localStorage.removeItem('dark')
    // save 
    if(document.body.classList.contains('dark')){
        localStorage.setItem('dark',1);
    }
});

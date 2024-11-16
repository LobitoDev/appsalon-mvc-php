document.addEventListener('DOMContentLoaded',function(){
    iniciarApp();
})


function iniciarApp(){
    buscarPorFecha();
}

//==============================================================

function buscarPorFecha(){
    const fechaImput = document.querySelector('#fecha');
    fechaImput.addEventListener('input', e => {
        const fechaSeleccionada = e.target.value;
        
        window.location = `?fecha=${fechaSeleccionada}`;
        
        
    })
}
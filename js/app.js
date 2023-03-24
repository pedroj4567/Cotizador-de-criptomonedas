const selectCriptomonedas = document.querySelector('#criptomonedas');
const selectMoneda = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultadoContainer = document.querySelector('#resultado');
//creamos una estructura para mandar los datos 
const data = {
    criptomoneda:'',
    moneda : ''
}

//creamos un promise para poder usarlo como un callback 
const obtenerCriptomoneda = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptomonedas();

    //anexamos funcionabilidad al formulario 
    formulario.addEventListener('submit',enviarDatos)

    //obtenemos los datos del select de moneda 
    selectMoneda.addEventListener('change',leerValor);
    selectCriptomonedas.addEventListener('change',leerValor)
});

//functions 
function consultarCriptomonedas(){
    //get the data from API
    const URL = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
    fetch(URL)
        .then(response => response.json())
        .then(data => obtenerCriptomoneda(data.Data))
        .then(criptomonedas => llenarSelect(criptomonedas))
        .catch(e => console.error(e.message))
}

function llenarSelect(criptomonedas){
    
    criptomonedas.forEach(moneda => {
        const {FullName , Name} = moneda.CoinInfo;
        
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        selectCriptomonedas.appendChild(option)
        
    });
}

//funcion que lee el valor de los campos
//pasamos el evento para tomar los valores del select
function leerValor(e){
    data[e.target.name] = e.target.value;
}



function enviarDatos(e){
    e.preventDefault();
    const {criptomoneda,moneda} = data;
    //validamos antes de enviar los datos
    if(criptomoneda === '' || moneda === ""){
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    //consultamos la api
    consultarApi();
}

function mostrarAlerta(msg){
    const existeError = document.querySelector('.error')

    if(!existeError){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = msg;
        formulario.appendChild(divMensaje);
    
        setTimeout(()=>{
            divMensaje.remove();
        },3000)
    }

    
}

function consultarApi(){
    const {criptomoneda,moneda} = data;
    const URL_2 = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    //antes de solicitar la informacion mostramos un spinner
    mostrarSpiner();

    fetch(URL_2)
        .then(respuesta => respuesta.json())
        .then(data => mostrarInfo(data.DISPLAY[criptomoneda][moneda],criptomoneda))
}

function mostrarInfo(data,criptomoneda){
    console.log(data);
 
    //limpiamos el html 
    limpiarHmtl();
    //anexamos los datos solicitados
    const {PRICE} = data;
    const cripto = document.createElement('p');
    cripto.classList.add('titulo')
    cripto.textContent = criptomoneda

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `<p>El precio es: <span>${PRICE}</span></p>`;



    //zona de anexo al contenedor resultado
    resultadoContainer.appendChild(cripto);
    resultadoContainer.appendChild(precio);

}
//limpia los elementos internos del contenedor
function limpiarHmtl(){
    while(resultadoContainer.firstChild){
        resultadoContainer.removeChild(resultadoContainer.firstChild);
    }
}

//muestra el spinner 

function mostrarSpiner(){
    limpiarHmtl();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;

    //SE anexa el spinner al contenedor
    resultadoContainer.appendChild(spinner);
}


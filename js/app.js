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
    const {PRICE,HIGHDAY,LOWDAY,FROMSYMBOL} = data;
    const cripto = document.createElement('p');
    cripto.classList.add('titulo')
    cripto.textContent = criptomoneda;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `<p>El precio es: <span>${PRICE}</span></p>`;

    const precioMasAlto = document.createElement('p');
    precioMasAlto.innerHTML = `<p>El precio mas alto: <span>${HIGHDAY}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#16FF00" class="w-2" id="arrow_up">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
        </svg>
    </p>`;

    const precioMasBajo = document.createElement('p');
    precioMasBajo.innerHTML = `<p>El precio mas bajo: <span>${LOWDAY}</span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#FF0032" class="" id="arrow_down">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
    </svg>

    </p>`;
    //zona de anexo al contenedor resultado
    resultadoContainer.appendChild(cripto);
    resultadoContainer.appendChild(precio);
    resultadoContainer.appendChild(precioMasAlto);
    resultadoContainer.appendChild(precioMasBajo);

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


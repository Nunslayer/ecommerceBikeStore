const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById('template--card').content
const templateFooter = document.getElementById('template--footer').content
const templateCarrito = document.getElementById('template--carrito').content
const fragmentSearch = document.createDocumentFragment();
const body = document.getElementById('body');
const toggleTheme = document.getElementById('toggle-icon');
const header = document.getElementById('header');
let carrito = {}

toggleTheme.addEventListener('click', e =>{
    body.classList.toggle('dark')
    const changeTheme = body.classList.contains('dark')
    if(changeTheme){
        toggleTheme.classList.replace('fa-moon', 'fa-sun');
        header.querySelector('img').setAttribute('src',"./assets/icons/specialized-icon.png")
    }else{
        toggleTheme.classList.replace('fa-sun', 'fa-moon');
        header.querySelector('img').setAttribute('src',"./assets/icons/specialized-black.png")
    }

    e.stopPropagation();
});

document.addEventListener('DOMContentLoaded', () => {
    fechData();
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'));
        pintarCarrito();
    }
    
});

header.addEventListener('click', e => {
    bntNavBar(e);
});

cards.addEventListener('click', e =>{
    addProduct(e);
});

items.addEventListener('click', e =>{
    btnAccion(e);
});

const fechData = async () => {
    try {
        const res = await fetch ('./modelo-bici.json');
        const data = await res.json();
        pintarTemplateCard(data);
    } catch (error) {
        console.log(error);
    }
};

const pintarTemplateCard = data => {
    data.forEach(producto => {
        templateCard.querySelector('h2').textContent=producto.name
        templateCard.querySelector('.card__discipline').textContent=producto.stamp
        templateCard.querySelector('.card__price').textContent=producto.price
        templateCard.querySelector('img').setAttribute('src', producto.images[0])
        templateCard.querySelector('.btn-buy').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragmentSearch.appendChild(clone)
    })
    cards.appendChild(fragmentSearch)
}

const addProduct = e => {
    console.log(e.target)
    if(e.target.classList.contains('btn-buy')){
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-buy').dataset.id,
        title: objeto.querySelector('h2').textContent,
        precio: objeto.querySelector('.card__price').textContent,
        cantidad: 1,
        imagen: objeto.querySelector('.img-card').getAttribute('src')
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad+1
    }

    carrito[producto.id] = {...producto}
    pintarCarrito();
}

const pintarCarrito = ()=>{
    items.innerHTML = '';
    Object.values(carrito).forEach(producto=>{
        templateCarrito.querySelector('img').setAttribute('src', producto.imagen) 
        templateCarrito.querySelector('#cantidad-comprada').textContent = producto.cantidad
        templateCarrito.querySelectorAll('td')[1].textContent = producto.title
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('#precio--total').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragmentSearch.appendChild(clone)
    })
    items.appendChild(fragmentSearch)

    pintarFooter();

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const pintarFooter = () =>{
    footer.innerHTML = '';
    if(Object.keys(carrito).length===0){
        footer.innerHTML =`<th scope="row" colspan="5">Haga sus compras!</th>`;
        return
    }
    
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad})=> acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio})=> acc + cantidad * precio,0)
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragmentSearch.appendChild(clone)
    footer.appendChild(fragmentSearch)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', ()=>{
        carrito={};
        pintarCarrito();
    })
    header.querySelector('#cantidad--total').textContent = nCantidad
}   

const btnAccion = e =>{
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito();
    }

    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }

        pintarCarrito();
    }

    e.stopPropagation();
};

const bntNavBar = e => {
    if(e.target.classList.contains('fa-bars')){
        const ulActive = header.querySelector('ul')
        ulActive.classList.toggle('active')
    }
    if(e.target.classList.contains('fa-cart-arrow-down')){
        const carritoPrincipal = document.getElementById('carrito--principal')
        carritoPrincipal.classList.toggle('shopping--show')
    }

    e.stopPropagation();
}

// seccion de slider falta corregir la funcionalidad slider a la izquierda tiene un efecto raro que no es agradable
const sliderContainer = document.getElementById('slider-container');
const slider = document.getElementById('slider');
const buttonLeft = document.getElementById('button-left');
const buttonRight = document.getElementById('button-right');

const sliderElements = document.querySelectorAll('.slider__element');

const rootStyles = document.documentElement.style;

let sliderCounter = 0;
let isInTransition = false;
const DIRECTION = {
    RIGHT: 'RIGHT',
    LEFT: 'LEFT'
};
const resizeSlide = ()=>{
    rootStyles.setProperty('--slide-transition', 'none');
    rootStyles.setProperty('--slide-transform', 0);
    return
}

const getTransformValue = ()=> Number(rootStyles.getPropertyValue('--slide-transform').replace('px',''));


const reorderSlide = () => {
    const transformValue = getTransformValue();
    rootStyles.setProperty('--slide-transition', 'none');
    if(sliderCounter === sliderElements.length-1){
        slider.appendChild(slider.firstElementChild);
        rootStyles.setProperty('--slide-transform', `${transformValue + sliderElements[sliderCounter].scrollWidth}px`);
        sliderCounter--;
    } else if(sliderCounter===0){
        slider.prepend(slider.lastElementChild);
        rootStyles.setProperty('--slide-transform', `${transformValue - sliderElements[sliderCounter].scrollWidth}px`);
        sliderCounter++;
    }

    isInTransition=false;
};


const moveSlide = (direction)=>{
    if(isInTransition) return
    const transformValue = getTransformValue();
    rootStyles.setProperty('--slide-transition', 'transform 1s');
    isInTransition = true;
    if(direction === DIRECTION.LEFT){
        rootStyles.setProperty('--slide-transform', `${transformValue + sliderElements[sliderCounter].scrollWidth}px`);
        sliderCounter--;
    }else if(direction===DIRECTION.RIGHT){
        rootStyles.setProperty('--slide-transform', `${transformValue - sliderElements[sliderCounter].scrollWidth}px`);
        sliderCounter++;
    }
    
}

buttonRight.addEventListener('click', ()=>moveSlide(DIRECTION.RIGHT));
buttonLeft.addEventListener('click', ()=>moveSlide(DIRECTION.LEFT));


slider.addEventListener('transitionend', reorderSlide);
sliderContainer.addEventListener('resize', resizeSlide);

reorderSlide();

resizeSlide();



const items = document.getElementById('items');
const templateCard = document.getElementById('template--card').content
const fragmentSearch = document.createDocumentFragment();

document.addEventListener('DOMContentLoaded', () => {
    fechData();
})

const fechData = async () => {
    try {
        const res = await fetch ('./api.json');
        const data = await res.json();
        pintarTemplateCard(data);
    } catch (error) {
        console.log(error);
    }
}

const pintarTemplateCard = data => {
    data.forEach(producto => {
        templateCard.querySelector('h2').textContent=producto.title
        templateCard.querySelector('p').textContent=producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.thumbnailUrl)
        const clone = templateCard.cloneNode(true)
        fragmentSearch.appendChild(clone)
    })
    items.appendChild(fragmentSearch)
}

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

const resizeSlide = ()=>{
    rootStyles.setProperty('--slide-transition', 'none');
    rootStyles.setProperty('--slide-transform', 0);
}

const moveSlide = (direction)=>{
    if(isInTransition) return
    const transformValue = getTransformValue();
    rootStyles.setProperty('--slide-transition', 'transform 1s');
    isInTransition = true;
    if(direction === DIRECTION.LEFT){
        rootStyles.setProperty('--slide-transform', `${transformValue + sliderElements[sliderCounter].scrollWidth}px`);
        sliderCounter--;
        console.log(rootStyles.getPropertyValue('--slide-transform'));
    }else if(direction===DIRECTION.RIGHT){
        rootStyles.setProperty('--slide-transform', `${transformValue - sliderElements[sliderCounter].scrollWidth}px`);
        sliderCounter++;
        console.log(rootStyles.getPropertyValue('--slide-transform'));
        console.log(sliderElements[sliderCounter].scrollWidth);
    }
    
}

buttonRight.addEventListener('click', ()=>moveSlide(DIRECTION.RIGHT));
buttonLeft.addEventListener('click', ()=>moveSlide(DIRECTION.LEFT));


slider.addEventListener('transitionend', reorderSlide);
sliderContainer.addEventListener('resize', resizeSlide);

reorderSlide();

resizeSlide();




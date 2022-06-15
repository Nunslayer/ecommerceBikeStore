export default function paginacion(newData,pagina){
    const prodPorPagina = 12;
    if(!pagina){
        pagina = 1
    }
    const totalPages = Math.ceil(newData.length / prodPorPagina)
    const pages = document.getElementById('pages');
    const contenedorPages = document.getElementById('cantidad--paginas');
    const templatePages = document.getElementById('template--pages').content
    const fragmentSearch = document.createDocumentFragment();
    const pintarPages = (paginaActual, totalPages) => {
        
        for(let i =0;i<totalPages;i++){
        const clone = templatePages.cloneNode(true)
        clone.querySelector('.pagina').textContent=i+1
        clone.querySelector('.pagina').dataset.id=i+1
        if(paginaActual===i+1){
            clone.querySelector('.pagina').setAttribute('class', 'pagina onPage')
        }
        fragmentSearch.appendChild(clone)
        }
        
        contenedorPages.appendChild(fragmentSearch)
        
        pages.querySelector('#pagina--actual').textContent=paginaActual
        pages.querySelector('#total--paginas').textContent=totalPages
    }
    pintarPages(pagina);
}
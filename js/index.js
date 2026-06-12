const API_URL = "http://localhost:5678/api"
const GALLERY_CONTAINER = document.getElementById("gallery_container")



async function getImages() {
    try {
        const response = await fetch(API_URL + "/works");

        if (!response.ok) {
            console.error(`Response status: ${response.status}`);
            return [];
        }
        return await response.json();
    } catch (e) {
        console.log(e);
        return [];
    }
}

function populateGallery(json){
    if (!json || json.length === 0) return;
    console.log(json)
    GALLERY_CONTAINER.innerHTML=''
    for(let i = 0; i < json.length; i++){
        let item = json[i]
        const FIGURE_TEMPLATE = `
        <figure data-filter="${item.categoryId}">
            <img src="${item.imageUrl}" alt="Abajour Tahina"/>
            <figcaption>${item.title}</figcaption>
        </figure>
        `
        GALLERY_CONTAINER.insertAdjacentHTML('beforeend', FIGURE_TEMPLATE)
    }
}


async function init() {
    const data = await getImages();
    populateGallery(data);
}

init();
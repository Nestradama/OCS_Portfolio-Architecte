const GALLERY_CONTAINER = document.getElementById("gallery_container");

function checkLoginStatus() {
    const token = window.localStorage.getItem("token");
    const userElements = document.querySelectorAll(".user_elements");
    const guestElements = document.querySelectorAll(".guest_elements");

    if (token) {
        userElements.forEach(el => {
            if (el.classList.contains('modifier-link')) {
                el.style.display = 'flex';
            } else {
                el.style.display = '';
            }
        });
        guestElements.forEach(el => el.style.display = "none");
    } else {
        userElements.forEach(el => el.style.display = "none");
        guestElements.forEach(el => el.style.display = "");
    }
}

function populateGallery(json){
    if (!json || json.length === 0) return;
    GALLERY_CONTAINER.innerHTML='';
    for(let i = 0; i < json.length; i++){
        let item = json[i];
        const FIGURE_TEMPLATE = `
        <figure data-filter="${item.categoryId}" data-id="${item.id}">
            <img src="${item.imageUrl}" alt="${item.title}"/>
            <figcaption>${item.title}</figcaption>
        </figure>
        `;
        GALLERY_CONTAINER.insertAdjacentHTML('beforeend', FIGURE_TEMPLATE);
    }
}

async function init() {
    if (GALLERY_CONTAINER) {
        const data = await getWorks();
        populateGallery(data);
    }
    checkLoginStatus(); 
}

init();
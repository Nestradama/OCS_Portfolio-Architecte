let modal = null;

//Core

async function openModal(e) {
    e.preventDefault();
    if (modal) return;

    modal = await createModal();
    modal.style.display = 'flex';

    modal.querySelectorAll('.close-button').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });
}

function closeModal() {
    if (!modal) return;
    modal.remove();
    modal = null;
}

async function createModal() {
    const works = await getWorks();
    const categories = await getCategories();

    const modalHTML = `
        <!-- Gallery View -->
        <div class="modal-content" id="modal-gallery-view">
            <span class="close-button">&times;</span>
            <h2>Galerie photo</h2>
            <div class="modal-gallery">
                ${works.map(work => `
                    <div class="modal-image-container" data-id="${work.id}">
                        <img src="${work.imageUrl}" alt="${work.title}">
                        <div class="trash-icon-background">
                            <i class="fa-solid fa-trash-can"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
            <hr>
            <button class="add-photo-button">Ajouter une photo</button>
        </div>

        <!-- Add Photo View -->
        <div class="modal-content" id="modal-add-view" style="display: none;">
            <span class="back-button"><i class="fa-solid fa-arrow-left"></i></span>
            <span class="close-button">&times;</span>
            <h2>Ajouter photo</h2>
            <form id="add-photo-form">
                <div class="add-photo-area">
                    <i class="fa-regular fa-image"></i>
                    <label for="photo-input" class="add-photo-btn">+ Ajouter photo</label>
                    <input type="file" id="photo-input" name="image" accept=".jpg, .png" style="display: none;">
                    <p>jpg, png : 4mo max</p>
                    <img class="preview" alt="Image preview">
                </div>
                <div class="input-group">
                    <label for="photo-title">Titre</label>
                    <input type="text" id="photo-title" name="title" required>
                </div>
                <div class="input-group">
                    <label for="photo-category">Catégorie</label>
                    <select id="photo-category" name="category" required>
                        <option value=""></option>
                        ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}
                    </select>
                </div>
                <hr>
                <button type="submit" class="valider-button" disabled>Valider</button>
            </form>
        </div>
    `;

    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal';
    modalWrapper.innerHTML = modalHTML;
    document.body.appendChild(modalWrapper);

    setupModalListeners(modalWrapper);
    
    return modalWrapper;
}

// Listener & Logic

function setupModalListeners(modalWrapper) {
    const galleryView = modalWrapper.querySelector('#modal-gallery-view');
    const addView = modalWrapper.querySelector('#modal-add-view');
    
    modalWrapper.querySelector('.add-photo-button').addEventListener('click', () => {
        galleryView.style.display = 'none';
        addView.style.display = 'flex';
    });

    modalWrapper.querySelector('.back-button').addEventListener('click', () => {
        addView.style.display = 'none';
        galleryView.style.display = 'flex';
    });

    setupDeleteListeners(modalWrapper);

    setupAddPhotoForm(modalWrapper);
}

function setupAddPhotoForm(modalWrapper) {
    const form = modalWrapper.querySelector('#add-photo-form');
    const photoInput = form.querySelector('#photo-input');
    const previewImg = form.querySelector('.preview');
    const titleInput = form.querySelector('#photo-title');
    const categorySelect = form.querySelector('#photo-category');
    const validerBtn = form.querySelector('.valider-button');
    const addPhotoAreaElements = form.querySelectorAll('.add-photo-area i, .add-photo-area label, .add-photo-area p');

    // Image Preview Logic
    photoInput.addEventListener('change', () => {
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                previewImg.src = event.target.result;
                previewImg.style.display = 'block';
                addPhotoAreaElements.forEach(el => el.style.display = 'none');
                checkFormValidity();
            }
            reader.readAsDataURL(file);
        } else {
            previewImg.style.display = 'none';
            addPhotoAreaElements.forEach(el => el.style.display = '');
            checkFormValidity();
        }
    });

    //Form du "Ajouter une image"
    const checkFormValidity = () => {
        validerBtn.disabled = !(photoInput.files.length > 0 && titleInput.value.trim() !== '' && categorySelect.value !== '');
    };
    titleInput.addEventListener('input', checkFormValidity);
    categorySelect.addEventListener('change', checkFormValidity);

    // Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('image', photoInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', categorySelect.value);

        const newWork = await addWork(formData);

        if (newWork) {
            form.reset();
            previewImg.style.display = 'none';
            previewImg.src = '';
            addPhotoAreaElements.forEach(el => el.style.display = '');
            validerBtn.disabled = true;
            
            await refreshGalleries(modalWrapper);
        }
    });
}


function setupDeleteListeners(modalWrapper) {
    modalWrapper.querySelectorAll('.trash-icon-background').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const container = e.target.closest('.modal-image-container');
            const workId = container.dataset.id;
            handleDeleteWork(workId);
        });
    });
}

// Data & DOM Manips

async function handleDeleteWork(workId) {
    const success = await deleteWork(workId);
    
    if (success) {
        document.querySelector(`.modal-image-container[data-id='${workId}']`)?.remove();
        document.querySelector(`#gallery_container figure[data-id='${workId}']`)?.remove();
    }
}

async function refreshGalleries(modalWrapper) {
    if (typeof init === 'function') {
        await init();
    }

    const newWorks = await getWorks();
    const modalGallery = modalWrapper.querySelector('.modal-gallery');
    modalGallery.innerHTML = newWorks.map(work => `
        <div class="modal-image-container" data-id="${work.id}">
            <img src="${work.imageUrl}" alt="${work.title}">
            <div class="trash-icon-background">
                <i class="fa-solid fa-trash-can"></i>
            </div>
        </div>
    `).join('');
    setupDeleteListeners(modalWrapper);
}



document.addEventListener('DOMContentLoaded', () => {
    const modifierLink = document.querySelector('.modifier-link');
    if (modifierLink) {
        modifierLink.addEventListener('click', openModal);
    }
});
let modal = null;

async function fetchWorksForModal() {
    try {
        const response = await fetch(`${API_URL}/works`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failure fetch:", error);
        return [];
    }
}

async function createModal() {
    const works = await fetchWorksForModal();

    const modalHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Galerie photo</h2>
            <div class="modal-gallery">
                ${works.map(work => `
                    <div class="modal-image-container">
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
    `;

    const modalWrapper = document.createElement('div');
    modalWrapper.className = 'modal';
    modalWrapper.innerHTML = modalHTML;
    document.body.appendChild(modalWrapper);

    return modalWrapper;
}

async function openModal(e) {
    e.preventDefault();
    if (modal) return;

    modal = await createModal();
    modal.style.display = 'flex';

    modal.querySelector('.close-button').addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

function closeModal() {
    if (!modal) return;
    modal.remove();
    modal = null;
    window.removeEventListener('keydown', closeModal);
}

document.addEventListener('DOMContentLoaded', () => {
    const modifierLink = document.querySelector('.modifier-link');
    if (modifierLink) {
        modifierLink.addEventListener('click', openModal);
    }
});

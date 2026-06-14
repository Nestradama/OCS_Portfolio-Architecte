const FILTERS = document.querySelectorAll('.filter-btn')


FILTERS.forEach(
    function (filter ){
        filter.addEventListener('click', function (){

            FILTERS.forEach(
                function (button){
                    button.classList.remove('active')
                }
            )
            filter.classList.add('active')

            filterGallery(filter.dataset.filter)
        })
    }
)

function filterGallery(selectedCategory) {
    const figures = GALLERY_CONTAINER.querySelectorAll('figure');
    console.log(selectedCategory)
    figures.forEach(figure => {
        const figureCategory = figure.dataset.filter;

        if (selectedCategory === 'all' || figureCategory === selectedCategory) {
            figure.style.display = 'block';
        } else {
            figure.style.display = 'none';
        }
    });
}
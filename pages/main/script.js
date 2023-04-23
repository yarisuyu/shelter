import {
    showRandomPets,
    showPreviousPets,
    showNextPets,
    showNavMenu,
    hideNavMenu
} from "../../assets/scripts/script.js"



let width = screen.width;

if (width >= 1280) {
    sessionStorage.setItem('pageSize', '3');
}
else if (width >= 768) {
    sessionStorage.setItem('pageSize', '2');
}
else {
    sessionStorage.setItem('pageSize', '1');

    document.querySelector('.header__burger-btn')
        .addEventListener('click', showNavMenu);


    document.getElementById("nav-menu")
        .addEventListener('click', e => {
            if (e.target.tagName.toLowerCase() === 'a') {
                hideNavMenu();
            }
        });

    document.getElementById("overlay")
        .addEventListener('click', hideNavMenu);
}


sessionStorage.setItem('currentPage', '1');
showRandomPets();

window.addEventListener('beforeunload', () => {
    sessionStorage.removeItem('currentPage');
    sessionStorage.removeItem('pageSize');
    sessionStorage.removeItem('randomizedPetList');
 });

/* slider event listeners */

const previousBtn = document.getElementById('pets-previous');
previousBtn.addEventListener('click', showPreviousPets);


const nextBtn = document.getElementById('pets-next');
nextBtn.addEventListener('click', showNextPets);

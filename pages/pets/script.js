import {
    showFirstPetPage,
    showLastPetPage,
    showPreviousPetPage,
    showNextPetPage,
    toggleNavMenu
} from "../../assets/scripts/script.js"

let width = screen.width;

if (width >= 1280) {
    sessionStorage.setItem('pageSize', '8');
}
else if (width >= 768) {
    sessionStorage.setItem('pageSize', '6');
}
else {
    sessionStorage.setItem('pageSize', '3');

    document.querySelector('.header__burger-btn')
        .addEventListener('click', toggleNavMenu);


    document.getElementById("nav-menu")
        .addEventListener('click', e => {
            if (e.target.tagName.toLowerCase() === 'a') {
                toggleNavMenu();
            }
        });

    document.getElementById("overlay")
        .addEventListener('click', () => {
            if (document.querySelector("header").classList.contains("open")) {
                toggleNavMenu();
            }
        });
}

showFirstPetPage();

window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('currentPage', 0);
    sessionStorage.removeItem('pageSize');
    sessionStorage.removeItem('randomizedPetList');
 });

/* Pagination event listeners */
const toFirstPageBtn = document.getElementById('to-first-page');
toFirstPageBtn.addEventListener('click', showFirstPetPage);

const toLastPageBtn = document.getElementById('to-last-page');
toLastPageBtn.addEventListener('click', showLastPetPage);

const toNextPageBtn = document.getElementById('forward');
toNextPageBtn.addEventListener('click', showNextPetPage);

const toPreviousPageBtn = document.getElementById('back');
toPreviousPageBtn.addEventListener('click', showPreviousPetPage);

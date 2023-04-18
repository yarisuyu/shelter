import {
    showFirstPetPage,
    showLastPetPage,
    showPreviousPetPage,
    showNextPetPage
} from "../../assets/scripts/script.js"

let width = screen.width;

if (width > 768) {
    sessionStorage.setItem('pageSize', '8');
}
else if (width > 320) {
    sessionStorage.setItem('pageSize', '6');
}
else {
    sessionStorage.setItem('pageSize', '3');

    let burger = document.querySelector('.header__burger-btn');
    burger.addEventListener('click', () => {
        document.querySelector('.header').classList.toggle('open');
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

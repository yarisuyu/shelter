export function addElement(container, type, className, innerText, id, attributes) {
    let element = document.createElement(type);
    if (id != null && id !== '') {
        element.id = id;
    }

    if (className != null && className !== '') {
        element.className = className;
    }

    if (attributes != null) {
        if (attributes instanceof Map) {
            attributes.forEach((value, key) => {
                element.setAttribute(key, value);
            })
        }
    }

    if (innerText != null) {
        element.innerText = innerText;
    }

    container.append(element);
    return element;
}


function renderPet(petsFragment, index, pet) {
    const figure = addElement(petsFragment, 'figure', 'pet-card', null, index);
    addElement(figure, 'img', 'pet-card-img', null, null, new Map([
        ['src', pet.img],
        ['alt', `${pet.type} ${pet.name}`],
        ['width', '270'],
        ['height', '270']
    ]));

    const caption = addElement(figure, 'figcaption', 'pet-card-desc');

    addElement(caption, 'h4', 'pet-card-name', pet.name);
    let petLink = addElement(caption, 'button', 'button_secondary pet-card-link', 'Learn more');

    petLink.addEventListener('click', (event) => {
        renderModalWindow(pet);
    });
}

function generateUniqueRandomValues(min, max, count, exceptValues = []) {
    if (count > (max - min)) {
        console.log("Error: unable to generate random values");
        return []; // ERROR!
    }

    const randomValues = new Set();

    for (let i = 0; i < exceptValues.length; i++) {
        randomValues.add(+exceptValues.at(i));
    }

    while (randomValues.size < count + exceptValues.length) {
        let value = Math.floor(Math.random() * (max - min)) + min;
        randomValues.add(value);
    }

    // remove auxiliary indices from the set
    for (let j = exceptValues.length; j > 0; j--) {
        randomValues.delete(+exceptValues.at(exceptValues.length - j));
    }

    return Array.from(randomValues);
}

function generateRandomPetList(totalPetCount, usePages = false) {
    sessionStorage.setItem('totalPetCount', totalPetCount);
    let randomizedArray = [];

    if (!usePages) {
        const SLIDE_COUNT = 3; // previous, current and next pages
        const pageSize = sessionStorage.getItem('pageSize');
        const minArraySize = SLIDE_COUNT * pageSize;
        randomizedArray = generateUniqueRandomValues(
            0,
            totalPetCount,
            min(totalPetCount, minArraySize)
        );

        let i = 0;
        while (randomizedArray.length < minArraySize) {
            randomizedArray.push(randomizedArray.at(i++));
        }
    } else {
        const MAX_PAGE_COUNT = 6;

        randomizedArray = generateUniqueRandomValues(0, totalPetCount, totalPetCount);

        // each 8 elements will be different because they are generated
        // using sets of 8 elements

        // each 6 elements will be different because before
        // generating the new 8 elements we prepopulate the set
        // with the tail of the previous 8 elements
        // that starts the new page of 6 elements

        // each 3 elements are different because they are contained inside
        // pages of 6 elements

        while (randomizedArray.length < MAX_PAGE_COUNT * totalPetCount) {
            // number of elements already created for the page of 6 elements
            let pageOfSixCurrentSize = randomizedArray.length % 6;

            let randomizedArray1 = generateUniqueRandomValues(
                0,
                totalPetCount,
                6 - pageOfSixCurrentSize,
                pageOfSixCurrentSize ? randomizedArray.slice(-pageOfSixCurrentSize) : []
            );
            randomizedArray = randomizedArray.concat(randomizedArray1);

            let pageOfEightCurrentSize = randomizedArray.length % 8;

            let randomizedArray2 = generateUniqueRandomValues(
                0,
                totalPetCount,
                totalPetCount - pageOfEightCurrentSize,
                pageOfEightCurrentSize ? randomizedArray.slice(-pageOfEightCurrentSize) : []
            );
            randomizedArray = randomizedArray.concat(randomizedArray2);
        }
    }

    sessionStorage.setItem('randomizedPetList', randomizedArray.join(','));
    return randomizedArray;
}

function changeBtnActiveStatus(btnId, newDisabledStatus = true) {
    const button = document.getElementById(btnId);
    if (newDisabledStatus) {
        if (button.disabled) {
            return;
        }
        else {
            button.disabled = true;
        }
    } else {
        button.disabled = false;
    }
}

function clearPetList() {
    let petList = document.querySelector('.pets__pet-list');
    while (petList.firstChild) {
        petList.removeChild(petList.lastChild);
    }
}


function renderPetList(usePages = false) {
    let petList = document.querySelector('.pets__pet-list');

    let pageSize = +sessionStorage.getItem('pageSize');
    let page = +sessionStorage.getItem('currentPage');

    let i = 0;
    fetch('../../assets/data/pets.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            let previousPetCount = +sessionStorage.getItem('totalPetCount');
            let randomizedPetList = getArrayFromSessionStorage('randomizedPetList');

            // if data has changed,  generate the new randomized pet index list
            if (previousPetCount != data.length || !randomizedPetList) {
                randomizedPetList = generateRandomPetList(data.length, usePages);

                page = 0;
                sessionStorage.setItem('currentPage', 0);
                sessionStorage.setItem('data', JSON.stringify(data));
            }

            if (usePages) {
                const currentBtn = document.getElementById("current-page");
                currentBtn.innerText = page + 1;

                var petsFragment = new DocumentFragment();
                for (let i = page * pageSize;
                    i < randomizedPetList.length && i < (page + 1) * pageSize;
                    i++) {
                    let index = randomizedPetList[i];
                    renderPet(petsFragment, index, data[index]);
                }
                petList.appendChild(petsFragment);
            }
            else {
                // generate 3 slides with pageSize of elements each
                const pageCount = randomizedPetList.length / pageSize;
                for (let j = 0; j < pageCount; j++) {
                    renderPetSlide(petList, j, pageSize, randomizedPetList);
                }

                const slides = Array.from(petList.children);
                if (slides && slides.length > 0) {
                    slides[1].classList.add('current-slide');
                }

                updateSlidePositions(petList);
            }
        });
}

const setSlidePosition = (slide, index) => {
    const columnGap = parseFloat(getComputedStyle(slide).columnGap);
    const slideWidth = slide.getBoundingClientRect().width;
    slide.style.left = (slideWidth + columnGap) * index + 'px';
}

function updateSlidePositions(petList) {
    const slides = Array.from(petList.children);

    if (slides && slides.length > 0) {
        slides.forEach((slide, index) => { setSlidePosition(slide, index - 1) });
    }
}

function moveToSlide(track, moveNext = true) {
    const currentSlide = petList.querySelector('.current-slide');

    const targetSlide = moveNext
        ? currentSlide.nextElementSibling
        : currentSlide.previousElementSibling;

    const slidePosition = parseFloat(targetSlide.style.left);

    track.style.transform = 'translateX(-' + slidePosition + ')';

    currentSlide.classList.remove('current-slide');
    targetSlide.classList.add('current-slide');
}

function renderPetSlide(pageList, page, pageSize, petIndexArray, shouldPrepend = false) {
    const data = JSON.parse(sessionStorage.getItem('data'));
    const slide = document.createElement('div');
    slide.className = 'pets__pet-slide';

    var petsFragment = new DocumentFragment();

    for (let k = page * pageSize; k < (page + 1) * pageSize; k++) {
        let index = petIndexArray[k];
        renderPet(petsFragment, index, data[index]);
    }

    slide.appendChild(petsFragment);

    if (shouldPrepend) {
        pageList.prepend(slide);
    }
    else {
        pageList.append(slide);
    }
}

function getArrayFromSessionStorage(key) {
    const strVal = sessionStorage.getItem('randomizedPetList');
    return strVal ? strVal.split(",") : null;
}


/* initial and callback functions for the pet slider */

export function showRandomPets() {
    const USE_PAGES = false;
    renderPetList(USE_PAGES);
}

export function showPreviousPets() {
    const petList = document.querySelector('.pets__pet-list');
    const pageSize = +sessionStorage.getItem('pageSize');
    const petCount = +sessionStorage.getItem('totalPetCount');

    let randomizedPetList = getArrayFromSessionStorage('randomizedPetList');

    if (!randomizedPetList) {
        console.log("Randomized pet list not generated");
        return;
    }

    // remove last slide of pets
    petList.lastChild.remove();
    for (let i = 0; i < pageSize; i++) {
        randomizedPetList.pop();
    }

    // insert new slide of pets to start
    let newValues = generateUniqueRandomValues(0, petCount, pageSize, randomizedPetList.slice(0, pageSize));
    randomizedPetList = newValues.concat(randomizedPetList);
    const shouldPrepend = true;
    renderPetSlide(petList, 0, pageSize, newValues, shouldPrepend);


    sessionStorage.setItem('randomizedPetList', randomizedPetList.join(','));

    const moveNext = false;
    moveToSlide(petList, moveNext);
    updateSlidePositions(petList);
}

export function showNextPets() {
    const petList = document.querySelector('.pets__pet-list');
    const pageSize = +sessionStorage.getItem('pageSize');
    const petCount = +sessionStorage.getItem('totalPetCount');

    let randomizedPetList = getArrayFromSessionStorage('randomizedPetList');

    if (!randomizedPetList) {
        console.log("Randomized pet list not generated");
        return;
    }

    // remove first page values
    petList.firstChild.remove();
    randomizedPetList = randomizedPetList.slice(pageSize);

    // insert new 3 values of generated values to end
    let newValues = generateUniqueRandomValues(0, petCount, pageSize, randomizedPetList.slice(-pageSize));
    randomizedPetList.push(...newValues);

    renderPetSlide(petList, 0, pageSize, newValues);

    sessionStorage.setItem('randomizedPetList', randomizedPetList.join(','));

    const moveNext = true;
    moveToSlide(petList, moveNext);

    updateSlidePositions(petList);
}


function getLastPageNumber() {
    let pageSize = +sessionStorage.getItem('pageSize');
    let randomizedPetList = getArrayFromSessionStorage('randomizedPetList');

    return randomizedPetList ? randomizedPetList.length / pageSize - 1 : -1;
}

function setPage(newPage, lastPage) {
    newPage = +newPage;
    lastPage = +lastPage;

    if (newPage < 0 || (lastPage > 0 && newPage > lastPage)) {
        console.log("New page out of range");
        return;
    }

    if (newPage == 0) {
        const isDisabled = true;
        changeBtnActiveStatus("to-first-page", isDisabled);
        changeBtnActiveStatus("back", isDisabled);
    }

    if (newPage == lastPage) {
        const isDisabled = true;
        changeBtnActiveStatus("to-last-page", isDisabled);
        changeBtnActiveStatus("forward", isDisabled);
    }

    sessionStorage.setItem('currentPage', newPage);
    clearPetList();

    const USE_PAGES = true;
    renderPetList(USE_PAGES);
}



/* initial and callback functions for the pet paginator */

export function showFirstPetPage() {
    return setPage(0, getLastPageNumber());
}

export function showLastPetPage() {
    let page = +sessionStorage.getItem('currentPage');
    if (page == 0) {
        const isDisabled = false;
        changeBtnActiveStatus("to-first-page", isDisabled);
        changeBtnActiveStatus("back", isDisabled);
    }

    let newPage = getLastPageNumber();
    return setPage(newPage, newPage);
}

export function showPreviousPetPage() {
    let page = +sessionStorage.getItem('currentPage');
    const lastPage = getLastPageNumber();
    if (page == lastPage) {
        const isDisabled = false;
        changeBtnActiveStatus("to-last-page", isDisabled);
        changeBtnActiveStatus("forward", isDisabled);
    }

    setPage(page - 1, lastPage);
}

export function showNextPetPage() {
    let page = +sessionStorage.getItem('currentPage');
    if (page == 0) {
        const isDisabled = false;
        changeBtnActiveStatus("to-first-page", isDisabled);
        changeBtnActiveStatus("back", isDisabled);
    }

    setPage(page + 1, getLastPageNumber());
}


/* functions for the modal window */

function closeModal() {
    document.getElementById('overlay').classList.remove('visible');
    document.getElementById('modal').classList.remove('visible');
    document.querySelector('body').classList.remove('noscroll');
}

function renderModalWindow(pet) {
    let body = document.querySelector('body');

    let overlay = document.getElementById('overlay');
    overlay.classList.add('visible');
    overlay.addEventListener('click', closeModal);

    overlay.addEventListener('mouseover', (event) => {
        console.log(event);
    });

    let petContent = document.getElementById('modal');
    petContent.classList.add('visible');

    let closeBtn = addElement(petContent, 'button', 'modal__close-button');
    addElement(closeBtn, 'i', 'fa-solid fa-xmark');
    closeBtn.addEventListener('click', closeModal);

    let popupContainer = addElement(petContent, 'div', 'popup__container');

    addElement(popupContainer, 'img', 'popup__img', null, null, new Map([
        ['src', pet.img],
        ['alt', `${pet.type} ${pet.name}`],
        ['width', '500'],
        ['height', '500']
    ]))
    let descContainer = addElement(popupContainer, 'div', 'description__content');
    let descHeader = addElement(descContainer, 'div', 'description__header');
    addElement(descHeader, 'h3', 'description__title', pet.name);
    addElement(descHeader, 'h4', 'description__subtitle', `${pet.type} - ${pet.breed}`);

    addElement(descContainer, 'h5', 'description__description', pet.description);
    let traits = addElement(descContainer, 'ul', 'description__traits');
    let age = addElement(traits, 'li');
    let ageText = addElement(age, 'h5');
    addElement(ageText, 'span', 'category', 'Age: ');
    addElement(ageText, 'span', null, pet.age);


    let inoculations = addElement(traits, 'li');
    let inoculationsText = addElement(inoculations, 'h5');
    addElement(inoculationsText, 'span', 'category', 'Inoculations: ');
    addElement(inoculationsText, 'span', null, pet.inoculations.join(', '));

    let diseases = addElement(traits, 'li');
    let diseasesText = addElement(diseases, 'h5');
    addElement(diseasesText, 'span', 'category', 'Diseases: ');
    addElement(diseasesText, 'span', null, pet.diseases.join(', '));

    let parasites = addElement(traits, 'li');
    let parasitesText = addElement(parasites, 'h5');
    addElement(parasitesText, 'span', 'category', 'Parasites: ');
    addElement(parasitesText, 'span', null, pet.parasites.join(', '));

    body.classList.add('noscroll');
}
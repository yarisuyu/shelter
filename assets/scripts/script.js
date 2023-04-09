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


export function renderPetList(page, page_count) {
    let petList = document.querySelector('.pets__pet-list');

    let i = 0;
    fetch('../../assets/data/pets.json')
        .then(response => {
            return response.json();
        })
        .then(data => {
            if (data.length < page * page_count) {
                return;
            }

            var petsFragment = new DocumentFragment();

            for (let i = page; i < data.length && i < (page + 1) * page_count; i++) {
                renderPet(petsFragment, i, data[i]);
            }
            petList.appendChild(petsFragment);
        });
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


function renderModalWindow(pet) {
    let body = document.querySelector('body');

    let overlay = document.getElementById('overlay');
    overlay.classList.add('visible');

    let petContent = document.getElementById('modal');
    petContent.classList.add('visible');

    let closeBtn = addElement(petContent, 'button', 'modal__close-button');
    addElement(closeBtn, 'i', 'fa-solid fa-xmark');

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('visible');
        petContent.classList.remove('visible');


        body.classList.remove('noscroll');
    });

    let popupContainer = addElement(petContent, 'div', 'popup__container', null, 'popup', new Map([
        ['tabindex', '-1']
    ]));

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
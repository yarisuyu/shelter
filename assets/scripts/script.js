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

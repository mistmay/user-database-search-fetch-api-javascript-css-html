class Card {
    constructor(cardImg, name, city, gender, allInfo, index) {
        this.cardImg = cardImg;
        this.name = name;
        this.city = city;
        this.gender = gender;
        this.allInfo = allInfo;
        this.index = index;
        this.div = this.cardGenerator();
        this.aside = this.pageGenerator();
    }
    cardGenerator() {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        const cardBackground = document.createElement('div');
        cardBackground.setAttribute('class', 'card-background');
        cardBackground.style.backgroundImage = `url('${this.cardImg}')`;
        card.append(cardBackground);
        const cardContent = document.createElement('div');
        cardContent.setAttribute('class', 'card-content');
        const cardTitle = document.createElement('h2');
        cardTitle.setAttribute('class', 'card-title');
        cardTitle.innerText = this.name;
        cardContent.append(cardTitle);
        const cardGender = document.createElement('p');
        cardGender.setAttribute('class', 'card-gender');
        cardGender.innerText = this.gender;
        cardContent.append(cardGender);
        const cardCity = document.createElement('p');
        cardCity.setAttribute('class', 'card-city');
        cardCity.innerText = this.city;
        cardContent.append(cardCity);
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'card-button');
        button.id = `card-button-${this.index}`;
        button.innerText = 'More Details';
        cardContent.append(button);
        card.append(cardContent);
        return card;
    }
    pageGenerator() {
        const aside = document.createElement('aside');
        aside.setAttribute('class', 'card-page');
        aside.id = `aside-${this.index}`;
        const img = document.createElement('img');
        img.setAttribute('src', this.cardImg);
        img.setAttribute('class', 'person-avatar');
        aside.append(img);
        const data = document.createElement('p');
        data.setAttribute('class', 'person-data');
        data.innerText = this.allInfo;
        aside.append(data);
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'page-button');
        button.id = `return-button-${this.index}`;
        button.innerText = 'Back';
        aside.append(button);
        return aside;
    }
}
const cardArray = [];
let checkDataImport = false;

function search(array) {
    const names = [];
    const cities = [];
    const result = [];
    let index = 0;
    array.forEach(element => {
        names.push([element.name.toLowerCase(), index]);
        cities.push([element.city.toLowerCase(), index]);
        index++;
    });
    const p = document.createElement('p');
    p.innerText = 'No Matches found';
    if (document.getElementById('search-all').checked) {
        names.concat(cities).forEach(item => {
            if (item[0].includes(document.getElementById('search-bar').value.toLowerCase())) {
                result.push(array[item[1]]);
            }
        });
    } else if (document.getElementById('search-name').checked) {
        names.forEach(item => {
            if (item[0].includes(document.getElementById('search-bar').value.toLowerCase())) {
                result.push(array[item[1]]);
            }
        });
    } else if (document.getElementById('search-city').checked) {
        cities.forEach(item => {
            if (item[0].includes(document.getElementById('search-bar').value.toLowerCase())) {
                result.push(array[item[1]]);
            }
        });
    }
    if (result.length === 0) {
        document.querySelectorAll('.card-page').forEach(element => {
            element.remove();
        });
        document.querySelectorAll('.card').forEach(element => {
            element.remove();
        });
        document.querySelectorAll('#card-container>p').forEach(element => {
            element.remove();
        });
        const p = document.createElement('p');
        p.innerText = 'No Matches found';
        document.getElementById('card-container').append(p);
    }
    generateCardSection(result);
}

function generatenextCards(array, min, max) {
    document.querySelectorAll('.card-page').forEach(element => {
        element.remove();
    });
    document.querySelectorAll('.card').forEach(element => {
        element.remove();
    });
    document.querySelectorAll('#card-container>p').forEach(element => {
        element.remove();
    });
    for (let i = min; i < max; i++) {
        if (array[i]) {
            document.getElementById('card-container').append(array[i].div);
            document.querySelector('body').prepend(array[i].aside);
        }
    }
    document.querySelectorAll('.card-button').forEach(element => {
        element.onclick = function () {
            const id = (element.id.split('').filter(item => !isNaN(Number(item)))).join('');
            document.getElementById(`aside-${id}`).classList.toggle('visible-page');
        };
    });
    document.querySelectorAll('.page-button').forEach(element => {
        element.onclick = function () {
            const id = (element.id.split('').filter(item => !isNaN(Number(item)))).join('');
            document.getElementById(`aside-${id}`).classList.toggle('visible-page');
        };
    });
}

function generateCardSection(array) {
    if (array.length !== 0) {
        let min = 0;
        let max = 3;
        generatenextCards(array, min, max);
        document.getElementById('button-left').onclick = function () {
            if (min <= 0) {
                min = array.length - 3;
                max = array.length;
            } else {
                min -= 3;
                max -= 3;
            }
            generatenextCards(array, min, max);
        };
        document.getElementById('button-right').onclick = function () {
            if (max >= array.length) {
                min = 0;
                max = 3;
            } else {
                min += 3;
                max += 3;
            }
            generatenextCards(array, min, max);
        };
    }
    document.getElementById('search-bar').oninput = function () {
        if (document.getElementById('search-bar').value !== '') {
            search(cardArray);
        } else {
            generateCardSection(cardArray);
        }
    };
}

function createCards(array) {
    let index = 0;
    array.forEach(element => {
        const name = `${element.first_name} ${element.last_name}`;
        let address = '';
        Object.entries(element.address).forEach(item => {
            if (item[0] !== "coordinates") {
                address += item.join(': ') + '\n';
            }
        });
        const info = `${name}\n${element.gender}\n${element.date_of_birth}\n${address}`;
        cardArray.push(new Card(element.avatar, name, element.address.city, element.gender, info, index));
        index++;
    });
    const btnRight = document.createElement('div');
    const btnLeft = document.createElement('div');
    btnRight.id = 'button-right';
    btnLeft.id = 'button-left';
    btnLeft.innerText = '<';
    btnRight.innerText = '>';
    document.getElementById('card-container').append(btnLeft);
    document.getElementById('card-container').append(btnRight);
    checkDataImport = true;
    generateCardSection(cardArray);
}
async function importDatabase() {
    const personArray = [];
    for (let i = 0; i < 21; i++) {
        try {
            const response = await fetch('https://random-data-api.com/api/users/random_user');
            const person = await response.json();
            personArray.push(person);
        } catch (error) {
            console.log(error.message);
        }
    }
    createCards(personArray);
}

function createNewUser() {
    if (!document.getElementById('avatar').value.startsWith('https://')) {
        alert('Error:\nplease insert a valid URL for your avatar\nex: https://site.org/image.png');
        return;
    }
    let checkName = false;
    const avatar = document.getElementById('avatar').value;
    const name = document.getElementById('name').value + ' ' + document.getElementById('surname').value;
    cardArray.forEach(element => {
        if (element.name.toLowerCase() === name.toLocaleLowerCase()) {
            alert('Error:\nUser with same name already existing');
            checkName = true;
            return;
        }
    });
    if (checkName) {
        return;
    }
    const city = document.getElementById('city').value;
    const gender = document.getElementById('gender').value;
    const info = `${name}\n${gender}\n${document.getElementById('date-birth').value}\ncity: ${city}\nstreet_name: ${document.getElementById('street').value}\nstreet_address: ${document.getElementById('address').value}\nzip_code: ${document.getElementById('zip').value}\nstate: ${document.getElementById('state').value}\ncountry: ${document.getElementById('country').value}`;
    cardArray.push(new Card(avatar, name, city, gender, info, cardArray.length));
    generateCardSection(cardArray);
    alert('New user created successfully!');
    document.querySelector('#new-user-page>form').reset();
}

window.addEventListener('DOMContentLoaded', importDatabase);
document.getElementById('add-user-btn').addEventListener('click', () => {
    if (!checkDataImport) {
        return;
    } else {
        document.getElementById('new-user-page').classList.toggle('visible-page');
    }
});
document.getElementById('return-homepage').addEventListener('click', () => {
    document.getElementById('new-user-page').classList.toggle('visible-page');
});
document.querySelector('#new-user-page>form').addEventListener('submit', (event) => {
    event.preventDefault();
    createNewUser();
});
"use strict";

alert('Я запустился!');

console.log(window.location);

if (!window.location.search) {
    window.location.search = `?store=true`;
}

const valueSearch = new URLSearchParams(window.location.search);

console.log(Boolean(valueSearch.get(`store`)));


// location.pathname = `${location.pathname}/case`;

// Мой ключ Московская база
const myKey = '26bf6db8441315df2fa0a6b5eac3146d';
//Мой ключ mapbox
const myToken = 'pk.eyJ1IjoibWFrc2dvZGtpbmciLCJhIjoiY2thZ3I3MHJvMDljczJ5bjdra3ZpcnNxeiJ9.RZEz8XBxMBS1zTPemFnfRQ';
//Моя карта с mapbox без подписей
const myCardOne = 'maksgodking/ckh0p06z605ao19qqfxvw5yna';
//Моя карта mapbox с подписями
const myCardTwo = `maksgodking/ckh0z5o3i085p19qrogcxkjtb`;
//Инициализация карты без подписей
let mapWithoutSignatures = L.tileLayer(`https://api.mapbox.com/styles/v1/${myCardOne}/tiles/{z}/{x}/{y}?fresh=true&title=copy&access_token=${myToken}`, {
    id: myCardOne,
    accessToken: myToken,
});
//Подгружаем карту их mapbox с подписями
const mapWithCaptions = L.tileLayer(`https://api.mapbox.com/styles/v1/${myCardTwo}/tiles/{z}/{x}/{y}?fresh=true&title=copy&access_token=${myToken}`, {
    id: myCardTwo,
    accessToken: myToken,
});
// Собираем подгруженные карты в объект
const baseMap = {
    'Карта с подписями': mapWithCaptions,
    "Карта без подписей": mapWithoutSignatures,
};
// Скачивание данных
async function connectMoscow() {
    const testValue = await fetch(`https://apidata.mos.ru//v1/datasets/1465/features?api_key=${myKey}`);
    const answerTest = await testValue.json();
    const mymap = L.map('test-map', {
        center: [51.505, -0.09],
        zoom: 13
    });
    const geoLayer = L.geoJSON(answerTest.features, {
        style: (answer) => {
            switch (answer.properties.Attributes.CommonName) {
                case "ВДНХ":
                    return { color: 'red' };
            }
        }
    });
    geoLayer.on('click', (ev) => {
        console.log(ev);
    })
    mymap.addLayer(geoLayer);
    L.control.layers(baseMap).addTo(mymap);
    return answerTest;
}

// Показ результата
connectMoscow().then(answer => console.log(answer));
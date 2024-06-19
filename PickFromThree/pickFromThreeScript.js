// (on load at bottom of file)

const API_URL = "https://pokeapi.co/api/v2/";
const monNamePath = "./monNameList.txt";
let monNameList = [];
let indices = [];
let bigString = ""

function rollMons(num) {
    indices = [];
    bigString= "";
    let names = [];

    for (let i = 0; i < num; i++) {
        let name = addNewMonFromList();
        names.push(name);
        getMonElement(name);
    }

    document.querySelector("#content").innerHTML = bigString;
    console.log(names);

    for (let index in names) {
        getSprite(names[index]);
    }
}

function addNewMonFromList() {
    // get unique index
    let result = Math.floor(Math.random() * monNameList.length);
    while (indices.includes(result)) {
        result = Math.floor(Math.random() * monNameList.length);
    }

    indices.push(result);
    let name = monNameList[result];

    return name;
}

// ----------------------------------------------------------------------------------------
// File Functions
// ----------------------------------------------------------------------------------------

function fillMonArray() {
    // snippet from https://stackoverflow.com/a/14446538
    fetch(monNamePath)
        .then((response) => response.text())
        .then((text) => {
            console.log(text);
            monNameList = text.split("\n");
            for (let monIndex in monNameList) {
                monNameList[monIndex] = monNameList[monIndex].trim();
            }
        })
        .catch((e) => console.error(e));
}

// ----------------------------------------------------------------------------------------
// Request Functions
// ----------------------------------------------------------------------------------------

function getResource(url, callback) {
    console.log("lookin for " + url);

    // gets an item from the api
    let xhr = new XMLHttpRequest();

    xhr.onload = callback;

    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function getSprite(monName) {
    let url = API_URL + "pokemon/" + monName + "/";
    getResource(url, spriteLoaded);
}

// ----------------------------------------------------------------------------------------
// Callback Functions
// ----------------------------------------------------------------------------------------

function spriteLoaded(e) {
    let xhr = e.target;
    let obj = JSON.parse(xhr.responseText);

    // just send the result right to the html formatting
    addSpriteToMon(obj);
}

function dataError(e) {
    // yikes
    console.log("An error occured");
}

// ----------------------------------------------------------------------------------------
// Format Functions
// ----------------------------------------------------------------------------------------

function getMonElement(monName) {
    // add to our big string the div for this result
    bigString += "<div class=mon>";
    bigString += "<img id='" + monName + "Img' src='' alt='sprite'>";
    bigString += "<h4>" + monName + "</h4>";
    bigString += "</div>";
}

function addSpriteToMon(monResult) {
    document.getElementById(monResult.name + "Img").setAttribute("src", monResult.sprites.other.showdown.front_default);
}

// ----------------------------------------------------------------------------------------
// WINDOW ON LOAD FUNCION
// ----------------------------------------------------------------------------------------

window.onload = e => {
    fillMonArray();
    document.getElementById("searchButton").onclick = () => {
        rollMons(3);
    };
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var elementArray = [];
var gridArea;
var wordArea;
var totalTranslated = 0;
var totalTranslatedThisPage = 0;
var totalCellsOnPage = 0;
var cellBitsCollected = 0;
var maxBitsPerCell = 3;
var minBitsPerCell = 1;
var totalRows = 6;
var totalCols = 6;
var wordsOnPage = 600;
var sentencesOnPage = 12;
var translationsPerUnit = 1;
var totalCellsOnPageElement = document.getElementById("totalCellsOnPage");
var totalCellsTranslatedOnPageElement = document.getElementById("totalCellsTranslatedOnPage");
var totalCellsTranslatedElement = document.getElementById("totalCellsTranslated");
var cellBitsCollectedElement = document.getElementById("cellBitsCollected");
var upgradeCost = document.getElementById("bitsCost");
var encodingBar = document.getElementById("encodingBar");
var letterMap = new Map();
var ElemAttr;
(function (ElemAttr) {
    ElemAttr["HOVER"] = "hover";
    ElemAttr["TRANSLATED"] = "translated";
    ElemAttr["TRANSLATIONS"] = "translations";
    ElemAttr["TRANSLATED_CHARS"] = "translated_chars";
    ElemAttr["TRANSLATIONS_NEEDED"] = "translations_needed";
    ElemAttr["TRANSLATIONS_PERFORMED"] = "translations_performed";
    ElemAttr["ORIGINAL_WORD"] = "original_word";
    ElemAttr["TRANSLATED_WORD"] = "translated_word";
})(ElemAttr || (ElemAttr = {}));
function start() {
    gridArea = document.getElementById("gridArea");
    wordArea = document.getElementById("wordArea");
    loadBook();
    buildLetterMap();
    buildPage();
    beginTimedEvents();
}
function loadBook() {
    var book = (0, fs_1.readFileSync)("./book.txt", "utf-8");
    console.log("Loaded book!");
}
function buildLetterMap() {
    // uppercase
    letterMap.set("A", "I");
    letterMap.set("B", "Z");
    letterMap.set("C", "R");
    letterMap.set("D", "S");
    letterMap.set("E", "A");
    letterMap.set("F", "W");
    letterMap.set("G", "Q");
    letterMap.set("H", "J");
    letterMap.set("I", "E");
    letterMap.set("J", "L");
    letterMap.set("K", "P");
    letterMap.set("L", "M");
    letterMap.set("M", "U");
    letterMap.set("N", "T");
    letterMap.set("O", "Y");
    letterMap.set("P", "B");
    letterMap.set("Q", "G");
    letterMap.set("R", "H");
    letterMap.set("S", "V");
    letterMap.set("T", "C");
    letterMap.set("U", "X");
    letterMap.set("V", "K");
    letterMap.set("W", "N");
    letterMap.set("X", "D");
    letterMap.set("Y", "O");
    letterMap.set("Z", "F");
    // lowercase
    letterMap.set("a", "i");
    letterMap.set("b", "z");
    letterMap.set("c", "r");
    letterMap.set("d", "s");
    letterMap.set("e", "a");
    letterMap.set("f", "w");
    letterMap.set("g", "q");
    letterMap.set("h", "j");
    letterMap.set("i", "e");
    letterMap.set("j", "l");
    letterMap.set("k", "p");
    letterMap.set("l", "m");
    letterMap.set("m", "u");
    letterMap.set("n", "t");
    letterMap.set("o", "y");
    letterMap.set("p", "b");
    letterMap.set("q", "g");
    letterMap.set("r", "h");
    letterMap.set("s", "v");
    letterMap.set("t", "c");
    letterMap.set("u", "x");
    letterMap.set("v", "k");
    letterMap.set("w", "n");
    letterMap.set("x", "d");
    letterMap.set("y", "o");
    letterMap.set("z", "f");
}
function encodeWord(word) {
    var newWord = "";
    for (var index = 0; index < word.length; index++) {
        var letter = word[index];
        if (letter == " " || letter == ".") {
            newWord += letter;
            continue;
        }
        var mappedLetter = letterMap.get(letter);
        newWord += mappedLetter;
    }
    return newWord;
}
function decodeWord(word) {
    var decodedWord = "";
    for (var index = 0; index < word.length; index++) {
        var letter = word[index];
        if (letter == " " || letter == ".") {
            decodedWord += letter;
            continue;
        }
        var mappedLetter = getByValue(letterMap, letter);
        if (mappedLetter == undefined)
            console.log("Undefined value: " + letter);
        decodedWord += mappedLetter;
    }
    return decodedWord;
}
function getByValue(map, searchValue) {
    for (var _i = 0, _a = map.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (value === searchValue)
            return key;
    }
}
function buildPage() {
    gridArea.innerHTML = '';
    wordArea.innerHTML = '';
    elementArray = [];
    var wasAPeriod = false;
    for (var index = 0; index < sentencesOnPage; index++) {
        var sentence = getRandomSentence();
        for (var index_1 = 0; index_1 < sentence.length; index_1++) {
            var newWord = encodeWord(sentence[index_1]);
            var word = createWord(newWord);
            wordArea.appendChild(word);
        }
    }
    totalCellsOnPage = elementArray.length;
    return;
    /*
    for (let index = 0; index < wordsOnPage; index++) {
        var word = createWord()
        if (index == 0 || wasAPeriod) {
            word.textContent = word.textContent.substring(0, 1).toUpperCase() + word.textContent.substring(1, word.textContent.length)
            word.setAttribute(ElemAttr.TRANSLATED_WORD, decodeWord(word.textContent))
        }

        if (word.textContent == ".") {
            wasAPeriod = true;
        } else {
            wasAPeriod = false;
        }

        wordArea.appendChild(word);
    }

    return
    for (let rows = 0; rows < totalRows; rows++) {
        var row = this.createRow()
        for (let cols = 0; cols < totalCols; cols++) {
            row.appendChild(this.createColumn(rows.toString() + ", " + cols.toString()))
        }
        gridArea.appendChild(row)
    }
    */
}
function createWord(text) {
    //<div class="p-1 border border-1">A</div>
    var word = document.createElement("div");
    word.className = "p-1 border border-1 font-monospace";
    word.setAttribute(ElemAttr.HOVER, "0");
    word.setAttribute(ElemAttr.TRANSLATED, "false");
    word.setAttribute(ElemAttr.TRANSLATIONS, "0");
    word.setAttribute(ElemAttr.TRANSLATED_CHARS, "0");
    word.setAttribute(ElemAttr.TRANSLATIONS_PERFORMED, "0");
    word.setAttribute(ElemAttr.TRANSLATIONS_NEEDED, "10");
    if (text != undefined && text != "") {
        word.textContent = text;
    }
    else {
        word.textContent = getRandomWord();
    }
    word.setAttribute(ElemAttr.ORIGINAL_WORD, word.textContent);
    word.setAttribute(ElemAttr.TRANSLATED_WORD, decodeWord(word.textContent));
    word.addEventListener("mouseover", this.translateHoveringOver);
    word.addEventListener("mouseleave", this.noLongerHovering);
    elementArray.push(word);
    return word;
}
function createRow() {
    var row = document.createElement("div");
    row.className = "row gx-2 border";
    return row;
}
function createColumn(text) {
    var col = document.createElement("div");
    col.style.width = "100px";
    col.style.height = "100px";
    col.className = "col border-start";
    col.setAttribute(ElemAttr.HOVER, "0");
    col.setAttribute(ElemAttr.TRANSLATED, "false");
    col.setAttribute(ElemAttr.TRANSLATIONS, "0");
    col.setAttribute(ElemAttr.TRANSLATED_CHARS, "0");
    col.setAttribute(ElemAttr.TRANSLATIONS_PERFORMED, "0");
    col.setAttribute(ElemAttr.TRANSLATIONS_NEEDED, "10");
    col.textContent = getRandomWord();
    col.setAttribute(ElemAttr.ORIGINAL_WORD, col.textContent);
    col.setAttribute(ElemAttr.TRANSLATED_WORD, decodeWord(col.textContent));
    col.addEventListener("mouseover", this.translateHoveringOver);
    col.addEventListener("mouseleave", this.noLongerHovering);
    var stats = document.createElement("div");
    //stats.textContent = `0/${col.getAttribute(ElemAttr.TRANSLATIONS_NEEDED)}`;
    col.appendChild(stats);
    elementArray.push(col);
    return col;
}
function getRandomWords() {
    var returnWords = [];
    var numWords = getRandomInt(3, 8);
    for (var index = 0; index < numWords; index++) {
        returnWords.push(getRandomWord());
    }
    return returnWords.join(" ");
}
function getRandomWord() {
    var strings = ["a", "the", "i", "you", "me", "we", "are", "us", "candy", "apple", "pop", "tart", "coke", "cellphone", "cranberry", "."];
    return encodeWord(strings[getRandomInt(0, strings.length - 1)]);
}
var sentences = [
    ["In", "a", "world", "of", "endless", "possibilities", "imagination", "is", "the", "limitless", "frontier", "."],
    ["Silence", "can", "be", "louder", "than", "a", "thousand", "words", "."],
    ["I", "like", "to", "play", "with", "cats", "."]
];
function getRandomSentence() {
    return sentences[getRandomInt(0, sentences.length - 1)];
}
var hoveredElement;
function translateHoveringOver(event) {
    //console.log(event.target)
    if (event != undefined) {
        hoveredElement = event.target;
    }
    var translated = hoveredElement.getAttribute(ElemAttr.TRANSLATED) || "false";
    var translations = Number.parseInt(hoveredElement.getAttribute(ElemAttr.TRANSLATIONS_PERFORMED) || "0");
    var translationsNeeded = Number.parseInt(hoveredElement.getAttribute(ElemAttr.TRANSLATIONS_NEEDED) || "0");
    if (translated.match("false")) {
        hoveredElement.setAttribute(ElemAttr.HOVER, "1");
        for (var index = 0; index < translationsPerUnit; index++) {
            translateWordInElement(hoveredElement);
        }
        if (translations >= translationsNeeded) {
            hoveredElement.setAttribute(ElemAttr.TRANSLATED, "true");
            hoveredElement.style.backgroundColor = '';
            hoveredElement.className = hoveredElement.className += " translated";
            totalTranslated++;
            totalTranslatedThisPage++;
            addCellBits();
            //element.textContent += " +" + addCellBits().toString()
        }
        colorElement();
        var secondsToHover = 5;
        if (hoveredElement != undefined) {
            setTimeout(function () {
                if (hoveredElement != undefined) {
                    translateHoveringOver(); // Call again to check continued hover
                }
            }, secondsToHover * 1000);
        }
    }
}
var colors = [
    "#d5d6ea", // soap
    "#f6f6eb", // isabelline
    "#d7ecd9", // chinese white
    "#f5d5cb", // champagne pink
    "#f6ecf5", // anti-flash white
    "#f3ddf2" // pink lace
];
var colorChanges = 0;
function colorElement() {
    if (hoveredElement == undefined)
        return;
    var changeColor = function () {
        var color = colors[getRandomInt(0, colors.length - 1)];
        if (hoveredElement == undefined || hoveredElement.getAttribute(ElemAttr.TRANSLATED) == "true")
            return;
        hoveredElement.style.backgroundColor = color;
        setTimeout(changeColor, 1000);
    };
    changeColor();
}
/**
 *
 * @param element
 */
function translateWordInElement(element) {
    /*
    Should be stored on the element..?
    apple
    translated_chars=0
    translations_needed=5
    original_word=apple
    translated_word=zffpq
    */
    var _a;
    var totalLetters = (_a = element.textContent) === null || _a === void 0 ? void 0 : _a.length;
    // total number of already changed letters
    var translationsPerformed = Number.parseInt(element.getAttribute(ElemAttr.TRANSLATIONS_PERFORMED) || "0");
    var translationsNeeded = Number.parseInt(element.getAttribute(ElemAttr.TRANSLATIONS_NEEDED) || "0");
    var originalWord = element.getAttribute(ElemAttr.ORIGINAL_WORD) || "";
    var translatedWord = element.getAttribute(ElemAttr.TRANSLATED_WORD) || "";
    var newWord = "";
    if (translationsPerformed < translationsNeeded) {
        newWord = encodeWord(element.textContent || "");
        translationsPerformed += 1;
    }
    else if (translationsPerformed >= translationsNeeded) {
        newWord = translatedWord;
    }
    element.textContent = newWord;
    element.setAttribute(ElemAttr.TRANSLATIONS_PERFORMED, translationsPerformed.toString());
}
function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function addCellBits() {
    var bits = getRandomInt(minBitsPerCell, maxBitsPerCell);
    cellBitsCollected += bits;
    return bits;
}
function noLongerHovering(event) {
    //console.log(event.target)
    var element = event.target;
    element.setAttribute(ElemAttr.HOVER, "0");
    element.style.backgroundColor = "";
    hoveredElement = undefined;
}
function beginTimedEvents() {
    checkIfAllDead();
    updateStatistics();
    updateEncodingBar();
}
function encodeNonHoveredElements() {
    var encodedElements = 0;
    elementArray.forEach(function (element) {
        var hover = element.getAttribute(ElemAttr.HOVER) || "0";
        var translations = getIntForAttr(element, ElemAttr.TRANSLATIONS_PERFORMED);
        var translated = element.getAttribute(ElemAttr.TRANSLATED) || "0";
        if (!hover.match("1") && translations > 0 && translated.match("false")) {
            console.log("Doing a encode on {}", element);
            var newTranslations = translations - 1;
            element.textContent = encodeWord(element.textContent || "");
            element.setAttribute(ElemAttr.TRANSLATIONS_PERFORMED, newTranslations.toString());
            encodedElements++;
        }
    });
    console.log("Encoded Elements: ", encodedElements);
    encodingBar.textContent = '';
    encodingBarProgress = 0;
}
function checkIfAllDead() {
    if (totalTranslatedThisPage >= totalCellsOnPage) {
        totalTranslatedThisPage = 0;
        buildPage();
    }
    setTimeout(checkIfAllDead, 1000);
}
function updateStatistics() {
    totalCellsOnPageElement.textContent = totalCellsOnPage.toString();
    totalCellsTranslatedOnPageElement.textContent = totalTranslatedThisPage.toString();
    totalCellsTranslatedElement.textContent = totalTranslated.toString();
    cellBitsCollectedElement.textContent = cellBitsCollected.toString();
    setTimeout(updateStatistics, 100);
}
var array = new Array(25);
var encodingBarProgress = 0;
function updateEncodingBar() {
    encodingBar.textContent = array.fill(".").join("");
    encodingBar.textContent = array.fill("|", 0, encodingBarProgress).join("");
    encodingBarProgress++;
    if (encodingBarProgress >= 25) {
        encodeNonHoveredElements();
    }
    setTimeout(updateEncodingBar, 50);
}
function upgradeTranslationsPerUnit() {
    var cost = Number.parseInt(upgradeCost.getAttribute("cost") || "0");
    if (cellBitsCollected >= cost) {
        translationsPerUnit += 1;
        cellBitsCollected -= cost;
        cost += cost * 0.25;
        upgradeCost.setAttribute("cost", cost.toString());
        upgradeCost.textContent = cost.toString();
    }
}
function getIntForAttr(element, attr) {
    var stringy = element.getAttribute(attr) || "0";
    var number = Number.parseInt(stringy);
    return number;
}
function getStringForAttr(element, attr) {
    return element.getAttribute(attr) || "0";
}
start();

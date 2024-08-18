import * as book from './book'

let elementArray: Array<HTMLElement> = [];
let gridArea: HTMLDivElement;
let wordArea: HTMLDivElement;
let upgradeButtonsArea: HTMLDivElement;
let upgradeCost: HTMLSpanElement;

let totalTranslated: number = 0;
let totalTranslatedThisPage: number = 0;
let totalCellsOnPage: number = 0;
let cellBitsCollected: number = 0;

const maxBitsPerCell = 3;
const minBitsPerCell = 1;

const totalRows = 6;
const totalCols = 6;

const wordsOnPage = 600
const sentencesOnPage = 12

let translationsPerUnit = 1

const totalCellsOnPageElement: HTMLElement = <HTMLElement>document.getElementById("totalCellsOnPage")
const totalCellsTranslatedOnPageElement: HTMLElement = <HTMLElement>document.getElementById("totalCellsTranslatedOnPage")
const totalCellsTranslatedElement: HTMLElement = <HTMLElement>document.getElementById("totalCellsTranslated")
const cellBitsCollectedElement: HTMLElement = <HTMLElement>document.getElementById("cellBitsCollected")

const encodingBar: HTMLSpanElement = <HTMLSpanElement>document.getElementById("encodingBar")

const letterMap: Map<string, string> = new Map();

enum ElemAttr {
    HOVER = "hover",
    TRANSLATED = "translated",
    TRANSLATIONS = "translations",
    TRANSLATED_CHARS = "translated_chars",
    TRANSLATIONS_NEEDED = "translations_needed",
    TRANSLATIONS_PERFORMED = "translations_performed",
    ORIGINAL_WORD = "original_word",
    TRANSLATED_WORD = "translated_word"
}

function start() {
    upgradeButtonsArea = <HTMLDivElement>document.getElementById("upgradeButtons");
    gridArea = <HTMLDivElement>document.getElementById("gridArea");
    wordArea = <HTMLDivElement>document.getElementById("wordArea");

    loadBook()

    buildLetterMap()

    buildUpgradeButtons()

    buildPage()

    beginTimedEvents()
}

function loadBook() {
    //const book = fs.readFileSync("./book.txt", "utf-8")
    console.log(book.bookText.substring(0, 100))
    var bookSplit = book.bookText.split(".");

    var total = 0;
    bookSplit.forEach(b => {
        var splits = b.split(" ");
        total += splits.length
        sentences.push(splits)
    })

    console.log("Loaded book! : Total", total)
}

function buildLetterMap() {
    // uppercase
    letterMap.set("A", "I")
    letterMap.set("B", "Z")
    letterMap.set("C", "R")
    letterMap.set("D", "S")
    letterMap.set("E", "A")
    letterMap.set("F", "W")
    letterMap.set("G", "Q")
    letterMap.set("H", "J")
    letterMap.set("I", "E")
    letterMap.set("J", "L")
    letterMap.set("K", "P")
    letterMap.set("L", "M")
    letterMap.set("M", "U")
    letterMap.set("N", "T")
    letterMap.set("O", "Y")
    letterMap.set("P", "B")
    letterMap.set("Q", "G")
    letterMap.set("R", "H")
    letterMap.set("S", "V")
    letterMap.set("T", "C")
    letterMap.set("U", "X")
    letterMap.set("V", "K")
    letterMap.set("W", "N")
    letterMap.set("X", "D")
    letterMap.set("Y", "O")
    letterMap.set("Z", "F")

    // lowercase
    letterMap.set("a", "i")
    letterMap.set("b", "z")
    letterMap.set("c", "r")
    letterMap.set("d", "s")
    letterMap.set("e", "a")
    letterMap.set("f", "w")
    letterMap.set("g", "q")
    letterMap.set("h", "j")
    letterMap.set("i", "e")
    letterMap.set("j", "l")
    letterMap.set("k", "p")
    letterMap.set("l", "m")
    letterMap.set("m", "u")
    letterMap.set("n", "t")
    letterMap.set("o", "y")
    letterMap.set("p", "b")
    letterMap.set("q", "g")
    letterMap.set("r", "h")
    letterMap.set("s", "v")
    letterMap.set("t", "c")
    letterMap.set("u", "x")
    letterMap.set("v", "k")
    letterMap.set("w", "n")
    letterMap.set("x", "d")
    letterMap.set("y", "o")
    letterMap.set("z", "f")

    // numbers
    letterMap.set("0", "8")
    letterMap.set("1", "4")
    letterMap.set("2", "1")
    letterMap.set("3", "5")
    letterMap.set("4", "2")
    letterMap.set("5", "7")
    letterMap.set("6", "9")
    letterMap.set("7", "6")
    letterMap.set("8", "3")
    letterMap.set("9", "0")
}

const specialCharacters = [
    " ", ".", ",", "\"", "'",
    "-", "`", "`", "!", "?", ";", "-"
]

const regularCharacters = "[a-z][A-Z]"

/*
Undefined value: - 
Undefined value: ` 
Undefined value: !
Undefined value: -
Undefined value: ; 
Undefined value: -
*/

function encodeWord(word: string) {
    let newWord = "";
    for (let index = 0; index < word.length; index++) {
        const letter = word[index]
        if (specialCharacters.includes(letter)) {
            newWord += letter
            continue
        }

        var mappedLetter = letterMap.get(letter)
        if (mappedLetter == undefined) {
            console.log("Undefined value: " + letter)
            mappedLetter = letter
        }

        newWord += mappedLetter;
    }

    return newWord;
}

function decodeWord(word: string) {
    let decodedWord = "";
    for (let index = 0; index < word.length; index++) {
        const letter = word[index]
        if (specialCharacters.includes(letter)) {
            decodedWord += letter
            continue
        }

        var mappedLetter = getByValue(letterMap, letter)
        if (mappedLetter == undefined) {
            console.log("Undefined value: " + letter)
            mappedLetter = letter
        }

        decodedWord += mappedLetter;
    }

    return decodedWord;
}

function getByValue(map: Map<string, string>, searchValue: string) {
    for (const [key, value] of map.entries()) {
        if (value === searchValue)
            return key;
    }
}

function buildUpgradeButtons() {
    // upgrade buttons
    upgradeButtonsArea.innerHTML = ''

    var upgradeButton1: HTMLButtonElement = <HTMLButtonElement>document.createElement('button')
    upgradeButton1.classList.add("btn")
    upgradeButton1.classList.add("btn-primary")
    upgradeButton1.textContent = "+1 Translations - Cost: "
    upgradeButton1.id = "translationsPerUnit"
    upgradeButton1.onclick = upgradeTranslationsPerUnit

    upgradeCost = <HTMLSpanElement>document.createElement('span')
    upgradeCost.classList.add("badge")
    upgradeCost.classList.add("text-bg-secondary")
    upgradeCost.setAttribute("cost", "10")
    upgradeCost.textContent = "10"
    upgradeButton1.appendChild(upgradeCost)

    upgradeButtonsArea.appendChild(upgradeButton1)
}

function buildPage() {

    // gamespace
    gridArea.innerHTML = ''
    wordArea.innerHTML = ''

    elementArray = []

    const wasAPeriod: boolean = false

    for (let index = 0; index < sentencesOnPage; index++) {
        const sentence = getSentenceInOrder();
        for (let index = 0; index < sentence.length; index++) {
            const newWord = encodeWord(sentence[index]);
            const word = createWord(newWord);
            if (word) {
                wordArea.appendChild(word)
            }
        }
    }

    totalCellsOnPage = elementArray.length

    return

}

function createWord(text?: string) {
    //<div class="p-1 border border-1">A</div>
    const word: HTMLDivElement = document.createElement("div")
    word.className = "p-1 border border-1 font-monospace"
    word.setAttribute(ElemAttr.HOVER, "0");
    word.setAttribute(ElemAttr.TRANSLATED, "false");
    word.setAttribute(ElemAttr.TRANSLATIONS, "0");
    word.setAttribute(ElemAttr.TRANSLATED_CHARS, "0");
    word.setAttribute(ElemAttr.TRANSLATIONS_PERFORMED, "0");
    word.setAttribute(ElemAttr.TRANSLATIONS_NEEDED, "10");

    if (text != undefined && text != "") {
        word.textContent = text
    } else {
        return
    }
    word.setAttribute(ElemAttr.ORIGINAL_WORD, word.textContent)
    word.setAttribute(ElemAttr.TRANSLATED_WORD, decodeWord(word.textContent))

    word.addEventListener("mouseover", translateHoveringOver)
    word.addEventListener("mouseleave", noLongerHovering)

    elementArray.push(word)

    return word;
}

function createRow(): HTMLDivElement {
    const row: HTMLDivElement = document.createElement("div")
    row.className = "row gx-2 border";

    return row
}

function createColumn(text: string): HTMLDivElement {
    const col: HTMLDivElement = document.createElement("div")

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
    col.setAttribute(ElemAttr.ORIGINAL_WORD, col.textContent)
    col.setAttribute(ElemAttr.TRANSLATED_WORD, decodeWord(col.textContent))

    col.addEventListener("mouseover", this.translateHoveringOver)
    col.addEventListener("mouseleave", this.noLongerHovering)

    const stats: HTMLDivElement = document.createElement("div")
    //stats.textContent = `0/${col.getAttribute(ElemAttr.TRANSLATIONS_NEEDED)}`;

    col.appendChild(stats)

    elementArray.push(col)

    return col
}

function getRandomWords() {
    const returnWords: string[] = [];

    const numWords = getRandomInt(3, 8);

    for (let index = 0; index < numWords; index++) {
        returnWords.push(getRandomWord())
    }

    return returnWords.join(" ")
}

function getRandomWord() {
    const strings = ["a", "the", "i", "you", "me", "we", "are", "us", "candy", "apple", "pop", "tart", "coke", "cellphone", "cranberry", "."];
    return encodeWord(strings[getRandomInt(0, strings.length - 1)])
}

const sentences: Array<Array<string>> = []

var sentenceIndex = 0;

function getSentenceInOrder() {
    var sentence = sentences[sentenceIndex]
    sentenceIndex++
    return sentence
}

function getRandomSentence() {
    return sentences[getRandomInt(0, sentences.length - 1)]
}

let hoveredElement: HTMLElement;

function translateHoveringOver(event?: MouseEvent) {
    //console.log(event.target)
    if (event != undefined) {
        hoveredElement = <HTMLElement>event.target;
    }

    const translated = hoveredElement.getAttribute(ElemAttr.TRANSLATED) || "false"
    const translations = Number.parseInt(hoveredElement.getAttribute(ElemAttr.TRANSLATIONS_PERFORMED) || "0")
    const translationsNeeded = Number.parseInt(hoveredElement.getAttribute(ElemAttr.TRANSLATIONS_NEEDED) || "0")

    if (translated.match("false")) {

        hoveredElement.setAttribute(ElemAttr.HOVER, "1");

        for (let index = 0; index < translationsPerUnit; index++) {
            translateWordInElement(hoveredElement)
        }

        if (translations >= translationsNeeded) {
            hoveredElement.setAttribute(ElemAttr.TRANSLATED, "true")
            hoveredElement.style.backgroundColor = ''
            hoveredElement.className = hoveredElement.className += " translated"
            totalTranslated++
            totalTranslatedThisPage++
            addCellBits()
            //element.textContent += " +" + addCellBits().toString()
        }

        colorElement();

        const secondsToHover = 5;

        if (hoveredElement != undefined) {
            setTimeout(() => {
                if (hoveredElement != undefined) {
                    translateHoveringOver(); // Call again to check continued hover
                }
            }, secondsToHover * 1000);
        }
    }
}

const colors = [
    "#d5d6ea", // soap
    "#f6f6eb", // isabelline
    "#d7ecd9", // chinese white
    "#f5d5cb", // champagne pink
    "#f6ecf5", // anti-flash white
    "#f3ddf2"  // pink lace
]

const colorChanges = 0;

function colorElement() {
    if (hoveredElement == undefined) return;

    const changeColor = () => {
        const color = colors[getRandomInt(0, colors.length - 1)]
        if (hoveredElement == undefined || hoveredElement.getAttribute(ElemAttr.TRANSLATED) == "true")
            return
        hoveredElement.style.backgroundColor = color
        setTimeout(changeColor, 1000)
    }
    changeColor();
}

/**
 * 
 * @param element 
 */
function translateWordInElement(element: HTMLElement) {

    /*
    Should be stored on the element..?
    apple
    translated_chars=0
    translations_needed=5
    original_word=apple
    translated_word=zffpq
    */

    const totalLetters = element.textContent?.length

    // total number of already changed letters
    let translationsPerformed = Number.parseInt(element.getAttribute(ElemAttr.TRANSLATIONS_PERFORMED) || "0")
    const translationsNeeded = Number.parseInt(element.getAttribute(ElemAttr.TRANSLATIONS_NEEDED) || "0")
    const originalWord = element.getAttribute(ElemAttr.ORIGINAL_WORD) || ""
    const translatedWord = element.getAttribute(ElemAttr.TRANSLATED_WORD) || ""

    let newWord = "";
    if (translationsPerformed < translationsNeeded) {
        newWord = encodeWord(element.textContent || "")
        translationsPerformed += 1
    } else if (translationsPerformed >= translationsNeeded) {
        newWord = translatedWord
    }

    element.textContent = newWord;
    element.setAttribute(ElemAttr.TRANSLATIONS_PERFORMED, translationsPerformed.toString());
}

function getRandomInt(min: number, max: number) {
    return Math.round(Math.random() * (max - min) + min);
}

function addCellBits() {
    const bits = getRandomInt(minBitsPerCell, maxBitsPerCell);
    cellBitsCollected += bits
    return bits
}


function noLongerHovering(event: MouseEvent) {
    //console.log(event.target)
    const element: HTMLElement = <HTMLElement>event.target;
    element.setAttribute(ElemAttr.HOVER, "0")
    element.style.backgroundColor = ""
    hoveredElement = undefined
}

function beginTimedEvents() {
    checkIfAllDead();
    updateStatistics();
    updateEncodingBar();
}

function encodeNonHoveredElements() {

    let encodedElements = 0;
    elementArray.forEach(element => {

        const hover = element.getAttribute(ElemAttr.HOVER) || "0"
        const translations = getIntForAttr(element, ElemAttr.TRANSLATIONS_PERFORMED)
        const translated = element.getAttribute(ElemAttr.TRANSLATED) || "0"

        if (!hover.match("1") && translations > 0 && translated.match("false")) {
            console.log("Doing a encode on {}", element)
            const newTranslations = translations - 1;
            element.textContent = encodeWord(element.textContent || "")
            element.setAttribute(ElemAttr.TRANSLATIONS_PERFORMED, newTranslations.toString())
            encodedElements++;
        }
    });

    console.log("Encoded Elements: ", encodedElements)
    encodingBar.textContent = ''
    encodingBarProgress = 0

}

function checkIfAllDead() {
    if (totalTranslatedThisPage >= totalCellsOnPage) {
        totalTranslatedThisPage = 0
        buildPage()
    }
    setTimeout(checkIfAllDead, 1000)
}

function updateStatistics() {
    totalCellsOnPageElement.textContent = totalCellsOnPage.toString()
    totalCellsTranslatedOnPageElement.textContent = totalTranslatedThisPage.toString()
    totalCellsTranslatedElement.textContent = totalTranslated.toString()
    cellBitsCollectedElement.textContent = cellBitsCollected.toString()
    setTimeout(updateStatistics, 100)
}


const array = new Array(25);
var encodingBarProgress = 0;

function updateEncodingBar() {

    encodingBar.textContent = array.fill(".").join("")
    encodingBar.textContent = array.fill("|", 0, encodingBarProgress).join("")
    encodingBarProgress++

    if (encodingBarProgress >= 25) {
        encodeNonHoveredElements()
    }

    setTimeout(updateEncodingBar, 50)
}

function upgradeTranslationsPerUnit() {
    let cost = Number.parseInt(upgradeCost.getAttribute("cost"))
    if (cellBitsCollected >= cost) {
        translationsPerUnit += 1
        cellBitsCollected -= cost
        cost += cost * 0.25
        upgradeCost.setAttribute("cost", cost.toString())
        upgradeCost.textContent = cost.toString()
    }

}

function getIntForAttr(element: HTMLElement, attr: ElemAttr) {
    const stringy = element.getAttribute(attr) || "0";
    const number = Number.parseInt(stringy);
    return number
}

function getStringForAttr(element: HTMLElement, attr: ElemAttr): string {
    return element.getAttribute(attr) || "0";
}

start()



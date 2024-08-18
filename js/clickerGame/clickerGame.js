var mainGameElement = document.getElementById("game");
var settingsElement = document.getElementById("settings");
var resetGameCheck = document.getElementById("resetGameCheck");
var resetGameButton = document.getElementById("resetGameButton");
var blueButtonsElement = document.getElementById("buttonGroupBlue");
var greenClicksElement = document.getElementById("totalGreen");
var greenButtonsElement = document.getElementById("buttonGroupGreen");
var greenIncrementElement = document.getElementById("incrementGreen");
var greenPerSecondElement = document.getElementById("perSecondGreen");
//#region classes
var ClickColor;
(function (ClickColor) {
    ClickColor["Blue"] = "Blue";
    ClickColor["Green"] = "Green";
    ClickColor["NAN"] = "NAN";
})(ClickColor || (ClickColor = {}));
var UpgradeType;
(function (UpgradeType) {
    UpgradeType["INCREMENT"] = "Per Click";
    UpgradeType["PER_SECOND"] = "Per Second";
    UpgradeType["NEW_BUTTON"] = "New Button";
    UpgradeType["NAN"] = "N/A";
})(UpgradeType || (UpgradeType = {}));
class Button {
    constructor(id, colorDataId, text, color, cost, colorCost, upgradeValue, type, upgradeColor, isClick) {
        this.isClick = false;
        this.id = id;
        this.colorDataId = colorDataId;
        this.text = text;
        this.color = color;
        this.colorCost = colorCost;
        this.upgradeValue = upgradeValue;
        this.type = type;
        this.upgradeColor = upgradeColor;
        this.cost = cost;
        this.isClick = isClick;
    }
}
class ColorData {
    constructor() {
        this.click = 0;
        this.increment = 1;
        this.perSecond = 0;
        this.upgradeButtons = []; //contains all of the buttons for the color
    }
}
function getTotalId(colorData) {
    return "total" + colorData.id;
}
function getIncrementId(colorData) {
    return "increment" + colorData.id;
}
function getPerSecondId(colorData) {
    return "perSecond" + colorData.id;
}
function getButtonGroupId(colorData) {
    return "buttonGroup" + colorData.id;
}
function getClickerId(colorData) {
    return "clicker" + colorData.id;
}
function buttonToJson(button) {
    return JSON.stringify(button);
}
function colorDataToJson(colorData) {
    return JSON.stringify(colorData);
}
function getUniqueId(button) {
    return [button.id, button.colorDataId, button.color].filter(Boolean).join("-");
}
//#endregion
//#region gameplay vars
// ColorData -> Buttons -> Button
var blueButton = {
    id: "Blue",
    colorDataId: "Blue",
    text: "Blue",
    color: ClickColor.Blue,
    cost: 0,
    colorCost: ClickColor.NAN,
    bought: false,
    isShown: false,
    isClick: true,
    element: undefined,
    upgradeValue: 0,
    type: UpgradeType.NAN,
    upgradeColor: ClickColor.NAN
};
var blueColorData = {
    id: "Blue",
    color: ClickColor.Blue,
    click: 0,
    increment: 1,
    perSecond: 0,
    clickButton: blueButton,
    upgradeButtons: [],
    totalElement: undefined,
    incrementElement: undefined,
    perSecondElement: undefined,
    buttonGroup: undefined,
    clickerElement: undefined
};
var greenButton = {
    id: "Green",
    colorDataId: "Green",
    text: "Green",
    color: ClickColor.Green,
    cost: 0,
    colorCost: ClickColor.NAN,
    bought: false,
    isShown: false,
    isClick: true,
    element: undefined,
    upgradeValue: 0,
    type: UpgradeType.NAN,
    upgradeColor: ClickColor.NAN
};
var greenColorData = {
    id: "Green",
    color: ClickColor.Green,
    click: 0,
    increment: 1,
    perSecond: 0,
    clickButton: greenButton,
    upgradeButtons: [],
    totalElement: undefined,
    incrementElement: undefined,
    perSecondElement: undefined,
    buttonGroup: undefined,
    clickerElement: undefined
};
var colorDataArray = [blueColorData];
var colorDataMap = new Map();
//#endregion
function createHTMLButton(button) {
    var newButton = document.createElement("button");
    newButton.id = button.id;
    newButton.textContent = button.text;
    newButton.className = getButtonColor(button.color);
    if (button.color == ClickColor.Blue) {
        button.colorDataId = "Blue";
    }
    else if (button.color == ClickColor.Green) {
        button.colorDataId = "Green";
    }
    if (button.isClick) {
        if (button.color == ClickColor.Blue) {
            newButton.onclick = (b) => increase(button.id);
        }
        else if (button.color == ClickColor.Green) {
            newButton.onclick = (b) => increase(button.id);
        }
    }
    return newButton;
}
function loadLocalStorage() {
    console.log("Loading data...");
    if (localStorage.length == 0) {
        console.log("New game! Welcome!");
        return;
    }
    var colorData = getLsOrDefault("colorData", "{}");
    colorDataArray = JSON.parse(colorData);
    colorDataArray.forEach(cd => {
        if (cd.id == "Blue") {
            blueColorData = cd;
        }
        if (cd.id == "Green") {
            greenColorData = cd;
        }
    });
    console.log("Loaded!");
}
function loadColorData() {
    colorDataMap.set(blueColorData.id, blueColorData);
    colorDataMap.set(greenColorData.id, greenColorData);
    blueColorData.totalElement = document.getElementById(getTotalId(blueColorData));
    blueColorData.incrementElement = document.getElementById(getIncrementId(blueColorData));
    blueColorData.perSecondElement = document.getElementById(getPerSecondId(blueColorData));
    blueColorData.buttonGroup = document.getElementById(getButtonGroupId(blueColorData));
    blueColorData.clickerElement = document.getElementById(getClickerId(blueColorData));
    greenColorData.totalElement = document.getElementById(getTotalId(greenColorData));
    greenColorData.incrementElement = document.getElementById(getIncrementId(greenColorData));
    greenColorData.perSecondElement = document.getElementById(getPerSecondId(greenColorData));
    greenColorData.buttonGroup = document.getElementById(getButtonGroupId(greenColorData));
    greenColorData.clickerElement = document.getElementById(getClickerId(greenColorData));
}
function loadButtons() {
    // Always load the clickables
    blueButton.element = createHTMLButton(blueButton);
    greenButton.element = createHTMLButton(greenButton);
    blueColorData.clickerElement.appendChild(blueButton.element);
    // create the upgrade button
    var blueUpgrade1Button = new Button("upgrade1", "Blue", "+1/click", ClickColor.Blue, 10, ClickColor.Blue, 1, UpgradeType.INCREMENT, ClickColor.Blue, false);
    var unlockGreenButton = new Button("unlockGreen", "Blue", "Unlock Green!", ClickColor.Blue, 100, ClickColor.Blue, 0, UpgradeType.NEW_BUTTON, ClickColor.Green, false);
    addUpgradeButtonToData(blueColorData, blueUpgrade1Button);
    addUpgradeButtonToData(blueColorData, unlockGreenButton);
    blueColorData.upgradeButtons.forEach(button => {
        showUpgrade(button);
    });
    var greenUpgradeButton1 = new Button("upgrade1", "Green", "+1 Blue/sec", ClickColor.Green, 100, ClickColor.Blue, 1, UpgradeType.PER_SECOND, ClickColor.Blue, false);
    addUpgradeButtonToData(greenColorData, greenUpgradeButton1);
    greenColorData.upgradeButtons.forEach(button => {
        showUpgrade(button);
    });
}
function saveGame() {
    console.log("Saving data...");
    colorDataArray = [];
    colorDataArray.push(blueColorData);
    colorDataArray.push(greenColorData);
    localStorage.setItem("colorData", JSON.stringify(colorDataArray));
    console.log("Saved!");
}
function resetGame() {
    console.log("Resetting game...");
    localStorage.clear();
    blueColorData.click = 0;
    blueColorData.increment = 1;
    blueColorData.perSecond = 0;
    blueColorData.upgradeButtons = [];
    blueColorData.buttonGroup;
    greenColorData.click = 0;
    greenColorData.increment = 1;
    greenColorData.perSecond = 0;
    greenColorData.upgradeButtons = [];
    blueColorData.buttonGroup.innerHTML = '';
    greenColorData.buttonGroup.innerHTML = '';
    blueColorData.clickerElement.innerHTML = '';
    greenColorData.clickerElement.innerHTML = '';
    loadButtons(); // reload the base buttons
    console.log("Reset");
}
$('#resetGameCheck').on("click", function () {
    resetGameButton.disabled = $(this).is(":checked") ? false : true;
});
function getLsOrDefault(itemName, defaultVal) {
    var value = localStorage.getItem(itemName);
    if (value) {
        return value;
    }
    else {
        return defaultVal;
    }
}
function getLsOrDefaultInt(itemName, defaultVal) {
    var value = localStorage.getItem(itemName);
    if (value) {
        return parseInt(value);
    }
    else {
        return defaultVal;
    }
}
//#region timed events
function startTimedEvents() {
    updateElementsText();
    incrementValPerSecond();
    autoSave();
}
function incrementValPerSecond() {
    blueColorData.click += blueColorData.perSecond;
    setTimeout(incrementValPerSecond, 1000);
}
function updateElementsText() {
    blueColorData.totalElement.textContent = blueColorData.click.toString();
    blueColorData.incrementElement.textContent = blueColorData.increment.toString();
    blueColorData.perSecondElement.textContent = blueColorData.perSecond.toString();
    greenColorData.totalElement.textContent = greenColorData.click.toString();
    greenColorData.incrementElement.textContent = greenColorData.increment.toString();
    greenColorData.perSecondElement.textContent = greenColorData.perSecond.toString();
    setTimeout(updateElementsText, 10);
}
function autoSave() {
    saveGame();
    setTimeout(autoSave, 5000);
}
//#endregion
function increase(colorName) {
    var colorData = colorDataMap.get(colorName);
    colorData.click += colorData.increment;
}
function checkValForUpgrades() {
    blueColorData.upgradeButtons.forEach(b => {
        var colorData = colorDataMap.get(b.colorCost);
        if (colorData.click >= b.cost && !b.isShown) {
            showUpgrade(b);
        }
    });
    greenColorData.upgradeButtons.forEach(b => {
        var colorData = colorDataMap.get(b.colorCost);
        if (colorData.click >= b.cost && !b.isShown) {
            showUpgrade(b);
        }
    });
    if (greenColorData.upgradeButtons[0] != null && greenColorData.clickButton != null) {
        if (greenColorData.upgradeButtons[0].bought) {
            showClicker(greenColorData.clickButton);
        }
    }
    setTimeout(checkValForUpgrades, 100);
}
function showClicker(button) {
    var colorData = colorDataMap.get(button.colorDataId);
    button.element = document.createElement("button");
    button.element.textContent = button.text;
    button.element.className = getButtonColor(button.color);
    button.element.onclick = (e) => increase(button.colorDataId);
    if (!colorData.clickerElement.contains(button.element) && !button.isShown) {
        colorData.clickerElement.appendChild(button.element);
        button.isShown = true;
    }
}
function showUpgrade(button) {
    var colorData = colorDataMap.get(button.colorDataId);
    var requiredColorData = colorDataMap.get(button.colorCost);
    button.element = document.createElement("button");
    button.element.textContent = button.text;
    button.element.className = getButtonColor(button.color);
    button.element.onclick = (e) => tryBuyUpgrade(button);
    button.element.innerHTML += ' <span class="badge text-bg-' + getColorClass(button.colorCost) + '">' + button.cost + " - " + button.colorCost + '</span>';
    if (requiredColorData.click >= button.cost) {
        button.isShown = true;
    }
    if (!colorData.buttonGroup.contains(button.element) && button.isShown) {
        colorData.buttonGroup.appendChild(button.element);
        console.log(colorData.id, colorData.buttonGroup.children);
    }
    if (button.bought) {
        button.element.disabled = true;
    }
}
function getColorClass(color) {
    switch (color) {
        case ClickColor.Blue:
            return "primary";
        case ClickColor.Green:
            return "success";
        default:
            break;
    }
}
function getButtonColor(color) {
    return "btn btn-" + getColorClass(color);
}
function addUpgradeButtonToData(colorData, button) {
    if (colorData.upgradeButtons.length == 0) {
        colorData.upgradeButtons.push(button);
        return;
    }
    colorData.upgradeButtons.forEach(element => {
        // upgrade1 can exist for both blue and green and else
        if (getUniqueId(element) != getUniqueId(button)) {
            colorData.upgradeButtons.push(button);
            return;
        }
    });
}
function tryBuyUpgrade(button) {
    var colorData = colorDataMap.get(button.colorDataId);
    var requiredColorData = colorDataMap.get(button.colorCost);
    var upgradingColorData = colorDataMap.get(button.upgradeColor);
    if (requiredColorData.click >= button.cost && !button.bought) {
        requiredColorData.click -= button.cost;
        switch (button.type) {
            case UpgradeType.INCREMENT:
                upgradingColorData.increment += button.upgradeValue;
                break;
            case UpgradeType.PER_SECOND:
                upgradingColorData.perSecond += button.upgradeValue;
                break;
            case UpgradeType.NEW_BUTTON:
                unlockClickButton(upgradingColorData);
            default:
                break;
        }
        button.bought = true;
        button.element.disabled = true;
    }
}
function unlockClickButton(colorData) {
    showClicker(colorData.clickButton);
}
function showSettings() {
    resetGameCheck.checked = false;
    resetGameButton.disabled = true;
    settingsElement.hidden = !settingsElement.hidden;
    mainGameElement.hidden = !mainGameElement.hidden;
}
loadLocalStorage();
loadColorData();
loadButtons();
startTimedEvents();
checkValForUpgrades();
export {};
//# sourceMappingURL=clickerGame.js.map
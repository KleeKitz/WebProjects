var total = 0;
var increment = 1;
var amountPerSecond = 0;
var valElement = document.getElementById("val");
var buttonsElement = document.getElementById("buttons");
var perSecondButtonsElement = document.getElementById("perSecondButtons");
var amountPerClickElement = document.getElementById("amountPerClick");
var amountPerSecondElement = document.getElementById("amountPerSecond");
var buttonUpgrade2;
var boughtUpgrade2 = false;
var button2Shown = false;
var psUpgrade1Button;
var psUpgrade1Bought = false;
var psUpgradeButton1Shown = false;
function loadLocalStorage() {
    console.log("Loading data...");
    total = getLsOrDefaultInt("total", 0);
    increment = getLsOrDefaultInt("increment", 1);
    amountPerSecond = getLsOrDefaultInt("amountPerSecond", 0);
    var boughtupgrades = getLsOrDefault("boughtUpgrades", "00");
    if (boughtupgrades[0] == "1") {
        boughtUpgrade2 = true;
        showUpgrade2();
    }
    if (boughtupgrades[1] == "1") {
        psUpgrade1Bought = true;
        showPSUpgrade1();
    }
    console.log("Loaded!");
}
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
        return parseInt(defaultVal);
    }
}
//#region timed events
function startTimedEvents() {
    updateElementsText();
    incrementValPerSecond();
    autoSave();
}
function incrementValPerSecond() {
    total += amountPerSecond;
    setTimeout(incrementValPerSecond, 1000);
}
function updateElementsText() {
    valElement.textContent = total.toString();
    amountPerClickElement.textContent = increment.toString();
    amountPerSecondElement.textContent = amountPerSecond.toString();
    setTimeout(updateElementsText, 10);
}
function autoSave() {
    console.log("Saving data...");
    localStorage.setItem("total", total.toString());
    localStorage.setItem("increment", increment.toString());
    localStorage.setItem("amountPerSecond", amountPerSecond.toString());
    var boughtUpgrades = "";
    boughtUpgrades += boughtUpgrade2 ? "1" : "0";
    boughtUpgrades += psUpgrade1Bought ? "1" : "0";
    localStorage.setItem("boughtUpgrades", boughtUpgrades);
    console.log("Saved!");
    setTimeout(autoSave, 5000);
}
//#endregion
function increaseVal() {
    if (valElement != null) {
        var text = valElement.textContent || "0";
        total = parseInt(text);
        total += increment;
    }
}
function checkValForUpgrades() {
    if (total >= 10 && !boughtUpgrade2) {
        showUpgrade2();
    }
    if (total >= 100) {
        showPSUpgrade1();
    }
    setTimeout(checkValForUpgrades, 100);
}
function showUpgrade2() {
    if (!button2Shown) {
        buttonUpgrade2 = document.createElement("button");
        buttonUpgrade2.textContent = "button2: cost 10";
        buttonUpgrade2.className = "btn btn-primary";
        buttonUpgrade2.onclick = function (e) { return tryBuyUpgrade2(); };
        if (buttonsElement != null) {
            buttonsElement.appendChild(buttonUpgrade2);
        }
        if (boughtUpgrade2) {
            buttonUpgrade2.disabled = true;
        }
        button2Shown = true;
    }
}
function showPSUpgrade1() {
    if (!psUpgradeButton1Shown) {
        psUpgrade1Button = document.createElement("button");
        psUpgrade1Button.textContent = "PerSecond +1: cost 100";
        psUpgrade1Button.className = "btn btn-success";
        psUpgrade1Button.onclick = function (e) { return tryBuyPSUpgrade1(); };
        if (perSecondButtonsElement != null) {
            perSecondButtonsElement.appendChild(psUpgrade1Button);
        }
        if (psUpgrade1Bought) {
            psUpgrade1Button.disabled = true;
        }
        psUpgradeButton1Shown = true;
    }
}
function tryBuyUpgrade2() {
    if (total >= 10 && !boughtUpgrade2) {
        total -= 10;
        boughtUpgrade2 = true;
        increment += 1;
        buttonUpgrade2.disabled = true;
    }
}
function tryBuyPSUpgrade1() {
    if (total >= 100 && !psUpgrade1Bought) {
        total -= 100;
        psUpgrade1Bought = true;
        amountPerSecond += 1;
        psUpgrade1Button.disabled = true;
    }
}
loadLocalStorage();
startTimedEvents();
checkValForUpgrades();
//# sourceMappingURL=clickerGame.js.map
import { moveElement, getLabel } from "./library.js";

const textSingleInputsArr = [...document.querySelectorAll(".text-single-input")],
    textChangeInputsArr = [...document.querySelectorAll(".text-change-input")];
let currentText;

export function getTextOutput(layersArr, counter, currentLayer, layerLabelsWrapper) {
    if(currentLayer) currentLayer.label.style.border = "2px solid #fff";
    const text = getTextLayout(counter);
    updateTextInputListeners(text);
    layerLabelsWrapper.append(text.label);
    workspace.append(text.output); 
    for(let key in text.styleValues) if(text.styleValues.hasOwnProperty(key)) document.getElementById(key).value = text.styleValues[key];
    moveElement(text.output, workspace);
    layersArr.push(text);
    text.output.oninput = () => {
        if(!text.output.textContent) text.label.textContent = `Надпись #${text.layer}`;
        text.label.textContent = text.output.textContent;
    }
    return text;
}

function getTextLayout(counter) {
    const output = document.createElement("SPAN");
    output.classList.add("text-output");
    output.id = `layer-${counter}`;
    output.textContent = "Введите текст";
    output.style.zIndex = counter;
    output.setAttribute("contenteditable", true);
    output.setAttribute("spellcheck", false);
    return {
        layer: counter,
        output: output,
        label: getLabel(counter, `Надпись #${counter}`),
        type: "text", 
        styleValues: {
            "text-font-input": "Impact",
            "text-font-size-input": 44,
            "text-color-input": "#ffffff",
            "text-stroke-color-input": "#000000",
            "text-background-input": "none",
            "text-rotate-input": 0
        }
    }
}

export function updateTextInputListeners(text) {
    const textInputsArr = [...document.querySelector(".text-input")];
    currentText = text;
    textInputsArr.forEach(input => {
        input.removeEventListener("input", updateTextSingleInputs);
        input.removeEventListener("change", updateTextChangeInputs);
    })
    textSingleInputsArr.forEach(input => input.addEventListener("input", updateTextSingleInputs));
    textChangeInputsArr.forEach(input => input.addEventListener("change", updateTextChangeInputs));
}

function updateTextSingleInputs(e) {
    if(currentText) {
        let input = e.target;
        switch(input.id) {
            case "text-color-input": return currentText.output.style.color = (input.value);
            case "text-stroke-color-input": return currentText.output.style.webkitTextStroke = `2px ${input.value}`;
            case "text-background-input": return currentText.output.style.background = input.value;
            case "text-rotate-input": return currentText.output.style.rotate = `${input.value}deg`;
            case "text-rotateX-input": return currentText.output.style.transform = `perspective(600px) rotateX(${input.value}deg)`;
        }
        currentText.styleValues[input.id] = +input.value;
    }
}

function updateTextChangeInputs(e) {
    if(currentText) {
        let input = e.target;
        switch(input.id) {
            case "text-font-input": return currentText.output.style.fontFamily = input.value;
            case "text-font-size-input": return currentText.output.style.fontSize = `${input.value}px`;
            case "text-settings__stroke-checkbox": {
                if(!input.checked) {
                    currentText.output.style.webkitTextStroke = `0px`;
                    document.getElementById("text-stroke-color-input").setAttribute("disabled", true);
                } else {
                    currentText.output.style.webkitTextStroke = `2px ${document.getElementById("text-stroke-color-input").value}`;
                    document.getElementById("text-stroke-color-input").removeAttribute("disabled");
                }
            }
            case "text-settings__background-checkbox": {
                if(!input.checked) {
                    currentText.output.style.background = "none";
                    document.getElementById("text-background-input").setAttribute("disabled", true);
                } else {
                    currentText.output.style.background = document.getElementById("text-background-input").value;
                    document.getElementById("text-background-input").removeAttribute("disabled");
                }
            }
        }
        currentText.styleValues[input.id] = +input.value;
    }
}
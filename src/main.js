import "normalize.css";
import "./assets/css/style.css";
import "./assets/css/fonts.css";
import "./assets/css/range.css";
import "./assets/img/upload-image-icon.png";
import "./assets/img/add-text-icon.png";
import "./assets/img/pen.png";
import "./assets/img/ai-icon.png";
import "./assets/img/download-icon.png";
import "./assets/img/clear-icon.png";
import "./assets/img/layers-icon.png";
import "./assets/img/settings-icon.png";
import "./assets/img/close.png";
import { resizeElement, sortLayersDnD, changeActiveLayer, deleteLayer, downloadCanvas } from "./js/library.js";
import { getImgOutput, updateImgInputListeners } from "./js/image-processing.js";
import { getTextOutput, updateTextInputListeners } from "./js/text-processing.js";

const workspace = document.querySelector("#workspace"),
    canvas = document.querySelector(".output-canvas"),
    workspaceResizeTrigger = document.querySelector(".resize-trigger"),
    uploadImgInput = document.querySelector("#download-img-input"),
    addTextBtn = document.querySelector(".add-text-control"),
    downloadCanvasBtn = document.querySelector(".download-canvas-control"),
    clearCanvasBtn = document.querySelector(".clear-canvas-control"),
    layersSettings = document.querySelector("#layers"),
    imgSettings = document.querySelector("#img-settings"),
    removeBackgroundBtn = document.querySelector(".img-settings__remove-bg-btn"),
    textSettings = document.querySelector("#text-settings"),
    layerLabelsWrapper = document.querySelector(".layer-labels-wrapper"),
    layers = new Array();
let zCounter = 0,
    currentLayer = null;

window.addEventListener("keydown", (e) => {if(e.key === "Tab") e.preventDefault()});
resizeElement(workspace, workspaceResizeTrigger);

document.querySelector(".open-layers__btn").addEventListener("click", () => layersSettings.classList.add("panel--visible"));
document.querySelector(".close-layers--btn").addEventListener("click", () => layersSettings.classList.remove("panel--visible"));

document.querySelector(".open-settings__btn").addEventListener("click", (e) => {
    if (currentLayer && currentLayer.type == "img") imgSettings.classList.add("panel--visible");
    else if (currentLayer && currentLayer.type == "text") textSettings.classList.add("panel--visible");
    else e.preventDefault();
})
document.querySelector(".close-img-settings--btn").addEventListener("click", () => imgSettings.classList.remove("panel--visible"));
document.querySelector(".close-text-settings--btn").addEventListener("click", () => textSettings.classList.remove("panel--visible"));

layerLabelsWrapper.addEventListener("dblclick", (e) => deleteLayer(layers, e));

layerLabelsWrapper.addEventListener("click", (e) => {
    currentLayer = changeActiveLayer(layers, e);
    if(currentLayer.type === "img") {
        for(let key in currentLayer.styleValues) {
            if(currentLayer.styleValues.hasOwnProperty(key)) document.getElementById(key).value = currentLayer.styleValues[key];
        }
        updateImgInputListeners(currentLayer, removeBackgroundBtn);
    } else if (currentLayer.type === "text") {
        for(let key in currentLayer.styleValues) {
            if(currentLayer.styleValues.hasOwnProperty(key)) document.getElementById(key).value = currentLayer.styleValues[key];
        }
        updateTextInputListeners(currentLayer)
    }
});

uploadImgInput.addEventListener("input", (e) => {
    currentLayer = getImgOutput(uploadImgInput, layers, zCounter, currentLayer, layerLabelsWrapper, removeBackgroundBtn);
    zCounter++;
})

addTextBtn.addEventListener("click", () => {
    currentLayer = getTextOutput(layers, zCounter, currentLayer, layerLabelsWrapper);
    zCounter++;
})

sortLayersDnD(layerLabelsWrapper, layers);

downloadCanvasBtn.addEventListener("click", () => downloadCanvas(workspace, canvas));

for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
    e.style.setProperty('--value', e.value);
    e.style.setProperty('--min', e.min == '' ? '0' : e.min);
    e.style.setProperty('--max', e.max == '' ? '100' : e.max);
    e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}
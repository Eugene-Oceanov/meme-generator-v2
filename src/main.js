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
import { moveElement, resizeElement, sortLayersDnD, changeActiveLayer, deleteLayer, downloadCanvas, textStylization } from "./js/library.js";
import { updateImgInputListeners } from "./js/image-processing.js"
import { getImg, getText } from "./js/layouts.js";

const workspace = document.querySelector("#workspace"),
    canvas = document.querySelector(".output-canvas"),
    preloaderOverlay = document.querySelector(".preloader-overlay"),
    workspaceResizeTrigger = document.querySelector(".resize-trigger"),
    uploadImgInput = document.querySelector("#download-img-input"),
    addTextBtn = document.querySelector(".add-text-control"),
    downloadCanvasBtn = document.querySelector(".download-canvas-control"),
    clearCanvasBtn = document.querySelector(".clear-canvas-control"),
    layersSettings = document.querySelector("#layers"),
    imgSettings = document.querySelector("#img-settings"),
    imgSettingsArr = document.querySelectorAll(".img-input"),
    removeBackgroundBtn = document.querySelector(".img-settings__remove-bg-btn"),
    textSettings = document.querySelector("#text-settings"),
    layerLabelsWrapper = document.querySelector(".layer-labels-wrapper"),
    layers = new Array();
let zCounter = 0,
    currentLayer = null;

window.addEventListener("keydown", (e) => {if(e.key === "Tab") e.preventDefault()});

document.querySelector(".open-layers__btn").addEventListener("click", () => layersSettings.classList.add("modal--visible"));
document.querySelector(".close-layers--btn").addEventListener("click", () => layersSettings.classList.remove("modal--visible"));

document.querySelector(".open-settings__btn").addEventListener("click", (e) => {
    if (currentLayer && currentLayer.type == "img") imgSettings.classList.add("modal--visible");
    else if (currentLayer && currentLayer.type == "text") textSettings.classList.add("modal--visible");
    else e.preventDefault();
})
document.querySelector(".close-img-settings--btn").addEventListener("click", () => imgSettings.classList.remove("modal--visible"));
document.querySelector(".close-text-settings--btn").addEventListener("click", () => textSettings.classList.remove("modal--visible"));

layerLabelsWrapper.addEventListener("dblclick", (e) => deleteLayer(layers, e));
layerLabelsWrapper.addEventListener("click", (e) => {
    currentLayer = changeActiveLayer(layers, e);
    console.log(currentLayer)
    if(currentLayer.type === "img") {
        for(let key in currentLayer.styleValues)  if(currentLayer.styleValues.hasOwnProperty(key)) document.getElementById(key).value = currentLayer.styleValues[key];
        updateImgInputListeners(currentLayer, removeBackgroundBtn);
    }
});

resizeElement(workspace, workspaceResizeTrigger);

// imgSettingsArr.forEach(item => item.addEventListener("input", () => currentLayer.styleValues[item.id] = +item.value)); забыл зачем это написал, потом вспомню

uploadImgInput.addEventListener("input", e => {
    if(currentLayer) currentLayer.label.style.border = "2px solid #fff";
    const file = uploadImgInput.files[0];
    if (file) {
        const img = getImg(zCounter, file.name);
        img.output.src = URL.createObjectURL(file);
        layerLabelsWrapper.append(img.label);
        workspace.append(img.output);
        setTimeout(() => { if (img.output.clientWidth > img.output.clientHeight) img.output.style.width = "100%";
                           else img.output.style.height = "100%"}, 0 );
        currentLayer = img;
        updateImgInputListeners(currentLayer, removeBackgroundBtn);
        for(let key in img.styleValues)  if(img.styleValues.hasOwnProperty(key)) document.getElementById(key).value = img.styleValues[key];
        moveElement(currentLayer.output, workspace);
        layers.push(img);
    }
    zCounter++;
})

addTextBtn.addEventListener("click", () => {
    if(currentLayer) currentLayer.label.style.border = "2px solid #fff";
    const text = getText(zCounter);
    currentLayer = text;
    textStylization(currentLayer);
    layerLabelsWrapper.append(text.label);
    workspace.append(text.output); 
    moveElement(text.output, workspace);
    layers.push(text);
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
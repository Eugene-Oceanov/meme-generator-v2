import "normalize.css";
import "./assets/css/style.css";
import "./assets/css/fonts.css";
import "./assets/css/range.css";
import "./assets/img/upload-image-icon.png";
import "./assets/img/add-text-icon.png";
import "./assets/img/download-icon.png";
import "./assets/img/clear-icon.png";
import "./assets/img/layers-icon.png";
import "./assets/img/settings-icon.png";
import "./assets/img/pen.png";
import "./assets/img/close.png";
import { moveElement, resizeElement, downloadCanvas, imgStylization, textStylization, sortLayersDnD } from "./js/library.js";
import { imgOutputItem, textOutputItem, layerLabelLayout } from "./js/layouts.js";

const workspace = document.querySelector("#workspace"),
    canvas = document.querySelector(".output-canvas"),
    workspaceResizeTrigger = document.querySelector(".resize-trigger"),
    uploadImgInput = document.querySelector("#download-img-input"),
    addTextBtn = document.querySelector(".add-text-control"),
    downloadCanvasBtn = document.querySelector(".download-canvas-control"),
    clearCanvasBtn = document.querySelector(".clear-canvas-control"),
    layersSettings = document.querySelector("#layers"),
    imgSettings = document.querySelector("#img-settings"),
    textSettings = document.querySelector("#text-settings"),
    layerLabelsWrapper = document.querySelector(".layer-labels-wrapper"),
    layers = new Array();
let zCounter = 0,
    currentLayer;

resizeElement(workspace, workspaceResizeTrigger);

document.querySelector(".open-layers__btn").addEventListener("click", () => layersSettings.classList.add("modal--visible"));
document.querySelector(".close-layers--btn").addEventListener("click", () => layersSettings.classList.remove("modal--visible"));

document.querySelector(".open-settings__btn").addEventListener("click", (e) => {
    if (currentLayer && currentLayer.className == "img-output") imgSettings.classList.add("modal--visible");
    else if (currentLayer && currentLayer.className == "text-output") textSettings.classList.add("modal--visible");
    else e.preventDefault()
})

document.querySelector(".close-img-settings--btn").addEventListener("click", () => {
    imgSettings.classList.remove("modal--visible");
})

document.querySelector(".close-text-settings--btn").addEventListener("click", () => {
    textSettings.classList.remove("modal--visible");
})

uploadImgInput.addEventListener("input", e => {
    zCounter++;
    const file = uploadImgInput.files[0];
    if (file) {
        const imgOutput = imgOutputItem(zCounter);
        const imgLabel = layerLabelLayout(zCounter, file.name);
        currentLayer = imgOutput.node;
        imgStylization(currentLayer,
            document.querySelector(".img-rotate-input"),
            document.querySelector(".img-rotateX-input"),
            document.querySelector(".img-rotateY-input"),
            document.querySelector(".img-opacity-input"),
            document.querySelector(".img-blur-input"),
            document.querySelector(".img-brightness-input"),
            document.querySelector(".img-contrast-input"),
            document.querySelector(".img-saturate-input"),
            document.querySelector(".img-hue-input"),
            document.querySelector(".img-invert-input"),
            document.querySelector(".img-sepia-input"));
        layerLabelsWrapper.append(imgLabel);
        imgOutput.node.src = URL.createObjectURL(file);
        workspace.append(imgOutput.node);
        moveElement(imgOutput.node, workspace);
        layers.push(imgLabel);
    }
})

addTextBtn.addEventListener("click", () => {
    zCounter++;
    const textOutput = textOutputItem(zCounter);
    const textLabel = layerLabelLayout(zCounter, `Надпись #${zCounter}`);
    currentLayer = textOutput;
    textStylization(currentLayer,
        document.querySelector(".text-settings__font-family-select"),
        document.querySelector(".text-settings__font-size-select"),
        document.querySelector(".text-settings__color-input"),
        document.querySelector("#text-settings__stroke-checkbox"),
        document.querySelector(".text-settings__stroke-color-input"),
        document.querySelector("#text-settings__background-checkbox"),
        document.querySelector(".text-settings__background-color-input"),
        document.querySelector(".text-rotate-input"))
    layerLabelsWrapper.append(textLabel);
    workspace.append(currentLayer);
    moveElement(textOutput, workspace);
    layers.push(textLabel);
    console.log(layers)
})

sortLayersDnD(layerLabelsWrapper, layers);

downloadCanvasBtn.addEventListener("click", () => downloadCanvas(workspace, canvas));

for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
    e.style.setProperty('--value', e.value);
    e.style.setProperty('--min', e.min == '' ? '0' : e.min);
    e.style.setProperty('--max', e.max == '' ? '100' : e.max);
    e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}
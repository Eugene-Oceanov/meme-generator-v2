import "normalize.css";
import "./assets/css/style.css";
import "./assets/css/fonts.css";
import "./assets/css/range.css";
import { moveElement, resizeElement, downloadCanvas, imgStylization, textStylization } from "./js/library.js";
import { imgOutputItem, textOutputItem, layerItemLayout } from "./js/layouts.js";

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
    layers = [];
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
    currentLayer = null;
    const file = uploadImgInput.files[0];
    if (file) {
        const imgOutput = imgOutputItem(zCounter)
        currentLayer = imgOutput;
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
            document.querySelector(".img-sepia-input"))
        layerLabelsWrapper.append(layerItemLayout(zCounter, file.name));
        imgOutput.src = URL.createObjectURL(file);
        workspace.append(imgOutput);
        moveElement(imgOutput, workspace);
        layers.push({ id: zCounter, node: imgOutput });
    }
})

addTextBtn.addEventListener("click", () => {
    zCounter++;
    const textOutput = textOutputItem(zCounter);
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
    workspace.append(currentLayer);
    moveElement(textOutput, workspace);
    layers.push({ id: zCounter, node: textOutput });
})

downloadCanvasBtn.addEventListener("click", () => downloadCanvas(workspace, canvas));

for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
    e.style.setProperty('--value', e.value);
    e.style.setProperty('--min', e.min == '' ? '0' : e.min);
    e.style.setProperty('--max', e.max == '' ? '100' : e.max);
    e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}
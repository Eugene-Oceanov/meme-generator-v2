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
import { moveElement, resizeElement, downloadCanvas, textStylization, sortLayersDnD } from "./js/library.js";
import { getImg, getText } from "./js/layouts.js";

const workspace = document.querySelector("#workspace"),
    canvas = document.querySelector(".output-canvas"),
    workspaceResizeTrigger = document.querySelector(".resize-trigger"),
    uploadImgInput = document.querySelector("#download-img-input"),
    addTextBtn = document.querySelector(".add-text-control"),
    downloadCanvasBtn = document.querySelector(".download-canvas-control"),
    clearCanvasBtn = document.querySelector(".clear-canvas-control"),
    layersSettings = document.querySelector("#layers"),
    imgSettings = document.querySelector("#img-settings"),
    imgSettingsArr = document.querySelectorAll(".img-input"),
    textSettings = document.querySelector("#text-settings"),
    layerLabelsWrapper = document.querySelector(".layer-labels-wrapper"),
    layers = new Array();
let zCounter = 0,
activeImage = null;

resizeElement(workspace, workspaceResizeTrigger);

imgSettingsArr.forEach(item => item.addEventListener("input", () => currentLayer.styleValues[item.id] = +item.value));

document.querySelector(".open-layers__btn").addEventListener("click", () => layersSettings.classList.add("modal--visible"));
document.querySelector(".close-layers--btn").addEventListener("click", () => layersSettings.classList.remove("modal--visible"));

document.querySelector(".open-settings__btn").addEventListener("click", (e) => {
    if (currentLayer && currentLayer.type == "img") imgSettings.classList.add("modal--visible");
    else if (currentLayer && currentLayer.type == "text") textSettings.classList.add("modal--visible");
    else e.preventDefault();
})

document.querySelector(".close-img-settings--btn").addEventListener("click", () => imgSettings.classList.remove("modal--visible"));

document.querySelector(".close-text-settings--btn").addEventListener("click", () => textSettings.classList.remove("modal--visible"));

uploadImgInput.addEventListener("input", e => {
    zCounter++;
    const file = uploadImgInput.files[0];
    if (file) {
        const img = getImg(zCounter, file.name);
        currentLayer = img;
        imgSettingsArr.forEach(item =>  item.removeEventListener("input"));
        imgStylization(currentLayer,
            document.getElementById("img-scale-input"),      document.getElementById("img-rotate-input"),
            document.getElementById("img-rotateX-input"),    document.getElementById("img-rotateY-input"),
            document.getElementById("img-opacity-input"),    document.getElementById("img-blur-input"),
            document.getElementById("img-brightness-input"), document.getElementById("img-contrast-input"),
            document.getElementById("img-saturate-input"),   document.getElementById("img-hue-input"),
            document.getElementById("img-invert-input"),     document.getElementById("img-sepia-input"));
        layerLabelsWrapper.append(img.label);
        img.output.src = URL.createObjectURL(file);
        workspace.append(img.output);
        setTimeout(() => {
            if (img.output.clientWidth > img.output.clientHeight) img.output.style.width = "100%";
            else img.output.style.height = "100%";
        }, 0);
        moveElement(currentLayer.output, workspace);
        layers.push(img);
    }
})

addTextBtn.addEventListener("click", () => {
    zCounter++;
    const text = getText(zCounter);
    currentLayer = text;
    textStylization(currentLayer,
        document.querySelector(".text-settings__font-family-select"),     document.querySelector(".text-settings__font-size-select"),
        document.querySelector(".text-settings__color-input"),            document.querySelector("#text-settings__stroke-checkbox"),
        document.querySelector(".text-settings__stroke-color-input"),     document.querySelector("#text-settings__background-checkbox"),
        document.querySelector(".text-settings__background-color-input"), document.querySelector(".text-rotate-input"));
    layerLabelsWrapper.append(text.label);
    workspace.append(text.output); 
    moveElement(text.output, workspace);
    layers.push(text);
})

sortLayersDnD(layerLabelsWrapper, layers);

downloadCanvasBtn.addEventListener("click", () => downloadCanvas(workspace, canvas));

for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
    e.style.setProperty('--value', e.value);
    e.style.setProperty('--min', e.min == '' ? '0' : e.min);
    e.style.setProperty('--max', e.max == '' ? '100' : e.max);
    e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}










let activeImage = null; // Ссылка на последнее добавленное изображение

function setActiveImage(img) {
    activeImage = img; // Обновляем активное изображение
}

function imgStylization() {
    const inputsArr = [scaleInput, rotateInput, rotateXinput, rotateYinput, opacityInput, blurInput, brightnessInput, contrastInput, saturateInput, colorCircleInput, inversionInput, sepiaInput];
    const perspectiveArr = [rotateXinput, rotateYinput];
    const filterArr = [blurInput, brightnessInput, contrastInput, saturateInput, colorCircleInput, inversionInput, sepiaInput];

    scaleInput.addEventListener("input", () => {
        if (activeImage) activeImage.output.style.transform = `scale(${scaleInput.value})`;
    });
    rotateInput.addEventListener("input", () => {
        if (activeImage) activeImage.output.style.rotate = `${rotateInput.value}deg`;
    });
    perspectiveArr.forEach(item => {
        item.addEventListener("input", () => {
            if (activeImage) activeImage.output.style.transform = `perspective(600px) rotateX(${rotateXinput.value}deg) rotateY(${rotateYinput.value}deg)`;
        });
    });
    opacityInput.addEventListener("input", () => {
        if (activeImage) activeImage.output.style.opacity = opacityInput.value;
    });
    filterArr.forEach(item => {
        item.addEventListener("input", () => {
            if (activeImage) activeImage.output.style.filter = `blur(${blurInput.value}px) brightness(${brightnessInput.value}%) contrast(${contrastInput.value}%) saturate(${saturateInput.value}%) hue-rotate(${colorCircleInput.value}deg) invert(${inversionInput.value}%) sepia(${sepiaInput.value}%)`;
        });
    });
    inputsArr.forEach(item => {
        item.addEventListener("input", () => {
            if (activeImage) activeImage.styleValues[item.id] = +item.value;
        });
    });
}

// При каждом добавлении нового изображения вызвать эту функцию
// img - экземпляр нового изображения
function addNewImage(img) {
    // Устанавливаем новое изображение как активное
    setActiveImage(img);

    // Повторное применение стилей для нового изображения
    // можно добавить логику, если необходимо применить какие-то значения по умолчанию
}
export function layerItemLayout(counter, name) {
    const layerItem = document.createElement("DIV");
    layerItem.classList.add("layer-label", `layer-label-${counter}`);
    layerItem.setAttribute("layer", counter);
    layerItem.setAttribute("draggable", true);
    layerItem.innerHTML = `<p class="layer-item-name">${name}</p>`;
    return layerItem;
}

export function imgOutputItem(counter) {
    const imgOutput = document.createElement("IMG");
    imgOutput.classList.add("img-output");
    imgOutput.setAttribute("layer", counter);
    imgOutput.style.zIndex = counter;
    return imgOutput;
}

export function textOutputItem(counter) {
    const textOutput = document.createElement("SPAN");
    textOutput.classList.add("text-output");
    textOutput.setAttribute("layer", counter);
    textOutput.textContent = "Введите текст";
    textOutput.style.zIndex = counter;
    textOutput.setAttribute("contenteditable", true);
    return textOutput;
}
export function layerLabelLayout(counter, name) {
    const label = document.createElement("LABEL");
    label.classList.add("layer-label", `layer-label-${counter}`);
    label.setAttribute("draggable", true);
    label.setAttribute("data-layer", counter);
    label.setAttribute("for", `layer-${counter}`)
    label.textContent = name;
    return label;
}

export function imgOutputItem(counter) {
    const imgOutput = document.createElement("IMG");
    imgOutput.classList.add("img-output");
    imgOutput.id = `layer-${counter}`;
    imgOutput.style.zIndex = counter;
    return {
        node: imgOutput,
        zIndex: counter,
        rotateValue: 0,
        rotateXvalue: 0,
        rotateYvalue: 0,
        opacityValue: 1,
        blurValue: 0,
        brightnessValue: 100,
        contrastValue: 100,
        saturateValue: 100,
        hueValue: 0,
        inversionValue: 0,
        sepiaValue: 0,
    }
}

export function textOutputItem(counter) {
    const textOutput = document.createElement("SPAN");
    textOutput.classList.add("text-output");
    textOutput.id = `layer-${counter}`;
    textOutput.textContent = "Введите текст";
    textOutput.style.zIndex = counter;
    textOutput.setAttribute("contenteditable", true);
    return textOutput;
}
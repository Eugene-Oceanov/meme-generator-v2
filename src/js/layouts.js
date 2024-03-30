export function getImg(counter, name) {
    const output = document.createElement("IMG");
    output.classList.add("img-output");
    output.setAttribute("id", `layer-${counter}`)
    output.style.zIndex = counter;
    return {
        layer: counter,
        output: output,
        label: getLabel(counter, name),
        type: "img",
        styleValues: {
            "img-scale-input": 1,
            "img-rotate-input": 0,
            "img-rotateX-input": 0,
            "img-rotateY-input": 0,
            "img-opacity-input": 1,
            "img-blur-input": 0,
            "img-brightness-input": 100,
            "img-contrast-input": 100,
            "img-saturate-input": 100,
            "img-hue-input": 0,
            "img-invert-input": 0,
            "img-sepia-input": 0
        }
    };
}

export function getText(counter) {
    const output = document.createElement("SPAN");
    output.classList.add("text-output");
    output.id = `layer-${counter}`;
    output.textContent = "Введите текст";
    output.style.zIndex = counter;
    output.setAttribute("contenteditable", true);
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

function getLabel(counter, name) {
    const label = document.createElement("LABEL");
    label.classList.add("layer-label");
    label.setAttribute("draggable", true);
    label.setAttribute("for", `layer-${counter}`);
    label.textContent = name;
    return label;
}
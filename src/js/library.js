const html2canvas = require("html2canvas");
export function moveElement(element, parent) {
    let active = false,
        currentX,
        currentY,
        initX,
        initY;
    element.addEventListener("mousedown", (e) => {
        active = true;
        initX = e.clientX - element.getBoundingClientRect().left;
        initY = e.clientY - element.getBoundingClientRect().top;
        document.addEventListener("mousemove", moveHandler)
    })
    function moveHandler(e) {
        if (active) {
            e.preventDefault();
            currentX = e.clientX - parent.getBoundingClientRect().left - initX;
            currentY = e.clientY - parent.getBoundingClientRect().top - initY;
            element.style.left = `${currentX}px`;
            element.style.top = `${currentY}px`;
        }
    }
    document.addEventListener("mouseup", () => {
        active = false
        document.removeEventListener("mousemove", moveHandler);
    });
}

export function resizeElement(element, trigger) {
    let elementRect = element.getBoundingClientRect(),
        active = false;
    trigger.addEventListener("mousedown", (e) => {
        active = true;
        document.addEventListener("mousemove", resizeHandler)
    })
    function resizeHandler(e) {
        if (active) {
            e.preventDefault();
            let currentWidth = e.clientX - elementRect.x;
            let currentHeight = e.clientY - elementRect.y;
            element.style.width = `${currentWidth}px`;
            element.style.height = `${currentHeight}px`;
        }
    }
    document.addEventListener("mouseup", () => {
        active = false
        document.removeEventListener("mousemove", resizeHandler);
    });
}

export function downloadCanvas(wrapper, outputCanvas) {
    html2canvas(wrapper).then(canvas => {
        outputCanvas.classList.remove("d-none");
        outputCanvas.appendChild(canvas);
        let date = new Date();
        const link = document.createElement("A");
        link.download = `myMeme_${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}_${date.getHours()}:${date.getMinutes()}.jpg`;
        link.href = canvas.toDataURL();
        link.click();
        outputCanvas.classList.add("d-none");
    })
}

export function imgStylization(img,
    rotateInput,
    rotateXinput,
    rotateYinput,
    opacityInput,
    blurInput,
    brightnessInput,
    contrastInput,
    saturateInput,
    colorCircleInput,
    inversionInput,
    sepiaInput) {
    const perspectiveArr = [rotateXinput, rotateYinput];
    const filterArr = [blurInput, brightnessInput, contrastInput, saturateInput, colorCircleInput, inversionInput, sepiaInput];
    rotateInput.addEventListener("input", () => img.style.rotate = `${rotateInput.value}deg`);
    perspectiveArr.forEach(item => {
        item.addEventListener("input", () => {
            img.style.transform = `perspective(600px) rotateX(${rotateXinput.value}deg) rotateY(${rotateYinput.value}deg)`
        })
    })
    opacityInput.addEventListener("input", () => img.style.opacity = opacityInput.value);
    filterArr.forEach(item => {
        item.addEventListener("input", () => {
            img.style.filter = `blur(${blurInput.value}px) brightness(${brightnessInput.value}%) contrast(${contrastInput.value}%) saturate(${saturateInput.value}%) hue-rotate(${colorCircleInput.value}deg) invert(${inversionInput.value}%) sepia(${sepiaInput.value}%)`;
        })
    })
}

export function textStylization(text,
    fontFamilySelect,
    fontSizeSelect,
    colorInput,
    strokeCheckbox,
    strokeColorInput,
    backgroundCheckbox,
    backgroundColorInput,
    rotateInput) {
    fontFamilySelect.addEventListener("change", () => text.style.fontFamily = fontFamilySelect.value);
    fontSizeSelect.addEventListener("change", () => text.style.fontSize = `${fontSizeSelect.value}px`);
    colorInput.addEventListener("input", () => text.style.color = colorInput.value);
    strokeCheckbox.addEventListener("change", () => {
        if (!strokeCheckbox.checked) {
            strokeColorInput.setAttribute("disabled", "true");
            text.style.webkitTextStroke = `0px ${strokeColorInput.value}`;
        } else {
            strokeColorInput.removeAttribute("disabled");
            text.style.webkitTextStroke = `2px ${strokeColorInput.value}`;
        }
    });
    strokeColorInput.addEventListener("input", () => text.style.webkitTextStroke = `2px ${strokeColorInput.value}`);
    backgroundCheckbox.addEventListener("change", () => {
        if (!backgroundCheckbox.checked) {
            backgroundColorInput.setAttribute("disabled", "true");
            text.style.background = "none";
        } else {
            backgroundColorInput.removeAttribute("disabled");
            text.style.background = backgroundColorInput.value;
        }
        backgroundColorInput.addEventListener("input", () => text.style.background = backgroundColorInput.value)
    });
    rotateInput.addEventListener("input", () => text.style.transform = `rotate(${rotateInput.value}deg)`);
}
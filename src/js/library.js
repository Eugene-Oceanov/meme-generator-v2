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
        document.addEventListener("mousemove", moveHandler);
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

export function resizeElement(element, trigger, inner) {
    let elementRect = element.getBoundingClientRect(),
        active = false;
    trigger.addEventListener("mousedown", (e) => {
        active = true;
        document.addEventListener("mousemove", resizeHandler);
    })
    function resizeHandler(e) {
        if (active) {
            e.preventDefault();
            let currentWidth = e.clientX - elementRect.x;
            let currentHeight = e.clientY - elementRect.y;
            element.style.width = `${currentWidth}px`;
            element.style.height = `${currentHeight}px`;
            if (inner) {
                inner.style.width = "100%";
                inner.style.height = "100%";
            }
        }
    }
    document.addEventListener("mouseup", () => {
        active = false;
        document.removeEventListener("mousemove", resizeHandler);
    });
}

let currentImg,
    filterInputsArr = [...document.querySelectorAll(".filter-input")],
    rotateInputsArr = [...document.querySelectorAll(".img-rotate-input")];

export function updateImgInputListeners(img, removeBgBtn) {
    currentImg = img;
    const inputsArr = [...document.querySelectorAll(".img-input")];
    inputsArr.forEach(input => {
        input.removeEventListener("input", updateSingleInputs);
        input.removeEventListener("input", updateRotateInputs);
        input.removeEventListener("input", updateFilterInputs);
    });
    inputsArr.forEach(input => input.addEventListener("input", updateSingleInputs));
    rotateInputsArr.forEach(input => input.addEventListener("input", updateRotateInputs));
    filterInputsArr.forEach(input => input.addEventListener("input", updateFilterInputs));
    removeBgBtn.addEventListener("click", updateBackground);
}

function updateSingleInputs(e) {
    if(currentImg) {
        const input = e.target;
        switch(input.id) {
            case "img-scale-input": return currentImg.output.style.transform = `scale(${input.value})`;
            case "img-rotate-input": return currentImg.output.style.rotate = `${input.value}deg`;
            case "img-opacity-input": return currentImg.output.style.opacity = input.value;
        }
        currentImg.styleValues[input.id] = +input.value;
    }
}

function updateRotateInputs() {
    if(currentImg) {
        const rotateValues = rotateInputsArr.map(input => {
            switch(input.id) {
                case "img-rotateX-input": return `rotateX(${input.value}deg)`;
                case "img-rotateY-input": return `rotateY(${input.value}deg)`;
            }
        })
        rotateValues.unshift("perspective(600px)");
        console.log( rotateValues.join(" "));
        currentImg.output.style.transform = rotateValues.join(" ");
        rotateInputsArr.forEach(input => currentImg.styleValues[input.id] = +input.value);
    }
}

function updateFilterInputs() {
    if(currentImg) {
        const filterValues = filterInputsArr.map(input => {
            switch(input.id) {
                case "img-blur-input": return `blur(${input.value}px)`;
                case "img-brightness-input": return `brightness(${input.value}%)`;
                case "img-contrast-input": return `contrast(${input.value}%)`;
                case "img-saturate-input": return `saturate(${input.value}%)`;
                case "img-hue-input": return `hue-rotate(${input.value}deg)`;
                case "img-invert-input": return `invert(${input.value}%)`;
                case "img-sepia-input": `sepia(${input.value}%)`;
            }
        });
        currentImg.output.style.filter = filterValues.join(" ");
        filterInputsArr.forEach(input => currentImg.styleValues[input.id] = +input.value);
    }
}

async function updateBackground() {
    let base64 = await imgToBase64(currentImg.output);
    let overlay = document.querySelector(".preloader-overlay");
    overlay.style.display = "flex"
    removeBackground(currentImg.output, base64, overlay)
}

function removeBackground(img, base64, overlay) {
    fetch("https://benzin.io/api/removeBackground",
        {
            method: "POST",
            headers: {
                "dataType": "json",
                "Content-Type": "application/json",
                "X-Access-Token": "djK0qGeGToPpSUmCVXGZzvkb76GhZ1lj9SScrYNV8g051lZIth5OBP2ZEhQbrPMn"
            },
            body: JSON.stringify({
                "crop": false,
                "crop_margin": "10px",
                "image_file_b64": base64,
                "output_format": "image",
                "output_image_format": "png"
            }),
        })
        .then(response => response.blob())
        .then(blob => {
            const croppedImgUrl = URL.createObjectURL(blob);
            img.src = croppedImgUrl;
            overlay.style.display = "none";
        })
        .catch(error => console.error(error));
}

async function imgToBase64 (img) {
    let base64 = await new Promise((resolve) => {
        const imgToB64 = document.createElement("IMG");
        imgToB64.src = img.src;
        imgToB64.onload = function () {
            let key = encodeURIComponent(img.src),
                canvas = document.createElement("canvas");
            canvas.width = imgToB64.width;
            canvas.height = imgToB64.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(imgToB64, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
    })
    return base64;
}



export function textStylization(text) {
    const fontFamilySelect = document.querySelector(".text-settings__font-family-select"),
        fontSizeSelect = document.querySelector(".text-settings__font-size-select"),
        colorInput = document.querySelector(".text-settings__color-input"),
        strokeCheckbox = document.querySelector("#text-settings__stroke-checkbox"),
        strokeColorInput = document.querySelector(".text-settings__stroke-color-input"),
        backgroundCheckbox = document.querySelector("#text-settings__background-checkbox"),
        backgroundColorInput = document.querySelector(".text-settings__background-color-input"),
        rotateInput = document.querySelector(".text-rotate-input");
    fontFamilySelect.addEventListener("change", () => text.output.style.fontFamily = fontFamilySelect.value);
    fontSizeSelect.addEventListener("change", () => text.output.style.fontSize = `${fontSizeSelect.value}px`);
    colorInput.addEventListener("input", () => text.output.style.color = colorInput.value);
    strokeCheckbox.addEventListener("change", () => {
        if (!strokeCheckbox.checked) {
            strokeColorInput.setAttribute("disabled", "true");
            text.output.style.webkitTextStroke = `0px ${strokeColorInput.value}`;
        } else {
            strokeColorInput.removeAttribute("disabled");
            text.output.style.webkitTextStroke = `2px ${strokeColorInput.value}`;
        }
    });
    strokeColorInput.addEventListener("input", () => text.output.style.webkitTextStroke = `2px ${strokeColorInput.value}`);
    backgroundCheckbox.addEventListener("change", () => {
        if (!backgroundCheckbox.checked) {
            backgroundColorInput.setAttribute("disabled", "true");
            text.output.style.background = "none";
        } else {
            backgroundColorInput.removeAttribute("disabled");
            text.output.style.background = backgroundColorInput.value;
        }
        backgroundColorInput.addEventListener("input", () => text.output.style.background = backgroundColorInput.value);
    });
    rotateInput.addEventListener("input", () => text.output.style.transform = `rotate(${rotateInput.value}deg)`);
}

export function sortLayersDnD(labelsWrapper, layersArr) {
    let dragged,
        dragOvered;

    labelsWrapper.addEventListener("drag", e => {
        e.preventDefault();
        dragged = e.target;
    });
    
    labelsWrapper.addEventListener("dragover", e => {
        e.preventDefault();
        dragOvered = e.target;
        if (dragged != dragOvered) dragOvered.style.marginTop = "10px";
    });
    
    labelsWrapper.addEventListener("dragleave", e => {
        e.preventDefault();
        dragOvered.style.marginTop = "2px";
    });
    
    labelsWrapper.addEventListener("drop", (e) => {
        e.preventDefault();
        let draggedIndex = layersArr.findIndex(item => item.label === dragged),
            dragOveredIndex = layersArr.findIndex(item => item.label === dragOvered),
            draggedImg = { ...layersArr[draggedIndex] };
        layersArr.splice(draggedIndex, 1);
        layersArr.splice(dragOveredIndex, 0, draggedImg);
        labelsWrapper.innerHTML = "";
        layersArr.forEach(item => {
            item.layer = layersArr.indexOf(item) + 1;
            labelsWrapper.append(item.label);
            item.output.id = `layer-${layersArr.indexOf(item) + 1}`;
            item.output.style.zIndex = layersArr.indexOf(item) + 1;
            item.label.style.marginTop = "2px";
        })
    })
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

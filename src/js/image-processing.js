let currentImg,
    filterInputsArr = [...document.querySelectorAll(".filter-input")],
    rotateInputsArr = [...document.querySelectorAll(".img-rotate-input")];

export function updateImgInputListeners(img, removeBgBtn) {
    currentImg = img;
    const imgInputsArr = [...document.querySelectorAll(".img-input")];
    imgInputsArr.forEach(input => {
        input.removeEventListener("input", updateSingleImgInputs);
        input.removeEventListener("input", updateRotateImgInputs);
        input.removeEventListener("input", updateFilterImgInputs);
        removeBgBtn.removeEventListener("click", updateImgBackground);
    });
    imgInputsArr.forEach(input => input.addEventListener("input", updateSingleImgInputs));
    rotateInputsArr.forEach(input => input.addEventListener("input", updateRotateImgInputs));
    filterInputsArr.forEach(input => input.addEventListener("input", updateFilterImgInputs));
    removeBgBtn.addEventListener("click", updateImgBackground);
}

function updateSingleImgInputs(e) {
    if(currentImg) {
        const input = e.target;
        switch(input.id) {
            case "img-scale-input": return currentImg.output.style.scale = input.value;
            case "img-rotate-input": return currentImg.output.style.rotate = `${input.value}deg`;
            case "img-opacity-input": return currentImg.output.style.opacity = input.value;
        }
        currentImg.styleValues[input.id] = +input.value;
    }
}

function updateRotateImgInputs() {
    if(currentImg) {
        const rotateValues = rotateInputsArr.map(input => {
            switch(input.id) {
                case "img-rotateX-input": return `rotateX(${input.value}deg)`;
                case "img-rotateY-input": return `rotateY(${input.value}deg)`;
            }
        })
        rotateValues.unshift("perspective(600px)");
        currentImg.output.style.transform = rotateValues.join(" ");
        rotateInputsArr.forEach(input => currentImg.styleValues[input.id] = +input.value);
    }
}

function updateFilterImgInputs() {
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

async function updateImgBackground() {
    let base64 = await imgToBase64(currentImg.output);
    let overlay = document.querySelector(".preloader-overlay");
    overlay.style.display = "flex"
    removeImgBackground(currentImg.output, base64, overlay)
}

function removeImgBackground(img, base64, overlay) {
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
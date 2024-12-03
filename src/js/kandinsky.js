import { moveElement, getLabel } from "./library.js";
import { updateImgInputListeners } from "./image-processing.js";

export async function getAiImgOutput(layersArr, counter, currentLayer, layerLabelsWrapper, style, prompt, removeBackgroundBtn, modalOverlay, preloaderOverlay) {
    if(prompt) {
        preloaderOverlay.style.display = "flex";
        if(currentLayer) currentLayer.label.style.border = "2px solid #fff";
        modalOverlay.style.display = "none";
        const img = await getAiImgLayout(counter, style, prompt, preloaderOverlay);
        layerLabelsWrapper.append(img.label);
        workspace.append(img.output);
        setTimeout(() => { if (img.output.clientWidth > img.output.clientHeight) img.output.style.width = `${workspace.offsetWidth}px`;
                               else img.output.style.height = `${workspace.offsetHeight}px`;
                               img.originalWidth = img.output.clientWidth;
                            }, 0 );
        currentLayer = img;
        updateImgInputListeners(currentLayer, removeBackgroundBtn);
        for(let key in img.styleValues)  if(img.styleValues.hasOwnProperty(key)) document.getElementById(key).value = img.styleValues[key];
        moveElement(currentLayer.output, workspace);
        layersArr.push(img);
        return img;
    } else alert("Введите запрос");
}

export async function getGenerationStyles() {
    try {
        let request = await fetch("https://cdn.fusionbrain.ai/static/styles/api");
        let response = await request.json();
        const styleRadioWrappersArr = new Array();
        response.forEach(item => {
            const styleRadioWrapper = document.createElement("DIV");
            styleRadioWrapper.classList.add("kandinsky-styles-radio-item-wrapper");
            const styleRadio = document.createElement("INPUT");
            styleRadio.id = `style-${item.name}`;
            styleRadio.setAttribute("type", "radio");
            styleRadio.setAttribute("name", "kandinsky-styles");
            styleRadio.setAttribute("style", item.name);
            styleRadio.classList.add("style-radio");
            if(item.name === "UHD") styleRadio.checked = true;
            const styleRadioLabel = document.createElement("LABEL");
            styleRadioLabel.setAttribute("for", `style-${item.name}`);
            styleRadioLabel.textContent = item.title;
            styleRadioWrapper.append(styleRadio, styleRadioLabel);
            styleRadioWrappersArr.push(styleRadioWrapper);
        })
        return styleRadioWrappersArr;
    } catch(error) { console.error(`Error: ${error}`); }
}

async function getAiImgLayout(counter, style, prompt, preloaderOverlay) {
    const url = 'https://api-key.fusionbrain.ai/';
    const apiKey = '57EDFB2E7674FB6ACC51C03408CC1EFF';
    const secretKey = '60320B67C5F39DD95D907D8A87BA8DA7';
    try {
        const modelId = await getModel(url, apiKey, secretKey);
        const uuid = await generateImage(url, apiKey, secretKey, style, prompt, modelId);
        const response = await checkGeneration(url, apiKey, secretKey, uuid);
        const output = document.createElement("IMG");
        output.setAttribute("src", "data:image/jpg;base64," + response);
        output.classList.add("img-output");
        output.setAttribute("id", `layer-${counter}`)
        output.setAttribute("draggable", false);    
        preloaderOverlay.style.display = "none";
        return {
            layer: counter,
            output: output,
            label: getLabel(counter, prompt),
            type: "img",
            styleValues: {
                "img-scale-input": 100,
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
        }
    } catch (error) { console.error(`Error: ${error}`); }
}

async function getModel(url, apiKey, secretKey) {
    const response = await fetch(url + 'key/api/v1/models', {
        method: 'GET',
        headers: {
            'X-Key': 'Key ' + apiKey,
            'X-Secret': 'Secret ' + secretKey
        }
    })
    const data = await response.json();
    return data[0].id;
}

async function generateImage(url, apiKey, secretKey, style, prompt, model, images = 1, width = 1024, height = 1024) {
    const params = {
        "type": "GENERATE",
        "style": style,
        "numImages": images,
        "width": width,
        "height": height,
        "generateParams": {
            "query": prompt
        }
    };
    const formData = new FormData();
    formData.append('model_id', model);
    formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));
    const response = await fetch(url + 'key/api/v1/text2image/run', {
        method: 'POST',
        headers: {
            'X-Key': 'Key ' + apiKey,
            'X-Secret': 'Secret ' + secretKey
        },
        body: formData
    });
    const data = await response.json();
    return data.uuid;
}

async function checkGeneration(url, apiKey, secretKey, requestId, attempts = 10, delay = 10000) {
    while (attempts > 0) {
        const response = await fetch(url + 'key/api/v1/text2image/status/' + requestId, {
            method: 'GET',
            headers: {
                'X-Key': 'Key ' + apiKey,
                'X-Secret': 'Secret ' + secretKey
            }
        });
        const data = await response.json();
        if (data.status === 'DONE') {
            return data.images;
        }
        attempts -= 1;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error('Generation attempts exhausted');
}

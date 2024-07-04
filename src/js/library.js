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

export function resizeElement(element, trigger, statusBar) {
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
            if(statusBar) statusBar.textContent = `Ш:${currentWidth}, B:${currentHeight}`;
        }
    }
    document.addEventListener("mouseup", () => {
        active = false;
        document.removeEventListener("mousemove", resizeHandler);
    });
}

export function getLabel(counter, name) {
    const label = document.createElement("LABEL");
    label.classList.add("layer-label");
    label.style.border = "4px solid #fff";
    label.setAttribute("draggable", true);
    label.setAttribute("for", `layer-${counter}`);
    label.setAttribute("layer-index", counter);
    label.textContent = name;
    return label;
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
            item.layer = layersArr.indexOf(item);
            labelsWrapper.append(item.label);
            item.output.id = `layer-${layersArr.indexOf(item)}`;
            item.output.style.zIndex = layersArr.indexOf(item);
            item.label.setAttribute("for", `layer-${layersArr.indexOf(item)}`);
            item.label.style.marginTop = "2px";
        })
    })
}

export function changeActiveLayer(layers, e) {
    let targetLayer;
    layers.forEach(item => {
        item.label.style.border = "2px solid #fff";
        if(item.label === e.target) {
            targetLayer = item;
            item.label.style.border = "4px solid #fff";
        }
    })
    return targetLayer;
}

export function deleteLayer(layers, e) {
    const label = e.target,
        layer = document.getElementById(label.getAttribute("for")),
        index = label.getAttribute("layer-index");
    label.remove();
    layer.remove();
    layers.splice(index, 1);
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
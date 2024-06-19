async function getModel(url, apiKey, secretKey) {
    const response = await fetch(url + 'key/api/v1/models', {
        method: 'GET',
        headers: {
            'X-Key': 'Key ' + apiKey,
            'X-Secret': 'Secret ' + secretKey
        }
    });
    const data = await response.json();
    return data[0].id;
}

async function generateImage(url, apiKey, secretKey, prompt, model, images = 1, width = 1024, height = 1024) {
    const params = {
        "type": "GENERATE",
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

(async () => {
    const url = 'https://api-key.fusionbrain.ai/';
    const apiKey = '57EDFB2E7674FB6ACC51C03408CC1EFF';
    const secretKey = '60320B67C5F39DD95D907D8A87BA8DA7';
    
    try {
        const modelId = await getModel(url, apiKey, secretKey);
        const uuid = await generateImage(url, apiKey, secretKey, "Cat in glasses", modelId);
        const images = await checkGeneration(url, apiKey, secretKey, uuid);
        console.log(images);
        // navigator.clipboard.writeText(images);
      document.querySelector("p").textContent = images
    } catch (error) {
        console.error('Error:', error);
    }
})();



// html
{/* <div class="output">
  <div class="overlay">
    <div class="preloader"></div>
  </div>
</div>

<div class="form">
  <textarea placeholder="Enter prompt"></textarea>
  <button>Get request</button>
</div> */}


// css
// * {
//     margin: 0;
//     padding: 0;
//     box-sizing: border-box;
//   }
  
//   body {
//     height: 100vh;
//     position: relative;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     background: #ccc;
//   }
  
//   .output {
//     width: 632px;
//     height: 632px;
//     position: relative;
//     background: #fff;
//     box-shadow: 3px 3px 15px rgba(0,0,0,0.5)
//   }
  
//   .overlay {
//     position: absolute;
//     width: 100%;
//     height: 100%;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     background: rgba(0,0,0,0.7);
//     display: none;
//   }
  
//   img {
//     width: 100%;
//     height: 100%;
//   }
  
//   .preloader {
//     width: 80px;
//     height: 80px;
//     border-color: #fff transparent;
//     border-style: solid;
//     border-width: 8px;
//     border-radius: 50%;
//     animation: load 1s linear infinite;
//   }
  
//   .form {
//     position: absolute;
//     right: 15px;
//     bottom: 35px;
//     display: flex;
//     flex-direction: column;
//   }
  
//   textarea {
//     width: 200px;
//     height: 100px;
//     margin-bottom: 10px;
//     resize: none;
//   }
  
//   button {
//     padding: 10px;
//     cursor: pointer;
//   }
  
//   @keyframes load {
//     to {
//       rotate: 360deg;
//     }
//   }

// js

// async function getModel(url, apiKey, secretKey) {
//     const response = await fetch(url + 'key/api/v1/models', {
//         method: 'GET',
//         headers: {
//             'X-Key': 'Key ' + apiKey,
//             'X-Secret': 'Secret ' + secretKey
//         }
//     });
//     const data = await response.json();
//     return data[0].id;
// }

// async function generateImage(url, apiKey, secretKey, prompt, model, images = 1, width = 1024, height = 1024) {
//     const params = {
//         "type": "GENERATE",
//         "numImages": images,
//         "width": width,
//         "height": height,
//         "generateParams": {
//             "query": prompt
//         }
//     };

//     const formData = new FormData();
//     formData.append('model_id', model);
//     formData.append('params', new Blob([JSON.stringify(params)], { type: 'application/json' }));

//     const response = await fetch(url + 'key/api/v1/text2image/run', {
//         method: 'POST',
//         headers: {
//             'X-Key': 'Key ' + apiKey,
//             'X-Secret': 'Secret ' + secretKey
//         },
//         body: formData
//     });

//     const data = await response.json();
//     return data.uuid;
// }

// async function checkGeneration(url, apiKey, secretKey, requestId, attempts = 10, delay = 10000) {
//     while (attempts > 0) {
//         const response = await fetch(url + 'key/api/v1/text2image/status/' + requestId, {
//             method: 'GET',
//             headers: {
//                 'X-Key': 'Key ' + apiKey,
//                 'X-Secret': 'Secret ' + secretKey
//             }
//         });
//         const data = await response.json();
//         if (data.status === 'DONE') {
//             return data.images;
//         }
//         attempts -= 1;
//         await new Promise(resolve => setTimeout(resolve, delay));
//     }
//     throw new Error('Generation attempts exhausted');
// }

// async function handler(prompt) {
//     const url = 'https://api-key.fusionbrain.ai/';
//     const apiKey = '57EDFB2E7674FB6ACC51C03408CC1EFF';
//     const secretKey = '60320B67C5F39DD95D907D8A87BA8DA7';
    
//     try {
//         const modelId = await getModel(url, apiKey, secretKey);
//         const uuid = await generateImage(url, apiKey, secretKey, prompt, modelId);
//         const images = await checkGeneration(url, apiKey, secretKey, uuid);
//         console.log(images);
//         const img = document.createElement("IMG")
//         img.setAttribute('src', "data:image/jpg;base64," + images);
//         document.querySelector(".output").append(img);
//         document.querySelector(".overlay").style.display = "none";
//     } catch (error) {
//         console.error('Error:', error);
//     }
// };

// document.querySelector("button").addEventListener("click", async () => {
//   // document.querySelector(".output").innerHTML = "";
//   document.querySelector(".overlay").style.display = "flex";
//   handler(document.querySelector("textarea").value);
// })
import { GoogleGenerativeAI } from "@google/generative-ai";


document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');

    let searchTimeout;

    // Load saved API key
    chrome.storage.sync.get('apiKey', function(data) {
        if (data.apiKey) {
            apiKeyInput.value = data.apiKey;
        }
    });

    // Save the API key
    saveApiKeyButton.addEventListener('click', function() {
        chrome.storage.sync.set({'apiKey': apiKeyInput.value}, function() {
            alert('API Key saved');
        });
    });



    summarizeButton.addEventListener('click', function() {
        const customPrompt = document.getElementById('customPrompt').value;
        const predefinedPrompt = document.getElementById('predefinedPrompts').value;
        const prompt = customPrompt || predefinedPrompt;
    
        const treatment = document.querySelector('input[name="pageTreatment"]:checked').value;
        summarizeSelectedPages(prompt, treatment);
    });
    

    async function executePrompt(prompt) {
    
        const summariesContainer = document.getElementById('TODO: get the text from the page element');
        summariesContainer.innerHTML = 'Processing...';
    
        let apiKey = await getApiKey();

        // TODO: get content from selected textfield
        let content = ''

        // TODO: get prefix from the dropdown list
        let prefix = ''
        // TODO: send api call to gemini
        let res = getGeminiResponse(content, apiKey, prefix)
        // TODO: show results using displaySummary
        displaySummary(res, summariesContainer)
        // function displaySummary(response, container) {
        //     const summaryElement = document.createElement('div');
        //     summaryElement.innerHTML = `<b>Processing for ${url}:</b> ${marked(summary)}`;
        //     container.appendChild(summaryElement);
        // }
    

    }
    
    

    async function getGeminiResponse(content, apiKey, prefix) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const fullContent = prefix + content;
        
        try {
            const result = await model.generateContent(fullContent);
            const response = await result.response;
            return await response.text();
        } catch (error) {
            console.error('Error generating processing:', error);
            throw new Error('Processing failed');
        }
    }
    

    function getApiKey() {
        return new Promise((resolve, reject) => {
            chrome.storage.sync.get('apiKey', function(data) {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(data.apiKey);
                }
            });
        });
    }
        
    
    function displaySummary(url, summary, container) {
        const summaryElement = document.createElement('div');
        summaryElement.innerHTML = `<b>Processing for ${url}:</b> ${marked(summary)}`;
        container.appendChild(summaryElement);
    }
    
    


    });
let model;

window.onload = async () => {
    await loadModel();
};

async function loadModel() {
    model = await mobilenet.load();
    const resultElement = document.getElementById('status');
    resultElement.innerHTML = `Model Loaded dan tekan lagi`;
}

async function classifyImage() {
    const image = document.createElement('img');
    const url = document.getElementById('selectedImage').src;

    image.onload = async function() {
        if (!model) {
            const resultElement = document.getElementById('status');
            resultElement.innerHTML = `Tunggu`;
            return;
        }
        
        const predictions = await model.classify(image);
        const topPrediction = predictions[0];
        const Tingkat = ((topPrediction.probability * 100)).toFixed(2);
        const prediksi = (100 - (topPrediction.probability * 100)).toFixed(2);
        let category = '';
        let TingkatKerusakan = '';
        if (Tingkat >= 70) {
            category = 'Bagus';
        } else {
            category = 'Buruk';
        }
        if (prediksi >= 50) {
            TingkatKerusakan = 'Tinggi';
        } else {
            TingkatKerusakan = 'Rendah';
        }
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `Tingkat Pengenalan Mesin: ${category}: ${topPrediction.className} (${(Tingkat)}%)`;
        const resultElements = document.getElementById('result2');
        resultElements.innerHTML = `Tingkat Kerusakan: ${TingkatKerusakan} (${prediksi}%)`;
        const user = JSON.parse(localStorage.getItem('user'));
        const selectedProduct = user.products.find(productData => productData.product === document.getElementById('productDropdown').value);
        const rowId = selectedProduct ? selectedProduct.rowId : null;
        document.getElementById('saveButton').style.display = 'inline-block';
        console.log('Selected Product:', selectedProduct);
        console.log('Row ID:', rowId);
        localStorage.setItem('resultData', JSON.stringify({
            rowId: selectedProduct.rowId,
            prediksi,
            tingkat: Tingkat
        }));
    };
    image.crossOrigin = "Anonymous"; // Handle CORS
    image.src = url;
}

async function saveResult() {
    const resultData = JSON.parse(localStorage.getItem('resultData'));

    if (!resultData) {
        console.error('No result data found');
        return;
    }

    const apiUrl = 'https://api.airtable.com/v0/appfCVfPcwccTepES/AI';
    const apiKey = 'patygJoNXcGIeuLnV.0e2de3c1c20c50e536dbc0414b48f6e7c9b390498f6e27d6b4cb271ba3419e26'; // Replace with your Airtable API key

    const data = {
        fields: {
            "Row ID": resultData.rowId,
            "AI": resultData.tingkat,
            "Damage Level": resultData.prediksi
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Data successfully sent to Airtable:', result);

        // Hide the save button and show the next button
        document.getElementById('saveButton').style.display = 'none';
        document.getElementById('nextButton').style.display = 'inline-block';
    } catch (error) {
        console.error('Error sending data to Airtable:', error);
    }
}

function goToBackView() {
    window.location.href = 'back-index.html';
}

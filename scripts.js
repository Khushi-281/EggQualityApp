document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
        var image = new Image();
        image.src = e.target.result;
        image.classList.add('preview-image');
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('imagePreview').appendChild(image);
    };

    reader.readAsDataURL(file);
});

document.getElementById('urlInput').addEventListener('input', function(event) {
    var url = event.target.value;
    if (url) {
        var image = new Image();
        image.src = url;
        image.classList.add('preview-image');
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('imagePreview').appendChild(image);
    }
});

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');
    const file = fileInput.files[0];
    const url = urlInput.value;
    const formData = new FormData();
    
    if (file) {
        formData.append('file', file);
    } else if (url) {
        formData.append('url', url);
    } else {
        document.getElementById('result').innerText = 'Please provide a file or a URL.';
        return;
    }
    
    fetch('/predict', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        let resultText = 'An error occurred. Please try again.';
        if (data.result === '0') {
            resultText = 'Prediction: The egg is damaged , not fresh and unsuitable for consumption.';
        } else if (data.result === '1') {
            resultText = 'Prediction: The egg is fresh, undamaged, and ready for consumption.';
        }
        document.getElementById('result').innerText = resultText;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'An error occurred. Please try again.';
    });
});

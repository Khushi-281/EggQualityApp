from flask import Flask, request, jsonify, render_template
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
from werkzeug.utils import secure_filename
import os
from PIL import Image

# Path to your model
MODEL_PATH = r"C:\Users\Khushi J Shetty\OneDrive\Desktop\Major Project\egg flask app\egg\eggfinal.h5"

# Load the model
model = load_model(MODEL_PATH)

app = Flask(__name__, static_url_path='/static')

def model_predict(image_path, model):
    # Assuming the file is an image, here is a basic preprocessing step
    image = Image.open(image_path)
    image = image.resize((128, 128))  # Resize the image to match the input size expected by your model
    image_array = np.array(image)  # Convert the PIL image to a NumPy array
    image_tensor = image_array.astype('float32') / 255.0  # Normalize the pixel values

    # Add batch dimension
    image_tensor = np.expand_dims(image_tensor, axis=0)

    predictions = model.predict(image_tensor)
    return predictions

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'result': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'result': 'No selected file'})
    
    filename = secure_filename(file.filename)
    file_path = os.path.join('uploads', filename)
    file.save(file_path)
    print("file_path",file_path)
    # Get the prediction
    predictions = model_predict(file_path, model)
    result = np.argmax(predictions, axis=1)[0]  # Assuming classification model
    print("a",result)

    return jsonify({'result': str(result)})

@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(host='0.0.0.0', port=5000, debug=True)


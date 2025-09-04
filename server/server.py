from flask import Flask, request, jsonify, render_template
from . import util

app = Flask(__name__)
util.load_saved_artifacts()


@app.route("/")
def home():
    return render_template("index.html")

@app.route('/get_region_names')
def get_region_name():
    response = jsonify({
        'regions': util.get_region_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    return response

@app.route('/predict_home_price', methods=['POST'])
def predict_home_price():
    region = request.form['region']
    bedrooms = int(request.form['bedrooms'])
    
    response = jsonify({
        'estimated_price':util.get_estimated_price(region, bedrooms)
    })
    
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    print("Starting Python Flask Server for Home Price Predictions...")
    app.run()

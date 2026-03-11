from flask import Flask, jsonify, request
from flask_cors import CORS
import main

app = Flask(__name__)

# Very permissive CORS setup to handle all browser extension preflights
CORS(app, 
     resources={r"/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
     methods=["GET", "POST", "OPTIONS"])

@app.after_request
def add_header(response):
    # Force headers for every request just to be absolutely sure
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS'
    return response

@app.route('/ready', methods=['GET'])
def ready_endpoint():
    result = main.ready()
    return result

@app.route('/correct', methods=['POST', 'OPTIONS'])
def correct_text():
    if request.method == 'OPTIONS':
        return '', 204
        
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    input_text = data['text']
    try:
        prompt = main.getCorrectSpelling(input_text)
        corrected = main.runPrompt(prompt)
        return corrected
    except Exception as e:
        return str(e), 500

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "online"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4769, debug=True)

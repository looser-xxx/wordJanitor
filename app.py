from flask import Flask, jsonify
from flask_cors import CORS
import main  # Import the main.py module

app = Flask(__name__)
CORS(app)

@app.route('/ready', methods=['GET'])
def ready_endpoint():
    # Call the ready() function from main.py
    result = main.ready()
    print(f"Backend called main.ready(), result: {result}")
    return result  # Return the text from main.ready()

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "online"})

if __name__ == '__main__':
    print("wordJanitor Flask Server starting on http://localhost:4769")
    app.run(host='0.0.0.0', port=4769, debug=True)

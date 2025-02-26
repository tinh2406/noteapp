from flask import Flask,request
from googletrans import Translator

from dotenv import dotenv_values

config = dotenv_values(".env")

PORT = 10001


translator = Translator()
app = Flask(__name__)

@app.route('/', methods=['POST'])
def translate():
    data = request.get_json()
    text = data['text']
    translation = translator.translate(text, dest='vi')
    return translation.text

if __name__ == '__main__':
    app.run(port=PORT)
    
import arklib
from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/',methods=['GET','POST'])
def home():
    return render_template('home.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True, port=os.getenv("PORT", default=5000))
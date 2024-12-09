from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

USER_CREDENTIALS = {"username": "admin", "password": "password"}

@app.route('/')
def home():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Authentication check
        if username == USER_CREDENTIALS['username'] and password == USER_CREDENTIALS['password']:
            return redirect(url_for('home_page', username=username))
        else:
            return render_template('login.html', error="Invalid username or password")

    return render_template('login.html')

@app.route('/home/<username>')
def home_page(username):
    return render_template('home.html', username=username)

if __name__ == '__main__':
    app.run(debug=True)

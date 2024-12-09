from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    test_case_name = None
    data_models = []
    if request.method == 'POST':
        test_case_name = request.form.get('test_case')
        data_models = request.form.getlist('data_model')
        client_radio = request.form.get('cradio')
        dtype = request.form.getlist('datatype')
        dvalue = request.form.getlist('dvalue')
        client_conf = request.form.getlist('Wlanconfig')
        print(client_conf,dtype,client_radio,dvalue)
    return render_template('testcasebuilder.html', test_case_name=test_case_name, data_models=data_models)


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)


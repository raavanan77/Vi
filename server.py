from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    test_case_name = None
    data_models = []
    radio_conf = ''
    if request.method == 'POST':
        test_case_name = request.form.get('test_case')
        data_models = request.form.getlist('data_model')
        dtype = request.form.getlist('datatype')
        dvalue = request.form.getlist('dvalue')

        for dm,dv,dt in zip(data_models,dvalue,dtype):
            radio_conf += '|'.join([dm,dv,dt]) + '|'
            #print(radio_conf)


        print(test_case_name, data_models,dtype,dvalue,radio_conf)  # For debugging

    return render_template('home.html', test_case_name=test_case_name, data_models=data_models)

if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)

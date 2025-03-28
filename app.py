from flask import Flask, render_template, request, send_file
import os
import fitz
import pandas as pd
import re

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limite

# Criar pasta de uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def extrair_valor(texto):
    padrao = r"R\$ ?\d{1,3}(?:\.\d{3})*,\d{2}"
    valores = re.findall(padrao, texto)
    return valores[0] if valores else "Não encontrado"

def extrair_nome(texto):
    padroes_nome = [
        r"(?i)Nome\s*(?:do\s*)?Recebedor\s*[:]\s*([^\n]+)",
        r"(?i)Beneficiário\s*[:]\s*([^\n]+)"
    ]
    
    for padrao in padroes_nome:
        nomes = re.findall(padrao, texto, re.MULTILINE | re.IGNORECASE)
        if nomes:
            nome = nomes[0].strip()
            nome = re.sub(r'\s+', ' ', nome)
            return nome
    
    return "Não encontrado"

@app.route('/', methods=['GET', 'POST'])
def upload_pdfs():
    if request.method == 'POST':
        # Limpar pasta de uploads anteriores
        for arquivo in os.listdir(app.config['UPLOAD_FOLDER']):
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], arquivo))
        
        # Receber arquivos
        arquivos = request.files.getlist('pdfs')
        dados = []

        for arquivo in arquivos:
            if arquivo.filename.endswith('.pdf'):
                caminho = os.path.join(app.config['UPLOAD_FOLDER'], arquivo.filename)
                arquivo.save(caminho)

                # Processar PDF
                with fitz.open(caminho) as doc:
                    texto = " ".join([page.get_text("text") for page in doc])

                valor = extrair_valor(texto)
                nome = extrair_nome(texto)

                dados.append({
                    "Arquivo": arquivo.filename, 
                    "Nome Recebedor": nome, 
                    "Valor": valor
                })

        # Criar DataFrame
        df = pd.DataFrame(dados)
        
        # Salvar HTML
        html_path = os.path.join(app.config['UPLOAD_FOLDER'], 'resultado.html')
        df.to_html(html_path, index=False)

        return send_file(html_path, as_attachment=True)

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

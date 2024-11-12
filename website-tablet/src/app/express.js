const express = require('express');
const path = require('path');
const app = express();

// Configurar o caminho para os arquivos estáticos do Angular
const angularPath = 'C:\\andon-jfa-fonte-oficial\\andon-jfa-fonte-oficial\\website-tablet\\dist\\website-tablet';
app.use(express.static(angularPath));

// Rota para servir o arquivo index.html do Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(angularPath, 'index.html'));
});

// Iniciar o servidor na porta 3000
app.listen(4200, () => {
    console.log('Servidor Express rodando na porta 4200!');
});

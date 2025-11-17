const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Rotas separadas
const nomeRoute = require("./routes/nome");
const cpfRoute = require("./routes/cpf"); // a sua antiga

app.use(nomeRoute);
app.use(cpfRoute);

app.listen(port, () => {
    console.log("Servidor online na porta " + port);
});

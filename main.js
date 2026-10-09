const express = require('express');
const cors = require('cors');
const authRoute = require('./routes/auth.route'); 

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', authRoute);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT} - http://localhost:3000`);
});
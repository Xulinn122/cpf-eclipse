const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
    const cpf = req.query.cpf;

    if (!cpf) {
        return res.json({
            erro: "Você precisa enviar ?cpf=00000000000"
        });
    }

    try {
        const url = `https://apis-brasil.shop/apis/apiserasacpf2025.php?cpf=${cpf}`;
        const response = await fetch(url);
        let data = await response.json();

        // ====== ALTERAÇÕES NO JSON ======
        let modificado = {};

        // Dados principais reorganizados
        modificado.pessoa = {
            nome: data.DADOS.NOME,
            cpf: data.DADOS.CPF,
            mae: data.DADOS.NOME_MAE,
            nasc: data.DADOS.NASC,
            sexo: data.DADOS.SEXO
        };

        // Emails resumidos
        modificado.emails = data.EMAIL.map(e => ({
            email: e.EMAIL,
            pessoal: e.EMAIL_PESSOAL,
            score: e.EMAIL_SCORE
        }));

        // Endereços reorganizados
        modificado.enderecos = data.ENDERECOS.map(e => ({
            endereco: `${e.LOGR_TIPO || ""} ${e.LOGR_NOME}, ${e.LOGR_NUMERO}`,
            cidade: e.CIDADE,
            uf: e.UF,
            cep: e.CEP
        }));

        // Score direto
        modificado.score = data.SCORE?.[0]?.CSB8 || null;

        // Parentes simplificados
        modificado.parentes = data.PARENTES.map(p => ({
            nome: p.NOME_VINCULO,
            parentesco: p.VINCULO
        }));

        return res.json({
            status: "ok",
            consultado: cpf,
            resultado: modificado
        });

    } catch (err) {
        console.log(err);
        res.json({ erro: "Falha ao consultar API" });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});

const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = "Nekro"; // sua chave real

router.get("/nome", async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ erro: "Faltando parâmetro ?q=" });

    try {
        const url = `https://mdzapis.com/api/newss2/nome/${encodeURIComponent(query)}?apikey=${API_KEY}`;
        const { data } = await axios.get(url);

        if (!data || !data.items) {
            return res.status(404).json({ erro: "Nenhum resultado encontrado." });
        }

        // Converter estrutura para PT-BR e limpar
        const resultados = data.items.map((pessoa) => ({
            nome: pessoa.name || null,
            data_nascimento: pessoa.birthday || null,
            idade: pessoa.age || null,
            signo: pessoa.zodiac || null,
            cpf: pessoa.document || null,
            escolaridade: pessoa.degreeEducation || null,
            titulo_eleitor: pessoa.voterRegistration || null,
            nacionalidade: pessoa.nationality || null,
            nome_mae: pessoa.motherName || null,
            nome_pai: pessoa.fatherName || null,
            cbo: pessoa.cbo || null,
            profissao: pessoa.cboName || null,
            
            telefone_principal: pessoa.mainPhone
                ? {
                    numero: pessoa.mainPhone.number,
                    whatsapp: pessoa.mainPhone.isWhatsApp,
                    endereco: pessoa.mainPhone.address
                        ? `${pessoa.mainPhone.address}, ${pessoa.mainPhone.addressNumber || ""}`.trim()
                        : null,
                    bairro: pessoa.mainPhone.neighborhood || null,
                    cidade: pessoa.mainPhone.city || null,
                    uf: pessoa.mainPhone.regionAbreviation || null,
                    cep: pessoa.mainPhone.zipCode || null
                }
                : null,

            quantidade_enderecos: pessoa.totalAddress || 0,
            quantidade_emails: pessoa.totalEmails || 0,
            quantidade_telefones: pessoa.totalPhone || 0,
            quantidade_socios: pessoa.totalBusinessAssociate || 0,
            quantidade_outros_contatos: pessoa.totalOthersContact || 0
        }));

        res.json({
            proximo: data.hasNext || false,
            total: data.total || resultados.length,
            resultados
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ erro: "Falha ao consultar API externa." });
    }
});

module.exports = router;

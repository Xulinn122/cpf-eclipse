export default async function handler(req, res) {
    const q = req.query.q;
    if (!q) return res.status(400).json({ erro: "Faltando parâmetro ?q=" });

    try {
        const url = `https://mdzapis.com/api/newss2/nome/${encodeURIComponent(q)}?apikey=Nekro`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.items) {
            return res.status(404).json({ erro: "Nenhum resultado encontrado." });
        }

        const resultados = data.items.map((pessoa) => ({
            nome: pessoa.name,
            data_nascimento: pessoa.birthday,
            idade: pessoa.age,
            signo: pessoa.zodiac,
            cpf: pessoa.document,
            escolaridade: pessoa.degreeEducation,
            nome_mae: pessoa.motherName,
            nome_pai: pessoa.fatherName,
            telefone_principal: pessoa.mainPhone ? {
                numero: pessoa.mainPhone.number,
                whatsapp: pessoa.mainPhone.isWhatsApp,
                cidade: pessoa.mainPhone.city,
                uf: pessoa.mainPhone.regionAbreviation
            } : null
        }));

        res.status(200).json({
            proximo: data.hasNext || false,
            total: data.total,
            resultados
        });

    } catch (error) {
        res.status(500).json({
            erro: "Falha ao consultar API externa.",
            detalhe: error.message
        });
    }
}
essoa.mainPhone.isWhatsApp,
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

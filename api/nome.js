export default async function handler(req, res) {
  try {
    const { nome } = req.query;

    if (!nome) {
      return res.status(400).json({ error: "Informe ?nome=FULANO" });
    }

    const url = `https://mdzapis.com/api/newss2/nome/${encodeURIComponent(nome)}?apikey=Nekro`;
    const data = await fetch(url).then(r => r.json());

    let hasNext = data.hasNext;

    // corrigir bug: tem items > 0 mas hasNext veio false
    if (data.items?.length > 0 && data.total > data.items.length) {
      hasNext = true;
    }

    const pessoas = (data.items || []).map(p => ({
      nome: p.name,
      nascimento: p.birthday,
      idade: p.age,
      signo: p.zodiac,
      cpf: p.document,
      mae: p.motherName,
      pai: p.fatherName || null,
      escolaridade: p.degreeEducation,
      cidade: p.mainPhone?.city || null,
      estado: p.mainPhone?.regionAbreviation || null,
      telefone: p.mainPhone?.number || null
    }));

    return res.status(200).json({
      ok: true,
      hasNext,
      total: data.total,
      resultados: pessoas
    });

  } catch (err) {
    return res.status(500).json({ error: "Erro interno", details: err.message });
  }
}
,

            telefone_principal: pessoa.mainPhone ? {
                numero: pessoa.mainPhone.number,
                whatsapp: pessoa.mainPhone.isWhatsApp,
                endereco: pessoa.mainPhone.address
                    ? `${pessoa.mainPhone.address}, ${pessoa.mainPhone.addressNumber || ""}`.trim()
                    : null,
                bairro: pessoa.mainPhone.neighborhood || null,
                cidade: pessoa.mainPhone.city || null,
                uf: pessoa.mainPhone.regionAbreviation || null,
                cep: pessoa.mainPhone.zipCode || null
            } : null,

            quantidade_enderecos: pessoa.totalAddress || 0,
            quantidade_emails: pessoa.totalEmails || 0,
            quantidade_telefones: pessoa.totalPhone || 0,
            quantidade_socios: pessoa.totalBusinessAssociate || 0,
            quantidade_outros_contatos: pessoa.totalOthersContact || 0
        }));

        res.status(200).json({
            status: "true",
            consultado: q,
            proximo: data.hasNext || false,
            total: data.total || resultados.length,
            resultados
        });

    } catch (error) {
        res.status(500).json({
            erro: "Falha ao consultar API externa.",
            detalhe: error.message
        });
    }
}
r(e);
        res.status(500).json({ erro: "Falha ao consultar API externa." });
    }
});

module.exports = router;

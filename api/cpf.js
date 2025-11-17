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
            // === DADOS PRINCIPAIS ===
            nome: pessoa.name,
            data_nascimento: pessoa.birthday,
            idade: pessoa.age,
            signo: pessoa.zodiac,
            cpf: pessoa.document,
            sexo: pessoa.gender,
            estado_civil: pessoa.civilStatus || null,
            escolaridade: pessoa.degreeEducation,
            nome_mae: pessoa.motherName,
            nome_pai: pessoa.fatherName,

            // === EMAILS (ARRAY COMPLETO) ===
            emails: pessoa.emails?.map(e => ({
                email: e.email,
                prioridade: e.priority,
                score: e.score,
                pessoal: e.personal,
                duplicado: e.duplicated,
                blacklist: e.blacklist,
                dominio: e.domain,
                data_inclusao: e.inclusionDate
            })) || [],

            quantidade_emails: pessoa.emails?.length || 0,

            // === ENDEREÇOS (LISTA COMPLETA) ===
            enderecos: pessoa.addresses?.map(end => ({
                tipo: end.type,
                logradouro: end.street,
                numero: end.number,
                complemento: end.complement,
                bairro: end.neighborhood,
                cidade: end.city,
                uf: end.state,
                cep: end.zipcode,
                atualizado_em: end.updatedAt,
                adicionado_em: end.createdAt
            })) || [],

            quantidade_enderecos: pessoa.addresses?.length || 0,

            // === TELEFONE PRINCIPAL ===
            telefone_principal: pessoa.mainPhone ? {
                numero: pessoa.mainPhone.number,
                whatsapp: pessoa.mainPhone.isWhatsApp,
                cidade: pessoa.mainPhone.city,
                uf: pessoa.mainPhone.regionAbreviation,
                tipo: pessoa.mainPhone.type,
                operadora: pessoa.mainPhone.carrier,
                atualizado_em: pessoa.mainPhone.updatedAt
            } : null,

            // === SCORES ===
            score: pessoa.score ? [{
                csb8: pessoa.score.csb8,
                faixa_csb8: pessoa.score.csb8Range,
                csba: pessoa.score.csba,
                faixa_csba: pessoa.score.csbaRange
            }] : [],

            // === MOSAIC ===
            mosaic: pessoa.mosaic ? {
                primario: pessoa.mosaic.primary,
                secundario: pessoa.mosaic.secondary,
                novo: pessoa.mosaic.new
            } : null,

            mosaic_resumido: pessoa.mosaic
                ? `${pessoa.mosaic.primary}/${pessoa.mosaic.new}`
                : null,

            // === PARENTES ===
            parentes: pessoa.relatives?.map(p => ({
                nome: pessoa.name,
                nome_vinculo: p.relativeName,
                vinculo: p.relationship
            })) || []
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

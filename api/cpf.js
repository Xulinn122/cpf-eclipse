export default async function handler(req, res) {
    const q = req.query.q;
    if (!q) return res.status(400).json({ erro: "Faltando parâmetro ?q=" });

    try {
        const url = `https://apis-brasil.shop/apis/apiserasacpf2025.php?cpf=${encodeURIComponent(q)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.DADOS) {
            return res.status(404).json({ erro: "Nenhum resultado encontrado." });
        }

        const pessoa = data.DADOS;

        // === FORMATAR RESULTADO ===
        const resultado = {
            nome: pessoa.NOME,
            cpf: pessoa.CPF,
            sexo: pessoa.SEXO,
            nascimento: pessoa.NASC,
            nome_mae: pessoa.NOME_MAE,
            nome_pai: pessoa.NOME_PAI,
            estado_civil: pessoa.ESTCIV,
            rg: pessoa.RG || null,
            renda: pessoa.RENDA || null,

            // EMAILS
            emails: (data.EMAIL || []).map(e => ({
                email: e.EMAIL,
                prioridade: e.PRIORIDADE,
                score: e.EMAIL_SCORE,
                pessoal: e.EMAIL_PESSOAL,
                duplicado: e.EMAIL_DUPLICADO,
                blacklist: e.BLACKLIST,
                dominio: e.DOMINIO,
                data_inclusao: e.DT_INCLUSAO
            })),
            quantidade_emails: (data.EMAIL || []).length,

            // TELEFONES
            telefones: data.TELEFONE || [],
            quantidade_telefones: (data.TELEFONE || []).length,

            // ENDEREÇOS
            enderecos: (data.ENDERECOS || []).map(end => ({
                tipo: end.LOGR_TIPO,
                logradouro: end.LOGR_NOME,
                numero: end.LOGR_NUMERO,
                complemento: end.LOGR_COMPLEMENTO,
                bairro: end.BAIRRO,
                cidade: end.CIDADE,
                uf: end.UF,
                cep: end.CEP,
                atualizado: end.DT_ATUALIZACAO,
                incluido: end.DT_INCLUSAO
            })),
            quantidade_enderecos: (data.ENDERECOS || []).length,

            // SCORE SERASA/AQUISIÇÃO
            score: (data.SCORE || []).map(s => ({
                csb8: s.CSB8,
                faixa_csb8: s.CSB8_FAIXA,
                csba: s.CSBA,
                faixa_csba: s.CSBA_FAIXA
            })),

            // MOSAIC
            mosaic: {
                primario: pessoa.CD_MOSAIC || null,
                novo: pessoa.CD_MOSAIC_NOVO || null,
                secundario: pessoa.CD_MOSAIC_SECUNDARIO || null
            },
            mosaic_resumido: pessoa.CD_MOSAIC
                ? `${pessoa.CD_MOSAIC}/${pessoa.CD_MOSAIC_NOVO}`
                : null,

            // PARENTES
            parentes: (data.PARENTES || []).map(p => ({
                nome: p.NOME,
                nome_vinculo: p.NOME_VINCULO,
                vinculo: p.VINCULO
            }))
        };

        return res.status(200).json(resultado);

    } catch (error) {
        res.status(500).json({
            erro: "Falha ao consultar API externa.",
            detalhe: error.message
        });
    }
}
soa.mosaic.new}`
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

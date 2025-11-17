export default async function handler(req, res) {
    const cpf = req.query.cpf;

    if (!cpf) {
        return res.status(400).json({
            erro: "bota a query doidão ?cpf=00000000000"
        });
    }

    try {
        const url = `https://apis-brasil.shop/apis/apiserasacpf2025.php?cpf=${cpf}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data || !data.DADOS) {
            return res.status(404).json({ erro: "CPF não encontrado kkk" });
        }

        const pessoa = {
            cpf: data.DADOS.CPF,
            nome: data.DADOS.NOME,
            sexo: data.DADOS.SEXO,
            nascimento: data.DADOS.NASC,
            nome_mae: data.DADOS.NOME_MAE,
            nome_pai: data.DADOS.NOME_PAI,
            estado_civil: data.DADOS.ESTCIV,
            situacao_cadastral: data.DADOS.CD_SIT_CAD,
            data_situacao: data.DADOS.DT_SIT_CAD,
            ocupacao_cbo: data.DADOS.CBO,
            mosaic: {
                primario: data.DADOS.CD_MOSAIC,
                secundario: data.DADOS.CD_MOSAIC_SECUNDARIO,
                novo: data.DADOS.CD_MOSAIC_NOVO
            }
        };

        const emails = data.EMAIL?.map(e => ({
            email: e.EMAIL,
            prioridade: e.PRIORIDADE,
            score: e.EMAIL_SCORE,
            pessoal: e.EMAIL_PESSOAL,
            duplicado: e.EMAIL_DUPLICADO,
            blacklist: e.BLACKLIST,
            dominio: e.DOMINIO,
            data_inclusao: e.DT_INCLUSAO
        })) || [];

        const enderecos = data.ENDERECOS?.map(e => ({
            tipo: e.LOGR_TIPO || "",
            logradouro: e.LOGR_NOME,
            numero: e.LOGR_NUMERO,
            complemento: e.LOGR_COMPLEMENTO,
            bairro: e.BAIRRO,
            cidade: e.CIDADE,
            uf: e.UF,
            cep: e.CEP,
            atualizado_em: e.DT_ATUALIZACAO,
            adicionado_em: e.DT_INCLUSAO
        })) || [];

        const score = data.SCORE?.map(s => ({
            csb8: s.CSB8,
            faixa_csb8: s.CSB8_FAIXA,
            csba: s.CSBA,
            faixa_csba: s.CSBA_FAIXA
        })) || [];

        const parentes = data.PARENTES?.map(p => ({
            nome: p.NOME,
            nome_vinculo: p.NOME_VINCULO,
            vinculo: p.VINCULO
        })) || [];

        res.status(200).json({
            status: "true",
            consultado: cpf,
            pessoa,
            emails,
            enderecos,
            score,
            parentes,
            quantidade_enderecos: enderecos.length,
            quantidade_emails: emails.length,
            mosaic_resumido: `${data.DADOS.CD_MOSAIC}/${data.DADOS.CD_MOSAIC_NOVO}`
        });

    } catch (error) {
        res.status(500).json({
            erro: "Falha ao consultar API, deu ruim interno.",
            detalhe: error.message
        });
    }
}
     mosaic_resumido: `${data.DADOS.CD_MOSAIC}/${data.DADOS.CD_MOSAIC_NOVO}`
        });

    } catch (error) {
        res.status(500).json({
            erro: "Falha ao consultar API, acesso negado.",
            detalhe: String(error)
        });
    }
}

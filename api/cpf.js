export default async function handler(req, res) {
  try {
    const { cpf } = req.query;

    if (!cpf) {
      return res.status(400).json({ error: "Informe ?cpf=123" });
    }

    const url = `https://apis-brasil.shop/apis/apiserasacpf2025.php?cpf=${cpf}`;
    const raw = await fetch(url).then(r => r.json());

    const d = raw.DADOS || {};

    // ====== Emails ======
    const emails = (raw.EMAIL || []).map(e => ({
      email: e.EMAIL,
      prioridade: e.PRIORIDADE,
      tipo: e.EMAIL_PESSOAL === "S" ? "Pessoal" : "Profissional",
      qualidade: e.EMAIL_SCORE,
      dominio: e.DOMINIO,
      dtInclusao: e.DT_INCLUSAO
    }));

    // ====== Telefones ======
    const telefones = (raw.TELEFONE || []).map(t => ({
      numero: t.TELEFONE,
      tipo: t.TIPO,
      operadora: t.OPERADORA,
      whatsapp: t.WHATSAPP === "S",
      atualizado: t.DT_ATUALIZACAO
    }));

    // ====== Endereços ======
    const enderecos = (raw.ENDERECOS || []).map(e => ({
      rua: `${e.LOGR_TIPO || ""} ${e.LOGR_NOME || ""}`.trim(),
      numero: e.LOGR_NUMERO,
      complemento: e.LOGR_COMPLEMENTO,
      bairro: e.BAIRRO,
      cidade: e.CIDADE,
      uf: e.UF,
      cep: e.CEP,
      atualizado: e.DT_ATUALIZACAO,
      inserido: e.DT_INCLUSAO
    }));

    // ====== Score ======
    const score = raw.SCORE?.[0]
      ? {
          csb8: raw.SCORE[0].CSB8,
          faixa_csb8: raw.SCORE[0].CSB8_FAIXA,
          csba: raw.SCORE[0].CSBA,
          faixa_csba: raw.SCORE[0].CSBA_FAIXA
        }
      : null;

    // ====== Parentes ======
    const parentes = (raw.PARENTES || []).map(p => ({
      nome: p.NOME_VINCULO,
      parentesco: p.VINCULO,
      cpf: p.CPF_VINCULO
    }));

    return res.status(200).json({
      ok: true,

      // =========================
      // 🧍 Dados Principais
      // =========================
      pessoa: {
        cpf: d.CPF,
        nome: d.NOME,
        sexo: d.SEXO === "M" ? "Masculino" : d.SEXO === "F" ? "Feminino" : null,
        nascimento: d.NASC,
        mae: d.NOME_MAE,
        pai: d.NOME_PAI
      },

      // =========================
      // 📌 Informações Cadastrais
      // =========================
      cadastro: {
        id: d.CADASTRO_ID,
        estadoCivil: d.ESTCIV,
        situacaoCadastral: d.CD_SIT_CAD,
        dataSituacao: d.DT_SIT_CAD,
        ultimaAtualizacao: d.DT_INFORMACAO,
        renda: d.RENDA || null,
        faixaRendaId: d.FAIXA_RENDA_ID || null,
        mosaic: {
          codigo: d.CD_MOSAIC,
          novo: d.CD_MOSAIC_NOVO,
          secundario: d.CD_MOSAIC_SECUNDARIO
        }
      },

      // =========================
      // 📩 Emails
      // =========================
      emails,

      // =========================
      // 📱 Telefones
      // =========================
      telefones,

      // =========================
      // 🏠 Endereços
      // =========================
      enderecos,

      // =========================
      // ⭐ Score de crédito
      // =========================
      score,

      // =========================
      // 👪 Parentes
      // =========================
      parentes
    });

  } catch (err) {
    return res.status(500).json({ error: "Erro interno", detail: err.message });
  }
}
ame,
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

window.__DATA__=window.__DATA__||{};
window.__DATA__["lab_reference_ranges.json"]={
  "version": "1.0",
  "updated": "2026-10-29",
  "edition": "儿科化验参考区间 V1.5",
  "policy": {
    "standard": "参考区间优先对齐 WS/T 779—2021（儿童血细胞分析）与 WS/T 780—2021（儿童常用生化）；两项标准只覆盖部分项目且需实验室验证",
    "priority": "临床以本院报告单的同方法、同年龄参考区间为准；本文件仅作教学对照",
    "neonate": "新生儿（0–28天）不得套用 28 天以上儿童参考区间，须按日龄/胎龄与检测方法判读",
    "verified": false
  },
  "bands": [
    "新生儿(0-28天)",
    "婴儿(1-12月)",
    "幼儿(1-6岁)",
    "学龄(6-12岁)",
    "青春期(12-18岁)"
  ],
  "items": [
    {
      "code": "WBC",
      "name": "白细胞计数",
      "unit": "×10⁹/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 5.0,
          "high": 20.0,
          "note": "出生后数小时生理性升高，须按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 6.0,
          "high": 17.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 5.0,
          "high": 15.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 4.5,
          "high": 13.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 4.5,
          "high": 13.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "流式或阻抗法计数；静脉血与末梢血差异明显，哭闹、应激、采血部位与仪器校准均可影响结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "NEUT",
      "name": "中性粒细胞绝对计数",
      "unit": "×10⁹/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.0,
          "high": 8.0,
          "note": "生后可短暂下降再回升，须按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 1.0,
          "high": 8.5,
          "note": "婴儿期中性粒细胞比例低于淋巴细胞属生理现象"
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 1.5,
          "high": 8.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 1.8,
          "high": 8.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 1.8,
          "high": 7.7,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "流式分类或血涂片镜检分类；新生儿中性粒细胞波动大，低于 1.0×10⁹/L 须警惕新生儿中性粒细胞减少；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "LYM",
      "name": "淋巴细胞绝对计数",
      "unit": "×10⁹/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.5,
          "high": 7.0,
          "note": "新生儿淋巴细胞自生后逐渐上升"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.0,
          "high": 9.5,
          "note": "生理性淋巴细胞增多常见，勿误判为感染"
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 2.0,
          "high": 8.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 1.5,
          "high": 5.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 1.1,
          "high": 4.8,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "流式分类或镜检分类；婴儿期淋巴细胞绝对值为一生最高水平，须按年龄档比较；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "Hb",
      "name": "血红蛋白",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 140,
          "high": 220,
          "note": "出生时最高，生后 2–3 月出现生理性贫血"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 100,
          "high": 135,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 105,
          "high": 140,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 110,
          "high": 145,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 115,
          "high": 155,
          "note": "男女参考下限不同，青春期须分性别判读"
        }
      ],
      "qualitative_hint": "",
      "method_note": "氰化高铁血红蛋白法或 SLS 法；末梢血常高于静脉血 5–10 g/L，贫血判定须按年龄与海拔校正；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "PLT",
      "name": "血小板计数",
      "unit": "×10⁹/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 150,
          "high": 400,
          "note": "生后数日可轻度波动，低于 150 须复片"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 150,
          "high": 400,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 150,
          "high": 400,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 150,
          "high": 400,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 150,
          "high": 400,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "阻抗法或光学法计数；EDTA 依赖性血小板聚集可致假性降低，必须结合血涂片复核；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CRP",
      "name": "C反应蛋白",
      "unit": "mg/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 8.0,
          "note": "生后 48 小时内可轻度升高，须按日龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 8.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 8.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 8.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 8.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊或散射浊度法；新生儿生后可有轻微升高，感染判断须结合日龄与临床表现；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "PCT",
      "name": "降钙素原",
      "unit": "ng/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 2.0,
          "note": "生后 48 小时内可生理性升高至 2 ng/mL 左右"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 0.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 0.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 0.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 0.5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "电化学发光法；生后 48 小时内有生理性升高，须按小时龄与检测平台判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ESR",
      "name": "红细胞沉降率",
      "unit": "mm/h",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 2,
          "note": "新生儿血沉低，参考区间窄"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 10,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 10,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 12,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 15,
          "note": "青春期女孩上限略高于男孩"
        }
      ],
      "qualitative_hint": "",
      "method_note": "魏氏法或自动血沉仪；婴幼儿血沉生理性偏低，室温与采血后放置时间影响结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "Na",
      "name": "钠",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 133,
          "high": 146,
          "note": "生后数日可生理性偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 135,
          "high": 145,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 135,
          "high": 145,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 136,
          "high": 146,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 137,
          "high": 147,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "离子选择电极法（间接或直接）；标本溶血、脂血与高蛋白可致假性偏低；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "K",
      "name": "钾",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 4.0,
          "high": 6.5,
          "note": "新生儿血钾生理性偏高，须避免溶血与止血带影响"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.8,
          "high": 5.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 3.5,
          "high": 5.3,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 3.5,
          "high": 5.2,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 3.5,
          "high": 5.1,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "离子选择电极法；溶血、长时间止血带与握拳可致假性升高，标本须及时离心；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "Cl",
      "name": "氯",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 96,
          "high": 112,
          "note": "新生儿氯偏高，生后逐渐下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 98,
          "high": 110,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 98,
          "high": 108,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 99,
          "high": 110,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 100,
          "high": 110,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "离子选择电极法或比色法；须与 Na⁺、HCO3⁻ 同时判读阴离子间隙；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "Ca",
      "name": "总钙",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.9,
          "high": 2.6,
          "note": "生后 24–48 小时生理性下降，早产儿更明显"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 2.1,
          "high": 2.55,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 2.2,
          "high": 2.6,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 2.2,
          "high": 2.6,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 2.2,
          "high": 2.6,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "偶氮砷Ⅲ或邻甲酚酞络合酮法；须同时看白蛋白，低白蛋白时按公式校正总钙；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "GLU",
      "name": "血糖",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 2.2,
          "high": 6.0,
          "note": "生后数小时生理性下降，早产与小于胎龄儿阈值更高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.3,
          "high": 5.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 3.3,
          "high": 5.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 3.5,
          "high": 5.6,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 3.6,
          "high": 5.8,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "己糖激酶法或葡萄糖氧化酶法；新生儿生后 24 小时内波动大，低血糖阈值按日龄与高危因素判定；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CREA",
      "name": "肌酐",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 18,
          "high": 50,
          "note": "生后受母体肌酐影响先高后降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 14,
          "high": 35,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 18,
          "high": 40,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 25,
          "high": 50,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 30,
          "high": 70,
          "note": "青春期后男性上限高于女性"
        }
      ],
      "qualitative_hint": "",
      "method_note": "酶法或苦味酸法；新生儿生后第 1 周受母体肌酐影响，1 岁内偏低，须按方法学与年龄判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "UREA",
      "name": "尿素",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.0,
          "high": 4.5,
          "note": "生后初期可偏高，随喂养建立下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 1.5,
          "high": 5.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 1.8,
          "high": 6.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 2.0,
          "high": 6.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 2.3,
          "high": 7.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "脲酶-谷氨酸脱氢酶法；蛋白摄入与脱水影响明显，婴儿参考区间低于成人；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ALT",
      "name": "丙氨酸氨基转移酶",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 7,
          "high": 45,
          "note": "新生儿可轻度升高，生后数周下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 5,
          "high": 35,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 5,
          "high": 30,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 5,
          "high": 25,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 5,
          "high": 30,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "速率法（IFCC 推荐方法）；溶血与剧烈运动可轻度升高，须按方法学与年龄判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "AST",
      "name": "天冬氨酸氨基转移酶",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 15,
          "high": 70,
          "note": "新生儿生理性偏高，生后下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 15,
          "high": 55,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 15,
          "high": 45,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 12,
          "high": 40,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 10,
          "high": 38,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "速率法；红细胞内 AST 高，溶血标本可假性显著升高，须同时看 ALT 与胆道指标；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TBIL",
      "name": "总胆红素",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 24,
          "high": 200,
          "note": "新生儿严禁按固定数值一刀切，须按小时龄列线图判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.4,
          "high": 17.1,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 3.4,
          "high": 17.1,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 3.4,
          "high": 17.1,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 3.4,
          "high": 20.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "重氮法或钒酸氧化法；新生儿须按小时龄列线图判读，不能套用本档区间；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ALB",
      "name": "白蛋白",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 28,
          "high": 42,
          "note": "新生儿与早产儿白蛋白生理性偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 32,
          "high": 45,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 35,
          "high": 50,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 38,
          "high": 52,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 38,
          "high": 54,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "溴甲酚绿法或免疫比浊法；新生儿白蛋白生理性偏低，早产儿更低；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "pH",
      "name": "血气pH",
      "unit": "无量纲",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 7.3,
          "high": 7.4,
          "note": "新生儿生后数小时 pH 可偏低，须按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 7.35,
          "high": 7.45,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 7.35,
          "high": 7.45,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 7.35,
          "high": 7.45,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 7.35,
          "high": 7.45,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "血气分析仪电极法；须注明标本类型（动脉/毛细血管/静脉）与采血时间；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "PaCO2",
      "name": "动脉二氧化碳分压",
      "unit": "mmHg",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 30,
          "high": 45,
          "note": "新生儿可偏低，须结合呼吸频率判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 30,
          "high": 42,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 33,
          "high": 43,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 35,
          "high": 45,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 35,
          "high": 45,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "血气分析仪电极法；哭闹、呼吸机参数与标本气泡影响结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "HCO3",
      "name": "碳酸氢根",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 18,
          "high": 26,
          "note": "新生儿肾调节能力差，HCO3⁻ 可偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 19,
          "high": 26,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 20,
          "high": 27,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 21,
          "high": 28,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 22,
          "high": 28,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "血气分析仪计算值或酶法；须与 BE、Na⁺、Cl⁻ 同时判读酸碱类型；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "LAC",
      "name": "乳酸",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.0,
          "high": 3.0,
          "note": "生后数小时可生理性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.5,
          "high": 2.2,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.5,
          "high": 2.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.5,
          "high": 2.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.5,
          "high": 2.2,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "乳酸脱氢酶法或电极法；标本须冰浴尽快送检，止血带时间过长可致假性升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_WBC",
      "name": "尿白细胞",
      "unit": "/HPF或分析仪单位",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 5,
          "note": "新生儿尿白细胞可略高，须结合尿培养"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 5,
          "note": "女童受外阴分泌物影响，须清洁留取"
        }
      ],
      "qualitative_hint": "",
      "method_note": "尿沉渣镜检（离心尿 400 倍视野）或尿沉渣分析仪；须区分离心/不离心与女童外阴污染；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_PRO",
      "name": "尿蛋白",
      "unit": "定性或g/L",
      "interpretation_type": "numeric",
      "ranges": [],
      "qualitative_hint": "尿蛋白以定性（-/±/+/++）或半定量报告，阳性程度不按数值大小比较；定量须留 24 小时尿或改做尿蛋白/肌酐比",
      "method_note": "干化学试纸或比色法（24 小时尿）；阳性程度与定量值不能互相替代；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CSF_WBC",
      "name": "脑脊液白细胞",
      "unit": "×10⁶/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 30,
          "note": "新生儿血脑屏障未成熟，白细胞可偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 8,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "脑脊液细胞计数（计数池或分析仪）；穿刺损伤按红细胞数校正，新生儿参考上限高于年长儿；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "RBC",
      "name": "红细胞计数",
      "unit": "×10¹²/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 4.0,
          "high": 6.5,
          "note": "出生时偏高，生后 2–3 月降至低点"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.8,
          "high": 5.2,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 4.0,
          "high": 5.3,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 4.1,
          "high": 5.4,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 4.2,
          "high": 5.6,
          "note": "男女参考区间不同，青春期须分性别判读"
        }
      ],
      "qualitative_hint": "",
      "method_note": "阻抗法或流式法；新生儿红细胞体积大、计数偏高，生后 2–3 月生理性贫血期下降；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "HCT",
      "name": "红细胞压积",
      "unit": "%",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 42,
          "high": 65,
          "note": "出生时高，生后数周下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 30,
          "high": 42,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 33,
          "high": 44,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 35,
          "high": 46,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 36,
          "high": 48,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "离心法或计算法（MCV×RBC）；末梢血偏高，脱水可致假性升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "MCV",
      "name": "平均红细胞体积",
      "unit": "fL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 95,
          "high": 120,
          "note": "新生儿 MCV 生理性偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 70,
          "high": 86,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 72,
          "high": 88,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 76,
          "high": 92,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 78,
          "high": 96,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "阻抗法或光学法；新生儿红细胞体积大，小细胞与大细胞判定须按年龄档；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "MCH",
      "name": "平均红细胞血红蛋白含量",
      "unit": "pg",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 31,
          "high": 37,
          "note": "新生儿 MCH 偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 23,
          "high": 29,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 24,
          "high": 30,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 25,
          "high": 31,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 26,
          "high": 32,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "由 Hb 与 RBC 计算；须与 MCV、MCHC 一起判读贫血形态学分类；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "MCHC",
      "name": "平均红细胞血红蛋白浓度",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 300,
          "high": 340,
          "note": "新生儿 MCHC 偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 310,
          "high": 350,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 315,
          "high": 355,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 320,
          "high": 360,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 320,
          "high": 360,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "由 Hb 与 HCT 计算；脂血、冷凝集与球形红细胞可影响结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "RDW",
      "name": "红细胞体积分布宽度",
      "unit": "%",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 14.5,
          "high": 18.5,
          "note": "新生儿红细胞大小不均，RDW 生理性偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 12.0,
          "high": 17.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 11.5,
          "high": 15.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 11.5,
          "high": 14.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 11.5,
          "high": 14.5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "阻抗法体积分布宽度；缺铁早期即可升高，须结合 MCV 与血涂片；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "RET",
      "name": "网织红细胞百分比",
      "unit": "%",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 2.0,
          "high": 6.0,
          "note": "生后 1 周内生理性偏高，随后下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.5,
          "high": 2.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.5,
          "high": 2.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.5,
          "high": 1.8,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.5,
          "high": 1.8,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "流式核酸染色法；生后骨髓活跃，网织红细胞百分比生理性偏高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "RET_ABS",
      "name": "网织红细胞绝对计数",
      "unit": "×10⁹/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 60,
          "high": 250,
          "note": "出生时生理性偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 25,
          "high": 90,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 25,
          "high": 75,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 25,
          "high": 70,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 25,
          "high": 70,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "流式核酸染色法绝对计数；贫血时须看校正后网织红细胞计数或网织红细胞生成指数；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "MONO",
      "name": "单核细胞绝对计数",
      "unit": "×10⁹/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.2,
          "high": 1.5,
          "note": "新生儿单核细胞比例可偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.2,
          "high": 1.2,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.2,
          "high": 1.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.2,
          "high": 0.9,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.2,
          "high": 0.9,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "流式分类或镜检分类；单核细胞绝对值随年龄逐渐接近成人水平；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "EOS",
      "name": "嗜酸性粒细胞绝对计数",
      "unit": "×10⁹/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.05,
          "high": 1.0,
          "note": "新生儿可轻度升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.05,
          "high": 0.8,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.05,
          "high": 0.6,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.05,
          "high": 0.55,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.05,
          "high": 0.5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "流式分类或镜检分类；寄生虫、过敏与药物反应时升高，采血后放置过久可降低；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "BASO",
      "name": "嗜碱性粒细胞绝对计数",
      "unit": "×10⁹/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 0.15,
          "note": ""
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 0.1,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 0.1,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 0.1,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 0.1,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "流式分类或镜检分类；正常比例极低，明显升高须排查骨髓增殖性疾病；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ANC",
      "name": "中性粒细胞绝对计数ANC",
      "unit": "×10⁹/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.0,
          "high": 8.0,
          "note": "生后可短暂下降，须按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 1.0,
          "high": 8.5,
          "note": "婴儿期中性粒细胞比例低于淋巴细胞属生理现象"
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 1.5,
          "high": 8.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 1.8,
          "high": 8.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 1.8,
          "high": 7.7,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "流式分类或镜检分类；与 NEUT 为同一指标的两种写法，须统一口径后比较；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "MPV",
      "name": "平均血小板体积",
      "unit": "fL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 8.0,
          "high": 11.5,
          "note": ""
        },
        {
          "band": "婴儿(1-12月)",
          "low": 8.0,
          "high": 12.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 8.0,
          "high": 12.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 8.0,
          "high": 12.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 8.0,
          "high": 12.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "阻抗法或光学法；受血小板计数与抗凝标本放置时间影响；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "PDW",
      "name": "血小板体积分布宽度",
      "unit": "%",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 9.0,
          "high": 17.0,
          "note": ""
        },
        {
          "band": "婴儿(1-12月)",
          "low": 9.0,
          "high": 17.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 9.0,
          "high": 17.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 9.0,
          "high": 17.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 9.0,
          "high": 17.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "阻抗法体积分布宽度；不同厂商算式差异大，跨仪器不可直接比较；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 779—2021",
        "url": "https://www.nhc.gov.cn/fzs/c100048/202105/481e639c307a4effa14957f4d0d738fd.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "IL6",
      "name": "白细胞介素6",
      "unit": "pg/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 25.0,
          "note": "生后 24–48 小时内可生理性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 7.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 7.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 7.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 7.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光或电化学发光法；生后早期可生理性升高，采血与离心时间影响结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "SAA",
      "name": "血清淀粉样蛋白A",
      "unit": "mg/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 10.0,
          "note": "生后早期可轻度升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 10.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 10.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 10.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 10.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊法；感染早期即升高，须与 CRP 同时判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FERRITIN",
      "name": "铁蛋白",
      "unit": "μg/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 100,
          "high": 400,
          "note": "新生儿铁蛋白生理性偏高，生后数月下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 15,
          "high": 100,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 15,
          "high": 90,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 15,
          "high": 80,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 15,
          "high": 100,
          "note": "青春期男性参考上限高于女性"
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊或化学发光法；急性炎症时铁蛋白升高，缺铁判定须结合 CRP 与血常规；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ASO",
      "name": "抗链球菌溶血素O",
      "unit": "IU/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 50.0,
          "note": "新生儿由母体抗体携带，可有低滴度"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 100.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 150.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 200.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 200.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊法；学龄前儿童参考上限低于年长儿，单次升高须结合咽拭子与临床；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "IGM",
      "name": "免疫球蛋白M",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.05,
          "high": 0.3,
          "note": "新生儿 IgM 低，升高须警惕宫内感染"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.25,
          "high": 1.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.3,
          "high": 1.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.4,
          "high": 1.8,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.5,
          "high": 2.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊法；婴儿期 IgM 合成能力尚低，早期感染可阴性；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "IGG",
      "name": "免疫球蛋白G",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 7.0,
          "high": 14.8,
          "note": "含母体 IgG，生后逐渐分解下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.0,
          "high": 10.0,
          "note": "生理性低丙种球蛋白期，勿误判为免疫缺陷"
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 5.0,
          "high": 11.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 6.0,
          "high": 13.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 7.0,
          "high": 15.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊法；含母体 IgG，生后 3–6 月降至生理性低点，须按年龄判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "IGA",
      "name": "免疫球蛋白A",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.01,
          "high": 0.1,
          "note": "新生儿 IgA 极低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.05,
          "high": 0.6,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.2,
          "high": 1.2,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.4,
          "high": 1.8,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.6,
          "high": 2.5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊法；新生儿 IgA 极低，1 岁后逐渐升高至接近成人；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "C3",
      "name": "补体C3",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.6,
          "high": 1.3,
          "note": "新生儿补体生理性偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.7,
          "high": 1.4,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.75,
          "high": 1.45,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.8,
          "high": 1.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.8,
          "high": 1.55,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊法；新生儿补体生理性偏低，早产儿更低；消耗性降低见于感染与肾炎；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "C4",
      "name": "补体C4",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.1,
          "high": 0.3,
          "note": "新生儿补体生理性偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.1,
          "high": 0.35,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.12,
          "high": 0.36,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.12,
          "high": 0.38,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.13,
          "high": 0.4,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊法；与 C3 同时判读，二者分离性降低提示不同补体激活途径；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "PT",
      "name": "凝血酶原时间",
      "unit": "s",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 11.5,
          "high": 15.5,
          "note": "生后数日维生素 K 依赖因子低，可延长"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 10.5,
          "high": 14.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 10.5,
          "high": 13.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 10.8,
          "high": 13.8,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 11.0,
          "high": 14.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "凝固法（组织因子法）；生后数日维生素 K 依赖因子低，PT 可延长，须按日龄判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "INR",
      "name": "国际标准化比值",
      "unit": "—",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.0,
          "high": 1.4,
          "note": "新生儿可略高，须按日龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.9,
          "high": 1.2,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.9,
          "high": 1.2,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.9,
          "high": 1.2,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.9,
          "high": 1.2,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "由 PT 与试剂 ISI 计算；不同凝血活酶试剂结果不可直接互换；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "APTT",
      "name": "活化部分凝血活酶时间",
      "unit": "s",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 35,
          "high": 55,
          "note": "新生儿 APTT 生理性延长"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 28,
          "high": 42,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 26,
          "high": 40,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 26,
          "high": 40,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 26,
          "high": 40,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "凝固法；新生儿 APTT 生理性延长，不能套用成人上限；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TT",
      "name": "凝血酶时间",
      "unit": "s",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 14,
          "high": 22,
          "note": "新生儿可轻度延长"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 14,
          "high": 21,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 14,
          "high": 21,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 14,
          "high": 21,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 14,
          "high": 21,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "凝固法；受肝素与纤维蛋白原水平影响，标本肝素污染可显著延长；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FIB",
      "name": "纤维蛋白原",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.5,
          "high": 3.5,
          "note": "新生儿纤维蛋白原生理性偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 1.5,
          "high": 3.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 1.8,
          "high": 4.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 1.8,
          "high": 4.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 1.8,
          "high": 4.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "Clauss 法；新生儿纤维蛋白原偏低，DIC 时下降；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "DDIMER",
      "name": "D-二聚体",
      "unit": "mg/L FEU",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 1.5,
          "note": "生后数日可生理性升高，单位须看清 DDU/FEU"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 0.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 0.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 0.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 0.5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊法（DDU 或 FEU 单位）；生后数日可生理性升高，须按年龄调整切值；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ATIII",
      "name": "抗凝血酶活性",
      "unit": "%",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 40,
          "high": 80,
          "note": "新生儿抗凝血酶活性生理性偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 60,
          "high": 95,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 75,
          "high": 110,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 80,
          "high": 115,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 80,
          "high": 120,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "发色底物法或凝固法；新生儿抗凝血酶活性生理性偏低，早产儿更低；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FXIII",
      "name": "凝血因子XIII活性",
      "unit": "%",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 40,
          "high": 80,
          "note": "新生儿因子 XIII 活性偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 60,
          "high": 120,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 70,
          "high": 130,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 70,
          "high": 140,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 70,
          "high": 140,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "尿素溶解法或发色底物法；显著降低见于遗传性因子 XIII 缺乏；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "MG",
      "name": "镁",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.6,
          "high": 0.95,
          "note": "新生儿血镁可偏低，早产儿更明显"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.7,
          "high": 1.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.7,
          "high": 1.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.72,
          "high": 1.02,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.72,
          "high": 1.03,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "二甲苯胺蓝法或酶法；溶血影响小，须与白蛋白、钙、钾同时判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "P",
      "name": "无机磷",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.25,
          "high": 2.5,
          "note": "新生儿血磷生理性偏高，生后数日下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 1.3,
          "high": 2.25,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 1.2,
          "high": 2.1,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 1.1,
          "high": 1.9,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.9,
          "high": 1.7,
          "note": "儿童血磷高于成人，青春期降至成人水平"
        }
      ],
      "qualitative_hint": "",
      "method_note": "钼酸铵直接法或紫外法；溶血与标本放置过久可致假性升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CAI",
      "name": "游离钙",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.0,
          "high": 1.35,
          "note": "生后 24 小时内可生理性下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 1.1,
          "high": 1.3,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 1.15,
          "high": 1.32,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 1.15,
          "high": 1.32,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 1.15,
          "high": 1.33,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "离子选择电极法；须与 pH 同步校正，标本须厌氧及时送检；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CO2CP",
      "name": "总二氧化碳结合力",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 17,
          "high": 25,
          "note": "新生儿肾调节能力差，可偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 18,
          "high": 26,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 19,
          "high": 27,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 20,
          "high": 28,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 21,
          "high": 29,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "滴定法或酶法；血气 HCO3⁻ 与生化 CO2CP 方法学不同，不可直接互换；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "OSM",
      "name": "血浆渗透压",
      "unit": "mOsm/kg",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 270,
          "high": 295,
          "note": "新生儿血浆渗透压略低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 275,
          "high": 300,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 275,
          "high": 300,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 275,
          "high": 300,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 275,
          "high": 300,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "冰点渗透压仪实测；计算值与实测值差值应在 10 mOsm/kg 以内；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_NA",
      "name": "尿钠",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 10,
          "high": 120,
          "note": "随机尿钠波动大，仅解释趋势，不按单次数值比较"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 20,
          "high": 180,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 20,
          "high": 200,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 20,
          "high": 220,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 25,
          "high": 250,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "离子选择电极法（随机尿）；随机尿受饮水与饮食影响极大，须结合尿肌酐与临床解读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_OSM",
      "name": "尿渗透压",
      "unit": "mOsm/kg",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 50,
          "high": 600,
          "note": "新生儿尿液浓缩能力低，渗透压偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 100,
          "high": 800,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 200,
          "high": 900,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 300,
          "high": 1000,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 400,
          "high": 1200,
          "note": "随机尿波动大，须结合同期血渗透压"
        }
      ],
      "qualitative_hint": "",
      "method_note": "冰点渗透压仪（随机尿）；随机尿渗透压受饮水影响极大，评价浓缩功能须结合限水试验；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "PAO2",
      "name": "动脉氧分压PaO₂",
      "unit": "mmHg",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 60,
          "high": 80,
          "note": "生后数小时内 PaO₂ 逐渐上升，须按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 75,
          "high": 95,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 80,
          "high": 100,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 80,
          "high": 100,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 80,
          "high": 100,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "血气分析仪电极法；新生儿生后数小时 PaO₂ 上升，须按小时龄与吸氧浓度判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "SPO2",
      "name": "经皮血氧饱和度SpO₂",
      "unit": "%",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 90,
          "high": 97,
          "note": "生后 24 小时内正常可低至 90%，须按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 95,
          "high": 100,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 95,
          "high": 100,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 95,
          "high": 100,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 95,
          "high": 100,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "脉搏血氧仪；生后 24 小时目标饱和度与年长儿不同，须在安静、末梢温暖时测量；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "BE",
      "name": "剩余碱BE",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": -7.0,
          "high": 1.0,
          "note": "新生儿可生理性偏低，须按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": -6.0,
          "high": 2.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": -4.0,
          "high": 2.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": -3.0,
          "high": 2.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": -3.0,
          "high": 2.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "血气分析仪计算值；与 HCO3⁻、血红蛋白浓度相关，须注明标本类型；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ANION_GAP",
      "name": "阴离子间隙AG",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 10,
          "high": 18,
          "note": "新生儿蛋白低，AG 可偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 10,
          "high": 18,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 8,
          "high": 16,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 8,
          "high": 16,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 8,
          "high": 16,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "由 Na⁺−(Cl⁻+HCO3⁻) 计算；低白蛋白时须校正，含钾与不含钾算式不同；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "VEN_PCO2",
      "name": "静脉血二氧化碳分压PvCO₂",
      "unit": "mmHg",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 35,
          "high": 50,
          "note": "新生儿静脉 PCO₂ 波动大，须结合动脉血气"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 38,
          "high": 52,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 40,
          "high": 52,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 40,
          "high": 52,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 42,
          "high": 54,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "静脉血气；与动脉血 PCO₂ 差值约 4–6 mmHg，须注明标本类型；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "LAC_V",
      "name": "静脉血乳酸",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.0,
          "high": 3.0,
          "note": "生后短时间内可生理性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.6,
          "high": 2.4,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.6,
          "high": 2.2,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.6,
          "high": 2.2,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.6,
          "high": 2.4,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "静脉血乳酸（酶法或电极法）；须与动脉/毛细血管乳酸区分，止血带与送检时间影响结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "DBIL",
      "name": "直接胆红素",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 10.0,
          "note": "新生儿可直接胆红素升高，须按日龄与临床判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 3.4,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 3.4,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 3.4,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 4.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "重氮法或钒酸氧化法；新生儿直接胆红素升高须警惕胆汁淤积；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "IBIL",
      "name": "间接胆红素",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 20,
          "high": 190,
          "note": "新生儿以间接胆红素升高为主，须按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 2.0,
          "high": 13.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 2.0,
          "high": 13.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 2.0,
          "high": 13.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 2.0,
          "high": 15.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "计算值（总胆红素−直接胆红素）；方法学不同直接影响间接胆红素结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "GGT",
      "name": "γ-谷氨酰转移酶",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 20,
          "high": 200,
          "note": "新生儿 GGT 生理性偏高，生后数周下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 5,
          "high": 45,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 5,
          "high": 25,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 5,
          "high": 20,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 5,
          "high": 25,
          "note": "男性参考上限略高于女性"
        }
      ],
      "qualitative_hint": "",
      "method_note": "速率法（γ-谷氨酰对硝基苯胺）；新生儿与胆汁淤积时显著升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ALP",
      "name": "碱性磷酸酶",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 100,
          "high": 500,
          "note": "新生儿及生长突增期生理性升高（骨源性）"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 100,
          "high": 450,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 130,
          "high": 400,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 130,
          "high": 450,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 60,
          "high": 400,
          "note": "青春期生长突增期可显著升高，男女峰值不同"
        }
      ],
      "qualitative_hint": "",
      "method_note": "磷酸对硝基苯酯速率法；溶血与标本放置影响结果，须结合骨与肝胆同工酶；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TP",
      "name": "总蛋白",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 45,
          "high": 65,
          "note": "新生儿总蛋白生理性偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 50,
          "high": 70,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 55,
          "high": 75,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 60,
          "high": 80,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 62,
          "high": 82,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "双缩脲法；须与白蛋白、球蛋白同时判读，脱水可致假性升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TBA",
      "name": "总胆汁酸",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 10,
          "note": "新生儿生后可有生理性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 8,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 8,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 8,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 10,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "循环酶法；进食后升高，须空腹采血，餐后标本不宜判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "LDH",
      "name": "乳酸脱氢酶",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 300,
          "high": 800,
          "note": "新生儿 LDH 生理性偏高，生后下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 200,
          "high": 500,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 150,
          "high": 400,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 140,
          "high": 350,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 120,
          "high": 300,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "乳酸底物速率法；溶血标本显著假性升高，须同时看同工酶与血涂片；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CK",
      "name": "肌酸激酶CK",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 100,
          "high": 500,
          "note": "产程与分娩方式影响，生后可明显升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 40,
          "high": 250,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 40,
          "high": 200,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 40,
          "high": 180,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 35,
          "high": 220,
          "note": "男性参考上限高于女性"
        }
      ],
      "qualitative_hint": "",
      "method_note": "酶偶联速率法；剧烈运动、肌注与产程可升高，须结合 CK-MB 与肌钙蛋白；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CYS_C",
      "name": "胱抑素C",
      "unit": "mg/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.9,
          "high": 2.0,
          "note": "新生儿胱抑素 C 生理性偏高，生后下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.4,
          "high": 1.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.4,
          "high": 0.9,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.45,
          "high": 0.95,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.5,
          "high": 1.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊或颗粒增强免疫比浊法；不受肌肉量影响，肾功能评估优于肌酐；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "UA",
      "name": "尿酸",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 100,
          "high": 350,
          "note": "新生儿尿酸偏高，生后下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 90,
          "high": 330,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 100,
          "high": 320,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 120,
          "high": 360,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 140,
          "high": 400,
          "note": "青春期男女参考区间分开"
        }
      ],
      "qualitative_hint": "",
      "method_note": "尿酸酶-过氧化物酶法；溶血与高脂饮食影响结果，须结合肾功能与嘌呤代谢；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "EGFR",
      "name": "估算肾小球滤过率eGFR",
      "unit": "mL/min/1.73m²",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 20,
          "high": 60,
          "note": "新生儿肾小球滤过率生理性低，生后快速上升"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 40,
          "high": 90,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 70,
          "high": 120,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 80,
          "high": 130,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 85,
          "high": 135,
          "note": "12 岁后部分公式按性别系数不同"
        }
      ],
      "qualitative_hint": "",
      "method_note": "按身高与血肌酐用 Schwartz 或 CKiD 公式计算；不同公式结果差异大，须注明公式与单位；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_ACR",
      "name": "尿白蛋白/肌酐比",
      "unit": "mg/g",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 30,
          "note": "新生儿尿白蛋白排泄可偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 30,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 30,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 30,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 30,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "随机尿白蛋白/肌酐比（免疫比浊法 + 酶法肌酐）；须用晨尿，运动与发热可一过性升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "UPCR",
      "name": "尿蛋白/肌酐比",
      "unit": "mg/mg",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 0.5,
          "note": "新生儿尿蛋白排泄生理性偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 0.2,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 0.2,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 0.2,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 0.2,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "随机尿蛋白/肌酐比；mg/mg 与 mg/mmol 单位不同，换算须核对；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_RBC",
      "name": "尿红细胞",
      "unit": "个/HPF",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 5,
          "note": "新生儿可略高，须结合尿培养与临床"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 3,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 3,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 3,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 3,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "尿沉渣镜检（个/HPF）；须区分肾小球源性（变形红细胞）与非肾小球源性；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_LEU",
      "name": "尿白细胞酯酶",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "白细胞酯酶以阴性/阳性或 +~++++ 分级报告：阴性为正常；阳性提示尿路炎症但不能区分菌尿，须结合尿培养与镜检白细胞计数，仅解释含义、不按数值比较",
      "method_note": "干化学试纸或尿沉渣分析仪；与尿沉渣镜检白细胞计数不能直接换算；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_NIT",
      "name": "尿亚硝酸盐",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "亚硝酸盐以阴性/阳性报告：阳性提示存在肠杆菌科细菌，阴性不能排除感染（球菌、尿液停留时间短可假阴性），仅解释含义、不按数值比较",
      "method_note": "干化学试纸（亚硝酸盐还原法）；须用晨起第一次尿，标本停留时间过短可假阴性；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_SG",
      "name": "尿比重",
      "unit": "—",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.005,
          "high": 1.015,
          "note": "新生儿尿液浓缩能力低，比重偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 1.005,
          "high": 1.02,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 1.005,
          "high": 1.025,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 1.005,
          "high": 1.03,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 1.005,
          "high": 1.03,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "折射仪或干化学法；干化学受蛋白与葡萄糖干扰，须结合尿渗透压；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_PH",
      "name": "尿pH",
      "unit": "—",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 5.0,
          "high": 7.5,
          "note": "新生儿尿液偏酸，随喂养改变"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 5.0,
          "high": 7.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 5.0,
          "high": 7.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 5.0,
          "high": 7.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 5.0,
          "high": 8.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "干化学试纸或 pH 计；标本放置过久因细菌分解尿素而偏碱；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_GLU",
      "name": "尿葡萄糖",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "尿糖以阴性/~+/+~++++ 分级报告：阴性为正常；阳性须结合血糖与肾糖阈判断，新生儿肾糖阈低可生理性阳性，仅解释含义、不按数值比较",
      "method_note": "干化学试纸（葡萄糖氧化酶法）；受维生素 C 等还原物质干扰；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_KET",
      "name": "尿酮体",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "尿酮体以阴性/~+/+~++++ 分级报告：阴性为正常；阳性见于饥饿、呕吐、糖尿病酮症，须结合血糖与血气，仅解释含义、不按数值比较",
      "method_note": "干化学试纸（硝普盐法）；对乙酰乙酸敏感，对 β-羟丁酸不敏感；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_BLD",
      "name": "尿潜血",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "尿潜血以阴性/~+/+~++++ 分级报告：阳性提示血红蛋白、肌红蛋白或完整红细胞，须结合尿沉渣红细胞计数区分，仅解释含义、不按数值比较",
      "method_note": "干化学试纸（过氧化物酶法）；肌红蛋白与血红蛋白均可阳性；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_CAST",
      "name": "尿管型",
      "unit": "个/LPF",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 2,
          "note": "新生儿可见少量透明管型"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 1,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 1,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 1,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 1,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "尿沉渣镜检（个/LPF）；透明管型可见于正常浓缩尿，颗粒管型与红细胞管型有病理意义；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "URINE_CULT",
      "name": "尿培养",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "尿培养以无生长/有生长及菌落计数报告：无生长为正常；阳性须结合采样方式（中段尿≥10⁵ CFU/mL、导尿≥10⁴、穿刺任意量）与症状，仅解释含义、不按数值比较",
      "method_note": "定量接种法（清洁中段尿/导尿/耻骨上膀胱穿刺）；菌落计数须与采样方式匹配判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "STOOL_WBC",
      "name": "粪便白细胞",
      "unit": "个/HPF",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 2,
          "note": ""
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 2,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 2,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 2,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 2,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "粪便涂片镜检（个/HPF）；正常粪便可见少量白细胞，细菌性肠炎时增多；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "STOOL_RBC",
      "name": "粪便红细胞",
      "unit": "个/HPF",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 1,
          "note": ""
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 1,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 1,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 1,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 1,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "粪便涂片镜检；正常不应出现红细胞，出现须排查侵袭性肠炎与肛裂；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FOBT",
      "name": "粪便隐血试验",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "粪便隐血以阴性/阳性报告：阴性为正常；阳性须排除饮食与肛裂因素后复查，免疫法优于化学法，仅解释含义、不按数值比较",
      "method_note": "免疫法或化学法（愈创木脂）；化学法受动物血与维生素 C 干扰；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "STOOL_CAL",
      "name": "粪钙卫蛋白",
      "unit": "μg/g",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 500,
          "note": "新生儿及小婴儿粪钙卫蛋白生理性偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 300,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 200,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 150,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 120,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊或 ELISA；婴儿期生理性偏高，判定须按年龄与检测平台；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "STOOL_PH",
      "name": "粪便pH",
      "unit": "—",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 5.0,
          "high": 7.5,
          "note": "新生儿胎便 pH 偏酸，喂养后改变"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 5.5,
          "high": 7.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 6.0,
          "high": 7.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 6.0,
          "high": 7.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 6.0,
          "high": 7.5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "pH 计或精密试纸；母乳喂养儿偏酸，配方奶喂养偏中性；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "STOOL_RED",
      "name": "粪便还原糖",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "粪便还原糖以阴性/阳性（+~++++）报告：阴性为正常；阳性提示碳水化合物吸收不良（如乳糖不耐受），仅解释含义、不按数值比较",
      "method_note": "试纸或滴定法（粪便还原糖）；标本须新鲜，放置过久细菌分解可假阴性；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "STOOL_CULT",
      "name": "粪便培养",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "粪便培养以无致病菌生长/分离出某菌报告：无生长为正常；分离出沙门菌、志贺菌、致病性大肠埃希菌、弯曲菌等须结合临床，仅解释含义、不按数值比较",
      "method_note": "选择性培养基分离培养；不同致病菌所需培养基与温度不同；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CSF_PRO",
      "name": "脑脊液蛋白",
      "unit": "g/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.2,
          "high": 1.5,
          "note": "新生儿血脑屏障未成熟，蛋白生理性偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.15,
          "high": 0.6,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.1,
          "high": 0.4,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.1,
          "high": 0.4,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.15,
          "high": 0.45,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊或比色法；新生儿血脑屏障未成熟，蛋白生理性偏高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CSF_GLU",
      "name": "脑脊液葡萄糖",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.7,
          "high": 4.0,
          "note": "新生儿脑脊液糖偏低，须与同期血糖比较"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 2.2,
          "high": 4.4,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 2.4,
          "high": 4.4,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 2.4,
          "high": 4.4,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 2.5,
          "high": 4.4,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "己糖激酶法；须与同期血糖比较（脑脊液/血清比值约 0.6）；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CSF_RBC",
      "name": "脑脊液红细胞",
      "unit": "×10⁶/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 10,
          "note": "新生儿可略高，须与穿刺损伤区分"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "脑脊液细胞计数；穿刺损伤须用红细胞校正白细胞（约每 1000 个红细胞折 1 个白细胞）；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CSF_CL",
      "name": "脑脊液氯化物",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 110,
          "high": 125,
          "note": "新生儿脑脊液氯化物偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 115,
          "high": 130,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 118,
          "high": 132,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 118,
          "high": 132,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 120,
          "high": 132,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "离子选择电极法或比色法；须与血清氯同时判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CSF_CULT",
      "name": "脑脊液培养",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "脑脊液培养以无菌生长/阳性（菌名+药敏）报告：无菌生长为正常；阳性须结合细胞数与生化，已用抗菌药者可阴性，仅解释含义、不按数值比较",
      "method_note": "需氧+厌氧培养，必要时增菌；已用抗菌药者可阴性；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TNI",
      "name": "肌钙蛋白I",
      "unit": "ng/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 0.05,
          "note": "生后可一过性升高，须按检测平台判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 0.02,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 0.02,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 0.02,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 0.02,
          "note": "不同高敏平台切值差异大，不可跨平台比较"
        }
      ],
      "qualitative_hint": "",
      "method_note": "高敏化学发光法；须注明检测平台与 99 百分位上限，新生儿生后可一过性升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TNT",
      "name": "肌钙蛋白T",
      "unit": "ng/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 30,
          "note": "生后可一过性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 14,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 14,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 14,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 14,
          "note": "不同高敏平台切值差异大，不可跨平台比较"
        }
      ],
      "qualitative_hint": "",
      "method_note": "高敏化学发光法；须注明检测平台与 99 百分位上限；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "BNP",
      "name": "B型钠尿肽BNP",
      "unit": "pg/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 100,
          "note": "生后 24–48 小时可生理性升高，须按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 50,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 40,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 40,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 50,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；生后 24–48 小时生理性升高，须按小时龄与检测平台判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "NT_PROBNP",
      "name": "N末端脑钠肽",
      "unit": "pg/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 300,
          "note": "新生儿生后可明显升高，肾功能不全时进一步升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 150,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 100,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 100,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 125,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "电化学发光法；新生儿生后可明显升高，肾功能影响清除；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CK_MB",
      "name": "肌酸激酶MB",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 5,
          "high": 30,
          "note": "生后早期可生理性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 20,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 15,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 15,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 20,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫抑制法或质量法；生后早期可生理性升高，须结合 CK 与肌钙蛋白；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TSH",
      "name": "促甲状腺激素",
      "unit": "mIU/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.0,
          "high": 10.0,
          "note": "生后 24–48 小时生理性 TSH 升高，按小时龄判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.7,
          "high": 6.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.7,
          "high": 5.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.7,
          "high": 5.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.5,
          "high": 4.5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；生后 24–48 小时生理性 TSH 升高，采血时机影响结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FT4",
      "name": "游离甲状腺素",
      "unit": "pmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 15,
          "high": 40,
          "note": "新生儿 FT4 生理性偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 12,
          "high": 22,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 12,
          "high": 22,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 12,
          "high": 21,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 11,
          "high": 20,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；新生儿 FT4 生理性偏高，早产儿可偏低；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FT3",
      "name": "游离三碘甲状腺原氨酸",
      "unit": "pmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 4.0,
          "high": 8.0,
          "note": "新生儿 FT3 生理性偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.5,
          "high": 6.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 3.5,
          "high": 6.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 3.5,
          "high": 6.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 3.5,
          "high": 6.5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；新生儿 FT3 生理性偏高，重症时降低（低 T3 综合征）；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CORTISOL",
      "name": "皮质醇",
      "unit": "nmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 50,
          "high": 500,
          "note": "生后早期可偏高，须注明采血时点"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 80,
          "high": 550,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 100,
          "high": 550,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 130,
          "high": 550,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 150,
          "high": 600,
          "note": "青春期昼夜节律与峰值改变"
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；呈昼夜节律，采血时间与应激状态影响极大，须固定采血时点；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ACTH",
      "name": "促肾上腺皮质激素",
      "unit": "pg/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 10,
          "high": 80,
          "note": "生后早期可偏高，须注明采血时点"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 10,
          "high": 60,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 10,
          "high": 55,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 10,
          "high": 55,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 10,
          "high": 60,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；标本须冰浴并及时离心，采血时间影响结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "INSULIN",
      "name": "胰岛素",
      "unit": "μIU/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 2,
          "high": 20,
          "note": "新生儿生后胰岛素可一过性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 2,
          "high": 15,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 2,
          "high": 15,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 2,
          "high": 15,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 3,
          "high": 25,
          "note": "青春期胰岛素抵抗，参考上限升高"
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；须空腹采血，溶血影响结果，须与 C 肽同步判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "C_PEPTIDE",
      "name": "C肽",
      "unit": "ng/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.5,
          "high": 3.0,
          "note": "新生儿可一过性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.5,
          "high": 2.5,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.5,
          "high": 2.5,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.6,
          "high": 2.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.7,
          "high": 3.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；与胰岛素同步判读，肾功能不全时升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "HBA1C",
      "name": "糖化血红蛋白",
      "unit": "%",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 3.5,
          "high": 6.0,
          "note": "新生儿红细胞更新快，HbA1c 不适用于新生儿糖代谢评估"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 4.0,
          "high": 6.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 4.0,
          "high": 6.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 4.0,
          "high": 6.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 4.0,
          "high": 6.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "高效液相或免疫比浊法；新生儿红细胞寿命短，糖化血红蛋白不可靠；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "BHB",
      "name": "β-羟丁酸",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 0.5,
          "note": "新生儿生后可一过性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 0.4,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 0.4,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 0.4,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 0.5,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "酶法或电极法；饥饿与酮症时升高，须结合血糖与血气；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "VITD25",
      "name": "25羟维生素D",
      "unit": "nmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 25,
          "high": 125,
          "note": "受母体维生素 D 状态影响，判定须用缺乏/不足切点"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 50,
          "high": 150,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 50,
          "high": 150,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 50,
          "high": 150,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 50,
          "high": 150,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "液相色谱-串联质谱或化学发光法；判定用缺乏/不足切点（<30 nmol/L 为缺乏），不以区间上下限简单判定；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "PTH",
      "name": "甲状旁腺激素",
      "unit": "pg/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 10,
          "high": 70,
          "note": "新生儿生后可一过性升高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 15,
          "high": 65,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 15,
          "high": 65,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 15,
          "high": 65,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 15,
          "high": 65,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；须与血钙、血磷、维生素 D 同时判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "LH",
      "name": "黄体生成素LH",
      "unit": "IU/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.5,
          "high": 5.0,
          "note": "生后数周小青春期 LH 可升高，须按性别判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.1,
          "high": 2.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.1,
          "high": 0.8,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.1,
          "high": 1.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.3,
          "high": 8.0,
          "note": "青春期男女差异大，须按 Tanner 分期判读"
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；婴儿期小青春期与青春期波动大，须按性别与青春期分期判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FSH",
      "name": "促卵泡刺激素FSH",
      "unit": "IU/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1.0,
          "high": 10.0,
          "note": "生后数周小青春期 FSH 可升高，女婴更明显"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.5,
          "high": 5.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.3,
          "high": 3.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.5,
          "high": 5.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 1.0,
          "high": 10.0,
          "note": "青春期须按 Tanner 分期判读"
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；婴儿期小青春期与青春期波动大，须按性别与青春期分期判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "IGF1",
      "name": "胰岛素样生长因子1",
      "unit": "ng/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 20,
          "high": 120,
          "note": "受母体与胎盘因素影响"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 20,
          "high": 150,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 50,
          "high": 250,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 100,
          "high": 400,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 150,
          "high": 600,
          "note": "青春期峰值出现年龄男女不同，须按分期判读"
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；随年龄与青春期分期显著升高，须按年龄/性别/青春期分层判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "IRON",
      "name": "血清铁",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 10,
          "high": 25,
          "note": "新生儿血清铁可偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 7,
          "high": 18,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 7,
          "high": 18,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 8,
          "high": 20,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 9,
          "high": 25,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "比色法；血清铁呈昼夜波动，须晨起空腹采血；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TIBC",
      "name": "总铁结合力",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 40,
          "high": 70,
          "note": "新生儿总铁结合力偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 45,
          "high": 75,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 45,
          "high": 75,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 45,
          "high": 80,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 45,
          "high": 80,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "计算法或直接法；与血清铁、转铁蛋白饱和度同时判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TSAT",
      "name": "转铁蛋白饱和度",
      "unit": "%",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 30,
          "high": 70,
          "note": "新生儿转铁蛋白饱和度生理性偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 15,
          "high": 40,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 15,
          "high": 40,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 15,
          "high": 40,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 15,
          "high": 45,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "由血清铁/总铁结合力计算；炎症时下降，缺铁时下降；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "VB12",
      "name": "维生素B12",
      "unit": "pmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 150,
          "high": 800,
          "note": "新生儿可偏高，随喂养变化"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 150,
          "high": 700,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 150,
          "high": 700,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 150,
          "high": 700,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 150,
          "high": 700,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；须与叶酸同时判读，妊娠与饮食影响结果；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FOLATE",
      "name": "叶酸",
      "unit": "ng/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 5.0,
          "high": 25.0,
          "note": "新生儿可偏高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.0,
          "high": 20.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 3.0,
          "high": 20.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 3.0,
          "high": 20.0,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 3.0,
          "high": 20.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；血清叶酸受近期饮食影响，红细胞叶酸更稳定；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ZINC",
      "name": "血清锌",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 9.0,
          "high": 20.0,
          "note": "新生儿血锌可偏低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 9.0,
          "high": 18.0,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 9.5,
          "high": 18.0,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 10.0,
          "high": 18.5,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 10.0,
          "high": 19.0,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "原子吸收法或比色法；须避免溶血与橡胶塞污染；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "IGE",
      "name": "总IgE",
      "unit": "IU/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 10,
          "note": "脐血与新生儿 IgE 很低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 30,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 100,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 200,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 300,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光或免疫比浊法；总 IgE 随年龄升高，婴儿参考上限低；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "SPEC_IGE",
      "name": "过敏原特异性IgE",
      "unit": "kUA/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0.0,
          "high": 0.35,
          "note": "阴性阈值不随年龄改变，阳性程度不等于临床严重度"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.0,
          "high": 0.35,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.0,
          "high": 0.35,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.0,
          "high": 0.35,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.0,
          "high": 0.35,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "荧光酶免疫或免疫印迹法；以分级（0–6 级）与 kUA/L 报告，<0.35 为阴性；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ANA",
      "name": "抗核抗体ANA",
      "unit": "滴度/定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "ANA 以阴性或滴度（1:80、1:160…）+ 核型报告：阴性或低滴度（≤1:80）可见于健康儿童，阳性不等于风湿病，须结合临床与其他自身抗体，仅解释含义、不按数值大小比较",
      "method_note": "间接免疫荧光法（HEp-2 细胞）或免疫印迹法；须同时报告滴度与核型；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "RF",
      "name": "类风湿因子RF",
      "unit": "IU/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 0,
          "high": 10,
          "note": "新生儿可携带母体 RF"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0,
          "high": 10,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 10,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 15,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 20,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "免疫比浊法；儿童阳性率低，阳性须结合临床与其他自身抗体；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ANCA",
      "name": "抗中性粒细胞胞浆抗体",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "ANCA 以阴性/阳性及 c-ANCA、p-ANCA 型报告：阳性须结合临床与 PR3/MPO 抗体，不能单独诊断血管炎，仅解释含义、不按数值比较",
      "method_note": "间接免疫荧光法（乙醇固定中性粒细胞）或 PR3/MPO 抗体免疫法；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "BC_CULT",
      "name": "血培养",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "血培养以无菌生长/阳性（菌名+药敏+报阳时间）报告：无菌生长为正常；阳性须区分污染菌（如凝固酶阴性葡萄球菌）与真正血流感染，仅解释含义、不按数值比较",
      "method_note": "血培养仪（需氧+厌氧瓶）；采血量与采血时机决定阳性率；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "MP_PCR",
      "name": "肺炎支原体核酸",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "肺炎支原体核酸以阴性/阳性报告：阳性提示标本中存在核酸，不能区分定植与活动感染，须结合临床与影像，仅解释含义、不按数值比较",
      "method_note": "实时荧光 PCR（咽拭子/痰/肺泡灌洗液）；采样部位与病程影响检出率；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "MP_IGM",
      "name": "肺炎支原体IgM",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "肺炎支原体 IgM 以阴性/阳性（可含滴度）报告：婴幼儿可阴性，阳性亦可持续数月，须结合核酸与临床，仅解释含义、不按数值比较",
      "method_note": "颗粒凝集法或酶联免疫法；感染后 1 周左右出现，可维持数月；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "RSV_AG",
      "name": "呼吸道合胞病毒抗原",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "呼吸道合胞病毒抗原以阴性/阳性报告：抗原阴性不能排除（病毒载量低时），婴儿毛细支气管炎高发季节须结合临床，仅解释含义、不按数值比较",
      "method_note": "免疫荧光或胶体金法（鼻咽分泌物）；抗原敏感性低于核酸；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FLU_AG",
      "name": "流感病毒抗原",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "流感病毒抗原以阴性/阳性（甲/乙型）报告：抗原阴性不能排除流感，流行季须结合临床，仅解释含义、不按数值比较",
      "method_note": "胶体金或免疫荧光法（鼻咽拭子）；抗原敏感性明显低于核酸；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "FLU_PCR",
      "name": "流感病毒核酸",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "流感病毒核酸以阴性/阳性（型别）报告：阳性可确认感染，采样时机与部位影响检出率，仅解释含义、不按数值比较",
      "method_note": "实时荧光 PCR（鼻咽拭子/灌洗液）；可区分甲/乙型及亚型；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ADENO_PCR",
      "name": "腺病毒核酸",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "腺病毒核酸以阴性/阳性报告：阳性须结合型别与临床（咽结合膜热、重症肺炎、结膜炎），仅解释含义、不按数值比较",
      "method_note": "实时荧光 PCR（呼吸道/结膜分泌物）；不同型别临床差异大；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "ENTERO_PCR",
      "name": "肠道病毒核酸",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "肠道病毒核酸以阴性/阳性（型别）报告：阳性提示肠道病毒感染，不能直接判断轻重，须结合临床，仅解释含义、不按数值比较",
      "method_note": "实时荧光 PCR（咽拭子/粪便/脑脊液）；可含肠道病毒通用型与 EV71/CA16 分型；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TB_IGRA",
      "name": "结核感染T细胞检测IGRA",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "结核感染 T 细胞检测以阴性/阳性/不确定报告：阳性提示结核感染（不能区分潜伏与活动），免疫抑制与低龄可假阴性，仅解释含义、不按数值比较",
      "method_note": "γ-干扰素释放试验（ELISPOT 或全血 ELISA）；不受卡介苗影响；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TB_PCR",
      "name": "结核分枝杆菌核酸",
      "unit": "定性",
      "interpretation_type": "qualitative",
      "ranges": [],
      "qualitative_hint": "结核分枝杆菌核酸以阴性/阳性报告：阳性提示标本中存在结核分枝杆菌复合群核酸，阴性不能排除结核，仅解释含义、不按数值比较",
      "method_note": "实时荧光 PCR 或 GeneXpert（痰/胃液/脑脊液/淋巴结）；不同标本灵敏度差异大；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "TSB_NEONATE",
      "name": "新生儿总胆红素",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 24,
          "high": 200,
          "note": "严禁按固定数值一刀切，须按小时龄曲线与高危因素判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.4,
          "high": 17.1,
          "note": "非本项适用年龄，此处仅列儿童总胆红素对照"
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 3.4,
          "high": 17.1,
          "note": "非本项适用年龄，此处仅列儿童总胆红素对照"
        },
        {
          "band": "学龄(6-12岁)",
          "low": 3.4,
          "high": 17.1,
          "note": "非本项适用年龄，此处仅列儿童总胆红素对照"
        },
        {
          "band": "青春期(12-18岁)",
          "low": 3.4,
          "high": 20.0,
          "note": "非本项适用年龄，此处仅列儿童总胆红素对照"
        }
      ],
      "qualitative_hint": "",
      "method_note": "重氮法或干化学法；须按出生小时龄（Bhutani 列线图）与胎龄、危险因素判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "DBS_TSH",
      "name": "新生儿筛查TSH",
      "unit": "mIU/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1,
          "high": 15,
          "note": "筛查切值约 15–20 mIU/L，生后 72 小时至 7 天采血"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 0.7,
          "high": 6.0,
          "note": "非筛查标本，此处仅列血清 TSH 对照区间"
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0.7,
          "high": 5.5,
          "note": "非筛查标本，此处仅列血清 TSH 对照区间"
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0.7,
          "high": 5.0,
          "note": "非筛查标本，此处仅列血清 TSH 对照区间"
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0.5,
          "high": 4.5,
          "note": "非筛查标本，此处仅列血清 TSH 对照区间"
        }
      ],
      "qualitative_hint": "",
      "method_note": "时间分辨荧光或酶免疫法（足跟血滤纸片）；为新生儿筛查切值，阳性须复采静脉血确认；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "DBS_PHE",
      "name": "新生儿筛查苯丙氨酸",
      "unit": "μmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 20,
          "high": 120,
          "note": "筛查切值约 120 μmol/L，超过须复采复查"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 35,
          "high": 90,
          "note": "非筛查标本，此处仅列血浆苯丙氨酸对照区间"
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 35,
          "high": 90,
          "note": "非筛查标本，此处仅列血浆苯丙氨酸对照区间"
        },
        {
          "band": "学龄(6-12岁)",
          "low": 35,
          "high": 90,
          "note": "非筛查标本，此处仅列血浆苯丙氨酸对照区间"
        },
        {
          "band": "青春期(12-18岁)",
          "low": 35,
          "high": 90,
          "note": "非筛查标本，此处仅列血浆苯丙氨酸对照区间"
        }
      ],
      "qualitative_hint": "",
      "method_note": "细菌抑制法或串联质谱（足跟血滤纸片）；筛查切值约 120 μmol/L，阳性须复查并做定量；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "NEO_GLU",
      "name": "新生儿血糖",
      "unit": "mmol/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 2.2,
          "high": 6.0,
          "note": "生后 4 小时内可生理性下降，低于 2.2 mmol/L 须处理"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 3.3,
          "high": 5.5,
          "note": "非新生儿标本，此处仅列儿童血糖对照区间"
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 3.3,
          "high": 5.5,
          "note": "非新生儿标本，此处仅列儿童血糖对照区间"
        },
        {
          "band": "学龄(6-12岁)",
          "low": 3.5,
          "high": 5.6,
          "note": "非新生儿标本，此处仅列儿童血糖对照区间"
        },
        {
          "band": "青春期(12-18岁)",
          "low": 3.6,
          "high": 5.8,
          "note": "非新生儿标本，此处仅列儿童血糖对照区间"
        }
      ],
      "qualitative_hint": "",
      "method_note": "葡萄糖氧化酶或己糖激酶法（静脉血或足跟血）；低血糖阈值按日龄与高危因素判定；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "CORD_PH",
      "name": "脐动脉血气pH",
      "unit": "—",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 7.1,
          "high": 7.4,
          "note": "脐动脉血 pH<7.00 提示重度酸中毒风险，须结合临床"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 7.35,
          "high": 7.45,
          "note": "非脐血标本，此处仅列儿童动脉血气对照"
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 7.35,
          "high": 7.45,
          "note": "非脐血标本，此处仅列儿童动脉血气对照"
        },
        {
          "band": "学龄(6-12岁)",
          "low": 7.35,
          "high": 7.45,
          "note": "非脐血标本，此处仅列儿童动脉血气对照"
        },
        {
          "band": "青春期(12-18岁)",
          "low": 7.35,
          "high": 7.45,
          "note": "非脐血标本，此处仅列儿童动脉血气对照"
        }
      ],
      "qualitative_hint": "",
      "method_note": "血气分析仪（脐动脉血）；采段与采血时间影响结果，须与 Apgar 评分、乳酸同时判读；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "AMYLASE",
      "name": "淀粉酶",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 10,
          "high": 90,
          "note": "新生儿淀粉酶活性低，1 岁内参考意义有限"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 20,
          "high": 110,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 25,
          "high": 115,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 25,
          "high": 120,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 25,
          "high": 125,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "酶法（对硝基苯麦芽七糖底物）；儿童参考区间低于成人，腮腺炎与胰腺炎时升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "LIPASE",
      "name": "脂肪酶",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 5,
          "high": 60,
          "note": "新生儿脂肪酶活性低"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 5,
          "high": 60,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 7,
          "high": 65,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 7,
          "high": 65,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 8,
          "high": 70,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "酶法（比色或浊度）；较淀粉酶特异，儿童参考上限低于成人；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "WS/T 780—2021",
        "url": "https://www.nhc.gov.cn/wjw/s9492/202105/3d5159ef7619452b9842ea9520189a11.shtml"
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "AFP",
      "name": "甲胎蛋白AFP",
      "unit": "ng/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 1000,
          "high": 50000,
          "note": "新生儿 AFP 生理性显著升高，生后逐渐下降"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 10,
          "high": 100,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 0,
          "high": 20,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 0,
          "high": 12,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 0,
          "high": 10,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "化学发光法；新生儿及婴儿生理性升高，1 岁内须按年龄判读，不能套用成人上限；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "LDH_CSF",
      "name": "脑脊液乳酸脱氢酶",
      "unit": "U/L",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 10,
          "high": 60,
          "note": "新生儿脑脊液 LDH 可略高"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 10,
          "high": 40,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 10,
          "high": 30,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 10,
          "high": 30,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 10,
          "high": 30,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "酶法；须与血清 LDH 同时判读，血性脑脊液可假性升高；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    },
    {
      "code": "D25",
      "name": "25羟维生素D（另写法）",
      "unit": "ng/mL",
      "interpretation_type": "numeric",
      "ranges": [
        {
          "band": "新生儿(0-28天)",
          "low": 10,
          "high": 50,
          "note": "与 VITD25 为同一指标不同单位，勿重复判读"
        },
        {
          "band": "婴儿(1-12月)",
          "low": 20,
          "high": 60,
          "note": ""
        },
        {
          "band": "幼儿(1-6岁)",
          "low": 20,
          "high": 60,
          "note": ""
        },
        {
          "band": "学龄(6-12岁)",
          "low": 20,
          "high": 60,
          "note": ""
        },
        {
          "band": "青春期(12-18岁)",
          "low": 20,
          "high": 60,
          "note": ""
        }
      ],
      "qualitative_hint": "",
      "method_note": "液相色谱-串联质谱或化学发光法；本项单位为 ng/mL（1 ng/mL≈2.5 nmol/L），与 VITD25 为同一指标不同单位；须以本院报告单同方法同年龄参考区间为准。",
      "source": {
        "name": "教学区间（WS/T 779/780—2021 未覆盖本项目，待核对原始文献）",
        "url": ""
      },
      "verified": false,
      "status": "教学区间，须以报告单参考区间为准"
    }
  ]
};

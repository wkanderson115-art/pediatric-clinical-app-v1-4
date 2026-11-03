window.__DATA__=window.__DATA__||{};
window.__DATA__["dose_rules.json"]={
  "version": "1.0",
  "updated": "2026-10-30",
  "edition": "儿科药典结构化教学剂量规则 V1.6",
  "policy": {
    "scope": "仅用于教学演示“体重×区间”的数学换算与上限提示",
    "not_a_prescription": true,
    "extraction": "数值来自各条目 dose_note 的原文区间，未新增数值",
    "verification": "全部规则 verified=false，须核对本院制剂说明书与最新指南"
  },
  "counts": {
    "drugs": 110,
    "with_rules": 79,
    "without_rules": 31
  },
  "items": [
    {
      "drug_id": "amoxicillin",
      "generic_name": "阿莫西林",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 20.0,
          "high": 40.0,
          "unit": "mg",
          "times_per_day": [
            2,
            3
          ],
          "max_single": 1000.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "20–40 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "amoxicillin_clavulanate",
      "generic_name": "阿莫西林克拉维酸",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 25.0,
          "high": 45.0,
          "unit": "mg",
          "times_per_day": [
            2,
            3
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "25–45 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ampicillin",
      "generic_name": "氨苄西林",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 50.0,
          "high": 100.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "50–100 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "penicillin_g",
      "generic_name": "青霉素G",
      "rules": [
        {
          "route": "静脉",
          "basis": "日",
          "low": 25000.0,
          "high": 50000.0,
          "unit": "U",
          "times_per_day": [
            2,
            4
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "2.5 万–5 万 U/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "cefalexin",
      "generic_name": "头孢氨苄",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 25.0,
          "high": 50.0,
          "unit": "mg",
          "times_per_day": [
            3,
            4
          ],
          "max_single": 4000.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "25–50 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "日总量一般不超过 4 g",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "cefaclor",
      "generic_name": "头孢克洛",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 20.0,
          "high": 40.0,
          "unit": "mg",
          "times_per_day": [
            2,
            3
          ],
          "max_single": 1000.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "20–40 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "单日总量一般不超过 1 g",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "cefuroxime",
      "generic_name": "头孢呋辛",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 20.0,
          "high": 30.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "20–30 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ceftriaxone",
      "generic_name": "头孢曲松",
      "rules": [
        {
          "route": "静脉",
          "basis": "日",
          "low": 50.0,
          "high": 80.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "50–80 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "cefotaxime",
      "generic_name": "头孢噻肟",
      "rules": [
        {
          "route": "静脉",
          "basis": "日",
          "low": 50.0,
          "high": 100.0,
          "unit": "mg",
          "times_per_day": [
            2,
            4
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "50–100 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ceftazidime",
      "generic_name": "头孢他啶",
      "rules": [
        {
          "route": "静脉",
          "basis": "日",
          "low": 100.0,
          "high": 150.0,
          "unit": "mg",
          "times_per_day": [
            3
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "100–150 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "azithromycin",
      "generic_name": "阿奇霉素",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 5.0,
          "high": 10.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "5–10 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "clarithromycin",
      "generic_name": "克拉霉素",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 15.0,
          "high": 15.0,
          "unit": "mg",
          "times_per_day": [
            2
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "15 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "erythromycin",
      "generic_name": "红霉素",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 30.0,
          "high": 50.0,
          "unit": "mg",
          "times_per_day": [
            3,
            4
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "30–50 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "clindamycin",
      "generic_name": "克林霉素",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 20.0,
          "high": 40.0,
          "unit": "mg",
          "times_per_day": [
            3,
            4
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "20–40 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "vancomycin",
      "generic_name": "万古霉素",
      "rules": [
        {
          "route": "静脉",
          "basis": "日",
          "low": 40.0,
          "high": 60.0,
          "unit": "mg",
          "times_per_day": [
            3,
            4
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "40–60 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "meropenem",
      "generic_name": "美罗培南",
      "rules": [
        {
          "route": "静脉",
          "basis": "日",
          "low": 60.0,
          "high": 60.0,
          "unit": "mg",
          "times_per_day": [
            3
          ],
          "max_single": 2000.0,
          "max_single_unit": "mg",
          "single_value": true,
          "age_note": "",
          "source_text": "60 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "piperacillin_tazobactam",
      "generic_name": "哌拉西林他唑巴坦",
      "rules": [
        {
          "route": "静脉",
          "basis": "日",
          "low": 270.0,
          "high": 400.0,
          "unit": "mg",
          "times_per_day": [
            3,
            4
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "270–400 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "metronidazole",
      "generic_name": "甲硝唑",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 20.0,
          "high": 30.0,
          "unit": "mg",
          "times_per_day": [
            3
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "20–30 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "cotrimoxazole",
      "generic_name": "复方磺胺甲噁唑",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 6.0,
          "high": 10.0,
          "unit": "mg",
          "times_per_day": [
            2
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "6–10 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "oseltamivir",
      "generic_name": "奥司他韦",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 2.0,
          "high": 2.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "2 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ganciclovir",
      "generic_name": "更昔洛韦",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 5.0,
          "high": 5.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "5 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "fluconazole",
      "generic_name": "氟康唑",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 3.0,
          "high": 12.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "3–12 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "paracetamol",
      "generic_name": "对乙酰氨基酚",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 10.0,
          "high": 15.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": 60.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "10–15 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "日总量一般不超过 60 mg",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ibuprofen",
      "generic_name": "布洛芬",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 5.0,
          "high": 10.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": 40.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "5–10 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "日总量一般不超过 40 mg",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "aspirin",
      "generic_name": "阿司匹林",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "diclofenac",
      "generic_name": "双氯芬酸",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 1.0,
          "high": 3.0,
          "unit": "mg",
          "times_per_day": [
            2,
            3
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "1–3 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "naproxen",
      "generic_name": "萘普生",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 10.0,
          "high": 10.0,
          "unit": "mg",
          "times_per_day": [
            2
          ],
          "max_single": 1000.0,
          "max_single_unit": "mg",
          "single_value": true,
          "age_note": "",
          "source_text": "10 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "日总量一般不超过 1 g",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "indomethacin",
      "generic_name": "吲哚美辛",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "salbutamol",
      "generic_name": "沙丁胺醇",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 0.15,
          "high": 0.15,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "0.15 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "budesonide",
      "generic_name": "布地奈德",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "montelukast",
      "generic_name": "孟鲁司特",
      "rules": [],
      "fixed_age_dose_text": "5 mg，每日 1",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ipratropium",
      "generic_name": "异丙托溴铵",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "epinephrine",
      "generic_name": "肾上腺素",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 0.01,
          "high": 0.01,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "0.01 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "loratadine",
      "generic_name": "氯雷他定",
      "rules": [],
      "fixed_age_dose_text": "10mg，每日 1",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "cetirizine",
      "generic_name": "西替利嗪",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.25,
          "high": 0.25,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "0.25 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ambroxol",
      "generic_name": "氨溴索",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 1.2,
          "high": 1.6,
          "unit": "mg",
          "times_per_day": [
            2,
            3
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "1.2–1.6 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "montmorillonite",
      "generic_name": "蒙脱石",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ors_iii",
      "generic_name": "口服补液盐III",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "saccharomyces_boulardii",
      "generic_name": "布拉氏酵母菌",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "omeprazole",
      "generic_name": "奥美拉唑",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.7,
          "high": 1.4,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.7–1.4 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "simethicone",
      "generic_name": "西甲硅油",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "lactulose",
      "generic_name": "乳果糖",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 1.0,
          "high": 3.0,
          "unit": "ml",
          "times_per_day": [
            1,
            2
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "1–3 ml/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "racecadotril",
      "generic_name": "消旋卡多曲",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 1.5,
          "high": 1.5,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "1.5 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "domperidone",
      "generic_name": "多潘立酮",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.25,
          "high": 0.25,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "0.25 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "sodium_chloride_09",
      "generic_name": "0.9%氯化钠注射液",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 10.0,
          "high": 20.0,
          "unit": "ml",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "10–20 ml/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "glucose_injection",
      "generic_name": "5%葡萄糖注射液",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 2.0,
          "high": 2.0,
          "unit": "ml",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "2 ml/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "potassium_chloride",
      "generic_name": "氯化钾",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "sodium_bicarbonate",
      "generic_name": "碳酸氢钠",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "calcium_gluconate",
      "generic_name": "葡萄糖酸钙",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 0.5,
          "high": 1.0,
          "unit": "ml",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.5–1 ml/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "diazepam",
      "generic_name": "地西泮",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 0.2,
          "high": 0.5,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.2–0.5 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "midazolam",
      "generic_name": "咪达唑仑",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 0.1,
          "high": 0.2,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.1–0.2 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "phenobarbital",
      "generic_name": "苯巴比妥",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 15.0,
          "high": 20.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "15–20 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "levetiracetam",
      "generic_name": "左乙拉西坦",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 10.0,
          "high": 20.0,
          "unit": "mg",
          "times_per_day": [
            2
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "10–20 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "mannitol",
      "generic_name": "甘露醇",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 0.25,
          "high": 1.0,
          "unit": "g",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.25–1 g/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "dopamine",
      "generic_name": "多巴胺",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 2.0,
          "high": 20.0,
          "unit": "μg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "2–20 μg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "captopril",
      "generic_name": "卡托普利",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.3,
          "high": 0.5,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.3–0.5 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "propranolol",
      "generic_name": "普萘洛尔",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.5,
          "high": 3.0,
          "unit": "mg",
          "times_per_day": [
            2,
            3
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.5–3 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "alprostadil",
      "generic_name": "前列地尔",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 0.01,
          "high": 0.05,
          "unit": "μg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.01–0.05 μg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "insulin",
      "generic_name": "胰岛素",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 0.05,
          "high": 0.1,
          "unit": "u",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.05–0.1 U/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "levothyroxine",
      "generic_name": "左甲状腺素",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 10.0,
          "high": 15.0,
          "unit": "μg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "10–15 μg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "hydrocortisone",
      "generic_name": "氢化可的松",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "methylprednisolone",
      "generic_name": "甲泼尼龙",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 1.0,
          "high": 2.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "1–2 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "dexamethasone",
      "generic_name": "地塞米松",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 0.15,
          "high": 0.6,
          "unit": "mg",
          "times_per_day": [],
          "max_single": 10.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "0.15–0.6 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "oral_iron",
      "generic_name": "口服铁剂",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 3.0,
          "high": 6.0,
          "unit": "mg",
          "times_per_day": [
            1,
            2
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "3–6 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "folic_acid",
      "generic_name": "叶酸",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "vitamin_k1",
      "generic_name": "维生素K1",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "vitamin_d",
      "generic_name": "维生素D",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "vitamin_c",
      "generic_name": "维生素C",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "mupirocin",
      "generic_name": "莫匹罗星",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "hydrocortisone_cream",
      "generic_name": "氢化可的松乳膏",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "calamine",
      "generic_name": "炉甘石洗剂",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "urea_cream",
      "generic_name": "尿素乳膏",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "caffeine_citrate",
      "generic_name": "咖啡因枸橼酸盐",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 5.0,
          "high": 10.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "5–10 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "surfactant",
      "generic_name": "肺表面活性物质",
      "rules": [
        {
          "route": "未标注（须核对说明书）",
          "basis": "次",
          "low": 100.0,
          "high": 200.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "100–200 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "gentamicin",
      "generic_name": "庆大霉素",
      "rules": [
        {
          "route": "静脉",
          "basis": "日",
          "low": 4.0,
          "high": 5.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "4–5 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "naloxone",
      "generic_name": "纳洛酮",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 0.01,
          "high": 0.1,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.01–0.1 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "activated_charcoal",
      "generic_name": "活性炭",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 1.0,
          "high": 1.0,
          "unit": "g",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "1 g/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "flumazenil",
      "generic_name": "氟马西尼",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 0.01,
          "high": 0.01,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "0.01 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "valproate",
      "generic_name": "丙戊酸钠",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 10.0,
          "high": 15.0,
          "unit": "mg",
          "times_per_day": [
            1,
            2
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "10–15 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "oxcarbazepine",
      "generic_name": "奥卡西平",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 8.0,
          "high": 10.0,
          "unit": "mg",
          "times_per_day": [
            2
          ],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "8–10 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "lamotrigine",
      "generic_name": "拉莫三嗪",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.3,
          "high": 0.6,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.3–0.6 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "topiramate",
      "generic_name": "托吡酯",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 1.0,
          "high": 3.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "1–3 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "aciclovir",
      "generic_name": "阿昔洛韦",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 5.0,
          "high": 10.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "5–10 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "valaciclovir",
      "generic_name": "伐昔洛韦",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 20.0,
          "high": 30.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "20–30 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "voriconazole",
      "generic_name": "伏立康唑",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 6.0,
          "high": 6.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "6 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "caspofungin",
      "generic_name": "卡泊芬净",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "单日不超过 70 mg",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ondansetron",
      "generic_name": "昂丹司琼",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 0.1,
          "high": 0.15,
          "unit": "mg",
          "times_per_day": [],
          "max_single": 4.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "0.1–0.15 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "metoclopramide",
      "generic_name": "甲氧氯普胺",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.1,
          "high": 0.15,
          "unit": "mg",
          "times_per_day": [],
          "max_single": 0.5,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "0.1–0.15 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "macrogol_4000",
      "generic_name": "聚乙二醇4000",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.4,
          "high": 0.8,
          "unit": "g",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "文中提及年龄条件：2 岁以上",
          "source_text": "0.4–0.8 g/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "bifidobacterium_triple",
      "generic_name": "双歧杆菌三联活菌",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "levofloxacin_eye_drops",
      "generic_name": "左氧氟沙星滴眼液",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "tobramycin_eye_drops",
      "generic_name": "妥布霉素滴眼液",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "mometasone_nasal",
      "generic_name": "糠酸莫米松鼻喷雾剂",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "sodium_bicarbonate_ear_drops",
      "generic_name": "碳酸氢钠滴耳液",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "methylphenidate",
      "generic_name": "哌甲酯",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.3,
          "high": 1.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.3–1 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "atomoxetine",
      "generic_name": "托莫西汀",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.5,
          "high": 0.5,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "0.5 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "sertraline",
      "generic_name": "舍曲林",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "melatonin",
      "generic_name": "褪黑素",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "ivig",
      "generic_name": "静脉注射用人免疫球蛋白",
      "rules": [
        {
          "route": "静脉",
          "basis": "日",
          "low": 0.8,
          "high": 1.0,
          "unit": "g",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.8–1 g/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "omalizumab",
      "generic_name": "奥马珠单抗",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "rhgh",
      "generic_name": "重组人生长激素",
      "rules": [
        {
          "route": "未标注（须核对说明书）",
          "basis": "日",
          "low": 0.025,
          "high": 0.05,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.025–0.05 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "interferon_alfa_2b",
      "generic_name": "干扰素α-2b",
      "rules": [],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "acetylcysteine",
      "generic_name": "乙酰半胱氨酸",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 150.0,
          "high": 150.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": true,
          "age_note": "",
          "source_text": "150 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "sodium_dmps",
      "generic_name": "二巯丙磺钠",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 2.5,
          "high": 5.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "2.5–5 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "methylene_blue",
      "generic_name": "亚甲蓝",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 1.0,
          "high": 2.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "1–2 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "pralidoxime_chloride",
      "generic_name": "氯解磷定",
      "rules": [
        {
          "route": "静脉",
          "basis": "次",
          "low": 15.0,
          "high": 30.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": 1000.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "15–30 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "aminophylline",
      "generic_name": "氨茶碱",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 3.0,
          "high": 5.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "3–5 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "chloral_hydrate",
      "generic_name": "水合氯醛",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 25.0,
          "high": 50.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": 1000.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "25–50 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "sildenafil",
      "generic_name": "西地那非",
      "rules": [
        {
          "route": "口服",
          "basis": "日",
          "low": 0.5,
          "high": 1.0,
          "unit": "mg",
          "times_per_day": [],
          "max_single": null,
          "max_single_unit": null,
          "single_value": false,
          "age_note": "",
          "source_text": "0.5–1 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    },
    {
      "drug_id": "dextromethorphan",
      "generic_name": "右美沙芬",
      "rules": [
        {
          "route": "口服",
          "basis": "次",
          "low": 0.3,
          "high": 0.5,
          "unit": "mg",
          "times_per_day": [],
          "max_single": 15.0,
          "max_single_unit": "mg",
          "single_value": false,
          "age_note": "",
          "source_text": "0.3–0.5 mg/kg",
          "verified": false
        }
      ],
      "fixed_age_dose_text": "",
      "max_daily_text": "",
      "basis": "由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示",
      "status": "教学区间待核对",
      "verified": false,
      "review_status": "编辑性抽取，未经药事/临床专家审核；不能作为处方依据"
    }
  ]
};

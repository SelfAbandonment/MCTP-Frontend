---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_0dab2547d4a911f1a0da525400393706
    ReservedCode1: FiHSR+DmFeFbkq0otETfWvRA/1oL4HOH5u6Rcj5PwnetsJ0zq48nGjaIstSKCIIr4v4pUZCrcKQLxLOB8r4AVNqdFDiAhSEUxFgQjaRml9adr3BAfC4X/oO3wSpupKdrKpEX2RiqSKYNu88s84WH37GPvUm1plYVGnwrNByemTxim5w1HatAVDHMWc4=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_0dab2547d4a911f1a0da525400393706
    ReservedCode2: FiHSR+DmFeFbkq0otETfWvRA/1oL4HOH5u6Rcj5PwnetsJ0zq48nGjaIstSKCIIr4v4pUZCrcKQLxLOB8r4AVNqdFDiAhSEUxFgQjaRml9adr3BAfC4X/oO3wSpupKdrKpEX2RiqSKYNu88s84WH37GPvUm1plYVGnwrNByemTxim5w1HatAVDHMWc4=
---

# StaffSection.vue 说明

## 文件路径
`src/preview/components/StaffSection.vue`

## 文件用途
功能 H——管理组成员（STAFF）展示组件：以卡片式列表展示管理组成员（称号 / ID / 职责），模拟数据可自定义。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `staffs` 数组 | 管理组成员数据（称号 / 名字 / 职责），4 名成员两列网格展示；`v-reveal` 错峰入场、`v-tilt="8"` 鼠标 3D 倾斜。 |
| `.preview-staff__title` | 称号铜黄实底小标签，突出角色身份。 |
| `.preview-staff__name` | 成员 ID，主文字强调。 |
| `.preview-staff__duty` | 职责描述，次要文字。 |
| `.preview-staff__note` | TODO-CONTENT 提示，成员名单待服主替换。 |

## TODO 备注清单
- `TODO-CONTENT: 管理组成员为模拟数据，待服主替换为真实名单与职责（组件数据区 staffs）`


---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 51c49d6df962a9d4b21f188913b061a5_0768dfdbd4a911f1a0da525400393706
    ReservedCode1: yPFo0+jDUFcPQpuMDdd0EwBp1ZPepucSYzduVNITkJKTPQpLbNoPMm5YW4MRrqsuPJWyn05AkBYPepWXaERwXOn3Coe5eLrU5qOY3+VnVmqFWhohhNiySZDkjH8vJwlOsrz4bYYwshajhCJzNBMDGNgYP43BD1TWA4JxSJpkH3QcsvN13dLhpq6C854=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 51c49d6df962a9d4b21f188913b061a5_0768dfdbd4a911f1a0da525400393706
    ReservedCode2: yPFo0+jDUFcPQpuMDdd0EwBp1ZPepucSYzduVNITkJKTPQpLbNoPMm5YW4MRrqsuPJWyn05AkBYPepWXaERwXOn3Coe5eLrU5qOY3+VnVmqFWhohhNiySZDkjH8vJwlOsrz4bYYwshajhCJzNBMDGNgYP43BD1TWA4JxSJpkH3QcsvN13dLhpq6C854=
---

# DownloadSection.vue 说明

## 文件路径
`src/preview/components/DownloadSection.vue`

## 文件用途
下载区组件：提供 Java 版 / 基岩版 / 整合包三个客户端下载入口，「当前推荐版本」高亮显示，链接为 `#` 占位。

## 主要代码说明

| 代码 | 为什么写 / 作用是什么 |
| --- | --- |
| `downloads` 数组 | 下载项数据（版本类型 / 说明 / 占位链接 / `recommended` 是否推荐）。 |
| `v-for` + `v-tilt="6"` | 三列网格（窄屏 1 列）卡片链接，带鼠标 3D 倾斜。 |
| `.is-recommended` | 推荐版本高亮：铜黄描边 + 铜黄底 + 发光，服主定版后一眼可见主推入口。 |
| `.preview-download__badge` | 推荐版本右上角角标。 |
| `:href="d.href"` | 当前均为 `#` 占位，确定下载源后替换即可。 |

## TODO 备注清单
- `TODO-BACKEND: 三个下载地址均待补（Java 版 / 基岩版 / 整合包），当前 href 为空字符串（点击被拦截，不会跳回首页）`
- `TODO-CONTENT: recommended 由服主定版后调整`


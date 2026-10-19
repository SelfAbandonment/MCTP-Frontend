"""Subset Smiley Sans to the characters used by the MCTP frontend.

Scans src/ (and a small safety alphabet) and writes a woff2 file.
Usage: python scripts/subset-font.py
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
OUT = SRC / "assets" / "fonts" / "smiley-sans.woff2"
SOURCE = Path(r"D:\code\MCTP\_fonts\smiley\SmileySans-Oblique.ttf")

SAFETY = (
    "一起生活创造方块之间自有天地世界玩家社区公告入服指北中心登录注册管理"
    "原野工坊远行夜色生存探索活动更多即将开放欢迎回来开始你的下一段故事"
    "从这我们的是由记住继续生长加入阅读档案查看了解进入回到首页非官方"
    "网站免责声明版权邮箱密码账号公告活动通知没有内容暂无数据加载失败重试"
    "错误成功保存删除编辑取消确认新建草稿发布定时停用恢复搜索分页上一页下"
    "一页共条记录退出个人资料修改绑定解绑微软正版昵称头像状态角色权限管理"
    "员普通用户你好谢谢请稍候正在进入世界等待加载完成连接服务器网络接口地址"
    "检查提交发送填写选择性别生日时间日期年月日星期一二三四五六七八九十百"
    "千万零两多少大小高低新旧前后左右上下东西南北中北京上海中国玩家我的你"
    "他她它们和与及或但但是如果因为所以可以需要应该不会不能没有全部所有每"
    "个一些这些那些这里那里什么怎么如何为什么因为所以然后已经还是就是只是"
    "非常特别真的很好棒极了美好快乐开心喜欢爱想说要会做看听说读写走跑来去"
    "到达开始结束停止继续再次重新第一次下一次现在过去未来今天明天昨天时间"
    "地方世界国家城市村庄自然山水天空大地海洋森林草原沙漠雪山河流湖泊花"
    "草树木石头金属建筑房屋道路桥梁铁轨列车风车岛屿营地火堆帐篷夜晚星空"
    "月亮太阳云朵雨雪风雷光电火水木土石金砂泥土草叶花果种子动物怪物怪物"
    "龙猫狗鸟鱼虫人朋友伙伴团队队伍家族公会联盟服务器地址端口网络连接"
    "0123456789"
    "·—…“”‘’《》〈〉【】（）！？：；，。、／＼｜＋－＝×÷↗→←↑↓✦◆●○■□"
)

def collect() -> str:
    chars = set(SAFETY)
    for path in SRC.rglob("*"):
        if path.is_file() and path.suffix in {".vue", ".js", ".css", ".md", ".html"}:
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            chars.update(text)
    return "".join(sorted(chars))

def main() -> int:
    if not SOURCE.exists():
        print(f"missing source font: {SOURCE}", file=sys.stderr)
        return 1
    text = collect()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    chars_file = ROOT / "scripts" / ".font-chars.txt"
    chars_file.write_text(text, encoding="utf-8")
    from fontTools import subset

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    options.recalc_bounds = True
    options.desubroutinize = True
    font = subset.load_font(str(SOURCE), options)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    subset.save_font(font, str(OUT), options)
    size = OUT.stat().st_size
    print(f"wrote {OUT} ({size / 1024:.1f} KB, {len(text)} chars)")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

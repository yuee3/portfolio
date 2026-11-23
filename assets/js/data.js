/* ==========================================================================
   data.js — 作品数据（文案在 HTML 中，这里只放需要循环渲染的作品列表）
   修改视频标题 / 简介：直接编辑 VIDEOS 数组即可，无需构建。
   ========================================================================== */

/* 首页「精选摄影」：slug 对应 assets/js/photos.js 中的条目
   span: tall(3:4) / wide(16:10) / sq(1:1) / half(4:3) / pano(21:9) */
window.SELECTED = [
  { slug: "portrait-06", span: "tall" },      // 武昌江滩
  { slug: "portrait-10", span: "tall" },      // 浙江舟山
  { slug: "portrait-11", span: "tall" },      // 重庆下浩里
  { slug: "landscape-07", span: "wide" },     // 故宫全景
  { slug: "food-01", span: "sq" },            // 三角构图
  { slug: "still-06", span: "sq" },           // 威士忌 · 落叶
  { slug: "landscape-11", span: "sq" },       // 老家河岸
  { slug: "portrait-12", span: "sq" },        // 重庆仙女山
  { slug: "portrait-05", span: "half" },      // 杭州灵隐寺
  { slug: "portrait-04", span: "half" }       // 云南大理
];

window.VIDEOS = [
  {
    id: "aifilm-jiangnan",
    src: "assets/video/aifilm-jiangnan.mp4",
    title: "江南丝染 · 阿绣的匠心",
    en: "Silk Dyeing of Jiangnan",
    tag: "AI 微电影",
    year: "2026.06",
    dur: "04′55″",
    team: "李文越 · 龚姝悦 · 贾鑫悦",
    role: "制作 / 统筹",
    note: "AIGC 国风微短剧。以大唐开元年间为背景，讲述杭州丝绸世家少女阿绣临危受命，守护祖传「练染印整」技艺、洗刷家族冤屈的故事。用微短剧的形式降低非遗的观看门槛。",
    work: "负责项目策划、资源协调与整体进度把控，参与剧本与分镜讨论，配合视觉风格与后期节奏的统一。",
    docs: [
      { label: "剧本 PDF", href: "assets/docs/aifilm-script.pdf" },
      { label: "故事大纲 PDF", href: "assets/docs/aifilm-outline.pdf" },
      { label: "作品汇报 PPTX", href: "assets/docs/aifilm-deck.pptx" }
    ],
    stills: ["still-2", "still-3", "still-4", "still-5"]
  },
  {
    id: "short-film",
    src: "assets/video/short-film.mp4",
    title: "微电影作品",
    en: "Short Film",
    tag: "剧情短片",
    year: "在校作品",
    dur: "14′53″",
    role: "编导 / 剪辑",
    thumbAt: 20,
    note: "完整的剧情短片创作，从前期构思到成片输出的全流程实践。"
  },
  {
    id: "wahaha-ad",
    src: "assets/video/wahaha-ad.mp4",
    title: "娃哈哈「非常可乐」",
    en: "Wahaha Very Cola · Ad",
    tag: "广告片",
    year: "大广赛",
    dur: "01′24″",
    role: "广告创作",
    note: "全国大学生广告艺术大赛品牌命题创作，围绕「非常可乐」完成创意与成片。"
  },
  {
    id: "jiangbei-psa",
    src: "assets/video/jiangbei-psa.mp4",
    title: "江北美好生活 · 公益推广",
    en: "Jiangbei Public Service Film",
    tag: "公益宣传片",
    year: "2025",
    dur: "02′55″",
    poster: "assets/img/video/jiangbei-cover.jpg",
    role: "剪辑 / 后期",
    note: "城市公益主题推广片，以日常场景的细节呈现「美好生活」的城市叙事。"
  },
  {
    id: "xhs-1290",
    src: "assets/video/xhs-1290.mp4",
    title: "《一把青》郭轸 × 朱青",
    en: "Xiaohongshu Edit · 1,290 likes",
    tag: "影视剪辑",
    year: "小红书",
    dur: "00′36″",
    thumbAt: 6,
    stat: "1290 赞",
    role: "剪辑 / 封面",
    note: "CP 向人物混剪，小红书单条点赞 1290，账号置顶作品。"
  },
  {
    id: "xhs-1222",
    src: "assets/video/xhs-1222.mp4",
    title: "《一把青》「老师有教无类」",
    en: "Xiaohongshu Edit · 1,222 likes",
    tag: "影视剪辑",
    year: "小红书",
    dur: "00′24″",
    stat: "1222 赞",
    role: "剪辑 / 封面",
    note: "台词名场面剪辑，小红书单条点赞 1222，账号置顶作品。"
  },
  {
    id: "xhs-ruanlingyu",
    src: "assets/video/xhs-ruanlingyu.mp4",
    title: "《阮玲玉》人物剪辑",
    en: "Ruan Lingyu · Character Edit",
    tag: "影视剪辑",
    year: "小红书",
    dur: "00′34″",
    role: "剪辑 / 封面",
    note: "以人物情绪为线索的片段组接，练习节奏与留白。"
  },
  {
    id: "xhs-xiuchundao",
    src: "assets/video/xhs-xiuchundao.mp4",
    title: "《绣春刀》人物混剪",
    en: "Brotherhood of Blades · Edit",
    tag: "影视剪辑",
    year: "小红书",
    dur: "00′09″",
    role: "剪辑 / 封面",
    note: "短平快的强节奏混剪，练习卡点与情绪推进。"
  }
];

# dsh-unslop

[English](README.md) | 中文

一个 DeepSeek Harness 插件，装上 **unslop** 技能：把「一看就是 AI 写的」界面，改成有自己性格的设计。

装一次，之后直接说你要修哪儿就行——「把这个面板去 AI 味」「这页面太像模板了」「unslop this dashboard」。它会先审计界面上的 AI 味，再从产品本身推出一个设计方向，等你点头，然后按九道 pass 逐层修：间距、颜色、图标、文案、字体、布局、细节、视觉、动效。

技能本身是 [Damir Sokolovsky（@heydamir）的 unslop](https://github.com/heydamir/unslop)，CC BY 4.0，为 DeepSeek Harness 做了适配，作者署名保留。

## 你会得到什么

- **只加一个技能，不抢别的。** 插件只在 Harness 技能注册表上注册一个 provider：不加模型工具、不联网、不起后台进程、没有配置项。
- **零额外安装。** 截图和测量都用机器上已有的 Chrome 或 Edge，不需要 Playwright、不需要 npm 下载、没有构建步骤。
- **没你同意不花钱。** 任何出图前都会先问，并且把 prompt 先给你看。
- **做不到就直说。** 需要登录的页面、背景画在 canvas 里的页面，快照会不完整——它会说出来，而不是瞎猜。故事短片依赖 Playwright，本插件故意不打包。
- **不只是网页 HTML。** 九道 pass 是设计判断，原生 App、游戏界面、模板格式同样适用；不适用的是渲染脚本，它会说明自己跳过了哪一步。

## 安装

### 从插件市场装

本仓库自带一个插件索引 `market/index.json`：

```
https://raw.githubusercontent.com/chenpipi0807/unslop-deepseekharness/main/market/index.json
```

1. 侧边栏打开 **Plugins（插件）**。
2. 在 **Experimental plugins（实验性插件）** 里打开 **Custom plugin indexes（自定义插件索引）**。
3. 进 **Discover** 标签页，点 **Add index source（添加索引源）**，把上面的地址粘进去。
4. 搜 *unslop*，打开条目，安装。

条目是用 `git+…git#<commit>` 钉在某个 commit 上装的，不涉及 npm 发版。如果它替换了一份已经装着的副本，DSH 会要求重启以加载新的模块。

### 从本地目录装

把这个目录复制到固定位置，然后在 **Plugins → Add plugin（添加插件）** 里选中它。本地目录是 link 安装，你改技能文件立刻生效。

### 用命令行装

`plugin_manager` 调 `install_bundle`，`target` 填这个目录的绝对路径。

### 确认装好了

- **Plugins → Installed（已安装）** 里会有一行 **Unslop**，带图标和描述。
- 任意会话的技能目录里都有 `unslop`，用自己的话说就会触发，也可以按名字加载。
- 新开的会话立刻可见；已经开着的会话在下一次目录刷新时拿到。

不确定有没有加载？让它跑一下渲染脚本，能打印出浏览器路径就说明技能和文件都在位：

```powershell
node <bundle>/skills/unslop/scripts/render.mjs browsers
```

## 使用

说清楚修什么、修哪里。目标可以是文件、跑着的应用，或者只有一个链接：

```
unslop this dashboard
unslop the hero of https://example.com
unslop my landing page and stop after the audit
```

一次运行按这个顺序走：

1. **看。** 先渲染再判断，不只看代码。
2. **审计。** 逐条列出 AI 味及其位置，同时用 `probe` 量布局，把间距变成数字而不是感觉。
3. **定档。** 重度就跑全流程；轻度只做打磨；本来就好的界面不动它，只给两三条具体建议。
4. **方向。** 五行——产品、性格、世界、两个浓墨处、签名细节——然后停下来问你。
5. **九道 pass。** 间距、颜色、图标、文案、字体、布局、细节、视觉、动效，每一道都是整屏改完再进下一道。
6. **核对。** 重新量、重新渲染，对着审计清单查，剩下的继续修。
7. **报告。** 方向、带位置的审计、每道改了什么、重算过哪些数字、替换过哪些字体 token、跳过了什么。

开头就说「直接做完，别问我」，可以跳过第 4 步的确认。before 那张图不计入预算，之后最多再渲染三次；如果第四次会改变设计，它会停下来告诉你哪里还不对。

它改的都是工作区文件，可以 diff。不会动 DSH 本身、你的 profile 或任何服务。

## 拿示例试一下

`examples/dashboard.html` 和 `examples/store.html` 是故意做得很糟的页面——紫渐变、emoji 当图标、发光胶囊、假窗口。复制一个到你自己的项目里再跑，是一个零成本的真实测试：

```powershell
node <bundle>/skills/unslop/scripts/render.mjs shot examples/dashboard.html before.png --width 1440 --height 900
```

然后按路径让它处理这个页面。

## 验证过什么

- 用 `install_bundle` 装进桌面 profile，技能出现在当时的会话目录里，并按名字加载成功，base directory 正确指向插件包。
- 拿 `examples/dashboard.html` 从零跑完一次：审计、方向、九道 pass、渲染核对。全程零安装、零联网，产出单个自包含 HTML。对结果跑 `probe`：视口 1440×900、无溢出，padding/radius/字号都是 pass 要求的数值。
- 发布出去的 commit 用市场推导出的同一条 spec 能装成功；raw 索引不跳转、内容与本地逐字节一致。
- `shot`、线上 URL 的 `snapshot`、`probe` 都在 Windows + Edge 上跑过。Chrome 与 macOS/Linux 的候选路径会被搜索，但没有实测。

没有验证的：在第二台机器上从市场安装、插件页在其它语言下的渲染、以及本插件不含的故事短片。

## 已知限制

- 技能是纯指令，跑得好不好取决于跟指令的模型；跑弱了表现为跳步骤，而不是代码坏掉。
- 渲染脚本需要 Chromium 内核浏览器。`render.mjs browsers` 会打印搜过哪些路径，`DSH_UNSLOP_BROWSER` 可以指定自定义可执行文件。
- `snapshot` 抓的是脚本执行后的 DOM，不是最终画面：canvas、WebGL、跨域 iframe 会丢。
- `--dark` 是强制浏览器深色模式，不等于页面自己有深色主题；页面有主题开关时优先用它。
- 故事短片（方形、十秒内、界面自己脱掉 AI 味）需要 Playwright 和 ffmpeg。设计说明还在技能里，录制脚本没打包。

## 目录结构

| 路径 | 作用 |
|---|---|
| `index.js` | Host 插件：在 `ctx.skills` 上注册 `unslop` provider |
| `cordis.patch.yml` | 插件 patch：插一行 |
| `skills/unslop/SKILL.md` | 技能正文，已适配 Harness 工具 |
| `skills/unslop/references/` | 识别清单、设计 token、视觉配方、RTL 规则、参考图 |
| `skills/unslop/scripts/render.mjs` | 用本机浏览器截图、抓快照、测量 |
| `examples/` | 故意做得很糟的练习页 |
| `market/` | format-1 插件索引，以及怎么发下一个版本 |
| `locale/`、`icon.svg`、`docs/` | 插件展示信息与详情页 |

## 署名与许可

技能内容——`SKILL.md`、`references/`、`examples/` 和参考图——是 **Damir Sokolovsky（[@heydamir](https://x.com/heydamir)）的 unslop**，[CC BY 4.0](LICENSE-CC-BY-4.0.txt) 许可，为 DeepSeek Harness 适配并保留了署名。上游：<https://github.com/heydamir/unslop>。再分发这个插件时请保留该署名。

Harness 侧的封装——`index.js`、`cordis.patch.yml`、`locale/`、`docs/`、`icon.svg`、`scripts/render.mjs`——是 MIT。

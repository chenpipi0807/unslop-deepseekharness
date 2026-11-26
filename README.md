# dsh-unslop

English | [中文](README.zh.md)

A DeepSeek Harness plugin that adds the **unslop** skill: it turns vibecoded, AI-looking UI into a designed interface with its own character.

Install it once, then just say what you want fixed — "unslop this dashboard", "this page looks like AI made it", "把这个页面去 AI 味". The agent audits the tells, proposes a direction taken from the product itself, waits for your yes, then fixes the screen in nine passes: spacing, color, icons, copy, type, layout, details, visuals, motion.

The skill itself is [unslop by Damir Sokolovsky (@heydamir)](https://github.com/heydamir/unslop), CC BY 4.0, adapted for DeepSeek Harness with the credit kept.

## What you get

- **One skill, nothing else taken over.** The bundle registers a single skill provider on the Harness skill registry. No model tools, no network calls, no background process, no config.
- **Zero extra installs.** Screenshots and measurements use the Chrome or Edge already on the machine. No Playwright, no npm download, no build step.
- **Nothing paid without a yes.** The skill asks before any image generation and shows the prompt first.
- **Honest when it can't.** A page behind a login, or one that paints its background in a canvas, comes out incomplete in a snapshot — the skill says so instead of guessing. The story video needs Playwright and is deliberately not shipped.
- **Not only for web HTML.** The nine passes are design reasoning, so they still apply to a native, game or template screen. The render script is the part you skip, and the skill says which step it skipped.

## Install

### From the plugin market

This repository ships its own index at `market/index.json`:

```
https://raw.githubusercontent.com/chenpipi0807/unslop-deepseekharness/main/market/index.json
```

1. Open **Plugins** in the sidebar.
2. Under **Experimental plugins**, switch on **Custom plugin indexes**.
3. Open the **Discover** tab, choose **Add index source**, and paste the URL above.
4. Search *unslop*, open the entry, and install it.

The entry installs from a pinned commit with `git+…git#<commit>`, so no npm release is involved. If it replaces an already-installed copy, DSH asks for a restart to load the new module.

### From a local folder

Copy this directory somewhere stable, then in **Plugins → Add plugin** choose that folder. A local folder install is linked, so edits you make to the skill take effect immediately.

### From the command line

`plugin_manager` with `install_bundle` and `target` set to the absolute path of this directory.

### Check that it is live

- **Plugins → Installed** lists the bundle as **Unslop** with its icon and description.
- In any session, the `unslop` skill is in the catalog; ask in your own words, or load it by name.
- New sessions see it immediately. An already-open session picks it up on its next catalog refresh.

Unsure whether it loaded? Ask the agent to run the render helper; if it prints a browser path, the skill and its files are in place:

```powershell
node <bundle>/skills/unslop/scripts/render.mjs browsers
```

## Use

Say what to fix and where. The screen can be a file, a running app, or only a link:

```
unslop this dashboard
unslop the hero of https://example.com
unslop my landing page and stop after the audit
```

What a run does, in order:

1. **Look.** Renders the screen and reads it, instead of trusting the code.
2. **Audit.** Lists every sign of slop with where it lives, and measures the layout with `probe` so spacing is a number, not a guess.
3. **Decide.** Heavy slop runs the full process; light slop is a polish pass; a good screen is left alone with two or three concrete suggestions.
4. **Direction.** Five lines — product, character, world, moments, signature — then it stops and asks you.
5. **Nine passes.** Spacing, color, icons, copy, type, layout, details, visuals, motion, each finished across the whole screen before the next.
6. **Check.** Re-measures, re-renders, compares with the audit, fixes what is left.
7. **Report.** The direction, the audit with locations, what each pass changed, every number it recomputed, every type token it had to substitute, and anything it skipped.

Say "just do it" up front to skip the approval gate at step 4. At most three renders happen after the before picture; if a fourth would change the design, the run stops and reports what is still wrong instead.

Everything it changes is workspace files you can diff. The skill does not touch DSH, your profile, or any service.

## Try it on the examples

`examples/dashboard.html` and `examples/store.html` are deliberately awful — purple gradients, emoji icons, glowing pills, a fake window. Copy one into your own project and run the skill on it: a real test that costs nothing.

```powershell
node <bundle>/skills/unslop/scripts/render.mjs shot examples/dashboard.html before.png --width 1440 --height 900
```

Then ask for the page by path.

## What was verified

- Installed into the desktop profile with `install_bundle`; the skill appeared in the live session catalog and loaded by name with its base directory resolved to the bundle.
- One full run on `examples/dashboard.html` from a standing start: audit, direction, nine passes, rendered result. Zero installs, zero network, one self-contained HTML file out. `probe` on that result reported a 1440×900 viewport with no overflow, and the padding, radius and type values the passes asked for.
- The published commit installs with the same spec the market derives, and the raw index is served unredirected with a byte-identical body.
- `shot`, `snapshot` of a live URL, and `probe` were all exercised on Windows with Edge. The Chrome and macOS/Linux candidates are searched but were not exercised here.

Not verified here: installing from the market index on a second machine, the Plugins page rendering in another locale, and the story video, which this bundle does not ship.

## Limits

- The skill is instruction-only, so the quality of a run depends on the model that follows it. A weak run shows up as skipped passes, not as broken code.
- The render helper needs a Chromium-based browser. `render.mjs browsers` prints what it searched; `DSH_UNSLOP_BROWSER` points it at a custom executable.
- `snapshot` captures the DOM after scripts run, not the painted result: canvas, WebGL and cross-origin frames are lost.
- `--dark` forces the browser's dark scheme. It is not the same as the page having a dark theme; prefer the page's own theme hook.
- The story video (square, under ten seconds, the screen unslopping itself) needs Playwright and ffmpeg. Its design notes are still in the skill; the recorder is not shipped.

## Layout

| Path | Role |
|---|---|
| `index.js` | Host plugin: registers the `unslop` skill provider on `ctx.skills` |
| `cordis.patch.yml` | The bundle patch: one inserted row |
| `skills/unslop/SKILL.md` | The skill body, adapted for Harness tools |
| `skills/unslop/references/` | Sign list, design tokens, visual recipes, RTL rules, reference images |
| `skills/unslop/scripts/render.mjs` | Screenshot, snapshot and probe through the local browser |
| `examples/` | Deliberately sloppy pages for a first run |
| `market/` | The format-1 plugin index and how to publish the next version |
| `locale/`, `icon.svg`, `docs/` | Plugin display metadata and the detail page |

## Credits and license

The skill content — `SKILL.md`, `references/`, `examples/`, and the reference images — is **unslop by Damir Sokolovsky ([@heydamir](https://x.com/heydamir))**, licensed [CC BY 4.0](LICENSE-CC-BY-4.0.txt), adapted for DeepSeek Harness with the credit kept intact. Upstream: <https://github.com/heydamir/unslop>. Keep that attribution if you redistribute this bundle.

The Harness wrapper — `index.js`, `cordis.patch.yml`, `locale/`, `docs/`, `icon.svg`, and `scripts/render.mjs` — is MIT.

# Plugin market index

`index.json` in this folder is a format-1 DeepSeek Harness plugin index. Add its raw URL to **Plugins → Discover** and this bundle becomes searchable and installable.

```
https://raw.githubusercontent.com/chenpipi0807/unslop-deepseekharness/main/market/index.json
```

## Add it once

1. **Plugins** in the sidebar.
2. Under **Experimental plugins**, switch on **Custom plugin indexes** (bundle `@deepseek-ai/dsh-experimental-plugin-market-bundle`; off by default).
3. Open the **Discover** tab and choose **Add index source**.
4. Paste the URL above. It has to be the final address: the Host refuses redirects, so no shortener and no branch alias that redirects.
5. Search *unslop*, open the entry, install.

The index declares one plugin, `dsh-unslop`, installed from a pinned commit with `git+…git#<commit>` — no npm release, no build step.

## Publishing a new version

1. Change the bundle, commit, and note the new commit (`git rev-parse HEAD`).
2. Add a version object to `plugins[0].versions` in `index.json`:
   - `version`: new semver;
   - `publishTimestamp`: Unix seconds;
   - `source`: `{ "type": "git", "url": "https://github.com/chenpipi0807/unslop-deepseekharness", "commit": "<40 lowercase hex>" }`;
   - `engines`: `{ "dsh": ">=0.2.2-rc.0 <0.3.0" }`.
3. Keep older versions: the Host sorts them and offers the newest compatible one. A copy installed from a pinned commit only updates inside the same repository directory.
4. Validate before pushing, with the parser shipped inside DSH:

```
ELECTRON_RUN_AS_NODE=1 "<dsh install>/DeepSeek Harness.exe" -e "const m=require('<asar>/node_modules/@deepseek-ai/dsh-plugin-market-index');const fs=require('fs');m.parseMarketIndex(JSON.parse(fs.readFileSync('market/index.json','utf8')),'https://raw.githubusercontent.com/chenpipi0807/unslop-deepseekharness/main/market/index.json')"
```

A malformed index shows the JSON path of the offending value in Discover instead of listing anything.

## Icon

`icon.svg` is duplicated here because a relative icon resolves against the index URL, and the Host accepts it only over `https:` or from the same origin.

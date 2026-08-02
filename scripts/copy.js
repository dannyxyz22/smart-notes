const fs = require("fs");
const path = require("path");

const pluginName = "smart-notes";

const root = path.resolve(__dirname, "..");
const target = `C:\\vault\\obsidian-vault-main\\.obsidian\\plugins\\${pluginName}`;



if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
}

const files = [
    "main.js",
    "manifest.json",
    "styles.css"
];

for (const file of files) {
    const src = path.join(root, file);

    if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(target, file));
        console.log(`✓ ${file}`);
    }
}

console.log("Plugin copiado.");
const fs = require("fs");
const path = require("path");

const pluginName = "smart-notes";

const root = path.resolve(__dirname, "..");
const targets = [
    path.join("C:", "vault", "obsidian-vault-main", ".obsidian", "plugins", pluginName),
    path.join("C:", "vault", "obsidian-vault-main", ".obsidian-desktop", "plugins", pluginName),
    path.join("C:", "vault", "obsidian-vault-main", ".obsidian-desktop-samsung", "plugins", pluginName),
];

const files = [
    "main.js",
    "manifest.json",
    "styles.css"
];

for (const target of targets) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    for (const file of files) {
        const src = path.join(root, file);

        if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(target, file));
            console.log(`✓ ${file} -> ${path.basename(path.dirname(target))}`);
        }
    }
}

console.log("Plugin copiado.");
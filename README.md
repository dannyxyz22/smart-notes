# Smart Notes — Books

Plugin de Obsidian que detecta notas com `type: book` no frontmatter e
exibe uma galeria em React, sem sair do vault e sem duplicar dados —
o Markdown continua sendo a única fonte de verdade.

## Como está organizado

```
smart-notes-obsidian/
├── manifest.json          # metadados do plugin (id, versão, etc.)
├── package.json
├── tsconfig.json
├── esbuild.config.mjs     # empacota src/ -> main.js
├── styles.css             # copiado para o vault junto com main.js
└── src/
    ├── main.tsx           # Plugin: registra a view, o ícone e o comando
    ├── types.ts           # BookRecord — o "modelo" derivado do frontmatter
    ├── data/
    │   └── useBooks.ts    # hook que lê o vault via metadataCache e mantém a lista sincronizada
    └── views/
        ├── BooksItemView.tsx  # ponte entre ItemView (Obsidian) e React
        ├── BooksView.tsx      # tela: busca, ordenação, grid
        └── BookCard.tsx       # card individual de um livro
```

Fluxo de dados (unidirecional, como descrito na ideia original):

```
Vault (arquivos .md)
   -> app.metadataCache (Obsidian já faz o parse do YAML)
   -> useBooks() converte frontmatter em BookRecord[]
   -> BooksView / BookCard apenas renderizam
```

O React **nunca** escreve nos arquivos nesta primeira versão — é uma
view somente leitura. Clicar em um card abre a nota original no editor
padrão do Obsidian (`app.workspace.getLeaf().openFile()`), então editar
ainda é 100% Markdown. O próximo passo natural (ver "Próximos passos"
abaixo) é permitir editar campos como `progress` ou `rating` direto no
card, escrevendo de volta via `processFrontMatter`.

## Formato de nota esperado

```markdown
---
type: book
title: O Hobbit
author: Tolkien
status: lendo
progress: 42
rating: 5
cover: "https://exemplo.com/capa.jpg"   # opcional
---

# Resumo
...
```

Todos os campos além de `type` e `title` são opcionais — a view lida
bem com a ausência deles.

## Instalar no seu vault (modo desenvolvimento)

1. Dentro do vault, crie a pasta do plugin:
   ```
   <SeuVault>/.obsidian/plugins/smart-notes-books/
   ```
2. Copie para essa pasta: `manifest.json`, `styles.css` e o `main.js`
   gerado pelo build (veja abaixo).
3. No Obsidian: **Configurações → Plugins da comunidade** → desativar
   "Modo seguro" (se necessário) → recarregar plugins → ativar
   "Smart Notes - Books".
4. Um ícone de livro aberto aparece na barra lateral (ribbon). Clique
   nele, ou use o Command Palette → "Abrir view de Livros".

## Desenvolver

```bash
npm install
npm run dev     # esbuild em modo watch, gera main.js a cada alteração
```

Para gerar o build final (minificado, sem sourcemap):

```bash
npm run build
```

O `main.js` é sempre gerado a partir de `src/` — não edite o `main.js`
diretamente.

Dica: para não copiar os arquivos manualmente a cada mudança, muita
gente cria um symlink da pasta do plugin para dentro do vault, ou usa
o `npm run dev` apontando o `outfile` do esbuild.config.mjs direto
para `.obsidian/plugins/smart-notes-books/main.js` do seu vault.

## Próximos passos (fora do escopo desta v0.1)

- **Edição inline**: permitir alterar `progress`/`rating`/`status`
  direto no card, escrevendo de volta com
  `app.fileManager.processFrontMatter(file, fn)`.
- **MarkdownDocument**: extrair a classe de leitura/escrita descrita na
  ideia original, para também editar as seções de corpo (Resumo,
  Citações) sem regex frágil.
- **Views alternativas**: tabela (AG Grid / TanStack Table), Kanban por
  `status`, timeline por `finished`.
- **Schema de coleção**: um arquivo `.smart-notes/books.schema.yaml`
  (ou frontmatter de uma nota de configuração) definindo os campos
  esperados, para gerar filtros/formulários automaticamente.
- **Detecção de tipo genérica**: hoje o hook está fixo em `type: book`;
  o próximo passo é generalizar para `type: <qualquer>` e escolher a
  view (`BookView`, `PersonView`, `ProjectView`...) dinamicamente, como
  na arquitetura original.

# Smart Notes

Plugin de Obsidian com três funcionalidades integradas:

1. **Home Dashboard** — painel central com métricas do vault, tarefas, inbox e atalhos para notas importantes.
2. **Agenda ICS** — painel lateral com os próximos compromissos lidos diretamente de feeds `.ics` do Google Calendar (sem iframe, sem dependência de sessão).
3. **Galeria de Livros** — view em grid de todas as notas com `type: book` no frontmatter.

O Markdown continua sendo a única fonte de verdade. O plugin nunca escreve nos arquivos.

---

## Estrutura do projeto

```
smart-notes/
├── manifest.json
├── package.json
├── tsconfig.json
├── esbuild.config.mjs        # empacota src/ → main.js
├── styles.css
└── src/
    ├── main.tsx              # Plugin: registra views, comandos e settings
    ├── settings.ts           # Tipo SmartNotesSettings + defaults
    ├── types.ts              # BookRecord
    ├── data/
    │   ├── useBooks.ts       # Hook: lê notas type:book via metadataCache
    │   ├── useDashboard.ts   # Hook: agrega tarefas, inbox e notas recentes
    │   └── useIcsAgenda.ts   # Hook: busca e parseia feeds ICS
    └── views/
        ├── HomeItemView.tsx  # ItemView bridge → HomeView
        ├── HomeView.tsx      # Dashboard principal (tab do editor)
        ├── AgendaItemView.tsx # ItemView bridge → AgendaView (sidebar)
        ├── AgendaView.tsx    # Lista de compromissos estilo Google Calendar
        ├── BooksItemView.tsx # ItemView bridge → BooksView
        ├── BooksView.tsx     # Galeria com busca e ordenação
        └── BookCard.tsx      # Card individual de livro
```

---

## Views e comandos

| Ação | Como acessar |
|---|---|
| Abrir Home dashboard | Ícone 🏠 no ribbon · Command Palette |
| Abrir painel de Agenda | Command Palette → "Abrir painel de Agenda" |
| Abrir view de Livros | Command Palette → "Abrir view de Livros" |

O **Home dashboard** abre como aba no editor principal. A **Agenda** abre como painel na sidebar direita.

---

## Home Dashboard

Seções exibidas:

- **Métricas rápidas** — contagem de livros, tarefas abertas, tarefas finalizadas hoje, notas na inbox.
- **Próximos compromissos** — tarefas com `Do date` no futuro, lidas do vault.
- **Finalizadas hoje** — tarefas com `Done: true` modificadas hoje.
- **Inbox e triagem rápida** — notas da pasta `inbox/`, ordenadas por data de modificação.
- **Pessoas e hábitos** — atalhos para `processed/Pessoas.base`, `processed/Journal.base` e `processed/CalendarView`.
- **Livros** — atalhos para `processed/Wishlist...` e `processed/Biblioteca.base`.
- **Notas recentes** — últimas 8 notas modificadas no vault.

Clicar em qualquer link abre o arquivo na **mesma aba** (substitui o dashboard).

### Tarefas

O hook `useDashboard` detecta tarefas via tag `#task` (no corpo ou no frontmatter). Campos relevantes:

```yaml
---
tags: [task]
title: Título da tarefa
Done: true          # ou false
Do date: "2026-08-10"
modified: 2026-08-01T20:00:00-03:00
---
```

---

## Agenda ICS

O painel lateral lê diretamente feeds `.ics` privados do Google Calendar via `requestUrl` (API do Obsidian — sem CORS, sem iframe).

### Configurar calendários

Acesse **Configurações → Smart Notes** e:

1. Cole a URL ICS de cada calendário (Google Calendar: Configurações do calendário → "Endereço secreto no formato iCal").
2. Defina nome e cor (hex `#RRGGBB`).
3. Ajuste "Dias para mostrar" (padrão: 21, máximo: 90).
4. Use **Adicionar calendário** para incluir novos feeds.

> ⚠️ URLs ICS são chaves privadas de acesso. **Não as inclua em repositórios públicos.** Elas são salvas no `data.json` do plugin dentro do vault (não no código-fonte).

### Visual

Layout inspirado no Google Calendar Agenda:

```
[ 1 ]  AGO., SAB.
  ●  Dia todo   Aniversário Akira         Pessoal
  ●  13:00      Santa Missa em Latim      Rotina
  ●  20:00      Week plan                 Rotina

[ 3 ]  AGO., SEG.
  ●  08:00      Márcio Jardim             Pessoal
```

- Número do dia em círculo (azul quando é hoje).
- Eventos do dia agrupados abaixo, ordenados por horário.
- Eventos all-day exibem "Dia todo".
- Coluna do nome do calendário omitida em telas estreitas.

### Suporte a recorrência

Regras `RRULE` são expandidas pela biblioteca [`rrule`](https://github.com/jakubroztocil/rrule). Exceções `EXDATE` são respeitadas.

---

## Galeria de Livros

Detecta automaticamente todas as notas com `type: book` no frontmatter.

### Formato de nota esperado

```yaml
---
type: book
title: O Hobbit
author: J.R.R. Tolkien
status: lendo          # lendo | lido | quero ler
progress: 42           # 0–100
rating: 5              # 0–5
cover: "https://..."   # opcional
---
```

Todos os campos além de `type` são opcionais.

### Funcionalidades da view

- Busca por título ou autor.
- Ordenação por título, autor, avaliação ou progresso.
- Barra de progresso e estrelas de avaliação no card.
- Clicar no card abre a nota no editor.

---

## Instalar no vault (modo desenvolvimento)

1. Crie a pasta do plugin no vault:
   ```
   <SeuVault>/.obsidian/plugins/smart-notes/
   ```
2. Copie `manifest.json`, `styles.css` e `main.js` para essa pasta.
3. No Obsidian: **Configurações → Plugins da comunidade** → desativar "Modo seguro" (se necessário) → recarregar → ativar **Smart Notes**.

O script `npm run build` faz o build e copia os arquivos automaticamente para o caminho configurado em `scripts/copy.js`.

---

## Desenvolver

```bash
npm install
npm run dev     # watch mode — regenera main.js a cada mudança
npm run build   # build de produção + cópia para o vault
```

`main.js` é sempre gerado a partir de `src/`. Não edite diretamente.

---

## Fluxo de dados

```
Vault (.md files)
  └─ metadataCache  ──► useBooks()      ──► BooksView
  └─ vault events   ──► useDashboard()  ──► HomeView

Google Calendar ICS feeds
  └─ requestUrl()   ──► useIcsAgenda()  ──► AgendaView
```

Todos os hooks são somente leitura. O vault nunca é modificado pelo plugin.

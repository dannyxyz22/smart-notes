---
modified: 2026-07-26T23:06:14-03:00
tags:
  - dashboard
type:
  - dashboard
---
# 🧠 Bem-vindo ao seu LLM-Wiki Personalizado

```dataviewjs
dv.view("processed/scripts/WeatherLookup");
```

```dataviewjs
const wrapper = dv.container.createDiv();
wrapper.style.cssText = "display:flex; flex-wrap:wrap; gap:12px; align-items:start;";

const col1 = wrapper.createDiv();
col1.style.cssText = "flex:1; min-width:260px;";

const col2 = wrapper.createDiv();
col2.style.cssText = "flex:1; min-width:260px;"; 

// Passando a coluna alvo diretamente como parâmetro do script
dv.view("processed/scripts/FestasLiturgicas", { target: col1 });
dv.view("processed/scripts/ProximosCompromissos", { target: col2 });
```
## ✅ Tarefas

```dataviewjs
dv.view("processed/scripts/Tarefas");
```

[[processed/CalendarView|CalendarView]]

## ✔️ Finalizadas hoje

```dataviewjs
// Pega o dia de hoje formatado como string "YYYY-MM-DD"
const hojeStr = dv.date("today").toFormat("yyyy-MM-dd");

const feitas = dv.pages("#task")
  .where(p => {
    // Garante que a tarefa está marcada como feita
    if (p.Done !== true) return false;
    
	// Alteração sugerida na linha do filtro se você quiser usar a data interna do frontmatter: 
	const mtimeData = dv.date(p.modified); // Em vez de p.file.mtime
    if (!mtimeData) return false;
    
    // Extrai apenas a parte "YYYY-MM-DD" para comparar strings limpas
    return mtimeData.toFormat("yyyy-MM-dd") === hojeStr;
  })
  .sort(p => p.file.mtime, "desc");

if (feitas.length === 0) {
  dv.el("em", "Nenhuma tarefa finalizada hoje ainda.");
} else {
  dv.table(
    ["Tarefa", "Prazo"],
    feitas.map(p => {
      // Faz o parse seguro do prazo "Do date" caso ele tenha aspas/fuso
      const prazoData = p["Do date"] ? dv.date(p["Do date"]) : null;
      const prazoFormatado = prazoData ? prazoData.toFormat("dd/MM") : "—";
      
      return [p.file.link, prazoFormatado];
    })
  );
}
```
# 🧍Pessoas
---
[[processed/Pessoas.base|Pessoas]]


# ✅Hábitos
[[processed/Journal.base|Journal]]
```dataviewjs
dv.view("processed/scripts/HabitsView", { mode: "tracker", api: require("obsidian") });
```

## 📥 Inbox & Triagem Rápida
---
[[processed/Inbox processing.base|Inbox processing]]

> [!todo] **Notas na Caixa de Entrada**
> Notas recém-criadas ou integradas que precisam de metadados, refinamento ou arquivamento.
> 
> ```dataview
> LIST
> FROM "inbox"
> ```

## :luc_book_open: Livros

:luc_layout_list: [[processed/Wishlist - Lista de livros católicos|Wishlist - Lista de livros católicos]]
:luc_library: [[processed/Biblioteca.base|Biblioteca]]

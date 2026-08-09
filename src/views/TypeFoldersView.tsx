import * as React from "react";
import { App, TFile, getAllTags, setIcon } from "obsidian";

interface TypeFoldersViewProps {
  app: App;
}

interface TypeFolder {
  type: string;
  label: string;
  files: TFile[];
  hue: number;
}

interface TagFolder {
  key: string;
  label: string;
  files: TFile[];
}

type NoteSortMode = "alphabetical" | "modified";
type AlphabeticalSortDirection = "ascending" | "descending";
type ModifiedSortDirection = "newest" | "oldest";

const TYPE_LABELS: Record<string, string> = {
  book: "Livros",
  confession: "Confissões",
  course: "Cursos",
  daily: "Diário",
  note: "Notas",
  person: "Pessoas",
  task: "Tarefas",
  tasks: "Tarefas",
};

const TYPE_ALIASES: Record<string, string> = {
  books: "book",
  confessions: "confession",
  courses: "course",
  notes: "note",
  persons: "person",
  people: "person",
  tasks: "task",
};

const RAINBOW_HUES = [8, 30, 50, 92, 142, 174, 202, 230, 262, 292, 322, 346];

function SortIcon({ icon }: { icon: string }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);

  React.useEffect(() => {
    if (ref.current) setIcon(ref.current, icon);
  }, [icon]);

  return <span ref={ref} className="smart-notes-type-sort-icon" aria-hidden="true" />;
}

function AlphabeticalSortIcon({ direction }: { direction: AlphabeticalSortDirection }) {
  const ascending = direction === "ascending";

  return (
    <svg
      className="smart-notes-type-sort-icon smart-notes-type-alphabetical-icon"
      viewBox="0 0 20 18"
      aria-hidden="true"
    >
      <path d="M4 2.5v12M1.5 12l2.5 2.5L6.5 12" />
      <text x="9" y="7">
        {ascending ? "A" : "Z"}
      </text>
      <text x="9" y="16">
        {ascending ? "Z" : "A"}
      </text>
    </svg>
  );
}

function extractTypes(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [value];
  return [...new Set(
    values
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim().toLowerCase())
      .map((item) => TYPE_ALIASES[item] ?? item)
      .filter(Boolean)
  )];
}

function typeLabel(type: string): string {
  const known = TYPE_LABELS[type];
  if (known) return known;
  return type
    .replace(/[-_]+/g, " ")
    .replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase("pt-BR"));
}

function fileTags(app: App, file: TFile): string[] {
  const cache = app.metadataCache.getFileCache(file);
  if (!cache) return [];

  return [...new Set(
    (getAllTags(cache) ?? [])
      .map((tag) => tag.replace(/^#/, "").trim())
      .filter(Boolean)
  )];
}

function buildTagFolders(app: App, files: TFile[]): TagFolder[] {
  const grouped = new Map<string, TagFolder>();

  for (const file of files) {
    const tags = fileTags(app, file);
    for (const tag of tags.length > 0 ? tags : [""]) {
      const key = tag.toLocaleLowerCase("pt-BR");
      const group = grouped.get(key) ?? {
        key,
        label: tag ? `#${tag}` : "Sem tag",
        files: [],
      };
      group.files.push(file);
      grouped.set(key, group);
    }
  }

  return [...grouped.values()].sort((left, right) => {
    if (!left.key) return 1;
    if (!right.key) return -1;
    return left.label.localeCompare(right.label, "pt-BR", { sensitivity: "base" });
  });
}

function buildTypeFolders(app: App): TypeFolder[] {
  const grouped = new Map<string, TFile[]>();

  for (const file of app.vault.getMarkdownFiles()) {
    if (file.path.toLowerCase().startsWith("templates/")) continue;
    const frontmatter = app.metadataCache.getFileCache(file)?.frontmatter;
    for (const type of extractTypes(frontmatter?.type)) {
      const files = grouped.get(type) ?? [];
      files.push(file);
      grouped.set(type, files);
    }
  }

  return [...grouped.entries()]
    .map(([type, files]) => ({
      type,
      label: typeLabel(type),
      files: files.sort((left, right) =>
        left.basename.localeCompare(right.basename, "pt-BR", { sensitivity: "base" })
      ),
      hue: 0,
    }))
    .sort((left, right) =>
      left.label.localeCompare(right.label, "pt-BR", { sensitivity: "base" })
    )
    .map((folder, index) => ({
      ...folder,
      hue: RAINBOW_HUES[index % RAINBOW_HUES.length],
    }));
}

export function TypeFoldersView({ app }: TypeFoldersViewProps) {
  const [folders, setFolders] = React.useState<TypeFolder[]>(() => buildTypeFolders(app));
  const [expandedTypes, setExpandedTypes] = React.useState<Set<string>>(() => new Set());
  const [expandedTags, setExpandedTags] = React.useState<Set<string>>(() => new Set());
  const [query, setQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const [noteSortMode, setNoteSortMode] = React.useState<NoteSortMode>("alphabetical");
  const [alphabeticalSortDirection, setAlphabeticalSortDirection] =
    React.useState<AlphabeticalSortDirection>("ascending");
  const [modifiedSortDirection, setModifiedSortDirection] =
    React.useState<ModifiedSortDirection>("newest");

  React.useEffect(() => {
    const refresh = () => setFolders(buildTypeFolders(app));
    const metadataRef = app.metadataCache.on("changed", refresh);
    const createRef = app.vault.on("create", refresh);
    const deleteRef = app.vault.on("delete", refresh);
    const renameRef = app.vault.on("rename", refresh);

    return () => {
      app.metadataCache.offref(metadataRef);
      app.vault.offref(createRef);
      app.vault.offref(deleteRef);
      app.vault.offref(renameRef);
    };
  }, [app]);

  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const visibleFolders = folders
    .map((folder) => {
      if (!normalizedQuery) return folder;
      const folderMatches =
        folder.label.toLocaleLowerCase("pt-BR").includes(normalizedQuery) ||
        folder.type.includes(normalizedQuery);
      return {
        ...folder,
        files: folderMatches
          ? folder.files
          : folder.files.filter((file) =>
              `${file.basename} ${file.path} ${fileTags(app, file).join(" ")}`
                .toLocaleLowerCase("pt-BR")
                .includes(normalizedQuery)
            ),
      };
    })
    .filter((folder) => folder.files.length > 0);

  const toggleFolder = (type: string) => {
    setExpandedTypes((current) => {
      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const toggleTagFolder = (key: string) => {
    setExpandedTags((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="smart-notes-type-folders-view">
      <div className="smart-notes-type-folders-header">
        <div className="smart-notes-type-folders-title">
          <span>Tipos</span>
        </div>
        <div className="smart-notes-type-folders-actions">
          <button
            type="button"
            className={`smart-notes-type-sort-button${noteSortMode === "alphabetical" ? " is-active" : ""}`}
            onClick={() => {
              if (noteSortMode === "alphabetical") {
                setAlphabeticalSortDirection((current) =>
                  current === "ascending" ? "descending" : "ascending"
                );
              } else {
                setNoteSortMode("alphabetical");
              }
            }}
            aria-label={`Ordenar notas de ${
              alphabeticalSortDirection === "ascending" ? "A a Z" : "Z a A"
            }`}
            aria-pressed={noteSortMode === "alphabetical"}
            title={
              alphabeticalSortDirection === "ascending"
                ? "Ordem alfabética: A–Z"
                : "Ordem alfabética: Z–A"
            }
          >
            <AlphabeticalSortIcon direction={alphabeticalSortDirection} />
          </button>
          <button
            type="button"
            className={`smart-notes-type-sort-button${noteSortMode === "modified" ? " is-active" : ""}`}
            onClick={() => {
              if (noteSortMode === "modified") {
                setModifiedSortDirection((current) =>
                  current === "newest" ? "oldest" : "newest"
                );
              } else {
                setNoteSortMode("modified");
              }
            }}
            aria-label={`Ordenar notas por modificação, ${
              modifiedSortDirection === "newest"
                ? "mais recentes primeiro"
                : "mais antigas primeiro"
            }`}
            aria-pressed={noteSortMode === "modified"}
            title={
              modifiedSortDirection === "newest"
                ? "Modificação: mais recentes primeiro"
                : "Modificação: mais antigas primeiro"
            }
          >
            <SortIcon icon="history" />
          </button>
        </div>
      </div>

      <div className="smart-notes-type-search">
        <input
          ref={searchInputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar tipos, tags ou notas"
          aria-label="Buscar tipos, tags ou notas"
        />
        {query ? (
          <button
            type="button"
            className="smart-notes-type-search-clear"
            onClick={() => {
              setQuery("");
              searchInputRef.current?.focus();
            }}
            aria-label="Limpar busca"
            title="Limpar busca"
          >
            ×
          </button>
        ) : null}
      </div>

      <div className="smart-notes-type-folders-tree">
        {visibleFolders.length === 0 ? (
          <p className="smart-notes-type-folders-empty">Nenhuma nota com type encontrada.</p>
        ) : (
          visibleFolders.map((folder) => {
            const expanded = normalizedQuery.length > 0 || expandedTypes.has(folder.type);
            const sortedFiles = [...folder.files].sort((left, right) =>
              noteSortMode === "modified"
                ? modifiedSortDirection === "newest"
                  ? right.stat.mtime - left.stat.mtime
                  : left.stat.mtime - right.stat.mtime
                : (alphabeticalSortDirection === "ascending" ? 1 : -1) *
                  left.basename.localeCompare(right.basename, "pt-BR", {
                    sensitivity: "base",
                  })
            );
            const tagFolders = buildTagFolders(app, sortedFiles);
            const subdivideByTag = tagFolders.length > 1;
            const style = {
              "--smart-notes-type-hue": `${folder.hue}`,
            } as React.CSSProperties;

            return (
              <section
                key={folder.type}
                className={`smart-notes-type-folder${expanded ? " is-expanded" : ""}`}
                style={style}
              >
                <button
                  type="button"
                  className="smart-notes-type-folder-row"
                  onClick={() => toggleFolder(folder.type)}
                  aria-expanded={expanded}
                >
                  <span className="smart-notes-type-folder-chevron" aria-hidden="true">
                    {expanded ? "⌄" : "›"}
                  </span>
                  <span className="smart-notes-type-folder-name">{folder.label}</span>
                  <span className="smart-notes-type-folder-count">{folder.files.length}</span>
                </button>

                {expanded ? (
                  subdivideByTag ? (
                    <div className="smart-notes-type-tag-folders">
                      {tagFolders.map((tagFolder) => {
                        const tagStateKey = `${folder.type}\u0000${tagFolder.key}`;
                        const tagExpanded =
                          normalizedQuery.length > 0 || expandedTags.has(tagStateKey);

                        return (
                          <div
                            key={tagFolder.key || "untagged"}
                            className={`smart-notes-type-tag-folder${tagExpanded ? " is-expanded" : ""}`}
                          >
                            <button
                              type="button"
                              className="smart-notes-type-tag-folder-row"
                              onClick={() => toggleTagFolder(tagStateKey)}
                              aria-expanded={tagExpanded}
                            >
                              <span className="smart-notes-type-folder-chevron" aria-hidden="true">
                                {tagExpanded ? "⌄" : "›"}
                              </span>
                              <span className="smart-notes-type-tag-folder-name">
                                {tagFolder.label}
                              </span>
                              <span className="smart-notes-type-tag-folder-count">
                                {tagFolder.files.length}
                              </span>
                            </button>

                            {tagExpanded ? (
                              <div className="smart-notes-type-tag-folder-notes">
                                {tagFolder.files.map((file) => (
                                  <button
                                    key={file.path}
                                    type="button"
                                    className="smart-notes-type-note-row"
                                    onClick={() =>
                                      void app.workspace.openLinkText(file.path, "", false)
                                    }
                                    title={file.path}
                                  >
                                    <span>{file.basename}</span>
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="smart-notes-type-folder-notes">
                      {sortedFiles.map((file) => (
                        <button
                          key={file.path}
                          type="button"
                          className="smart-notes-type-note-row"
                          onClick={() => void app.workspace.openLinkText(file.path, "", false)}
                          title={file.path}
                        >
                          <span>{file.basename}</span>
                        </button>
                      ))}
                    </div>
                  )
                ) : null}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

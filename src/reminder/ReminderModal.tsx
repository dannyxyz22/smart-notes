import * as React from "react";
import { Root, createRoot } from "react-dom/client";
import { App, Modal, TFile } from "obsidian";

export interface ReminderModalProps {
  initialTitle: string;
  file: TFile;
  onCreate: (
    title: string,
    startTime: string,
    endTime: string
  ) => void | Promise<void>;
  onClose: () => void;
}

export class ReminderModal extends Modal {
  private root: Root | null = null;
  private readonly props: ReminderModalProps;

  constructor(app: App, props: ReminderModalProps) {
    super(app);
    this.props = props;
  }

  onOpen(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Criar Lembrete" });

    const rootEl = containerEl.createDiv("reminder-modal-root");
    this.root = createRoot(rootEl);
    this.render();
  }

  render(): void {
    if (!this.root) return;
    this.root.render(
      <ReminderForm
        initialTitle={this.props.initialTitle}
        onCreate={this.props.onCreate}
        onClose={() => this.close()}
      />
    );
  }

  onClose(): void {
    this.props.onClose();
    this.root?.unmount();
    this.root = null;
  }
}

function ReminderForm(props: {
  initialTitle: string;
  onCreate: (
    title: string,
    startTime: string,
    endTime: string
  ) => void | Promise<void>;
  onClose: () => void;
}) {
  const [title, setTitle] = React.useState(props.initialTitle);
  const [datetime, setDatetime] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const defaultDatetime = React.useMemo(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  }, []);

  React.useEffect(() => {
    if (!datetime) setDatetime(defaultDatetime);
  }, [datetime, defaultDatetime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const start = new Date(datetime);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // + 1 hora
      await props.onCreate(title, start.toISOString(), end.toISOString());
      props.onClose();
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
        minWidth: "340px",
        color: "var(--text-normal)",
        backgroundColor: "var(--background-modular-form)",
        borderRadius: "6px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600" }}>Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "6px 8px",
            border: "1px solid var(--background-modifier-border)",
            borderRadius: "4px",
            backgroundColor: "var(--background-input)",
            color: "var(--text-input)",
            fontSize: "13px",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600" }}>
          Data e hora
        </label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "6px 8px",
            border: "1px solid var(--background-modifier-border)",
            borderRadius: "4px",
            backgroundColor: "var(--background-input)",
            color: "var(--text-input)",
            fontSize: "13px",
          }}
        />
      </div>

      {error && (
        <div
          style={{
            color: "var(--text-error, #ef5350)",
            fontSize: "12px",
            backgroundColor: "var(--background-modifier-error, rgba(239, 83, 80, 0.1))",
            padding: "6px 8px",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          marginTop: "4px",
        }}
      >
        <button
          type="button"
          onClick={props.onClose}
          style={{
            padding: "6px 14px",
            border: "1px solid var(--background-modifier-border)",
            borderRadius: "4px",
            backgroundColor: "var(--background-modifier-hover)",
            color: "var(--text-normal)",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "6px 16px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "var(--interaccent-normal, #4a90e2)",
            color: "#ffffff",
            cursor: loading ? "default" : "pointer",
            fontSize: "13px",
            fontWeight: "600",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Criando…" : "Criar lembrete"}
        </button>
      </div>
    </form>
  );
}

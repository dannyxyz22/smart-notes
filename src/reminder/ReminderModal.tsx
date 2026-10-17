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
  onCancel?: () => void;
}

export class ReminderModal extends Modal {
  private root: Root | null = null;
  private readonly props: ReminderModalProps;
  private submittedSuccessfully = false;

  constructor(app: App, props: ReminderModalProps) {
    super(app);
    this.props = props;
  }

  onOpen(): void {
    const { contentEl, modalEl } = this;
    contentEl.empty();
    contentEl.addClass("reminder-modal-content");

    // Garante que o dialog use o fundo sólido oficial do Obsidian
    modalEl.addClass("reminder-modal-dialog");
    modalEl.style.backgroundColor = "var(--background-primary)";
    modalEl.style.color = "var(--text-normal)";
    modalEl.style.borderRadius = "8px";
    modalEl.style.boxShadow = "var(--shadow-l, 0 10px 25px rgba(0, 0, 0, 0.3))";
    modalEl.style.padding = "20px";
    modalEl.style.maxWidth = "420px";
    modalEl.style.width = "100%";

    contentEl.createEl("h2", {
      text: "Criar Lembrete",
      cls: "reminder-modal-title",
    });

    const rootEl = contentEl.createDiv("reminder-modal-root");
    this.root = createRoot(rootEl);
    this.render();
  }

  render(): void {
    if (!this.root) return;
    this.root.render(
      <ReminderForm
        initialTitle={this.props.initialTitle}
        onCreate={this.props.onCreate}
        onClose={(success) => {
          if (success) this.submittedSuccessfully = true;
          this.close();
        }}
      />
    );
  }

  onClose(): void {
    if (!this.submittedSuccessfully) {
      this.props.onCancel?.();
    }
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
  onClose: (success: boolean) => void;
}) {
  const [title, setTitle] = React.useState(props.initialTitle);
  const [datetime, setDatetime] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const defaultDatetime = React.useMemo(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const pad = (n: number) => String(n).padStart(2, "0");
    return (
      `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
      `T${pad(now.getHours())}:${pad(now.getMinutes())}`
    );
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
      props.onClose(true);
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
        gap: "14px",
        marginTop: "12px",
        color: "var(--text-normal)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--text-normal)",
          }}
        >
          Título
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid var(--background-modifier-border)",
            borderRadius: "6px",
            backgroundColor:
              "var(--background-modifier-form-field, var(--background-secondary))",
            color: "var(--text-normal)",
            fontSize: "13px",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--text-normal)",
          }}
        >
          Data e hora
        </label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
          className="reminder-modal-datetime-input"
          style={{
            width: "100%",
            minHeight: "40px",
            padding: "8px 12px 8px 34px",
            border: "1px solid var(--background-modifier-border)",
            borderRadius: "6px",
            backgroundColor:
              "var(--background-modifier-form-field, var(--background-secondary))",
            color: "var(--text-normal)",
            fontSize: "13px",
            boxSizing: "border-box",
          }}
        />
      </div>

      {error && (
        <div
          style={{
            color: "var(--text-error, #ef5350)",
            fontSize: "12px",
            backgroundColor:
              "var(--background-modifier-error, rgba(239, 83, 80, 0.1))",
            padding: "8px 10px",
            borderRadius: "4px",
            border: "1px solid var(--text-error, #ef5350)",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
          marginTop: "8px",
        }}
      >
        <button
          type="button"
          onClick={() => props.onClose(false)}
          className="mod-cancel"
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
          className="mod-cta"
          style={{
            padding: "6px 16px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: "var(--interactive-accent)",
            color: "var(--text-on-accent, #ffffff)",
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

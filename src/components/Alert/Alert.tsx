import "./Alert.css";

interface AlertProps {
  message: string;
  variant?: "success" | "error";
  actionLabel?: string;
  onAction?: () => void;
}

function Alert({ message, variant = "success", actionLabel, onAction }: AlertProps) {
  return (
    <div className={`alert alert--${variant}`}>
      <span className="alert__icon" aria-hidden="true">{variant === "success" ? "✓" : "✗"}</span>
      <span className="alert__message">{message}</span>
      {actionLabel && onAction && (
        <button type="button" className="alert__action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default Alert;
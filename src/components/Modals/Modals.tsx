import type { ReactNode } from "react";
import "./Modals.css";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

function Modal({ onClose, children }: ModalProps) {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-box">{children}</div>
    </div>
  );
}

export default Modal;
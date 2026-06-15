"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "./modal.module.css";

type ModalProps = {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  modalClassName?: string;
};

export function Modal({
  title,
  description,
  onClose,
  children,
  modalClassName,
}: ModalProps) {
  const modalRoot =
    typeof document !== "undefined"
      ? document.getElementById("modal-root")
      : null;

  if (!modalRoot) {
    return null;
  }

  const modalElement = (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={`${styles.modal} ${modalClassName ?? ""}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <div className={styles.heading}>
            <h2 className={styles.title}>{title}</h2>
            {description ? (
              <p className={styles.description}>{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );

  return createPortal(modalElement, modalRoot);
}

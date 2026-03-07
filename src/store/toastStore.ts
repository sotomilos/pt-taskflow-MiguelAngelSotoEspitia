"use client";

import { create } from "zustand";

export type ToastVariant = "success" | "error" | "info";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  createdAt: number;
};

type ToastInput = {
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number; // default 3200
};

type ToastState = {
  toasts: Toast[];
  push: (t: ToastInput) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

const MAX_TOASTS = 4;
let seq = 0;

function genId() {
  seq = (seq + 1) % 1_000_000_000;
  return `${Date.now()}-${seq}`;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  push: (t) => {
    const id = genId();
    const duration = t.duration ?? 3200;

    const toast: Toast = {
      id,
      title: t.title,
      description: t.description,
      variant: t.variant,
      duration,
      createdAt: Date.now(),
    };

    set((s) => ({
      toasts: [...s.toasts, toast].slice(-MAX_TOASTS),
    }));

    if (typeof window !== "undefined" && duration > 0) {
      window.setTimeout(() => get().dismiss(id), duration);
    }

    return id;
  },

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  clear: () => set({ toasts: [] }),
}));
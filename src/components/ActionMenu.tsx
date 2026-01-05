"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/helper";
import { useSidebar } from "@/components/AppShell";

type ActionItem = {
  label: string;
  onClick: () => void;
  destructive?: boolean;
};

export default function ActionMenu({
  anchorEl,
  items,
  onClose,
}: {
  anchorEl: HTMLElement | null;
  items: ActionItem[];
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const { isSidebarOpen } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  const position = useMemo(() => {
    if (!anchorEl) return { top: 0, right: 0 };
    const rect = anchorEl.getBoundingClientRect();
    const gap = 8;
    const top = rect.bottom + gap;
    const right = Math.max(0, window.innerWidth - rect.right);
    return { top, right };
  }, [anchorEl, isSidebarOpen]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target) && anchorEl && !anchorEl.contains(target)) {
        onClose();
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [anchorEl, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      ref={menuRef}
      style={{ position: "fixed", top: position.top, right: position.right, width: 208 }}
      className="z-[1000]"
    >
      <div className="rounded-xl border border-gray-200 bg-white p-1 shadow-lg">
        {items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={item.onClick}
            className={cn(
              "w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50",
              item.destructive && "text-red-600 hover:bg-red-50"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}

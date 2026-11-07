import { Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

// Quantity picker plus add-to-cart pill; the count resets after each add.
export function AddDishButton({ onAdd, label, compact = false }: { onAdd: (qty: number) => void; label: string; compact?: boolean }) {
  const { t } = useI18n();
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const click = () => {
    onAdd(qty);
    setFlash(true);
    setQty(1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFlash(false), 1200);
  };

  return (
    <div className={`flex shrink-0 items-center ${compact ? "gap-1.5" : "gap-2"}`}>
      <div className="flex items-center gap-0.5 rounded-full border">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          aria-label={t("qty_less")}
          className="rounded-full p-1.5 text-muted-foreground hover:text-primary disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span aria-live="polite" className="min-w-4 text-center text-sm font-semibold">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => Math.min(9, q + 1))}
          aria-label={t("qty_more")}
          className="rounded-full p-1.5 text-muted-foreground hover:text-primary"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <button
        onClick={click}
        className={`flex items-center gap-1 rounded-full bg-primary text-primary-foreground ${compact ? "px-3 py-1.5 text-sm" : "px-3 py-1.5 text-sm"}`}
        aria-label={`${label} ${flash ? "✓" : ""}`}
      >
        {flash ? "✓" : <><Plus className="h-3.5 w-3.5" /> {label}</>}
      </button>
    </div>
  );
}

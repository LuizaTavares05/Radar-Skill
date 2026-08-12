import { useState } from "react";
import type { ElementType, ReactNode } from "react";

type FloatingInputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: ElementType;
  rightIcon?: ReactNode;
  onRightIconClick?: () => void;
  error?: string;
};

export default function FloatingInput({
  label,
  type = "text",
  value,
  onChange,
  icon: Icon,
  rightIcon,
  onRightIconClick,
  error,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div>
      <div
        className={`flex items-center border-2 rounded-2xl bg-card transition-all duration-200 ${
          focused
            ? "border-primary shadow-[0_0_0_3px_rgba(10,78,119,0.12)]"
            : error
              ? "border-danger"
              : "border-border hover:border-muted/50"
        }`}
      >
        {Icon && (
          <div
            className={`pl-4 flex-shrink-0 transition-colors duration-200 ${focused ? "text-primary" : "text-muted"}`}
          >
            <Icon size={18} />
          </div>
        )}
        <div className="relative flex-1 px-4">
          <label
            className={`absolute left-4 transition-all duration-200 pointer-events-none select-none ${
              isActive
                ? "top-2 text-xs font-semibold text-primary"
                : "top-1/2 -translate-y-1/2 text-sm text-muted font-normal"
            }`}
          >
            {label}
          </label>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent outline-none text-foreground text-base pb-2 pt-6"
            aria-label={label}
          />
        </div>
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            tabIndex={-1}
            className="pr-4 flex-shrink-0 text-muted hover:text-text-secondary transition-colors duration-150"
            aria-label="Mostrar/ocultar senha"
          >
            {rightIcon}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger pl-1 font-medium">{error}</p>}
    </div>
  );
}

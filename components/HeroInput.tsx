"use client";

import { useState, useRef, useEffect } from "react";

interface HeroInputProps {
  onSubmit: (url: string) => void;
  disabled?: boolean;
}

export default function HeroInput({ onSubmit, disabled }: HeroInputProps) {
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !disabled) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="animate-fade-in flex flex-col items-center gap-12 w-full max-w-2xl mx-auto px-6">
      {/* Title */}
      <div className="text-center space-y-4">
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight"
          style={{ letterSpacing: "-0.04em" }}
        >
          Repo<span style={{ color: "var(--color-primary)" }}>Score</span>
        </h1>
        <p
          className="text-lg md:text-xl max-w-md mx-auto"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Cole o link do seu repositório do GitHub e descubra o valor da sua
          ideia.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={`launcher-window p-2 transition-all duration-200 ${
            isFocused ? "animate-pulse-glow" : ""
          }`}
          style={{
            borderColor: isFocused
              ? "var(--color-primary-glow)"
              : "var(--color-border)",
          }}
        >
          <div className="flex items-center gap-3 px-4">
            {/* Prompt indicator */}
            <span
              className="text-sm font-mono shrink-0"
              style={{ color: "var(--color-primary)" }}
            >
              ❯
            </span>

            {/* Input field */}
            <input
              ref={inputRef}
              id="repo-url-input"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="https://github.com/usuario/repositorio"
              disabled={disabled}
              className="flex-1 bg-transparent border-none outline-none py-3 text-base font-mono placeholder-opacity-40"
              style={{
                color: "var(--color-text-primary)",
                caretColor: "var(--color-primary)",
              }}
              autoComplete="off"
              spellCheck={false}
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={disabled || !url.trim()}
              className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: url.trim()
                  ? "var(--color-primary)"
                  : "var(--color-surface-hover)",
                color: url.trim()
                  ? "var(--color-text-inverse)"
                  : "var(--color-text-muted)",
              }}
            >
              Analisar
            </button>
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div
          className="flex items-center justify-center gap-2 mt-4 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          Pressione{" "}
          <kbd className="kbd-key">Enter</kbd>{" "}
          para analisar
        </div>
      </form>
    </div>
  );
}

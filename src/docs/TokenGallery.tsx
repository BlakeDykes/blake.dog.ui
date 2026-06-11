import type { CSSProperties } from "react";

// Storybook-docs-only helpers. Rendering goes through var(--token) so every
// gallery follows the active data-theme live.

const label: CSSProperties = {
  fontFamily: "var(--font-family-code)",
  fontSize: "var(--font-size-sm)",
  color: "var(--color-fg)",
};

const row: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-md)",
};

const column: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-sm)",
  padding: "var(--space-md)",
  borderRadius: "var(--radius-md)",
  backgroundColor: "var(--color-bg)",
};

const SEMANTIC_COLORS = [
  "--color-bg",
  "--color-bg-subtle",
  "--color-bg-elevated",
  "--color-fg",
  "--color-fg-muted",
  "--color-fg-on-accent",
  "--color-accent",
  "--color-accent-hover",
  "--color-accent-active",
  "--color-border",
  "--color-border-strong",
  "--color-danger",
  "--color-danger-hover",
  "--color-focus-ring",
];

export function ColorTokens() {
  return (
    <div style={column}>
      {SEMANTIC_COLORS.map((name) => (
        <div key={name} style={row}>
          <div
            style={{
              width: "var(--space-xl)",
              height: "var(--space-xl)",
              borderRadius: "var(--radius-sm)",
              border: "var(--border-width-thin) solid var(--color-border)",
              backgroundColor: `var(${name})`,
            }}
          />
          <code style={label}>{name}</code>
        </div>
      ))}
    </div>
  );
}

const SPACES = [
  "--space-xs",
  "--space-sm",
  "--space-md",
  "--space-lg",
  "--space-xl",
];

export function SpaceTokens() {
  return (
    <div style={column}>
      {SPACES.map((name) => (
        <div key={name} style={row}>
          <div style={{ width: "10rem" }}>
            <div
              style={{
                width: `var(${name})`,
                height: "var(--space-sm)",
                backgroundColor: "var(--color-accent)",
              }}
            />
          </div>
          <code style={label}>{name}</code>
        </div>
      ))}
    </div>
  );
}

const FONT_SIZES = [
  "--font-size-xs",
  "--font-size-sm",
  "--font-size-md",
  "--font-size-lg",
  "--font-size-xl",
  "--font-size-2xl",
  "--font-size-3xl",
];

export function TypeTokens() {
  return (
    <div style={column}>
      {FONT_SIZES.map((name) => (
        <div key={name} style={row}>
          <span
            style={{
              fontFamily: "var(--font-family-body)",
              fontSize: `var(${name})`,
              color: "var(--color-fg)",
            }}
          >
            Aa
          </span>
          <code style={label}>{name}</code>
        </div>
      ))}
    </div>
  );
}

const RADII = ["--radius-sm", "--radius-md", "--radius-lg", "--radius-pill"];

export function RadiusTokens() {
  return (
    <div style={{ ...column, flexDirection: "row", alignItems: "flex-end" }}>
      {RADII.map((name) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-xs)",
          }}
        >
          <div
            style={{
              width: "var(--space-xl)",
              height: "var(--space-xl)",
              borderRadius: `var(${name})`,
              backgroundColor: "var(--color-accent)",
            }}
          />
          <code style={label}>{name}</code>
        </div>
      ))}
    </div>
  );
}

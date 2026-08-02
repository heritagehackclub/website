"use client";

import type { ComponentProps, ReactNode } from "react";
import { Button, Card, Input, Label, Textarea } from "theme-ui";
import { HackIcon } from "./hack-icon";

export function ActionButton({
  icon,
  children,
  variant = "primary",
  ...props
}: ComponentProps<typeof Button> & {
  icon?: ComponentProps<typeof HackIcon>["name"];
  children: ReactNode;
}) {
  return (
    <Button variant={variant} className="action-button" {...props}>
      {icon ? <HackIcon name={icon} size={18} /> : null}
      <span>{children}</span>
    </Button>
  );
}

export function SurfaceCard({
  className = "",
  children,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card className={`surface-card ${className}`} {...props}>
      {children}
    </Card>
  );
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "red" | "green" | "blue" | "yellow";
}) {
  return <span className={`status-pill status-pill--${tone}`}>{children}</span>;
}

export function Field({
  id,
  label,
  multiline = false,
  hint,
  ...props
}: {
  id: string;
  label: string;
  hint?: string;
} & (
  | ({ multiline: true } & ComponentProps<typeof Textarea>)
  | ({ multiline?: false } & ComponentProps<typeof Input>)
)) {
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea id={id} {...(props as ComponentProps<typeof Textarea>)} />
      ) : (
        <Input id={id} {...(props as ComponentProps<typeof Input>)} />
      )}
      {hint ? <small>{hint}</small> : null}
    </div>
  );
}

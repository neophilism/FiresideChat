export function formatDuration(seconds: number | null) {
  if (!seconds || seconds < 1) return null;
  const whole = Math.round(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${Math.max(1, minutes)} min`;
}

export function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function officeLabel(kind: string, isCurrent: boolean, state?: string | null) {
  const prefix = isCurrent ? "" : "Former ";
  if (kind === "PRESIDENT") return `${prefix}U.S. President`;
  if (kind === "SENATE") return `${prefix}U.S. Senator${state ? ` · ${state}` : ""}`;
  if (kind === "SHADOW_SENATE")
    return `${prefix}D.C. Shadow Senator`;
  return `${prefix}U.S. Representative${state ? ` · ${state}` : ""}`;
}

export const DEFAULT_COMPANIES = [
  {
    name: "360 Medical",
    color: "#00A3FF",
    description: "Medical technology and automation",
  },
  {
    name: "WoundCare 360",
    color: "#A855F7",
    description: "Wound care solutions and operations",
  },
  {
    name: "BCMD",
    color: "#F97316",
    description: "Billing and practice management",
  },
  {
    name: "OAF Nation",
    color: "#22C55E",
    description: "Media, content, and community",
  },
] as const;

export function getCompanyInitials(name: string): string {
  const known: Record<string, string> = {
    "360 Medical": "360",
    "WoundCare 360": "WC",
    BCMD: "B",
    "OAF Nation": "OAF",
  };
  if (known[name]) return known[name];
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return words.map((w) => w[0]).join("").slice(0, 3).toUpperCase();
  return name.slice(0, 3).toUpperCase();
}

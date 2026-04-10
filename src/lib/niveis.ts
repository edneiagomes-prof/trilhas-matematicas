export interface NivelInfo {
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
}

export const NIVEL_INFO: Record<number, NivelInfo> = {
  1: {
    label: "Branco",
    emoji: "⬜",
    color: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-300",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-700",
  },
  2: {
    label: "Azul",
    emoji: "🔵",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-300",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
  },
  3: {
    label: "Amarelo",
    emoji: "🟡",
    color: "text-yellow-700",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-700",
  },
  4: {
    label: "Vermelho",
    emoji: "🔴",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-300",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
  },
};

export function getNivelInfo(nivel: number): NivelInfo {
  return NIVEL_INFO[nivel] ?? NIVEL_INFO[1];
}

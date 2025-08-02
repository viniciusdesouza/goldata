import {
  Users,
  Settings,
  ChartBar as ChartNoAxesColumnIcon,
  Share2,
  Heart,
  SearchCheck,
  CircleDot,
  CalendarClock,
  CheckCircle2,
  Newspaper,
  FileText,
  Megaphone,
} from "lucide-react";

export function getMainTabHref(tabKey: string) {
  switch (tabKey) {
    case "seguindo": return "/?tab=seguindo&subtab=favoritos";
    case "descobrir": return "/?tab=descobrir&subtab=partidas";
    case "compartilhados": return "/?tab=compartilhados&subtab=voceCompartilhou";
    case "resultados": return "/?tab=resultados&subtab=partidas";
    default: return "/?tab=seguindo&subtab=favoritos";
  }
}

export function getPartidasSubTabHref(key: string) {
  switch (key) {
    case "aoVivo":
      return "/?tab=descobrir&subtab=partidas&partidasTab=aoVivo#partidas";
    case "programada":
      return "/?tab=descobrir&subtab=partidas&partidasTab=programada#partidas";
    case "terminados":
      return "/?tab=descobrir&subtab=partidas&partidasTab=terminados#partidas";
    default:
      return "/?tab=descobrir&subtab=partidas#partidas";
  }
}

export const FUTEBOL_HOJE_TABS = [
  {
    key: "seguindo",
    label: "Seguindo",
    icon: Heart,
    color: "#ef4444",
    href: getMainTabHref("seguindo"),
  },
  {
    key: "descobrir",
    label: "Descobrir",
    icon: ChartNoAxesColumnIcon,
    color: "#2563eb",
    href: getMainTabHref("descobrir"),
  },
  {
    key: "compartilhados",
    label: "Compartilhados",
    icon: Share2,
    color: "#06b6d4",
    href: getMainTabHref("compartilhados"),
  },
  {
    key: "resultados",
    label: "Resultados",
    icon: SearchCheck,
    color: "#2563eb",
    href: getMainTabHref("resultados"),
  },
];

export const PARTIDAS_TABS = [
  {
    key: "aoVivo",
    label: "Ao Vivo",
    icon: CircleDot,
    color: "#ef4444",
    href: getPartidasSubTabHref("aoVivo"),
  },
  {
    key: "programada",
    label: "Programada",
    icon: CalendarClock,
    color: "#2563eb",
    href: getPartidasSubTabHref("programada"),
  },
  {
    key: "terminados",
    label: "Terminados",
    icon: CheckCircle2,
    color: "#16a34a",
    href: getPartidasSubTabHref("terminados"),
  },
];

export const BLOG_TABS = [
  {
    key: "todos",
    label: "Todos",
    icon: Newspaper,
    color: "#2563eb",
    href: "/blog?tab=todos",
  },
  {
    key: "artigos",
    label: "Artigos",
    icon: FileText,
    color: "#16a34a",
    href: "/blog?tab=artigos",
  },
  {
    key: "noticias",
    label: "Notícias",
    icon: Megaphone,
    color: "#ef4444",
    href: "/blog?tab=noticias",
  },
];

export function getMenuList(pathname: string) {
  return [
    {
      href: "/?tab=seguindo&subtab=favoritos",
      label: "Futebol Hoje",
      icon: ChartNoAxesColumnIcon,
      isCategory: true,
      tabs: FUTEBOL_HOJE_TABS,
    },
    {
      href: getPartidasSubTabHref("aoVivo"),
      label: "Partidas de Futebol",
      icon: ChartNoAxesColumnIcon,
      isCategory: true,
      tabs: PARTIDAS_TABS,
    },
    {
      href: "/blog?tab=todos",
      label: "Artigos & Notícias",
      icon: Newspaper,
      isCategory: true,
      tabs: BLOG_TABS,
    },
    {
      href: "/users",
      label: "Usuários",
      icon: Users,
      isSection: false,
    },
    {
      href: "/account",
      label: "Conta",
      icon: Settings,
      isSection: false,
    },
  ];
}
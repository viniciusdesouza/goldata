import React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { GlobalSearch } from "@/components/global-search/GlobalSearch";
import { Button } from "@/components/ui/button";
import { GoldataLogo } from "@/components/admin-panel/GoldataLogo";

interface NavbarProps {
  title: string;
  onOpenMenuMobile?: () => void;
}

/**
 * Hook para detectar se está em tela mobile via breakpoint.
 */
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(`(max-width:${breakpoint - 1}px)`);
    setIsMobile(media.matches);
    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [breakpoint]);
  return isMobile;
}

export function Navbar({ title, onOpenMenuMobile }: NavbarProps) {
  const isMobile = useIsMobile();

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="px-4 sm:px-8 flex h-16 items-center relative">
          {/* Esquerda: Menu lateral */}
          <div className="flex items-center min-w-0">
            <Button
              className="h-8 lg:hidden mr-4"
              variant="outline"
              size="icon"
              onClick={onOpenMenuMobile}
              aria-label="Abrir menu"
            >
              <MenuIcon size={20} />
            </Button>
          </div>
          {/* Centro: Logo */}
          <div
            className={
              isMobile
                ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10"
                : "flex items-center lg:ml-8"
            }
          >
            <Link href="/" className="flex items-center gap-1 shrink-0" aria-label="Página inicial">
              <GoldataLogo className="w-10 h-10 text-primary dark:text-white" />
            </Link>
          </div>
          {/* Título da seção (desktop) */}
          <span className="hidden lg:inline font-bold ml-3 truncate">{title}</span>
          {/* Barra de pesquisa (md+) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl px-2 hidden md:block">
            <GlobalSearch />
          </div>
          {/* Direita: Botões */}
          <div className="flex items-center justify-end space-x-2 ml-auto">
            <ModeToggle />
          </div>
        </div>
        {/* Mobile: Barra de pesquisa */}
        <div className="block md:hidden px-4 pb-2">
          <GlobalSearch />
        </div>
      </header>
      {/* Espaçamento extra no mobile para afastar o conteúdo do navbar */}
      {isMobile && <div className="h-6 md:hidden"></div>}
    </>
  );
}
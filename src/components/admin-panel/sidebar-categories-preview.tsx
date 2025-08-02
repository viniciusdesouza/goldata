"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import PinButton from "@/components/campeonatos/PinButton";
import PinButtonClube from "@/components/pesquisa-clubes/PinButtonClube";
import ShareButtonClube from "@/components/pesquisa-clubes/ShareButtonClube";
import ShareButtonCampeonato from "@/components/campeonatos/ShareButtonCampeonato";
import "@/components/pesquisa-clubes/sharebuttonclube.css";
import "@/components/campeonatos/sharebuttoncampeonato.css";

type PreviewItem = {
  id: number | string;
  name: string;
  logo?: string;
  iconSvg?: string;
  iconComponent?: JSX.Element;
  iconColor?: string;
  showPin?: boolean;
  url?: string;
  itemType?: "clube" | "campeonato";
};

type SidebarCategoryPreviewProps = {
  title?: string;
  icon?: JSX.Element;
  fetchUrl?: string | null;
  allUrl: string;
  processData: (data?: any) => PreviewItem[];
  active?: boolean;
  customLabel?: string;
  itemUrlPrefix?: string;
  layout?: "grid" | "list";
  activeItemId?: string | number;
};

function RawSidebarCategoryPreview(props: SidebarCategoryPreviewProps) {
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.fetchUrl) {
      fetch(props.fetchUrl)
        .then((res) => res.json())
        .then((data) => setItems(props.processData(data).slice(0, 6)))
        .finally(() => setLoading(false));
    } else {
      setItems(props.processData().slice(0, 6));
      setLoading(false);
    }
  }, [props.fetchUrl, props.processData]);

  const ITEM_HEIGHT = 44;

  function getSidebarLink(item: PreviewItem): string {
    if (typeof item.id === "string") {
      switch (item.id) {
        case "aoVivo":
          return "/?tab=paraVoce&subtab=aoVivo";
        case "programada":
          return "/?tab=paraVoce&subtab=programada";
        case "terminados":
          return "/?tab=paraVoce&subtab=terminados";
        case "favoritos":
          return "/?tab=seguindo&subtab=favoritos";
        case "clubesFavoritos":
          return "/?tab=seguindo&subtab=clubesFavoritos";
        case "campeonatosFavoritos":
          return "/?tab=seguindo&subtab=campeonatosFavoritos";
      }
    }
    if (item.url) return item.url;
    if (props.itemUrlPrefix) return `${props.itemUrlPrefix}${item.id}`;
    return `${props.allUrl}/${item.id}`;
  }

  // Define largura dos nomes tanto para list quanto para grid
  const nameMaxWidth = "max-w-[119px]"; // Reduzido para ~1 caractere a menos

  return (
    <section className="mb-4">
      {props.title && (
        <div className="flex items-center gap-2 mb-1.5 mt-3 px-1">
          {props.icon && (
            <span className="text-[15px] text-black dark:text-zinc-500">{props.icon}</span>
          )}
          <span className="uppercase tracking-wide text-base font-normal text-black dark:text-zinc-400 select-none">
            {props.title}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="px-3 py-0 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse w-full"
                style={{ height: ITEM_HEIGHT }}
              />
            ))
          : items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center w-full px-3 pr-0 sidebar-preview-item rounded-lg group transition-all duration-150",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800/80 shadow-sm",
                  props.activeItemId && String(props.activeItemId) === String(item.id)
                    ? "bg-zinc-200 dark:bg-zinc-800 ring-2 ring-orange-500 border-orange-400 dark:border-orange-600"
                    : "bg-white dark:bg-transparent"
                )}
                style={{ height: ITEM_HEIGHT, minHeight: ITEM_HEIGHT, marginBottom: 2 }}
                tabIndex={-1}
              >
                {item.iconComponent && (
                  <span
                    className="inline-flex items-center justify-center mr-2"
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      minHeight: 24,
                      color: item.iconColor || "currentColor",
                    }}
                  >
                    {item.iconComponent}
                  </span>
                )}
                {!item.iconComponent && item.iconSvg && (
                  <span
                    className="inline-flex items-center justify-center mr-2"
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      minHeight: 24,
                      color: item.iconColor || undefined,
                    }}
                    dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                  />
                )}
                {item.logo && (
                  <span className="mr-2">
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="w-6 h-6 object-contain rounded-full border border-zinc-200 dark:border-zinc-700 bg-white"
                      loading="lazy"
                      style={{
                        minWidth: 24,
                        minHeight: 24,
                      }}
                    />
                  </span>
                )}
                <span className="flex items-center w-full relative">
                  <Link
                    href={getSidebarLink(item)}
                    className={cn(
                      "truncate text-[15px] font-normal text-black dark:text-zinc-100",
                      "group-hover:underline",
                      nameMaxWidth,
                      "transition-colors"
                    )}
                    tabIndex={0}
                    title={item.name}
                    onClick={e => e.stopPropagation()}
                    style={{ lineHeight: '1.18', fontSize: 15 }}
                  >
                    {item.name}
                  </Link>
                  {item.showPin && typeof item.id === "number" && (
                    <span className="absolute right-2 flex items-center gap-[2px]">
                      {/* gap-[2px] aproxima bem os botões */}
                      {item.itemType === "clube" ? (
                        <span
                          className={cn(
                            "rounded-full transition-colors duration-100",
                            "bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700",
                            "cursor-pointer select-none",
                            "p-1"
                          )}
                          tabIndex={-1}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: "9999px",
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          <ShareButtonClube id={Number(item.id)} showText={false} className="club-share-icon-btn" />
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "rounded-full transition-colors duration-100",
                            "bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700",
                            "cursor-pointer select-none",
                            "p-1"
                          )}
                          tabIndex={-1}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: "9999px",
                          }}
                          onClick={e => e.stopPropagation()}
                        >
                          <ShareButtonCampeonato id={Number(item.id)} showText={false} className="champ-share-icon-btn" />
                        </span>
                      )}
                      <span
                        className={cn(
                          "rounded-full transition-colors duration-100",
                          "bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-700",
                          "cursor-pointer select-none",
                          "p-1"
                        )}
                        tabIndex={-1}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: "9999px",
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        {item.itemType === "clube"
                          ? <PinButtonClube id={Number(item.id)} size={20} showText={false} />
                          : <PinButton id={Number(item.id)} size={20} showText={false} />
                        }
                      </span>
                    </span>
                  )}
                </span>
              </div>
            ))}
      </div>
    </section>
  );
}

export function SidebarCategoryPreview(props: SidebarCategoryPreviewProps) {
  return <RawSidebarCategoryPreview {...props} />;
}
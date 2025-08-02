import "./globals.css";
import "@/components/partidas-futebol/mi-match-root.css";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { ADMIN_PANEL_CONTENT_PADDING_TOP } from "@/app/layout-constants";
import { FixedChampionshipsProvider } from "@/components/campeonatos/FixedChampionshipsContext";
import { ToastProvider } from "@/components/ui/ToastContext";
import { TabsProvider } from "@/components/partidas-futebol/TabsContext";
import { FavoritosProvider } from "@/components/partidas-futebol/FavoritosContext";
import { FixedClubesProvider } from "@/components/pesquisa-clubes/FixedClubesContext";
import { CompartilhadosProvider } from "@/components/partidas-futebol/CompartilhadosContext";
import { CompartilhadosRecebidosProvider } from "@/components/partidas-futebol/CompartilhadosRecebidosContext";
import { ResultadosSalvosProvider } from "@/components/global-search/ResultadosSalvosContext";
import { GlobalSearchExpandProvider } from "@/components/global-search/GlobalSearchExpandContext";
import { CookieBunner } from "@/components/CookieBunner/Bunner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "GolData",
  description: "Seu site de estatísticas de futebol",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <FixedChampionshipsProvider>
            <FixedClubesProvider>
              <ToastProvider>
                <FavoritosProvider>
                  <CompartilhadosProvider>
                    <CompartilhadosRecebidosProvider>
                      <TabsProvider>
                        <ResultadosSalvosProvider>
                          <GlobalSearchExpandProvider>
                            <AdminPanelLayout>
                              <div className={`min-h-screen flex flex-col pb-16 ${ADMIN_PANEL_CONTENT_PADDING_TOP}`}>
                                {children}
                              </div>
                              <CookieBunner />
                            </AdminPanelLayout>
                          </GlobalSearchExpandProvider>
                        </ResultadosSalvosProvider>
                      </TabsProvider>
                    </CompartilhadosRecebidosProvider>
                  </CompartilhadosProvider>
                </FavoritosProvider>
              </ToastProvider>
            </FixedClubesProvider>
          </FixedChampionshipsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
"use client";

import React from "react";
import { SidebarContent } from "./sidebar-content";

export function MenuCustom() {
  return (
    <div className="yt-sidebar-menu-custom">
      <SidebarContent />
      <div className="yt-sidebar-footer">
        <div className="yt-sidebar-footer-links">
          <a href="/pg/sobre">Sobre</a>
          <a href="/pg/publicidade">Publicidade</a>
          <a href="/pg/fontes-metodologia">Fontes e Metodologia</a>
          <a href="/pg/contato">Contato</a>
          <a href="/pg/termos">Termos de uso</a>
          <a href="/pg/privacidade">Privacidade</a>
          <a href="/pg/cookies">Política de Cookies</a>
          <a href="/pg/faq">FAQ</a>
        </div>
        <div className="yt-sidebar-footer-copyright">
          &copy; {new Date().getFullYear()} Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
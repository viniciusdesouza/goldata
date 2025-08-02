import React, { ReactNode } from "react";

interface ContentLayoutProps {
  title: string;
  children: ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      {/* O Navbar já está no layout principal */}
      <div className="p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
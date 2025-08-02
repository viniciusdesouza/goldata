import Link from "next/link";

const footerLinks = [
  [
    { label: "Sobre", href: "/pg/sobre" },
    { label: "Publicidade", href: "/pg/publicidade" },
    { label: "Fontes e Metodologia", href: "/pg/fontes-metodologia" },
    { label: "Entre em contato", href: "/pg/contato" },
  ],
  [
    { label: "Termos de uso", href: "/pg/termos" },
    { label: "Privacidade", href: "/pg/privacidade" },
    { label: "Política de Cookies", href: "/pg/cookies" },
    { label: "FAQ", href: "/pg/faq" },
  ],
];

export function Footer() {
  return (
    <footer className="w-full pt-3 pb-2 flex flex-col items-center bg-transparent">
      <nav className="w-full">
        {footerLinks.map((group, idx) => (
          <ul
            key={idx}
            className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[13px] font-medium text-zinc-500 dark:text-zinc-300"
          >
            {group.map((item, i) => (
              <li key={item.href} className="flex items-center">
                <Link
                  href={item.href}
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-100"
                  tabIndex={0}
                >
                  {item.label}
                </Link>
                {i < group.length - 1 && (
                  <span className="mx-1 select-none text-zinc-300 dark:text-zinc-700">·</span>
                )}
              </li>
            ))}
          </ul>
        ))}
      </nav>
      <div className="mt-2 text-[12px] text-zinc-400 dark:text-zinc-500 text-center font-normal w-full">
        &copy; {new Date().getFullYear()} Todos os direitos reservados.
      </div>
    </footer>
  );
}
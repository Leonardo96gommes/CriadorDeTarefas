import { ThemeToggle } from "./theme-toggle"

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background z-10">
      <div className="container flex h-14 md:h-16 items-center justify-between py-2 md:py-4 px-4 md:px-6">
        <div className="w-10 md:block hidden">{/* Espaço vazio para equilibrar o layout em desktop */}</div>
        <h1 className="text-xl md:text-2xl font-bold text-center flex-1 md:flex-none">Gerenciador de Tarefas</h1>
        <ThemeToggle />
      </div>
    </header>
  )
}


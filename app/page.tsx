import { Suspense } from "react"
import TaskManager from "@/components/task-manager"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-4 px-4 md:py-8 md:px-6">
        <Suspense fallback={<div className="flex items-center justify-center p-8">Carregando...</div>}>
          <TaskManager />
        </Suspense>
      </main>
    </div>
  )
}


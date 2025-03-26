"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get("message") || "Ocorreu um erro desconhecido"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Erro</h1>
        <p className="mb-6 text-muted-foreground">{errorMessage}</p>
        <Button asChild>
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
      <ErrorContent />
    </Suspense>
  )
}


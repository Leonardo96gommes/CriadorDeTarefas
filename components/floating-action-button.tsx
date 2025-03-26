"use client"

import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingActionButtonProps {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button onClick={onClick} className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg" size="icon">
      <PlusIcon className="h-6 w-6" />
      <span className="sr-only">Adicionar tarefa</span>
    </Button>
  )
}


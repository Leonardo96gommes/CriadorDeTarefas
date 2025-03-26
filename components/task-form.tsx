"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Task } from "@/lib/types"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface TaskFormProps {
  onAddTask: (task: Task) => void
  onCancel: () => void
  isMobile?: boolean
}

export default function TaskForm({ onAddTask, onCancel, isMobile = false }: TaskFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    let dueDate: string | undefined = undefined

    if (date) {
      const dateObj = new Date(date)
      if (time) {
        const [hours, minutes] = time.split(":").map(Number)
        dateObj.setHours(hours, minutes)
      }
      dueDate = dateObj.toISOString()
    }

    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: false,
      dueDate,
      createdAt: new Date().toISOString(),
    }

    onAddTask(newTask)
  }

  return (
    <div className="mt-4 md:mt-6 p-3 md:p-4 border rounded-lg bg-muted/30">
      <h3 className="font-medium text-sm md:text-base mb-3 md:mb-4">Nova Tarefa</h3>
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        <div className="space-y-1 md:space-y-2">
          <Label htmlFor="title" className="text-xs md:text-sm">
            Título
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título da tarefa"
            required
            className="text-sm"
          />
        </div>

        <div className="space-y-1 md:space-y-2">
          <Label htmlFor="description" className="text-xs md:text-sm">
            Descrição (opcional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite uma descrição para a tarefa"
            rows={isMobile ? 2 : 3}
            className="text-sm"
          />
        </div>

        <div className="space-y-1 md:space-y-2">
          <Label className="text-xs md:text-sm">Data e Hora</Label>
          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className={cn(
                    "justify-start text-left font-normal text-xs md:text-sm",
                    !date && "text-muted-foreground",
                    isMobile ? "w-full md:w-[240px]" : "w-[240px]",
                  )}
                >
                  <CalendarIcon className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align={isMobile ? "center" : "start"}>
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ptBR} />
              </PopoverContent>
            </Popover>

            {date && (
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full md:w-[120px] text-xs md:text-sm"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            size={isMobile ? "sm" : "default"}
            className="text-xs md:text-sm"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!title.trim()}
            size={isMobile ? "sm" : "default"}
            className="text-xs md:text-sm"
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  )
}


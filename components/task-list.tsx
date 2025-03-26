"use client"

import { Trash2, Calendar } from "lucide-react"
import type { Task } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TaskListProps {
  tasks: Task[]
  onToggleCompletion: (id: string) => void
  onDelete: (id: string) => void
  isMobile?: boolean
}

export default function TaskList({ tasks, onToggleCompletion, onDelete, isMobile = false }: TaskListProps) {
  if (tasks.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">Nenhuma tarefa encontrada</div>
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-3 md:p-4 border rounded-lg flex items-start gap-2 md:gap-3 ${
            task.completed ? "bg-muted/50" : ""
          }`}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id)}
            className="mt-0.5 md:mt-1"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium text-sm md:text-base truncate ${task.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p
                className={`text-xs md:text-sm mt-0.5 md:mt-1 line-clamp-2 ${task.completed ? "text-muted-foreground" : ""}`}
              >
                {task.description}
              </p>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1 mt-1 md:mt-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {format(new Date(task.dueDate), isMobile ? "dd/MM/yy HH:mm" : "PPp", { locale: ptBR })}
                </span>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "icon"}
            onClick={() => onDelete(task.id)}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir tarefa</span>
          </Button>
        </div>
      ))}
    </div>
  )
}


import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createCalendarEvent } from "@/lib/google-calendar"

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const accessToken = cookieStore.get("google_access_token")?.value

  if (!accessToken) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  try {
    const { tasks } = await request.json()

    // Filtrar tarefas com datas definidas
    const tasksToSync = tasks.filter((task: any) => task.dueDate)

    if (tasksToSync.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nenhuma tarefa com data para sincronizar",
      })
    }

    // Criar eventos para cada tarefa
    const results = []
    const errors = []

    for (const task of tasksToSync) {
      try {
        const result = await createCalendarEvent(accessToken, task)
        results.push({
          taskId: task.id,
          eventId: result.id,
          success: true,
        })
      } catch (error: any) {
        console.error(`Erro ao sincronizar tarefa ${task.id}:`, error)
        errors.push({
          taskId: task.id,
          error: error.message || "Erro desconhecido",
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors: errors.length > 0 ? errors : undefined,
      syncedCount: results.length,
      failedCount: errors.length,
    })
  } catch (error: any) {
    console.error("Erro ao sincronizar com o calendário:", error)
    return NextResponse.json(
      {
        error: error.message || "Falha ao sincronizar com o calendário",
      },
      { status: 500 },
    )
  }
}


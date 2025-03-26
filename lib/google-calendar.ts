// Função para criar eventos no Google Calendar
export async function createCalendarEvent(accessToken: string, task: any) {
  try {
    const dueDate = new Date(task.dueDate)
    const endDate = new Date(dueDate)
    endDate.setHours(endDate.getHours() + 1) // Duração padrão de 1 hora

    const event = {
      summary: task.title,
      description: task.description || "",
      start: {
        dateTime: dueDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: true,
      },
    }

    const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erro na resposta da API do Google Calendar:", errorData)
      throw new Error(errorData.error?.message || "Falha ao criar evento")
    }

    return await response.json()
  } catch (error) {
    console.error("Erro ao criar evento no Google Calendar:", error)
    throw error
  }
}

// Função para verificar e atualizar o token de acesso se necessário
export async function refreshAccessTokenIfNeeded() {
  try {
    // Verificar se o token está expirado
    const response = await fetch("/api/auth/refresh-token")
    return await response.json()
  } catch (error) {
    console.error("Erro ao atualizar token:", error)
    throw error
  }
}


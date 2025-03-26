import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  const accessToken = cookieStore.get("google_access_token")?.value

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { tasks } = await request.json()

    // Filter tasks with due dates
    const tasksToSync = tasks.filter((task: any) => task.dueDate)

    // Create events for each task
    const results = await Promise.all(
      tasksToSync.map(async (task: any) => {
        const dueDate = new Date(task.dueDate)
        const endDate = new Date(dueDate)
        endDate.setHours(endDate.getHours() + 1) // Default 1 hour duration

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
          throw new Error(`Failed to create event: ${response.statusText}`)
        }

        return await response.json()
      }),
    )

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error syncing with calendar:", error)
    return NextResponse.json({ error: "Failed to sync with calendar" }, { status: 500 })
  }
}


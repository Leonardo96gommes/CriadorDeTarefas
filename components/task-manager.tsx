"use client"

import { useState, useEffect, Suspense } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskList from "./task-list"
import TaskForm from "./task-form"
import type { Task } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import GoogleAuthButton from "./google-auth-button"
import { useMobile } from "@/hooks/use-mobile"
import { FloatingActionButton } from "./floating-action-button"
import { ErrorMessage } from "./error-message"
import { useSearchParams } from "next/navigation"

interface UserInfo {
  name: string
  email: string
  picture?: string
}

function TaskManagerContent() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const { toast } = useToast()
  const isMobile = useMobile()
  const searchParams = useSearchParams()

  // Verificar se acabou de autenticar
  useEffect(() => {
    const authSuccess = searchParams?.get("auth") === "success"
    if (authSuccess) {
      toast({
        title: "Autenticação bem-sucedida",
        description: "Você foi conectado à sua conta do Google com sucesso!",
      })
      // Forçar verificação de autenticação
      checkAuthStatus()
    }
  }, [searchParams, toast])

  // Verificar status de autenticação
  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/status")
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
      setUserInfo(data.userInfo)

      // Verificar se temos informações do usuário no cookie
      if (!data.userInfo && data.authenticated) {
        // Tentar obter informações do usuário do cookie diretamente
        try {
          const userInfoCookie = document.cookie
            .split("; ")
            .find((row) => row.startsWith("user_info="))
            ?.split("=")[1]

          if (userInfoCookie) {
            const parsedUserInfo = JSON.parse(decodeURIComponent(userInfoCookie))
            setUserInfo(parsedUserInfo)
          }
        } catch (error) {
          console.error("Erro ao obter informações do usuário do cookie:", error)
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status de autenticação:", error)
    }
  }

  // Load tasks from local storage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    // Check if user is authenticated with Google
    checkAuthStatus()
  }, [])

  // Save tasks to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (task: Task) => {
    setTasks([...tasks, task])
    setIsFormOpen(false)
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleGoogleSync = async () => {
    setIsLoading(true)
    setSyncError(null)

    try {
      // Verificar se há tarefas com data para sincronizar
      const tasksWithDates = tasks.filter((task) => task.dueDate)

      if (tasksWithDates.length === 0) {
        toast({
          title: "Nenhuma tarefa para sincronizar",
          description: "Adicione uma data às suas tarefas para sincronizá-las com o Google Calendar.",
        })
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/calendar/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha ao sincronizar com o Google Calendar")
      }

      const data = await response.json()

      if (data.syncedCount === 0 && data.failedCount > 0) {
        throw new Error("Não foi possível sincronizar nenhuma tarefa")
      }

      let description = `${data.syncedCount} tarefa(s) sincronizada(s) com sucesso!`

      if (data.failedCount > 0) {
        description += ` ${data.failedCount} tarefa(s) não puderam ser sincronizadas.`
      }

      toast({
        title: "Sincronização concluída",
        description,
      })
    } catch (error: any) {
      console.error("Erro ao sincronizar com o Google Calendar:", error)
      setSyncError(error.message || "Não foi possível sincronizar com o Google Calendar")
      toast({
        title: "Erro na sincronização",
        description: error.message || "Não foi possível sincronizar com o Google Calendar. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardContent className="p-3 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-semibold">Minhas Tarefas</h2>
            <div className="flex flex-wrap gap-2 items-center">
              <GoogleAuthButton
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
                onSync={handleGoogleSync}
                isMobile={isMobile}
                userInfo={userInfo}
                onAuthChange={checkAuthStatus}
              />
              {!isMobile && (
                <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Nova Tarefa
                </Button>
              )}
            </div>
          </div>

          {syncError && (
            <ErrorMessage
              message={syncError}
              onRetry={() => {
                setSyncError(null)
                handleGoogleSync()
              }}
            />
          )}

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <TaskList
                tasks={tasks}
                onToggleCompletion={toggleTaskCompletion}
                onDelete={deleteTask}
                isMobile={isMobile}
              />
            </TabsContent>
            <TabsContent value="pending">
              <TaskList
                tasks={tasks.filter((task) => !task.completed)}
                onToggleCompletion={toggleTaskCompletion}
                onDelete={deleteTask}
                isMobile={isMobile}
              />
            </TabsContent>
            <TabsContent value="completed">
              <TaskList
                tasks={tasks.filter((task) => task.completed)}
                onToggleCompletion={toggleTaskCompletion}
                onDelete={deleteTask}
                isMobile={isMobile}
              />
            </TabsContent>
          </Tabs>

          {isFormOpen && <TaskForm onAddTask={addTask} onCancel={() => setIsFormOpen(false)} isMobile={isMobile} />}
        </CardContent>
      </Card>

      {isMobile && !isFormOpen && <FloatingActionButton onClick={() => setIsFormOpen(true)} />}
    </>
  )
}

export default function TaskManager() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Carregando...</div>}>
      <TaskManagerContent />
    </Suspense>
  )
}


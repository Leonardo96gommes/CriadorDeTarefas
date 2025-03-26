"use client"
import { Button } from "@/components/ui/button"
import { Calendar, LogOut, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserInfo {
  name: string
  email: string
  picture?: string
}

interface GoogleAuthButtonProps {
  isAuthenticated: boolean
  isLoading: boolean
  onSync: () => Promise<void>
  isMobile?: boolean
  userInfo: UserInfo | null
  onAuthChange?: () => void
}

export default function GoogleAuthButton({
  isAuthenticated,
  isLoading,
  onSync,
  isMobile = false,
  userInfo,
  onAuthChange,
}: GoogleAuthButtonProps) {
  const { toast } = useToast()

  const handleGoogleAuth = () => {
    window.location.href = "/api/auth/google"
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast({
        title: "Desconectado",
        description: "Você foi desconectado da sua conta do Google.",
      })
      if (onAuthChange) {
        onAuthChange()
      } else {
        window.location.reload()
      }
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Não foi possível encerrar a sessão. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleSyncClick = async () => {
    try {
      // Primeiro, tenta atualizar o token se necessário
      await fetch("/api/auth/refresh-token")
      // Depois, executa a sincronização
      await onSync()
    } catch (error) {
      console.error("Erro ao sincronizar:", error)
    }
  }

  if (isAuthenticated && userInfo) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handleSyncClick}
          disabled={isLoading}
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-2 text-xs md:text-sm"
        >
          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          {isLoading ? "Sincronizando..." : isMobile ? "Sincronizar" : "Sincronizar"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={isMobile ? "sm" : "default"} className="flex items-center gap-2 p-1 md:p-2">
              <Avatar className="h-6 w-6 md:h-8 md:w-8">
                {userInfo.picture ? <AvatarImage src={userInfo.picture} alt={userInfo.name} /> : null}
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {!isMobile && (
                <span className="text-xs md:text-sm max-w-[100px] truncate">{userInfo.name || userInfo.email}</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">{userInfo.name}</span>
                <span className="text-xs text-muted-foreground">{userInfo.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  } else if (isAuthenticated) {
    // Caso esteja autenticado mas sem informações do usuário
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handleSyncClick}
          disabled={isLoading}
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-2 text-xs md:text-sm"
        >
          <Calendar className="h-3 w-3 md:h-4 md:w-4" />
          {isLoading ? "Sincronizando..." : isMobile ? "Sincronizar" : "Sincronizar"}
        </Button>

        <Button
          variant="ghost"
          onClick={handleLogout}
          size={isMobile ? "sm" : "default"}
          className="flex items-center gap-2"
        >
          <Avatar className="h-6 w-6 md:h-8 md:w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="sr-only md:not-sr-only text-xs md:text-sm">Conta Google</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleGoogleAuth}
      size={isMobile ? "sm" : "default"}
      className="flex items-center gap-2 text-xs md:text-sm"
    >
      <Calendar className="h-3 w-3 md:h-4 md:w-4" />
      {isMobile ? "Conectar" : "Conectar ao Google"}
    </Button>
  )
}


"use client"

import { useEffect } from "react"

export function CookieScript() {
  useEffect(() => {
    // Função para verificar e corrigir cookies
    const checkAndFixCookies = () => {
      try {
        // Verificar se o cookie user_info existe e está acessível
        const userInfoCookie = document.cookie.split("; ").find((row) => row.startsWith("user_info="))

        if (!userInfoCookie) {
          console.log("Cookie de informações do usuário não encontrado, verificando status...")
          // Verificar status de autenticação
          fetch("/api/auth/status")
            .then((response) => response.json())
            .then((data) => {
              if (data.authenticated && data.userInfo) {
                console.log("Usuário autenticado, mas cookie não encontrado. Corrigindo...")
                // Definir cookie manualmente
                document.cookie = `user_info=${encodeURIComponent(JSON.stringify(data.userInfo))}; path=/; max-age=3600;`
                // Recarregar para aplicar as mudanças
                window.location.reload()
              }
            })
            .catch((error) => {
              console.error("Erro ao verificar status de autenticação:", error)
            })
        }
      } catch (error) {
        console.error("Erro ao verificar cookies:", error)
      }
    }

    // Verificar cookies após o carregamento da página
    checkAndFixCookies()
  }, [])

  return null
}


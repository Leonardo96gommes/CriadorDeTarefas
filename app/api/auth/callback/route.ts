import { type NextRequest, NextResponse } from "next/server"
import { getGoogleTokens, getGoogleUserInfo } from "@/lib/google-auth"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  // Se houver erro na autenticação
  if (error) {
    console.error("Erro na autenticação do Google:", error)
    return NextResponse.redirect(new URL(`/error?message=${error}`, request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/error?message=Código de autorização não fornecido", request.url))
  }

  try {
    // Troca o código por tokens
    const tokens = await getGoogleTokens(code)

    if (!tokens || tokens.error) {
      console.error("Erro ao obter tokens:", tokens?.error_description || "Falha desconhecida")
      return NextResponse.redirect(new URL("/error?message=Falha na autenticação", request.url))
    }

    // Obtém informações do usuário
    const userInfo = await getGoogleUserInfo(tokens.access_token)

    // Armazena tokens em cookies
    const cookieStore = cookies()

    // Define o token de acesso
    cookieStore.set("google_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokens.expires_in,
      path: "/",
      sameSite: "lax",
    })

    // Define o refresh token se disponível
    if (tokens.refresh_token) {
      cookieStore.set("google_refresh_token", tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 dias
        path: "/",
        sameSite: "lax",
      })
    }

    // Armazena informações do usuário em um cookie não-httpOnly para acesso do cliente
    const userInfoData = {
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
    }

    cookieStore.set("user_info", JSON.stringify(userInfoData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokens.expires_in,
      path: "/",
      sameSite: "lax",
    })

    // Redireciona de volta para o app
    return NextResponse.redirect(new URL("/?auth=success", request.url))
  } catch (error) {
    console.error("Erro no callback:", error)
    return NextResponse.redirect(new URL("/error?message=Falha na autenticação", request.url))
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const accessToken = cookieStore.get("google_access_token")?.value
  const userInfoCookie = cookieStore.get("user_info")?.value

  let userInfo = null
  if (userInfoCookie) {
    try {
      userInfo = JSON.parse(userInfoCookie)
    } catch (e) {
      console.error("Erro ao analisar informações do usuário:", e)
    }
  }

  return NextResponse.json({
    authenticated: !!accessToken,
    userInfo: userInfo,
  })
}


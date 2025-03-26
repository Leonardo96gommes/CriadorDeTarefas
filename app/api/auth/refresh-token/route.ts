import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get("google_refresh_token")?.value

  if (!refreshToken) {
    return NextResponse.json({ error: "Refresh token não encontrado" }, { status: 401 })
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error_description || "Falha ao atualizar token")
    }

    const data = await response.json()

    // Atualizar o token de acesso no cookie
    cookieStore.set("google_access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: data.expires_in,
      path: "/",
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erro ao atualizar token:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


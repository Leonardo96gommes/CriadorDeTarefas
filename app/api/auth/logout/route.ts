import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const cookieStore = cookies()

  // Remove todos os cookies relacionados à autenticação
  cookieStore.delete("google_access_token")
  cookieStore.delete("google_refresh_token")
  cookieStore.delete("user_info")

  return NextResponse.json({ success: true })
}


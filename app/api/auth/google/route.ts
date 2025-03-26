import { type NextRequest, NextResponse } from "next/server"
import { getGoogleAuthURL } from "@/lib/google-auth"

export async function GET(request: NextRequest) {
  const authUrl = getGoogleAuthURL()
  return NextResponse.redirect(authUrl)
}


// Variáveis de ambiente do lado do servidor
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000/api/auth/callback"

// Gera a URL de autenticação do Google OAuth
export function getGoogleAuthURL() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth"
  const options = {
    redirect_uri: REDIRECT_URI,
    client_id: GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ].join(" "),
  }

  const queryString = new URLSearchParams(options)
  return `${rootUrl}?${queryString.toString()}`
}

// Troca o código de autorização por tokens
export async function getGoogleTokens(code: string) {
  const url = "https://oauth2.googleapis.com/token"
  const values = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao obter tokens do Google:", error)
    throw error
  }
}

// Obtém informações do usuário a partir do token de acesso
export async function getGoogleUserInfo(access_token: string) {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Erro ao obter informações do usuário:", error)
    throw error
  }
}


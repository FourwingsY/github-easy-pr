export async function getAllowedScopes(token: string) {
  try {
    const response = await fetch("https://api.github.com/users/codertocat", {
      headers: { Authorization: `token ${token}` },
    })
    const allowedScopes = response.headers.get("x-oauth-scopes")?.split(", ") || []
    return allowedScopes
  } catch (e) {
    console.error(e)
    return []
  }
}

export function approve() {
  console.log("APPROVE THIS PR2")
}

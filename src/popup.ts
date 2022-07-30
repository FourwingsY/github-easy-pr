const TOKEN_KEY = "easypr-token"

const tokenInput = document.getElementById("token") as HTMLInputElement
const tokenSave = document.querySelector("#token + button") as HTMLButtonElement

function init() {
  chrome.storage.sync.get(TOKEN_KEY, (values) => {
    if (values[TOKEN_KEY]) {
      tokenInput.value = values[TOKEN_KEY]
    }
  })

  tokenSave?.addEventListener("click", async () => {
    const token = tokenInput.value
    const validationResult = await validate(token)
    console.log(validationResult)
    if (validationResult.isEnough) {
      chrome.storage.sync.set({ [TOKEN_KEY]: token })
    }
    const errorSection = document.querySelector("#errors")
    errorSection?.replaceChildren()
    validationResult.errors.forEach((errorMessage) => {
      const p = createMessage({ message: errorMessage })
      errorSection?.append(p)
    })
    const warningSection = document.querySelector("#warnings")
    warningSection?.replaceChildren()
    validationResult.warnings.forEach((warningMessage) => {
      const p = createMessage({ message: warningMessage })
      warningSection?.append(p)
    })
  })
}

async function validate(token: string) {
  const errors: string[] = []
  const warnings: string[] = []
  const scopes = await getAllowedScopes(token)

  if (!scopes.includes("repo") && !scopes.includes("public_repo")) {
    errors.push("Cannot access your repositories")
  }
  if (!scopes.includes("repo")) {
    warnings.push("Cannot access your private repositories")
  }
  return { isEnough: errors.length === 0, errors, warnings }
}

async function getAllowedScopes(token: string) {
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

function createMessage({ message }: { message: string }) {
  const paragraph = document.createElement("p")
  paragraph.innerText = message
  return paragraph
}

init()

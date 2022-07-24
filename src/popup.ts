import { TOKEN_KEY } from "./constants.js"
import { validateToken } from "./github.js"

const tokenInput = document.getElementById("token") as HTMLInputElement
const tokenSave = document.querySelector("#token + button") as HTMLButtonElement

function init() {
  chrome.storage.sync.get(TOKEN_KEY, (values) => {
    tokenInput.value = values[TOKEN_KEY]
  })

  tokenSave?.addEventListener("click", async () => {
    const token = tokenInput.value
    const validationResult = await validate(token)
    if (validationResult.isEnough) {
      chrome.storage.sync.set({ TOKEN_KEY: token })
    } else {
      // TODO: require more scopes?
    }
  })
}
async function validate(token: string) {
  const data = validateToken(token)
  // TODO: check scopes
  console.log(data)
  return { isEnough: false }
}

init()

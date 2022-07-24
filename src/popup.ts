import { Octokit } from "octokit"

const tokenInput = document.getElementById("token") as HTMLInputElement
const tokenSave = document.querySelector("#token + button") as HTMLButtonElement

const TOKEN_KEY = "easypr-token"

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
  const octokit = new Octokit({ auth: token })
  const { data } = await octokit.rest.users.getAuthenticated()
  // TODO: check scopes
  console.log(data)
  return { isEnough: false }
}

init()

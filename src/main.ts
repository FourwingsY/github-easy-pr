import { addApproveButton } from "./button.js"
import { TOKEN_KEY } from "./constants.js"

// run only on PR page
console.log(location.href)
const isPRPage = false
if (isPRPage) {
  chrome.storage.sync.get(TOKEN_KEY, (values) => {
    console.log(values[TOKEN_KEY])
    addApproveButton()
  })
}

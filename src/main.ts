import { addApproveButton } from "./button.js"

// run only on PR page
console.log(location.href)
const isPRPage = false
if (isPRPage) {
  addApproveButton()
}

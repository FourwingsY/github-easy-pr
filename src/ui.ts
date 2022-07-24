export function addApproveButton() {
  const actions = document.querySelector("#partial-new-comment-form-actions")
  if (!actions) return
  const commentButton = actions.querySelector(".btn-primary")
  if (!commentButton) return
  const approveButton = createApproveButton()
  approveButton.addEventListener("click", console.log)
  commentButton.parentElement?.append(approveButton)
}

export function createApproveButton() {
  const button = document.createElement("button")
  button.type = "submit"
  button.setAttribute("data-disable-with", "")
  button.setAttribute("formnovalidate", "")
  button.setAttribute("data-comment-text", "Approve with comment")
  button.innerHTML = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
<span class="js-form-action-text" data-default-action-text="Approve pull request">Approve pull request</span>`
  button.classList.add("btn", "btn-primary", "js-comment-and-button")
  return button
}

export function createMessage({ message }: { message: string }) {
  const paragraph = document.createElement("p")
  paragraph.innerText = message
  return paragraph
}

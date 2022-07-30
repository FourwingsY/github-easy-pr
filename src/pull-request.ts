chrome.storage.sync.get("easypr-token", async function (items) {
  const token = items["easypr-token"]

  const pullRequest = parsePRURL(location.pathname)
  const canApprove = await testToken(token, pullRequest)
  if (!canApprove) return

  // Add approve button
  const actions = document.querySelector("#partial-new-comment-form-actions")
  if (!actions) return
  const commentButton = actions.querySelector(".btn-primary")
  if (!commentButton) return
  const approveButton = createApproveButton()
  commentButton.parentElement?.append(approveButton)

  approveButton.addEventListener("click", () => {
    if (!pullRequest) return
    approve(token, pullRequest)
  })
})

var permissionCache: { [repo: string]: boolean } = window.permissionCache || {}

async function testToken(token: string, pullRequest: PullRequest | null) {
  if (!pullRequest) return false
  const { owner, repo } = pullRequest
  if (typeof window.permissionCache[`${owner}/${repo}`] === "boolean") return window.permissionCache[`${owner}/${repo}`]

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      method: "GET",
      headers: { Authorization: `token ${token}` },
    })
    const { permissions } = await response.json()
    const canApprove = permissions.admin || permissions.maintain || permissions.push || permissions.triage
    permissionCache[`${owner}/${repo}`] = canApprove
    return canApprove
  } catch (e) {
    console.error(e)
    return false
  }
}

function createApproveButton() {
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

function parsePRURL(url: string) {
  const regex = /\/([\w-]+)\/([\w-]+)\/pull\/?(\d+)/
  const match = regex.exec(url)
  if (!match) return null
  const [_match, owner, repo, pullNumber] = match
  return { owner: owner as string, repo: repo as string, pullNumber: pullNumber as string } as const
}

interface PullRequest {
  owner: string
  repo: string
  pullNumber: string
}
async function approve(token: string, { owner, repo, pullNumber }: PullRequest, comment?: string) {
  fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/reviews`, {
    method: "POST",
    headers: { Authorization: `token ${token}` },
    body: JSON.stringify({
      body: comment,
      event: "APPROVE",
    }),
  })
}

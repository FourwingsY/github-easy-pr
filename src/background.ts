chrome.runtime.onInstalled.addListener(() => {
  console.log("Plugin installed")
})
chrome.tabs.onUpdated.addListener(async function (tabId, update, tab) {
  if (update.status !== "complete") return
  const currentUrl = parseURL(tab.url)
  if (!currentUrl.isPR) return

  chrome.scripting.executeScript({
    target: { tabId },
    files: ["pull-request.js"],
  })
})

function parseURL(url?: string) {
  if (!url) return { isPR: false, owner: "", repo: "", pullNumber: "" }
  const regex = /\/([\w-]+)\/([\w-]+)\/pull\/(\d+)/
  const match = regex.exec(url)
  if (!match) return { isPR: false } as const
  const [_match, owner, repo, pullNumber] = match
  return { isPR: true, owner: owner as string, repo: repo as string, pullNumber: pullNumber as string } as const
}

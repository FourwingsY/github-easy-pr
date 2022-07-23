// This script just inject build/main.js as <script type="module" />
;(function () {
  const script = document.createElement("script")
  script.setAttribute("type", "module")
  script.setAttribute("src", chrome.runtime.getURL("build/main.js"))
  const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement
  head.insertBefore(script, head.lastChild)
})()

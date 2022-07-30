declare global {
  interface Window {
    permissionCache: { [repo: string]: boolean }
  }
}

declare global {
  interface Window {
    google_optimize: {
      get: (id: string) => string
    }
  }
}

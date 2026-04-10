const useApp = (): {
  initApp: () => Promise<void>
} => {
  const initApp = async (): Promise<void> => {
    // Asset list is now statically defined in types/asset.ts (SUPPORTED_ASSETS).
    // No remote fetching needed for the AtomOne bridge.
  }

  return {
    initApp,
  }
}

export default useApp

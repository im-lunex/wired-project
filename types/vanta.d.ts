declare module "three" {
  const THREE: unknown
  export default THREE
}

declare module "vanta/dist/vanta.birds.min.js" {
  const VANTA: {
    BIRDS: (options: Record<string, unknown>) => { destroy(): void }
  }
  export default VANTA.BIRDS
}

declare module "vanta/dist/vanta.waves.min.js" {
  const VANTA: {
    WAVES: (options: Record<string, unknown>) => { destroy(): void }
  }
  export default VANTA.WAVES
}

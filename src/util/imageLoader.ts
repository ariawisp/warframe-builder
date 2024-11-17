'use client'

export default function wfcdLoader({
  src,
  width,
  quality
}: {
  src: string
  width: number
  quality?: number
}) {
  // Base URL for WFCD warframe-items images
  const baseUrl =
    'https://raw.githubusercontent.com/WFCD/warframe-items/master/data/img'
  return `${baseUrl}/${src}?w=${width}&q=${quality || 75}`
}

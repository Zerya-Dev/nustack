export function basename(filename: string): string {
  return filename.split(/[\\/]/).at(-1) ?? filename
}

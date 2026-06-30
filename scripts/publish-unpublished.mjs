import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = process.cwd()
const tarballsDir = join(root, '.release-tarballs')
rmSync(tarballsDir, { recursive: true, force: true })
mkdirSync(tarballsDir, { recursive: true })

const scanRoots = [join(root, 'packages'), join(root, 'modules')]
const packageDirs = []
for (const scanRoot of scanRoots) {
  if (!existsSync(scanRoot))
    continue
  for (const child of readdirSync(scanRoot)) {
    const dir = join(scanRoot, child)
    if (existsSync(join(dir, 'package.json')))
      packageDirs.push(dir)
  }
}

for (const dir of packageDirs) {
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
  if (pkg.private)
    continue
  const spec = `${pkg.name}@${pkg.version}`

  let published = false
  try {
    execFileSync('npm', ['view', spec, 'version'], { stdio: 'ignore' })
    published = true
  }
  catch {
    published = false
  }
  if (published) {
    console.log(`skip ${spec}`)
    continue
  }

  console.log(`pack ${spec}`)
  // Don't use --json: a package's prepack script (e.g. nuxt-module-build) writes
  // to stdout and corrupts the JSON. pnpm's tarball name is deterministic instead.
  execFileSync(
    'pnpm',
    ['--filter', pkg.name, 'pack', '--pack-destination', tarballsDir],
    { cwd: root, stdio: 'inherit' },
  )
  const tarballName = `${pkg.name.replace('@', '').replaceAll('/', '-')}-${pkg.version}.tgz`
  const tarballPath = resolve(tarballsDir, tarballName)

  console.log(`publish ${spec}`)
  try {
    execFileSync('npm', ['publish', tarballPath, '--access', 'public'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'inherit', 'pipe'],
    })
  }
  catch (err) {
    const stderr = err.stderr ?? ''
    // The registry read endpoint is CDN-cached, so `npm view` above can lag
    // behind a fresh publish and report a package as missing. Treat the
    // "cannot publish over" 403 as proof it already exists, and skip.
    if (/cannot publish over|previously published|E403/i.test(stderr)) {
      console.log(`already published, skip ${spec}`)
      continue
    }
    process.stderr.write(stderr)
    throw err
  }
}

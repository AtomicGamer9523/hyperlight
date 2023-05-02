import readdir from 'readdirp'
import { build } from './bundler'
import { clearCache, getReadableFileSize } from './utils/fileutils'
import { parseBundle } from './utils/ssrutils'
import table from 'as-table'

export class HyperlightBuilder {
  extensionFilter: string[]

  constructor(extensionFilter: string[]) {
    this.extensionFilter = extensionFilter
  }

  async build() {
    await clearCache()

    const pages = await readdir.promise('pages/', {
      fileFilter: this.extensionFilter.map((v) => `*.${v}`)
    })

    const buildTable = []

    for (const page of pages) {
      const { client: clientResult, server: serverResult } = await build(page.fullPath, page.path)

      const parsedImport = await parseBundle(serverResult, false)
      const Size = await getReadableFileSize(clientResult)

      buildTable.push({
        Page: `${parsedImport.type == 'SSR' ? 'λ' : '○'} ${page.path}`,
        Size
      })
    }

    console.log('\n', table(buildTable))

    // Symbol legenda
    console.log(`\n○  (Static) - rendered as static HTML`)
    console.log('λ  (Server) - rendered at runtime')
    console.log('\n')
  }
}

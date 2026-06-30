import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import ts from 'typescript'

const BLOCKS_DIR = join(process.cwd(), 'packages/blocks/src')

function hasJsxTextChild(sourceFile: ts.SourceFile, node: ts.Node): boolean {
  if (ts.isJsxText(node)) {
    const text = node.getText(sourceFile).trim()
    if (text.length > 0) return true
  }
  if (ts.isStringLiteral(node) && ts.isJsxAttribute(node.parent)) {
    const attr = node.parent
    const name = attr.name.getText(sourceFile)
    if (name === 'className' || name === 'href' || name === 'src' || name === 'alt' || name === 'role') return false
  }
  return ts.forEachChild(node, (child) => hasJsxTextChild(sourceFile, child))
}

function checkFile(filePath: string): string[] {
  const source = readFileSync(filePath, 'utf-8')
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const errors: string[] = []

  function visit(node: ts.Node) {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      if (hasJsxTextChild(sourceFile, node)) {
        const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1
        errors.push(`${filePath}:${line} — texte littéral dans JSX (utiliser content props)`)
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return errors
}

const files = readdirSync(BLOCKS_DIR).filter((f) => f.endsWith('Block.tsx'))
const allErrors = files.flatMap((f) => checkFile(join(BLOCKS_DIR, f)))

if (allErrors.length > 0) {
  console.error('validate-blocks failed:\n' + allErrors.join('\n'))
  process.exit(1)
}

console.log('validate-blocks OK')

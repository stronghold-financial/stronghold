import { Config, Assert } from 'stronghold'
import { spawn } from 'child_process'

export function launchEditor(file: string, config?: Config): Promise<number | null> {
  let editor = process.env.EDITOR

  if (!editor && config) {
    editor = config.get('editor')
  }

  if (!editor) {
    throw new Error(
      `you must set the EDITOR environment variable or 'editor' in the stronghold config`,
    )
  }

  return new Promise<number | null>((resolve, reject) => {
    Assert.isNotUndefined(editor)
    const process = spawn(editor, [file], { stdio: 'inherit' })
    process.on('exit', (code) => resolve(code))
    process.on('error', (error) => reject(error))
  })
}

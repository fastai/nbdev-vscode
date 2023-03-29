import * as vscode from 'vscode';
import * as path from 'path';

export function getPath(relativeFilePath: string): string {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return '.';
  }
  const currentFilePath = editor.document.uri.fsPath;
  const currentFileDir = path.dirname(currentFilePath);
  return path.join(currentFileDir, relativeFilePath);
}

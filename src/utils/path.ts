import * as vscode from 'vscode';
import * as path from 'path';
const fs = require('fs');

export function getPath(relativeFilePath: string): string {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return '.';
  }
  const currentFilePath = editor.document.uri.fsPath;
  const currentFileDir = path.dirname(currentFilePath);
  return path.join(currentFileDir, relativeFilePath);
}

export function isNbdev() {
  // determine if the current workspace is a nbdev project
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
  if (!workspaceRoot) {
    return false;
  }

  // Open the settings.ini file
  const settingsPath = path.join(workspaceRoot, "settings.ini");
  if (fs.existsSync(settingsPath)) {
    return true;
} else {
   return false;
}
}
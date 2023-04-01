import * as vscode from 'vscode';

export function isCleanEnabled(): boolean {
  const configuration = vscode.workspace.getConfiguration();
  const enabled = configuration.get<boolean>('nbdev.cleanEnabled');
  return enabled ?? true; // Default to true if the setting is not found.
}

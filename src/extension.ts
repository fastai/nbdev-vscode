import * as vscode from 'vscode';
import { goToCustomDefinition } from "./commands/goToDefinition";
import { directives } from "./completion/directives";
import { shell } from "./utils/shell";
import { isNbdev } from "./utils/path";


let cleannb = vscode.workspace.onDidSaveNotebookDocument((document: vscode.NotebookDocument) => {
    const path = document.uri.fsPath;
    if (isNbdev() && path.endsWith('.ipynb')) {
        shell('nbdev_clean --fname ' + path);
        vscode.window.showInformationMessage("Cleaned: " + path);
    }
});

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
        cleannb,
        directives, 
        vscode.commands.registerCommand("nbdev.navNotebook", goToCustomDefinition)
    );
}

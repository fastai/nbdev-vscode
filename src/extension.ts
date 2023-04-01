import * as vscode from 'vscode';
import { goToCustomDefinition } from "./commands/goToDefinition";
import { directives } from "./completion/directives";

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
        directives, 
        vscode.commands.registerCommand("nbdev.navNotebook", goToCustomDefinition)
    );
}

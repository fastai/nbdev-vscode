// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nbdev" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('nbdev.navNotebook', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Hamel Husain NB!');
		goToCustomDefinition();
	});

	context.subscriptions.push(disposable);
}

// export function activate(context: vscode.ExtensionContext) {
// 	console.log('hello yaya');
// 	context.subscriptions.push(
// 	  vscode.commands.registerCommand('nbdev.gotoCustomDefinition', () => {
// 		console.log('hello yaya')
// 		// goToCustomDefinition();
// 	  })
// 	);
// }


function getPath(relativeFilePath: string):string {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		return '.';
	  }
	const currentFilePath = editor.document.uri.fsPath;
	const currentFileDir = path.dirname(currentFilePath);
	return path.join(currentFileDir, relativeFilePath);
}

  

const specialCommentPattern =  /# *%% *([^ ]+) *(\d+)/;


async function goToCustomDefinition() {
	const editor = vscode.window.activeTextEditor;
  
	if (!editor) {
	  return;
	}
  
	const document = editor.document;
	const position = editor.selection.active;
	const lineNumber = position.line;
	const line = document.lineAt(lineNumber).text;
  
	const match = line.match(specialCommentPattern);
  
	if (match && match.index !== undefined) {
	  const [_, filePath, cellNumber] = match;
	  const absPath = getPath(filePath);
	  const notebookUri = vscode.Uri.file(absPath);

	try {
		console.log('Opened the notebook!');
		await vscode.commands.executeCommand(
		  'vscode.openWith',
		  notebookUri,
		  'jupyter-notebook', // The built-in Notebook editor viewType
		  { preview: false }
		);	
    } catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		vscode.window.showErrorMessage('Error opening the notebook: ' + errorMessage);
	  }


	} else {
	  // Fallback to built-in "Go To Definition" functionality
	  await vscode.commands.executeCommand('editor.action.revealDefinition');
	}
  }
  
  




// This method is called when your extension is deactivated
export function deactivate() {}

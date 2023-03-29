import path = require("path");
import * as vscode from "vscode";
import { getPath } from "../utils/path";

const specialCommentPattern = /# *%% *([^ ]+) *(\d+)/;
const globalMatchPattern = /# *%% *([^ ]+) *(\d+)/g;

function openInNotebook(idx: number) {
  const jupyter = vscode.extensions.getExtension("ms-toolsai.jupyter");
  if (!jupyter) {
    vscode.window.showErrorMessage("Jupyter extension not found.");
    return;
  }

  if (!jupyter.isActive) {
    vscode.window.showErrorMessage("Jupyter extension is not active.");
    return;
  }

  const activeEditor = vscode.window.activeNotebookEditor;
  if (!activeEditor) {
    vscode.window.showInformationMessage("No active Jupyter editor found.");
    return;
  }

  if (idx + 1 < activeEditor.notebook.cellCount) {
    activeEditor.selections = [new vscode.NotebookRange(idx, idx + 1)];
    activeEditor.revealRange(
      new vscode.NotebookRange(idx, idx + 1),
      vscode.NotebookEditorRevealType.AtTop
    );
  }
}

// Tries to find the `export` comment in the cell
// If found, returns the value, otherwise returns an empty string
function findCellModuleName(cell: vscode.NotebookCell): string | undefined {
  const cellText = cell.document.getText();
  // Get all characters from cellText up until the \n character
  // e.g. in the cells with the `#|export` only comment, the cell
  // text will be `#|export\ndef get_id...` and we want to get `#|export` part only
  // otherwise the regex matches `def get_id` which is wrong.
  // This could be fixed with a better regex...
  const textBeforeNewline = cellText.split("\n")[0];
  const exportMatch = textBeforeNewline.match(/#\|export\s+(?!\n)(\w+)/);
  if (exportMatch) {
    const [_, name] = exportMatch;
    return name;
  }
  return undefined;
}

export async function goToCustomDefinition() {
  if (vscode.window.activeNotebookEditor) {
    // We're in a notebook, so we're navigating back to code

    // Find the cell that we're in
    const notebookEditor = vscode.window.activeNotebookEditor;

    const cell = vscode.window.activeNotebookEditor.notebook.cellAt(
      notebookEditor.selections[0].start
    );
    if (!cell) {
      return;
    }

    let moduleName = findCellModuleName(cell);

    // We don't have a cell-local export, find the default one
    if (!moduleName) {
      // Get text from all cells in the document
      const allCellsText = vscode.window.activeNotebookEditor.notebook
        .getCells()
        .map((cell) => cell.document.getText())
        .join("");

      // Search for the `#| default_exp` comment
      const defaultExpMatch = allCellsText.match(/#\|\s*default_exp\s+(\w+)/);

      if (defaultExpMatch) {
        // Read the path from the default_exp comment
        const [_, name] = defaultExpMatch;
        moduleName = name;
      }
    }

    // If the module name is still undefined, we can't do anything
    // This happens if the user is in a cell that doesn't have an export comment
    // and there is no default_exp comment in the document
    if (!moduleName) {
      return;
    }

    // Get the root of the workspace
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!workspaceRoot) {
      return;
    }

    // Open the settings.ini file
    const settingsPath = path.join(workspaceRoot, "settings.ini");

    // Get the text from the settings.ini file
    const settingsText = await vscode.workspace.fs.readFile(
      vscode.Uri.file(settingsPath)
    );

    // lib_ath regex
    const libPathPattern = /lib_path\s*=\s*([^;\s]+)/;

    // Find the lib_path in the settings.ini file
    const libPathMatch = settingsText.toString().match(libPathPattern);
    if (!libPathMatch) {
      return;
    }

    // Read the path from the lib_path comment
    const [_, libPath] = libPathMatch;

    // Get the full path to the module
    const modulePath = path.join(workspaceRoot, libPath, `${moduleName}.py`);

    // Open the module
    const moduleUri = vscode.Uri.file(modulePath);
    await vscode.commands.executeCommand(
      "vscode.openWith",
      moduleUri,
      "python"
    );

    // Get the editor for the module
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return;
    }

    // Search for the cell text in the activeEditor
    const cellText = cell.document.getText();

    // Remove the first line from the cellText - remove the characters until /n
    const cellTextWithoutFirstLine = cellText.substring(
      cellText.indexOf("\n") + 1
    );

    // Get the location of the text in the document
    const cellTextLocation = activeEditor.document
      .getText()
      .indexOf(cellTextWithoutFirstLine);

    // GEt the line number from the editor where the cellTextWithoutFirstLine appears
    const textPosition = activeEditor.document.positionAt(cellTextLocation);

    activeEditor.selection = new vscode.Selection(textPosition, textPosition);

    activeEditor.revealRange(
      new vscode.Range(textPosition, textPosition),
      vscode.TextEditorRevealType.AtTop
    );
  } else {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    // We're in code, so we're navigating to a notebook
    const lineNumber = editor.selection.active.line;

    // Get the text from selected line to the beginning of the document
    // Adding +1 to the line number to include the current line (i.e. if you press F12 on the first line, the +1 includes the first line)
    const rangeText = editor.document.getText(
      new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(lineNumber + 1, 0)
      )
    );

    // Do a global match first, to get all matches of the pattern
    const allMatches = rangeText.match(globalMatchPattern);

    // Get the last one
    const lastMatch = allMatches && allMatches[allMatches.length - 1];

    // Extract the cell number
    const match = lastMatch && lastMatch.match(specialCommentPattern);

    if (match && match.index !== undefined) {
      const [_, filePath, cellNumber] = match;
      const absPath = getPath(filePath);
      const notebookUri = vscode.Uri.file(absPath);

      try {
        await vscode.commands.executeCommand(
          "vscode.openWith",
          notebookUri,
          "jupyter-notebook", // The built-in Notebook editor viewType
          { preview: false }
        );
        openInNotebook(parseInt(cellNumber));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(
          "Error opening the notebook: " + errorMessage
        );
      }
    } else {
      console.log("navigating to definition...");
      // Fallback to built-in "Go To Definition" functionality
      await vscode.commands.executeCommand("editor.action.revealDefinition");
    }
  }
}

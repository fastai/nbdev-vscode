import * as assert from "assert";
import path = require("path");
import { beforeEach } from "mocha";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { goToCustomDefinition } from "../../commands/goToDefinition";
// import * as myExtension from '../../extension';

const testProjectPath = path.join(__dirname, "data", "testproject1");

async function reset() {
  await vscode.commands.executeCommand(
    "vscode.openFolder",
    vscode.Uri.file(testProjectPath)
  );
  await vscode.commands.executeCommand("workbench.action.closeAllEditors");
}

suite("Extension Test Suite", () => {
  beforeEach(async () => {
    await reset();
  });
  test("invoking the command on .py file opens .ipynb file", async () => {
    const corePath = path.join(testProjectPath, "lewinb", "core.py");
    const coreUri = vscode.Uri.file(corePath);
    await vscode.commands.executeCommand("vscode.openWith", coreUri, "python");

    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      assert.fail("No active editor");
    }

    // Find string # %% ../nbs/00_core.ipynb 3
    const cellText = "# %% ../nbs/00_core.ipynb 3";
    const cellTextLocation = activeEditor.document.getText().indexOf(cellText);

    // Select the cell and invoke the command
    const cellTextRange = new vscode.Range(
      activeEditor.document.positionAt(cellTextLocation),
      activeEditor.document.positionAt(cellTextLocation + cellText.length)
    );

    // Select the cellTextRange
    activeEditor.selection = new vscode.Selection(
      cellTextRange.start,
      cellTextRange.end
    );

    // Invoke the goToCustomDefinition command
    await goToCustomDefinition();

    // Verify 00_core.ipynb is open
    const notebookEditor = vscode.window.activeNotebookEditor;
    if (!notebookEditor) {
      assert.fail("No notebook editor is open");
    }

    const activeNotebook = notebookEditor.notebook;
    const activeNotebookPath = activeNotebook.uri.path;
    const expectedNotebookPath = path.join(
      testProjectPath,
      "nbs",
      "00_core.ipynb"
    );
    assert.equal(activeNotebookPath, expectedNotebookPath);

    // Get the selected cell
    const selectedCell = notebookEditor.selections[0].start;
    const selectedCellText = activeNotebook
      .getCells()
      [selectedCell].document.getText();

    const expectedCellText = "def get_id(owner,repo,pull_number):";
    // Assert the expectedCellText is in the  selectedCellText
    assert.ok(selectedCellText.indexOf(expectedCellText) > -1);
  });

  test("invoking the command on .ipynb file opens correct .py file", async () => {
    // Open the notebook file
    const notebookPath = path.join(testProjectPath, "nbs", "00_core.ipynb");
    const notebookUri = vscode.Uri.file(notebookPath);
    await vscode.commands.executeCommand(
      "vscode.openWith",
      notebookUri,
      "jupyter-notebook"
    );

    // Find string def get_id(owner,repo,pull_number):
    const activeNotebook = vscode.window.activeNotebookEditor;
    if (!activeNotebook) {
      assert.fail("No notebook editor is open");
    }

    // Go to one of the cells
    const cellText = "def get_id(owner,repo,pull_number):";
    // Go through each cell and find the cell with the text
    const cell = activeNotebook.notebook.getCells().find((cell) => {
      return cell.document.getText().indexOf(cellText) > -1;
    });

    if (!cell) {
      assert.fail("Could not find cell with text: " + cellText);
    }

    // Select the cell
    activeNotebook.selection = new vscode.NotebookRange(
      cell.index,
      cell.index + 1
    );

    // Inovke the goToCustomDefinition command
    await goToCustomDefinition();

    // Verify file core.py is open
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      assert.fail("No editor is open");
    }

    const activeEditorPath = activeEditor.document.uri.path;
    const expectedEditorPath = path.join(testProjectPath, "lewinb", "core.py");
    assert.equal(activeEditorPath, expectedEditorPath);

    // Get the active line in the activeEditor - it has to match the cell text
    // from the notebook
    const activeLine = activeEditor.selection.active.line;
    const activeLineText = activeEditor.document.lineAt(activeLine).text;
    assert.equal(activeLineText, cellText);
  });
});

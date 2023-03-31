import * as assert from 'assert';
import fs = require('fs');
import path = require('path');


// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { getDirectives } from "../../utils/nb";

suite('Extension Test Suite', () => {
	const testProjectPath = path.join(__dirname, "data", "testproject1");
	const nbPath = path.join(testProjectPath, "nbs", "00_core.ipynb");

	const content = fs.readFileSync(nbPath, 'utf8');
	const notebookJson = JSON.parse(content);
	const codeCells = notebookJson.cells.filter((x: any) => x.cell_type === 'code');
	codeCells.getCode = function(index:number) {
		return this[index].source.join('');
	};

	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
	});

    test('nb.getDirectives', () => {

		function checkDirective(cellNum: number, expected: string){
			//check if the cell has the directive
			const directives = getDirectives(codeCells.getCode(cellNum));
			// @ts-ignore
			assert.ok(expected in directives);
		}

		// this cell has an export directive
		checkDirective(1, 'export');

		// this cell has an eval directive
		checkDirective(3, 'eval');

		// this cell has a hide and eval directive
		checkDirective(8, 'hide');	
		checkDirective(8, 'eval');			
	});
});

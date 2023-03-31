import * as assert from 'assert';
import fs = require('fs');
import path = require('path');


// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { getDirectives } from "../../utils/nb";

// const content = fs.readFileSync(nbPath, 'utf8');
// const notebookJson = JSON.parse(content);


suite('Extension Test Suite', () => {
	const testProjectPath = path.join(__dirname, "data", "testproject1");
	const nbPath = path.join(testProjectPath, "nbs", "00_core.ipynb");
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
	});

    test('nb.getDirectives', () => {
       const content = fs.readFileSync(nbPath, 'utf8');
	   console.log(content)
		assert.strictEqual(-1, -1);
	});
});
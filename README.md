[![test](https://github.com/fastai/nbdev-vscode/actions/workflows/test.yaml/badge.svg)](https://github.com/fastai/nbdev-vscode/actions/workflows/test.yaml)

# nbdev VSCode

> An experimental [nbdev](https://nbdev.fast.ai) extension for VSCode

## Current Features

Note: This extension assumes the workspace's root is the nbdev project's root.

1. Navigate between code in notebooks and python modules with the `F2` key.  This will navigate to the right cell in the corresponding notebook or the corresponding line in the python module! [Demo](https://twitter.com/HamelHusain/status/1641460341992304640)

2. Autocomplete with hints for important directives. This triggers in notebooks when you type `#| ` (needs a space after the `|` to trigger the autocomplete). [Demo](https://twitter.com/HamelHusain/status/1642051330402287616?s=20)

3. Clean notebooks automatically on save. We have a Jupyter hook that didn't work in VSCode, and this fixes that. [Demo](https://twitter.com/HamelHusain/status/1642202815756918785?s=20).  You can toggle this on/off in User settings.

## Installation

Install the extension [from the marketplace](https://marketplace.visualstudio.com/items?itemName=hamelhusain.nbdev) in your IDE:

<img width="250" alt="image" src="https://user-images.githubusercontent.com/1483922/229318940-83c16b9b-8157-48ab-b104-cf1a35fa1c4a.png">


## Change Keyboard Shortcuts

You can change the default keyboard shortcut from `F2` for this extension (and any other extension) by modifying your keyboard shortcuts as follows:

1. Open the command palette: `CMD + Shift + P`
2. Search for `Keyboard Shortcuts`, select `Preferences: Open Keyboard Shortcuts`
3. Search for `nbdev` in the list of shortcuts
4. If you hover over the left-hand side of the table, an edit icon will appear - this will allow you to change the shortcut.


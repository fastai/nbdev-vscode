[![test](https://github.com/fastai/nbdev-vscode/actions/workflows/test.yaml/badge.svg)](https://github.com/fastai/nbdev-vscode/actions/workflows/test.yaml)

# nbdev VSCode

> An experimental nbdev extension for VSCode

## Current Features

1. Navigate between code in notebooks and python modules with the `F2` key.  This will navigate to the right cell in the corresponding notebook, or the corresponding line in the python module! [demo](https://twitter.com/HamelHusain/status/1641460341992304640)

2. Autocomplete with hints for important directives. [demo](https://twitter.com/HamelHusain/status/1642051330402287616?s=20)

## Installation

1. Download the file `wget https://github.com/fastai/nbdev-vscode/raw/main/nbdev-0.0.2.vsix`
2. Install the extension with the CLI: 
   `code --install-extension "./nbdev-0.0.2.vsix"`

OR install with the GUI:
1. Open VSCode in the current directory `code.``
2. In the file explorer, right-click `nbdev-0.0.2.vsix` and select `Install Extension VSIX`:

![](2023-03-20-21-18-26.png)

## Usage

From any nbdev python module file, press `F2` on a cell that looks like this:

```python
# %% ../nbs/00_core.ipynb 7
def myfunc(): pass
```

This will take you to the corresponding notebook associated with that comment.  

Similarly, press `F2` in a vscode notebook and it will take you to the python module.

## Change Keyboard Shortcuts

You can change the default keyboard shortcut from `F2` for this extension (and any other extension) by modifying your keyboard shortcuts as follows:

1. Open the command palette: `CMD + Shift + P`
2. Search for `Keyboard Shortcuts`, select `Preferences:Open Keyboard Shortcuts`
3. Search for `nbdev` in the list of shortcuts
4. If you hover over the left-hand side of the table, an edit icon will appear - this will allow you to change the shortcut.


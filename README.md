# nbdev VSCode

> An experimental nbdev extension for VSCode

## Current Features

1. Navigate between code in notebooks and python modules with the `F2` key.  This will navigate to the right cell in the corresponding notebook, or the corresponding line in the python module!

## Installation

1. Download the file `wget https://github.com/fastai/nbdev-vscode/raw/main/nbdev-0.0.1.vsix`
2. Open VSCode in the current directory `code.``
3. In the file explorer, right-click `nbdev-0.0.1.vsix` and select `Install Extension VSIX`:

![](2023-03-20-21-18-26.png)

## Usage

From any nbdev python module file, press `F2` on a cell that looks like this:

```python
# %% ../nbs/00_core.ipynb 7
def myfunc(): pass
```

This will take you to the corresponding notebook associated with that comment.  

Similarly, press `F2` in a vscode notebook and it will take you to the python module.

## TODO

Write tests


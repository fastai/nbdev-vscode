import * as vscode from 'vscode';

const completions = [
  { completion: 'echo: false', description: 'hide cell inputs.' },
  { completion: 'echo: true', description: '(default) show cell inputs.' },
  { completion: 'export', description: 'exports this cell to your Python library' },
  { completion: 'exporti', description: 'exports this cell to your Python library but does not include it in `__all__`' },
  { completion: 'hide', description: 'hides this cell from your rendered documentation' },
  { completion: 'exec_doc', description: 'executes this cell and includes the output in your documentation' },
  { completion: 'eval: false', description: 'ignores cell during testing' },
  { completion: 'default_exp', description: 'sets the default export for this notebook' },
  { completion: 'code_fold: show', description: 'Show code in a collapsible element where the contents are shown by default.' },
  { completion: 'code_fold: true', description: 'Show code in a collapsible element where the contents are hidden by default.' },
  { completion: 'filter_stream <keyword1> <keyword2> ...', description: 'filters the output of this cell to not include lines containing the keyword(s)' }, 
];

const completionItems = completions.map(directive => {
  const item = new vscode.CompletionItem(directive.completion, vscode.CompletionItemKind.Snippet);
  item.documentation = new vscode.MarkdownString(directive.description);
  return item;
});

export const directives = vscode.languages.registerCompletionItemProvider(
  'python', // only trigger on python files
  {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

      // get all text until the `position` and check if it reads `console.`
      // and if so then complete if `log`, `warn`, and `error`
      const linePrefix = document.lineAt(position).text.substr(0, position.character);

      if (!document.fileName.endsWith('.ipynb')){
        // only trigger on .ipynb files
        return undefined;
      }

      if (!linePrefix.endsWith('#| ') || (linePrefix.trim() !== '#|')) {
        return undefined;
      }

      return completionItems;
    }
  },
  ' ' // triggered whenever a '#| ' is typed - the space is important for some reason it doesn't trigger without it
);

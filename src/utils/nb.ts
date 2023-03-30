export function getDirectives(cellText: string): { [key: string]: string[] } | undefined {
   // get directives from cell text
   const rawDirArray = cellText.trim().split("\n");
   const idx = rawDirArray.map(x => x.trim().startsWith('#|')).findIndex(x => x === false);
    if (idx === -1) {
        return undefined;
    }
   const matches = rawDirArray.slice(0, idx).map(x => x.trim().match(/\#?\|\s*?(\w+)\s*(\w+)?/));
   let dirMap: { [key: string]: string[] } = {};
   let val:any = [];

   for (const match of matches) {
       if (match) {
           const [_, name, value] = match;
           if (value !== undefined) { const val = value.trim().split(/\s+/); }
           dirMap[name] = val; 
       }
   }
   return dirMap;
}

const fs = require('fs');
const path = require('path');
const base = path.resolve('apps/tv/src');

function getImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /import\s+(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  const imports = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    let imp = match[1];
    if (imp.startsWith('.')) {
      const dir = path.dirname(filePath);
      let resolved = path.resolve(dir, imp);
      if (!fs.existsSync(resolved)) {
        if (fs.existsSync(resolved + '.ts')) resolved += '.ts';
        else if (fs.existsSync(resolved + '.tsx')) resolved += '.tsx';
        else if (fs.existsSync(resolved + '/index.ts')) resolved += '/index.ts';
        else if (fs.existsSync(resolved + '/index.tsx')) resolved += '/index.tsx';
      }
      imports.push(resolved);
    }
  }
  return imports;
}

const graph = {};
function scan(dir) {
  for (const f of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) scan(p);
    else if (f.name.endsWith('.ts') || f.name.endsWith('.tsx')) {
      graph[p] = getImports(p);
    }
  }
}
scan(base);
graph[path.resolve('apps/tv/App.tsx')] = getImports(path.resolve('apps/tv/App.tsx'));

console.log('Scanned files:', Object.keys(graph).length);

function checkCycle(node, visited, stack, trail = []) {
  visited.add(node);
  stack.add(node);
  trail.push(node);
  for (const next of (graph[node] || [])) {
    if (!visited.has(next)) {
      if (checkCycle(next, visited, stack, [...trail])) return true;
    } else if (stack.has(next)) {
      console.log('CYCLE DETECTED:');
      console.log([...trail, next].map(p => path.basename(p)).join(' -> '));
      return true;
    }
  }
  stack.delete(node);
  return false;
}

const visited = new Set();
for (const node of Object.keys(graph)) {
  if (!visited.has(node)) {
    checkCycle(node, visited, new Set());
  }
}
console.log('Cycle scan complete.');

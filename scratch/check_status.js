const fs = require('fs');

const content = fs.readFileSync('./scratch/build_phonics_data.js', 'utf8');

// evaluate stories array safely
const stories = eval(content.slice(content.indexOf('const stories = [') + 'const stories = '.length, content.indexOf('// ── WEB & TV EXPORT LOGIC ──')));

console.log('Total stories:', stories.length);
stories.forEach((s, idx) => {
  console.log(`\nStory ${idx + 1}: ${s.id} (${s.title})`);
  s.pages.forEach(p => {
    const webPath = p.image ? `./apps/web/public${p.image}` : null;
    const webExists = webPath && fs.existsSync(webPath);
    console.log(`  Page ${p.pageNumber}: imageKey=${p.imageKey || 'NONE'}, image=${p.image || 'NONE'}, webFileExists=${webExists}`);
  });
});

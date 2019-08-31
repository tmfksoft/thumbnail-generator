const { generateSprites } = require('../src');
const fs = require('fs');
const path = require('path');

console.log(generateSprites);
// generateSprites is a promise. So we can 'spray and pray' and like a boomerang it'll come back to us when its done.
generateSprites({
    source: path.join(__dirname, './sample.mp4'),
}).then(out => {
    console.log(`I generated ${out.pageCount} pages out from ${out.frameCount} frames.`);
    for (let page of out.pages) {
        fs.writeFileSync(`example_${out.pages.indexOf(page)}.png`, page);
    }
}).catch(err => {
    console.log(err);
});

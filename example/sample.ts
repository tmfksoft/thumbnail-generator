import { generateSprites } from '../index';
import * as fs from 'fs';

console.log(generateSprites);

// generateSprites is a promise. So we can 'spray and pray' and like a boomerang it'll come back to us when its done.
generateSprites({
    source: '../input/bbb_sunflower_1080p_30fps_normal.mp4'
}).then( out => {
    console.log(`I generated ${out.pageCount} pages out from ${out.frameCount} frames.`);
    for (let page of out.pages) {
        fs.writeFileSync(`example_${out.pages.indexOf(page)}.png`, page);
    }
}).catch( err => {
    console.log(err);
});
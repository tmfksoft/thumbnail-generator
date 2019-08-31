import { createCanvas, loadImage } from 'canvas';
import * as ffmpeg from 'ffmpeg';
import * as webp from 'webp-converter';
import uuid from 'uuidv4';

import * as rimraf from 'rimraf';
import * as mkdirp from 'mkdirp';

import * as fs from 'fs';
import * as path from 'path';

const doLogging = (process.env.NODE_ENV === 'development') || false;

interface GeneratorOptions {
    /** The source video file. Must be an FFMPEG supported video format. */
    source: string,
    
    /** (Optional) The Thumbnail Width */
    tw?: number,
    /** (Optional) The Thumbnail Height */
    th?: number,

    /** (Optional) Output WebP Sprite Pages instead of PNG? */
    toWebp?: boolean,
}
interface GeneratorOutput {
    /** The total amount of Sprite Pages generated */
    pageCount: number,

    /** The total amount of frames present in the Sprite Pages */
    frameCount: number,

    /** An array of the generated pages in WebP or PNG format. */
    pages: Buffer[],
}

async function gSprites(options: GeneratorOptions) : Promise<GeneratorOutput> {

    const hash = uuid();

    const sourceFile = options.source;

    const tw = options.tw || 133;
    const th = options.th || 75;

    const toWebp = options.toWebp || false;

    if (!fs.existsSync(sourceFile)) {
        throw new Error("Source file doesn't exist!");
    }

    const outputPath = path.join('output', hash);
    const tempPath = path.join('output', hash, 'temp');

    // Make our directories
    mkdirp.sync(outputPath);
    mkdirp.sync(tempPath);

    // Generate our thumbnails.
    let ffMovie = await new ffmpeg(sourceFile);

    if (doLogging) console.log(`Video Duration: ${ffMovie.metadata.duration.seconds}s`);

    let predicted = Math.ceil(ffMovie.metadata.duration.seconds / 10);

    // Not 100% sure why the predicted is always 1 lower than the actual.
    if (doLogging) console.log(`Predicting ${predicted} frames`);
    
    let f = await ffMovie.fnExtractFrameToJPG(tempPath, {
        frame_rate: .1,
        file_name: hash,
    });

    if (doLogging) console.log(`Generated: ${f.length} frames.`);
    
    predicted = f.length;

    let pageCols = 10;
    let pageRows = 10;

    if (predicted < pageCols) pageCols = predicted;

    let pageTotal = pageCols * pageRows;
    
    let pages = Math.ceil( predicted / (pageCols * pageRows));

    if (doLogging) console.log(`Predicting ${pages} pages.`);

    const output = {
        pageCount: pages,
        frameCount: predicted,
        pages: [],
    } as GeneratorOutput;

    for (let pageID=0; pageID<pages; pageID++) {

        // How many can we fit on this sheet?
        let remainder = predicted - (pageID * pageTotal);
        if (remainder > 100) remainder = 100;

        let width = Math.ceil(tw * pageCols);
        let height = Math.ceil(th * Math.ceil(remainder / pageRows));

        if (doLogging) console.log(`Canvas size: ${width} x ${height}`);

        let canvas = createCanvas( width, height );

        let ctx = canvas.getContext('2d');

        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fill();

        if (doLogging) console.log(`Images left: ${remainder}`);

        // Load and place the images.
        for (let i = 0; i<remainder; i++) {
            let offset = pageTotal * pageID;
            let imagePath = path.join(tempPath, `${hash}_${(offset + i + 1)}.jpg`);
            if (doLogging) console.log(`Loading ${imagePath}`);
            let img = await loadImage(imagePath);

            let dx = Math.floor( (i) % 10 * tw );
            let dy = Math.floor((i) / 10) * th;

            if (doLogging) console.log(`Drawing ${hash}_${(offset + i + 1)}.jpg at ${dx}x${dy}`);

            ctx.drawImage(img, dx, dy, tw, th);
        }

        // Generate the final image.
        const stream = canvas.toBuffer();
        const finalPath = path.join(outputPath, `${hash}_${pageID}.png`);
        fs.writeFileSync(finalPath, stream);

        if (!toWebp) {
            output.pages.push( fs.readFileSync(finalPath) );
        }

        if (toWebp) {
            await new Promise( (resolve, reject) => {
                webp.cwebp(path.join(outputPath, `${hash}_${pageID}.png`), path.join(outputPath, `${hash}_${pageID}.webp`), "-q 80", (status, error) => {
                    if (error) return reject(error);
                    if (status === 101) return reject(error);
                    const webpFinal = path.join(outputPath, `${hash}_${pageID}.webp`);

                    output.pages.push( fs.readFileSync(webpFinal) );
                    return resolve();
                });
            });
        }
    }

    // Perform Clear up.
    if (doLogging) console.log(`Clearing away temporary output directory ${outputPath}`);
    rimraf.sync(path.join(__dirname, outputPath));

    return output;
}
export const generateSprites = gSprites;
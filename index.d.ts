/// <reference types="node" />
interface GeneratorOptions {
    /** The source video file. Must be an FFMPEG supported video format. */
    source: string;
    /** (Optional) The Thumbnail Width */
    tw?: number;
    /** (Optional) The Thumbnail Height */
    th?: number;
    /** (Optional) Output WebP Sprite Pages instead of PNG? */
    toWebp?: boolean;
}
interface GeneratorOutput {
    /** The total amount of Sprite Pages generated */
    pageCount: number;
    /** The total amount of frames present in the Sprite Pages */
    frameCount: number;
    /** An array of the generated pages in WebP or PNG format. */
    pages: Buffer[];
}
declare function gSprites(options: GeneratorOptions): Promise<GeneratorOutput>;
export declare const generateSprites: typeof gSprites;
export {};

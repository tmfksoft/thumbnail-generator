# Thumbnail Generator
*A fairly simple NodeJS module designed to generate Sprite Sheets from a Video*

#### Whats it do?
`thumbnail-generator` is a NodeJS module that generates sprite sheets from a video.
A generate sprite sheet will contain up to 100 frames of the supplied video at 10 second intervals.

Currently this functionality isn't configurable right now.
However the size of the thumbnails and the format of the pages can be configured.

The thumbnails can be of any size but by default are `133px x 75px` intended for a `16:9` ratio video.
There is an upper limit for the size of the thumbnails as their size and quantity greatly impacts the processing time and success of the output.

While developing the module I discovered that the `canvas` module struggled to generate images that were too large.
Possibly due to memory constraints, I **strongly recommend** sticking to the defaults unless you wish to alter the aspect ratio.

#### How do I use it?
The module only exposes one singular method `generateSprites` this takes in `GenerationOptions` and outputs `GenerationOutput`.

The module uses FFMPEG to generate frames from the video supplied, Canvas to generate the sprite sheets (known as pages in the module) and optionally WebP Convertor to convert the resulting pages from PNG to WebP

##### Generation Options
The `generateSprites` method takes an object with the following required and optional parameters:

| Parameter | Optional | Type    | Default | Description                                                                  |
| ---       | ---      | ---     | ---     | ---                                                                          |
| source    | False    | String  | N/A     | The source video file, this must be a path to a FFMPEG supported video file. |
| tw        | True     | Number  | 133     | The width of one single thumbnail in the sprite sheet                        |
| th        | True     | Number  | 75      | The height of one single thumbnail in  the sprite sheet                      |
| toWebp    | True     | Boolean | False   |W hether the output should be in WebP format. Results in PNG when false.      |

*Note: `toWebp` controls the output format. When disabled the module outputs in PNG, when enabled it ouputs in WebP*

##### Generation Output
The `generateSprites` method outputs a Promise that resolves to an object when completed with the following parameters:

| Parameter  | Type     | Description                                                                                                        |
| ---        | ---      | ---                                                                                                                |
| pageCount  | Number   | The number of sprite sheet pages that were generated.                                                              |
| frameCount | Number   | The number of thumbnails extracted from the video and placed on the sprite sheet pages.                            |
| pages      | Buffer[] | An array of the sprite sheet pages. Each item is a Buffer of the page in the format configured. Either PNG or WebP |

*Note: The module creates a directory named `output`, this will be used for the temporarily generated images. The temporary directories and images are cleared up after generation but `output` is not. In future it may pay to allow configuring the output directory location to redirect to the systems `temp` folder.*

### Example Code
You can find examples of using this module in TypeScript and regular NodeJS in the `examples` directory along an example sprite page.

It is up to yourself on how to utilise the output. In most cases you can use CSS and Javascript to create a thumbnail DIV with the page as its background and alter the background position depending on your position within the video.

A Sprite Sheet Page will look something like this:

![Example Page](example/example_0.png?raw=true)

### Project Maintenance
I'd hardly call this a project as it's not something I intend to maintain.

The module is something I threw together for a side project and I've gone ahead and turned it into a module so I can easily reuse it myself.
I've documented the module usage both for my own reference and for any unfortunate souls that stumble upon it in future.

If there's any bugs do feel free to open an issue and if I have 5minutes I may rectify the bug.
However PRs to fix them are probably a better option.

### One Last Thing..
This is the first NodeJS module I've released in a long time and is also my first TypeScript module I've released in even longer.

It's written in TypeScript (source bundled) and pre-compiled down to JS with TypeDef's however I may have completely messed up how to package it etc.
Feel free to point out how to rectify any of my mistakes.
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var canvas_1 = require("canvas");
var ffmpeg = require("ffmpeg");
var webp = require("webp-converter");
var uuidv4_1 = require("uuidv4");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");
var fs = require("fs");
var path = require("path");
var doLogging = (process.env.NODE_ENV === 'development') || false;
function gSprites(options) {
    return __awaiter(this, void 0, void 0, function () {
        var hash, sourceFile, tw, th, toWebp, outputPath, tempPath, ffMovie, predicted, f, pageCols, pageRows, pageTotal, pages, output, _loop_1, pageID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hash = uuidv4_1["default"]();
                    sourceFile = options.source;
                    tw = options.tw || 133;
                    th = options.th || 75;
                    toWebp = options.toWebp || false;
                    if (!fs.existsSync(sourceFile)) {
                        throw new Error("Source file doesn't exist!");
                    }
                    outputPath = path.join('output', hash);
                    tempPath = path.join('output', hash, 'temp');
                    // Make our directories
                    mkdirp.sync(outputPath);
                    mkdirp.sync(tempPath);
                    return [4 /*yield*/, new ffmpeg(sourceFile)];
                case 1:
                    ffMovie = _a.sent();
                    if (doLogging)
                        console.log("Video Duration: " + ffMovie.metadata.duration.seconds + "s");
                    predicted = Math.ceil(ffMovie.metadata.duration.seconds / 10);
                    // Not 100% sure why the predicted is always 1 lower than the actual.
                    if (doLogging)
                        console.log("Predicting " + predicted + " frames");
                    return [4 /*yield*/, ffMovie.fnExtractFrameToJPG(tempPath, {
                            frame_rate: .1,
                            file_name: hash
                        })];
                case 2:
                    f = _a.sent();
                    if (doLogging)
                        console.log("Generated: " + f.length + " frames.");
                    predicted = f.length;
                    pageCols = 10;
                    pageRows = 10;
                    if (predicted < pageCols)
                        pageCols = predicted;
                    pageTotal = pageCols * pageRows;
                    pages = Math.ceil(predicted / (pageCols * pageRows));
                    if (doLogging)
                        console.log("Predicting " + pages + " pages.");
                    output = {
                        pageCount: pages,
                        frameCount: predicted,
                        pages: []
                    };
                    _loop_1 = function (pageID) {
                        var remainder, width, height, canvas, ctx, i, offset, imagePath, img, dx, dy, stream, finalPath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    remainder = predicted - (pageID * pageTotal);
                                    if (remainder > 100)
                                        remainder = 100;
                                    width = Math.ceil(tw * pageCols);
                                    height = Math.ceil(th * Math.ceil(remainder / pageRows));
                                    if (doLogging)
                                        console.log("Canvas size: " + width + " x " + height);
                                    canvas = canvas_1.createCanvas(width, height);
                                    ctx = canvas.getContext('2d');
                                    ctx.rect(0, 0, canvas.width, canvas.height);
                                    ctx.fillStyle = "black";
                                    ctx.fill();
                                    if (doLogging)
                                        console.log("Images left: " + remainder);
                                    i = 0;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < remainder)) return [3 /*break*/, 4];
                                    offset = pageTotal * pageID;
                                    imagePath = path.join(tempPath, hash + "_" + (offset + i + 1) + ".jpg");
                                    if (doLogging)
                                        console.log("Loading " + imagePath);
                                    return [4 /*yield*/, canvas_1.loadImage(imagePath)];
                                case 2:
                                    img = _a.sent();
                                    dx = Math.floor((i) % 10 * tw);
                                    dy = Math.floor((i) / 10) * th;
                                    if (doLogging)
                                        console.log("Drawing " + hash + "_" + (offset + i + 1) + ".jpg at " + dx + "x" + dy);
                                    ctx.drawImage(img, dx, dy, tw, th);
                                    _a.label = 3;
                                case 3:
                                    i++;
                                    return [3 /*break*/, 1];
                                case 4:
                                    stream = canvas.toBuffer();
                                    finalPath = path.join(outputPath, hash + "_" + pageID + ".png");
                                    fs.writeFileSync(finalPath, stream);
                                    if (!toWebp) {
                                        output.pages.push(fs.readFileSync(finalPath));
                                    }
                                    if (!toWebp) return [3 /*break*/, 6];
                                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                                            webp.cwebp(path.join(outputPath, hash + "_" + pageID + ".png"), path.join(outputPath, hash + "_" + pageID + ".webp"), "-q 80", function (status, error) {
                                                if (error)
                                                    return reject(error);
                                                if (status === 101)
                                                    return reject(error);
                                                var webpFinal = path.join(outputPath, hash + "_" + pageID + ".webp");
                                                output.pages.push(fs.readFileSync(webpFinal));
                                                return resolve();
                                            });
                                        })];
                                case 5:
                                    _a.sent();
                                    _a.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    pageID = 0;
                    _a.label = 3;
                case 3:
                    if (!(pageID < pages)) return [3 /*break*/, 6];
                    return [5 /*yield**/, _loop_1(pageID)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    pageID++;
                    return [3 /*break*/, 3];
                case 6:
                    // Perform Clear up.
                    if (doLogging)
                        console.log("Clearing away temporary output directory " + outputPath);
                    rimraf.sync(path.join(__dirname, outputPath));
                    return [2 /*return*/, output];
            }
        });
    });
}
exports.generateSprites = gSprites;

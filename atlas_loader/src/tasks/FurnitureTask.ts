import fs from "fs";
import path from "path";
import {SpritesheetBuilder} from "../builders/SpritesheetBuilder";
import {OffsetBuilder} from "../builders/OffsetBuilder";
import {VisualizationBuilder} from "../builders/VisualizationBuilder";
import {deleteFurniFile} from "../utils/TemporaryFile";
import readline from "readline";

export class FurnitureTask {

    private _fileQueue: string[] = [];
    private _rootDirectory: string = '../resource/dcr/hof_furni/';

    public initialise(): Promise<void> {
        console.log("Initialising FurnitureTask...");
        return new Promise<void>(async (resolve, reject) => {
            try {
                // Recursively read directories and files
                this.recursiveFileRead(this._rootDirectory);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    private recursiveFileRead(dirPath: string) {
        const files = fs.readdirSync(dirPath);


        //Order files by t first
        files.sort((a, b) => {
            if (a.includes("t")) {
                return -1;
            } else if (b.includes("t")) {
                return 1;
            } else {
                return 0;
            }
        });
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                this.recursiveFileRead(filePath);
            } else if (path.extname(file) === ".swf") {
                this._fileQueue.push(filePath);
            }
        });
    }

    public async run() {
        console.log("Running FurnitureTask...");
        const startDate: Date = new Date();
        let fileCount: number = 0;
    
        for (const filePath of this._fileQueue) {
            const assetName: string = path.basename(filePath, path.extname(filePath));
            const directoryPath: string = path.dirname(filePath);

            //if ../resource/sprites/assetName/assetName.png exists, skip
            if (fs.existsSync(path.join('../resource/sprites/', assetName, assetName + ".png"))) {
                continue;
            }

            try {
                fileCount += 1;
                await new SpritesheetBuilder().build(assetName,directoryPath);    
                await new OffsetBuilder().buildFurnitureOffset(assetName, directoryPath);
                if(!await new VisualizationBuilder().buildFurnitureVisualization(assetName,directoryPath)) continue;
        

                // Define destination directory
                const destDirectory = path.join('../resource/sprites/', assetName);
                if (!fs.existsSync(destDirectory)) {
                    fs.mkdirSync(destDirectory, { recursive: true });
                }

                // Move assetName.png and assetName.json to the destination directory
                const pngFile = path.join(directoryPath, assetName,assetName + ".png");
                const jsonFile = path.join(directoryPath, assetName,assetName + ".json");

                if (fs.existsSync(pngFile)) {
                    fs.renameSync(pngFile, path.join(destDirectory,assetName + ".png"));
                }
                if (fs.existsSync(jsonFile)) {
                    fs.renameSync(jsonFile, path.join(destDirectory,assetName + ".json"));
                }


                console.log("Cleanup " + assetName + "...");
                //Check if /furniName/furniName.png exists
                if (fs.existsSync(path.join(directoryPath, assetName, assetName + "_spritesheet.png"))) {
                    //Delete it
                    fs.unlinkSync(path.join(directoryPath, assetName, assetName + "_spritesheet.png"));
                }

                readline.clearLine(process.stdout, 0);
                process.stdout.cursorTo(0);
                
                process.stdout.write("\x1b[0m" + " >> " + "\x1b[33m" + fileCount + "\x1b[0m" + "/" + "\x1b[33m" + this._fileQueue.length + " \x1b[43m\x1b[37m" + assetName + "\x1b[0m");

            } catch (e) {

            }
        }
        const endDate: Date = new Date();
        console.log("FurnitureTask finished in " + (endDate.getTime() - startDate.getTime()) + "ms.", "\x1b[0m");
    }

}
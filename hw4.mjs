#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import colors from 'colors';
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer';

let executionDir = process.cwd();

const options = yargs(hideBin(process.argv))
.usage("Usage: -p <path>")
.option('s', {
    alias: 'search',
    describe: 'Provide a pattern to search in file',
    type: "string",
    demandOption: true 
})
.option("p", { alias: "path", 
    describe: "Path to file", 
    type: "string",
    demandOption: false 
})
.argv;

if(options.p){
    executionDir += options.p
}

const list =  fs.readdirSync(executionDir);
const choice = (list) =>{
    list.unshift('../')
    inquirer.prompt([{
        name: 'fileName',
        type: 'list',
        message: 'Choose file',
        choices: list
    }]).then((answer)=>{
        let filePath = path.join(executionDir, answer.fileName);
        let count = 0;
        if(fs.lstatSync(filePath).isFile()){
            const readStream = fs.createReadStream(filePath, 'utf8');
            readStream.on('data', (chunk) => { 
                if(chunk.includes(options.s)){
                    const pattern = new RegExp(options.s, 'gi');
                    const transformedChunk = chunk.toString().replace(pattern, () => {
                        count++;
                        return colors.inverse(options.s)
                    });
                    console.log(transformedChunk);
                }else{
                    console.log('No matches')
                }; 
            });
            readStream.on('end', () => console.log('File reading finished. ' + (count ? `Matches: ${count}`: ''))); 
            readStream.on('error', () => console.log(err));   
        } else{
            let currentList = fs.readdirSync(filePath)
            executionDir += path.sep+answer.fileName
            choice(currentList)
        }
    });
}
choice(list);
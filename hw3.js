const fs = require('fs');
const lineReader = require('line-reader'); 

const FILE_PATH = './access_tmp.log';
const patterns = [
    '89.123.1.41',
    '34.48.240.111'
]

 
lineReader.eachLine(FILE_PATH, function(line) { 
    
    for(let i = 0; i < patterns.length; i++){
        if(line.includes(patterns[i])){
            fs.writeFile(`./${patterns[i]}_requests.log`, 
            line + '\n',
            { flag: 'a' }, 
            (err) => console.log(err));
            return;
        }
    }

}); 

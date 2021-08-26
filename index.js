const { log } = require('console');
const fs = require('fs');
const { isObject } = require('util');

const fileName = process.argv[2];

let file = fs.readFileSync(fileName, {encoding: 'utf8'});
const DefaultCharNames = ['MC', 'Sayori', 'Monika', 'Natsuki', 'Yuri', 'Natsuki & Yuri']
const Characters = ['mc', 's', 'm', 'n', 'y', 'ny']
let CharNames = [null, null, null, null, null, 'Natsuki & Yuri']
const isACharacterInstruction = (token, i, fileTokens) => {
    /*let tokensTillSpace = readTokensTillSpace(i, fileTokens).join('');
    let charIndex = Characters.indexOf(tokensTillSpace);
    if(charIndex !== -1) {
        return { charIndex, tokensTillSpace }
    }
    return { charIndex: null, tokensTillSpace };*/
    
}


let string = false;
let character = false;
let narratorCharacter = false;
let strings = [];
let stringArray = [];
let characterText = [];
let otherTokens = [];
let fileLines = file.split('\n');
const readTokensTillSpace = (index=0, fileTokens) => {
    let result = [];
    for(let tokenI in fileTokens) {
        if(tokenI >= index) {
            let token = fileTokens[tokenI]
            if(token == " ") break;
            result.push(token);
        }
    }
    return result;
}

// regex to test if a token is starting a new expression or part of one
const expressionRegex = /[\t\n ]/g;

fileLines.forEach(line => {
    let fileTokens = line.split('')
    fileTokens.forEach((token, i) => {
        let nextToken = fileTokens[i+1] || "";
        let lastToken = fileTokens[i-1] || "";
        switch(token) {
            case '"':
    
                if(lastToken == "\\") break;
                string = !string;
                if(!string) {
                    if(character) {
                        character = false;
                        let charName = line.split(' ').filter(exp => exp.length > 0)[0] || "aaa"
                        characterText.push([charName, strings.join('')]);
                    } else if(narratorCharacter) {
                        narratorCharacter = false;
                        characterText.push(["Narrator", strings.join('')])
                    } else {
                        stringArray.push(strings.join(''));
                    }
                    strings = [];
                }
                break;
            default:
                if(string) {
                    if((token == "\\") && (nextToken == '"')) {
                        strings.push('"');
                        break;
                    }
                    strings.push(token);
                    break;
                }
                if((lastToken.match(expressionRegex))) {
                    if((((Characters.indexOf(token) !== -1) && (nextToken == " ")) || ((token === "m") && (nextToken === "c")) || ((token === "n") && (nextToken === "y")))) {
                        character = true;
                        return;
                    }

                    if(nextToken == '"' && !narratorCharacter) {
                        narratorCharacter = true;
                    }
                    
                }
                break;
        }
    })
    character = false;
    /*let { charIndex, tokensTillSpace } = isACharacterInstruction(token, i, fileTokens);
    if(charIndex !== null) {
        console.log(`show char instruction  ${DefaultCharNames[charIndex]}, ${tokensTillSpace}, ${stringArray[stringArray.length-1]}`)
    }*/
})

console.log(characterText.map(text => `${DefaultCharNames[Characters.indexOf(text[0])] || text[0]} - ${text[1]}`).join('\n'))
//console.log(otherTokens.join(''))
//console.log(stringArray)
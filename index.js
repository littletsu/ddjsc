const fs = require('fs');

const fileName = process.argv[2];

let file = fs.readFileSync(fileName, {encoding: 'utf8'});
const DefaultCharNames = ['MC', 'Sayori', 'Monika', 'Natsuki', 'Yuri', 'Natsuki & Yuri']
const Characters = ['mc', 's', 'm', 'n', 'y', 'ny']
let CharNames = [null, null, null, null, null, 'Natsuki & Yuri']

let string = false;
let character = false;
let narratorCharacter = false;
let strings = [];

let instructions = [];
const INSTRUCTIONS = {
    CHARACTER_TEXT: "characterText",
    STRING: "string",
    OTHER: "other"
}
const pushInstruction = (type, data) => instructions.push({
    type,
    data
})

let fileLines = file.split('\n');


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
                        let charName = line.split(' ').filter(exp => exp.length > 0)[0]
                        pushInstruction(INSTRUCTIONS.CHARACTER_TEXT, [charName, strings.join('')])
                    } else if(narratorCharacter) {
                        narratorCharacter = false;
                        pushInstruction(INSTRUCTIONS.CHARACTER_TEXT, ["Narrator", strings.join('')])
                    } else {
                        pushInstruction(INSTRUCTIONS.STRING, strings.join(''));
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
                        break;
                    }

                    if(nextToken == '"' && !narratorCharacter) {
                        narratorCharacter = true;
                        break;
                    }
                    
                }
                break;
        }
    })
    character = false;

})

//console.log(characterText.map(text => `${DefaultCharNames[Characters.indexOf(text[0])] || text[0]} - ${text[1]}`).join('\n'))
console.log(instructions.filter(instr => instr.type === INSTRUCTIONS.CHARACTER_TEXT).map(instr => `${DefaultCharNames[Characters.indexOf(instr.data[0])] || instr.data[0]} - ${instr.data[1]}`).join('\n'))
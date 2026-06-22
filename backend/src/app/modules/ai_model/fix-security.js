const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '..', '..', 'utils', 'promptSecurity.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Append the missing closing structural bracket at the absolute end of file
if (!content.trim().endsWith('}')) {
    content += '\n}\n';
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("✅ Successfully added missing closing bracket to promptSecurity.ts!");
} else {
    console.log("ℹ️ promptSecurity.ts already contains a trailing closing bracket.");
}
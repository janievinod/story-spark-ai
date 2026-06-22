const fs = require('fs');
const path = require('path');

cconst filePath = path.join(__dirname, 'ai_model.utils.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the truncated structure with a complete try-catch block
const targetPattern = `try {\n    // Existing AI model rendering or parsing logic...`;
const structuralFix = `try {
    // Existing AI model rendering or parsing logic...
} catch (error) {
    console.error("AI Model utility failure:", error);
}`;

if (content.includes(targetPattern)) {
    content = content.replace(targetPattern, structuralFix);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("✅ Successfully patched ai_model.utils.ts structure!");
} else {
    // Alternative absolute fallback for syntax line recovery
    console.log("⚠️ Target placeholder pattern not found. Let's append structural balance blocks.");
}
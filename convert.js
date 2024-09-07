const fs = require('fs');

const readmePath = 'README.md'; // Path to your README file
const outputPath = 'questions.js'; // Output file for questions array

fs.readFile(readmePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const questions = [];
    const questionBlocks = data.split(/\n---\n/); // Split by separators (---)
    
    questionBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        
        let question = '';
        let code = '';
        const options = [];
        let correctAnswer = '';
        let explanation = '';

        let inCodeBlock = false;
        let inDetailsBlock = false;
        let inExplanationBlock = false;

        lines.forEach(line => {
            line = line.trim();

            if (line.startsWith('######')) {
                // Capture the question text
                question = line.replace('###### ', '').trim();
            } else if (line.startsWith('```javascript')) {
                // Start of the code block
                inCodeBlock = true;
                code += line + '\n';
            } else if (line.startsWith('```') && inCodeBlock) {
                // End of the code block
                inCodeBlock = false;
                code += line + '\n';
            } else if (inCodeBlock) {
                // Inside the code block
                code += line + '\n';
            } else if (line.startsWith('- ')) {
                // Extract options
                options.push(line);
            } else if (line.includes('**Answer:**')) {
                // Extract the correct answer
                correctAnswer = line.split('**Answer:**')[1].trim();
            } else if (line.includes('#### Answer:')) {
                // Fallback for answer in <details>
                correctAnswer = line.split('#### Answer:')[1].trim();
            } else if (line.startsWith('<details>')) {
                // Start of explanation in details block
                inDetailsBlock = true;
            } else if (line.startsWith('</details>')) {
                // End of explanation block
                inDetailsBlock = false;
            } else if (inDetailsBlock && line.startsWith('<p>')) {
                // Capture explanation inside details
                inExplanationBlock = true;
                explanation += line.replace('<p>', '').replace('</p>', '').trim() + '\n';
            } else if (inExplanationBlock) {
                // Continue capturing explanation
                explanation += line.replace('<p>', '').replace('</p>', '').trim() + '\n';
            }
        });

        questions.push({
            question,
            code,
            options,
            correctAnswer,
            explanation: explanation.trim()
        });
    });

    const output = `const questions = ${JSON.stringify(questions, null, 2)};\n\nexport default questions;`;

    fs.writeFile(outputPath, output, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Questions array has been generated successfully!');
    });
});

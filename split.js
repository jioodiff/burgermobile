const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Extract CSS
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
    fs.writeFileSync('style.css', styleMatch[1].trim());
}

// Extract JS
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
    fs.writeFileSync('script.js', scriptMatch[1].trim());
}

// Update HTML
let newHtml = html.replace(/<style>[\s\S]*?<\/style>/, '');
newHtml = newHtml.replace(/<script>[\s\S]*?<\/script>/, '');

// Insert links
newHtml = newHtml.replace('</head>', '    <link rel="stylesheet" href="style.css">\n</head>');
newHtml = newHtml.replace('</body>', '    <script src="script.js"></script>\n</body>');

fs.writeFileSync('index.html', newHtml);
console.log('Split successful');

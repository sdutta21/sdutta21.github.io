const fs = require('fs');

// Read the current style.css
let cssContent = fs.readFileSync('./css/style.css', 'utf8');

// Replace the circular border-radius for author-img with rounded corners
const oldPattern = /#colorlib-aside \.author-img {[\s\S]*?border-radius: 50%;/g;
const newPattern = cssContent.replace(
  /(-webkit-border-radius: )50%;/g, '$18px;'
).replace(
  /(-moz-border-radius: )50%;/g, '$18px;'  
).replace(
  /(-ms-border-radius: )50%;/g, '$18px;'
).replace(
  /(border-radius: )50%;/g, '$18px;'
);

// Write the updated CSS back to file
fs.writeFileSync('./css/style.css', newPattern);

console.log('✅ Updated profile photo to use rounded corners instead of circle');
console.log('   • Changed border-radius from 50% to 8px');
console.log('   • Photo should now be a rounded square instead of a circle');
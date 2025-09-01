const fs = require('fs');

// Read the current style.css
let cssContent = fs.readFileSync('./css/style.css', 'utf8');

// Replace all instances of the old blue color with your custom terracotta
const oldColor = '#4F7CAC';
const newColor = '#CC7C5E';

// Count replacements for feedback
let replacementCount = 0;
const originalContent = cssContent;

// Replace all instances
cssContent = cssContent.replace(new RegExp(oldColor, 'g'), (match) => {
  replacementCount++;
  return newColor;
});

// Also replace any other common blue colors that might be in there
const otherBlueColors = [
  '#2c98f0', // Another blue used in the template
  '#2C98F0'  // Uppercase version
];

otherBlueColors.forEach(blueColor => {
  const blueReplacements = cssContent.match(new RegExp(blueColor, 'g'));
  if (blueReplacements) {
    cssContent = cssContent.replace(new RegExp(blueColor, 'g'), newColor);
    replacementCount += blueReplacements.length;
    console.log(`Replaced ${blueReplacements.length} instances of ${blueColor}`);
  }
});

// Write the updated CSS back to file
fs.writeFileSync('./css/style.css', cssContent);

console.log(`✅ Updated style.css:`);
console.log(`   • Replaced ${replacementCount} color references`);
console.log(`   • Changed ${oldColor} → ${newColor}`);
console.log(`   • Your sidebar and accents should now use your custom terracotta color!`);

if (replacementCount === 0) {
  console.log(`ℹ️  No instances of ${oldColor} found - the colors may already be correct.`);
}
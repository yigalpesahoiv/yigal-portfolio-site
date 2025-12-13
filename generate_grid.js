const fs = require('fs');
const path = require('path');

const dir = 'images/on-set/resized';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

let html = '<div class="columns-1 md:columns-2 lg:columns-3 gap-0 space-y-0 text-[0]">'; // text-[0] removes whitespace gaps

files.forEach(file => {
    html += `
    <div class="break-inside-avoid">
        <img src="images/on-set/resized/${file}" alt="On Set" class="w-full block grayscale-0 transition-opacity duration-500 hover:opacity-90" loading="lazy">
    </div>`;
});

html += '</div>';

console.log(html);

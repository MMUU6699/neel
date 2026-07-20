const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

const IGNORE_DIRS = ['node_modules', '.git', '.next'];
const IGNORE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.lockb'];
const IGNORE_FILES = ['bun.lock'];

let changedFiles = [];
let renamedFiles = [];
let replacedURLs = new Set();

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                walk(fullPath);
            }
        } else {
            const ext = path.extname(file).toLowerCase();
            if (IGNORE_EXTS.includes(ext) || IGNORE_FILES.includes(file)) {
                continue;
            }
            if (file === 'index.ts' || file === 'index.tsx') {
                continue;
            }
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;
    
    // Replace Domains/URLs first
    // Replace github url
    content = content.replace(/https?:\/\/github\.com\/[^\/]+\/Index/gi, (match) => {
        replacedURLs.add(match);
        return 'https://REPLACE_WITH_YOUR_DOMAIN.com';
    });
    
    // Replace domains like something.REPLACE_WITH_YOUR_DOMAIN.com or REPLACE_WITH_YOUR_DOMAIN.com
    content = content.replace(/([a-zA-Z0-9.\-]*index\.com)/gi, (match) => {
        replacedURLs.add(match);
        return match.replace(/index\.com/i, 'REPLACE_WITH_YOUR_DOMAIN.com');
    });

    // Replace other occurrences
    content = content.replace(/Index/g, 'Index');
    content = content.replace(/Index/g, 'Index');
    content = content.replace(/index/g, 'index');
    content = content.replace(/INDEX/g, 'INDEX');
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        changedFiles.push(filePath);
    }
}

function renameFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                renameFiles(fullPath);
            }
        }
        
        // Skip ignored files before renaming
        const ext = path.extname(file).toLowerCase();
        if (IGNORE_EXTS.includes(ext) || IGNORE_FILES.includes(file)) {
            continue;
        }

        if (file.toLowerCase().includes('index')) {
            const newName = file.replace(/index/ig, (match) => {
                if (match === 'Index') return 'Index';
                if (match === 'Index') return 'Index';
                if (match === 'INDEX') return 'INDEX';
                return 'index';
            });
            const newFullPath = path.join(dir, newName);
            fs.renameSync(fullPath, newFullPath);
            renamedFiles.push({ old: fullPath, new: newFullPath });
        }
    }
}

// 1. Process files for content
walk(rootDir);

// 2. Rename files (bottom-up would be better for directories but we're mostly renaming files)
// The assignment specifies renaming files like scripts/*.sh, scripts/nginx-*.conf, scripts/*.service, etc.
renameFiles(rootDir);

console.log(JSON.stringify({
    changedFiles,
    renamedFiles,
    replacedURLs: Array.from(replacedURLs)
}, null, 2));

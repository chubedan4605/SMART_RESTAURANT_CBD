const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = [
  path.join(__dirname, '../src/features'),
  path.join(__dirname, '../src/Components'),
];

const classReplacements = {
  // BGS
  'bg-white': 'bg-white dark:bg-neutral-950',
  'bg-bistro-cream': 'bg-bistro-cream dark:bg-neutral-900',
  // TEXT
  'text-bistro-charcoal': 'text-bistro-charcoal dark:text-gray-100',
  'text-bistro-charcoal/80': 'text-bistro-charcoal/80 dark:text-gray-200',
  'text-bistro-charcoal/70': 'text-bistro-charcoal/70 dark:text-gray-300',
  'text-bistro-charcoal/60': 'text-bistro-charcoal/60 dark:text-gray-400',
  'text-bistro-charcoal/50': 'text-bistro-charcoal/50 dark:text-gray-500',
  // BORDERS
  'border-bistro-charcoal/10': 'border-bistro-charcoal/10 dark:border-white/10',
  'border-bistro-charcoal/20': 'border-bistro-charcoal/20 dark:border-white/20',
  'border-bistro-cream': 'border-bistro-cream dark:border-neutral-800',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Cẩn thận tránh replace nhiều lần nếu đã có dark:
  for (const [lightClass, replacement] of Object.entries(classReplacements)) {
    // Tìm các class, lưu ý khoảng trắng hoặc ngoặc kép hoặc backtick
    // Chỉ replace nếu chưa có dark: phía sau hoặc phía trước
    const regex = new RegExp(`(?<!dark:)\\b${lightClass.replace(/\//g, '\\/')}\\b(?!\\s+dark:)`, 'g');
    content = content.replace(regex, replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated: ${filePath}`);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

DIRECTORIES_TO_SCAN.forEach(dir => {
  if (fs.existsSync(dir)) {
    scanDir(dir);
  } else {
    console.warn(`Directory not found: ${dir}`);
  }
});

console.log("Done adding dark mode classes!");

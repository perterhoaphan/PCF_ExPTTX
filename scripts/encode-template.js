/**
 * Script encode template.pptx → template.ts (base64)
 * Chạy: node scripts/encode-template.js
 * Output: PptxGenerator/template.ts
 */

const fs = require("fs");
const path = require("path");

const templatePath = path.resolve(__dirname, "../PptxGenerator/template.pptx");
const outputPath = path.resolve(__dirname, "../PptxGenerator/template.ts");

if (!fs.existsSync(templatePath)) {
    console.error("❌ Không tìm thấy template.pptx. Chạy create-template.js trước!");
    process.exit(1);
}

const buffer = fs.readFileSync(templatePath);
const base64 = buffer.toString("base64");
const sizeKB = (buffer.length / 1024).toFixed(1);

const tsContent = `// AUTO-GENERATED - Chạy "node scripts/encode-template.js" để cập nhật
// Template size: ${sizeKB} KB
export const TEMPLATE_BASE64 = "${base64}";
`;

fs.writeFileSync(outputPath, tsContent, "utf8");
console.log(`✅ Encoded template.pptx (${sizeKB} KB) → template.ts`);

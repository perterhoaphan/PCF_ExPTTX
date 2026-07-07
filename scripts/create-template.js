/**
 * Script tạo file template.pptx với 5 slide, mỗi slide có {slideX_title} làm placeholder.
 * Chạy: node scripts/create-template.js
 * Output: PptxGenerator/template.pptx
 */

const pptxgen = require("pptxgenjs");
const path = require("path");

async function createTemplate() {
    const pres = new pptxgen();
    pres.layout = "LAYOUT_16x9";

    const DARK_BLUE = "1E3A5F";
    const WHITE = "FFFFFF";
    const LIGHT_BLUE = "A8C8E8";

    // Helper: thêm header bar xanh + tiêu đề slide (số hiệu)
    function addHeader(slide, slideNum) {
        slide.addShape(pres.ShapeType.rect, {
            x: 0, y: 0, w: "100%", h: 1.0,
            fill: { color: DARK_BLUE },
            line: { color: DARK_BLUE },
        });
        slide.addText(`Slide ${slideNum}`, {
            x: 0.3, y: 0.1, w: 2, h: 0.8,
            fontSize: 13, color: LIGHT_BLUE, fontFace: "Calibri",
        });
    }

    // =========================================================
    // SLIDE 1
    // =========================================================
    const s1 = pres.addSlide();
    s1.background = { color: DARK_BLUE };
    // Placeholder title chính
    s1.addText("{slide1_title}", {
        x: 0.5, y: 2.0, w: 9, h: 1.5,
        fontSize: 36, bold: true, color: WHITE,
        align: "center", fontFace: "Calibri",
    });
    s1.addText("Nhấn nút Export để điền tiêu đề", {
        x: 0.5, y: 3.8, w: 9, h: 0.5,
        fontSize: 14, color: LIGHT_BLUE,
        align: "center", italic: true,
    });

    // =========================================================
    // SLIDE 2
    // =========================================================
    const s2 = pres.addSlide();
    s2.background = { color: WHITE };
    addHeader(s2, 2);
    s2.addText("{slide2_title}", {
        x: 0.5, y: 1.2, w: 9, h: 1.2,
        fontSize: 30, bold: true, color: DARK_BLUE,
        align: "left", fontFace: "Calibri",
    });
    // Đường kẻ trang trí
    s2.addShape(pres.ShapeType.rect, {
        x: 0.5, y: 2.5, w: 9, h: 0.05,
        fill: { color: LIGHT_BLUE }, line: { color: LIGHT_BLUE },
    });
    s2.addText("Nội dung slide 2 sẽ được điền ở đây...", {
        x: 0.5, y: 2.8, w: 9, h: 2.0,
        fontSize: 14, color: "555555", italic: true,
    });

    // =========================================================
    // SLIDE 3
    // =========================================================
    const s3 = pres.addSlide();
    s3.background = { color: WHITE };
    addHeader(s3, 3);
    s3.addText("{slide3_title}", {
        x: 0.5, y: 1.2, w: 9, h: 1.2,
        fontSize: 30, bold: true, color: DARK_BLUE,
        align: "left", fontFace: "Calibri",
    });
    s3.addShape(pres.ShapeType.rect, {
        x: 0.5, y: 2.5, w: 9, h: 0.05,
        fill: { color: LIGHT_BLUE }, line: { color: LIGHT_BLUE },
    });
    s3.addText("Nội dung slide 3 sẽ được điền ở đây...", {
        x: 0.5, y: 2.8, w: 9, h: 2.0,
        fontSize: 14, color: "555555", italic: true,
    });

    // =========================================================
    // SLIDE 4
    // =========================================================
    const s4 = pres.addSlide();
    s4.background = { color: WHITE };
    addHeader(s4, 4);
    s4.addText("{slide4_title}", {
        x: 0.5, y: 1.2, w: 9, h: 1.2,
        fontSize: 30, bold: true, color: DARK_BLUE,
        align: "left", fontFace: "Calibri",
    });
    s4.addShape(pres.ShapeType.rect, {
        x: 0.5, y: 2.5, w: 9, h: 0.05,
        fill: { color: LIGHT_BLUE }, line: { color: LIGHT_BLUE },
    });
    s4.addText("Nội dung slide 4 sẽ được điền ở đây...", {
        x: 0.5, y: 2.8, w: 9, h: 2.0,
        fontSize: 14, color: "555555", italic: true,
    });

    // =========================================================
    // SLIDE 5
    // =========================================================
    const s5 = pres.addSlide();
    s5.background = { color: DARK_BLUE };
    s5.addText("{slide5_title}", {
        x: 0.5, y: 2.0, w: 9, h: 1.5,
        fontSize: 32, bold: true, color: WHITE,
        align: "center", fontFace: "Calibri",
    });
    s5.addText("Cảm ơn!", {
        x: 0.5, y: 4.0, w: 9, h: 0.6,
        fontSize: 18, color: LIGHT_BLUE,
        align: "center", italic: true,
    });

    // Lưu file
    const outputPath = path.resolve(__dirname, "../PptxGenerator/template.pptx");
    await pres.writeFile({ fileName: outputPath });
    console.log("✅ Template created:", outputPath);
    console.log("\nPlaceholders:");
    console.log("  Slide 1: {slide1_title}");
    console.log("  Slide 2: {slide2_title}");
    console.log("  Slide 3: {slide3_title}");
    console.log("  Slide 4: {slide4_title}");
    console.log("  Slide 5: {slide5_title}");
}

createTemplate().catch(console.error);

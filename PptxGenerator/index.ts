import { IInputs, IOutputs } from "./generated/ManifestTypes";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { TEMPLATE_BASE64 } from "./template";

export class PptxGenerator implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _button: HTMLButtonElement;
    private _exportData = "{}";
    private _buttonLabel = "Xuất PowerPoint";
    private _buttonColor = "#C0392B";
    private _pptxTemplate = ""; // Lưu chuỗi Base64 nhận được từ SharePoint Flow

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._button = document.createElement("button");
        this._button.style.cssText = `
            display: inline-block;
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Segoe UI', Segoe, sans-serif;
            letter-spacing: 0.3px;
            transition: filter 0.15s ease;
            white-space: nowrap;
        `;
        this._button.onmouseenter = () => { this._button.style.filter = "brightness(1.12)"; };
        this._button.onmouseleave = () => { this._button.style.filter = "brightness(1)"; };
        this._button.onmousedown  = () => { this._button.style.filter = "brightness(0.88)"; };
        this._button.onmouseup    = () => { this._button.style.filter = "brightness(1.12)"; };
        this._button.onclick = this._generate.bind(this);

        this._applyProps(context);
        container.appendChild(this._button);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._applyProps(context);
    }

    private _applyProps(context: ComponentFramework.Context<IInputs>): void {
        // Thu nhập Template Base64 từ Power Apps (SharePoint Flow)
        this._pptxTemplate = context.parameters.pptxTemplate?.raw ?? "";

        // Thu thập 5 slide titles từ từng property riêng
        this._exportData = JSON.stringify({
            slide1_title: context.parameters.slide1Title?.raw ?? "",
            slide2_title: context.parameters.slide2Title?.raw ?? "",
            slide3_title: context.parameters.slide3Title?.raw ?? "",
            slide4_title: context.parameters.slide4Title?.raw ?? "",
            slide5_title: context.parameters.slide5Title?.raw ?? "",
        });

        // Button label
        const label = (context.parameters.buttonLabel?.raw ?? "").trim();
        this._buttonLabel = label || "Xuất PowerPoint";
        this._button.textContent = this._buttonLabel;

        // Button color
        const color = (context.parameters.buttonColor?.raw ?? "").trim();
        this._buttonColor = color || "#C0392B";
        this._button.style.backgroundColor = this._buttonColor;
        this._button.style.color = this._isDark(this._buttonColor) ? "#FFFFFF" : "#1A1A1A";
    }

    /** Tính độ sáng hex color, trả về true nếu màu tối */
    private _isDark(hex: string): boolean {
        const c = hex.replace("#", "");
        if (c.length < 6) return true;
        const r = parseInt(c.slice(0, 2), 16);
        const g = parseInt(c.slice(2, 4), 16);
        const b = parseInt(c.slice(4, 6), 16);
        // Công thức W3C luminance
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return lum < 0.55;
    }

    private _generate(): void {
        this._button.disabled = true;
        const originalText = this._button.textContent ?? this._buttonLabel;
        this._button.textContent = "⏳ Đang tạo...";

        // Lấy dữ liệu Base64: Lọc khoảng trắng và tiền tố data:...;base64, (nếu có)
        let rawTemplate = (this._pptxTemplate || "").trim();
        
        console.log("[PptxGenerator] Raw template length received from Power Apps:", rawTemplate.length);
        if (rawTemplate.length > 100) {
            console.log("[PptxGenerator] Raw template snippet (first 100 chars):", rawTemplate.substring(0, 100));
        }

        // Lọc bỏ tiền tố data URI nếu Flow trả về kèm header
        if (rawTemplate.includes("base64,")) {
            rawTemplate = rawTemplate.split("base64,")[1];
            console.log("[PptxGenerator] Cleaned data URI prefix. New length:", rawTemplate.length);
        }

        const usingFallback = !rawTemplate;
        const activeTemplate = rawTemplate || TEMPLATE_BASE64;

        console.log("[PptxGenerator] Using fallback demo template?", usingFallback);

        if (!activeTemplate) {
            alert("Lỗi: Không tìm thấy dữ liệu template PowerPoint!");
            this._button.textContent = originalText;
            this._button.disabled = false;
            return;
        }

        try {
            // Parse JSON data
            let data: Record<string, string>;
            try {
                data = JSON.parse(this._exportData);
            } catch {
                data = { tieu_de: this._exportData };
            }

            // Decode base64 template
            const binaryStr = atob(activeTemplate);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
            }

            // Load PizZip + Docxtemplater
            const zip = new PizZip(bytes.buffer);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            // Fill placeholders
            doc.render(data);

            // Generate blob và tải về
            const blob = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            });

            const d = new Date();
            const dateStr = `${d.getDate().toString().padStart(2, "0")}${(d.getMonth() + 1).toString().padStart(2, "0")}${d.getFullYear()}`;
            const fileName = `BaoCao_${dateStr}.pptx`;

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 3000);



        } catch (err) {
            console.error("[PptxGenerator] Lỗi render/decode:", err);
            alert(`Lỗi khi tạo PPTX: ${(err as Error).message}\n(Hãy kiểm tra F12 Console để xem chi tiết)`);
        } finally {
            this._button.textContent = originalText;
            this._button.disabled = false;
        }
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        this._button.onclick      = null;
        this._button.onmouseenter = null;
        this._button.onmouseleave = null;
        this._button.onmousedown  = null;
        this._button.onmouseup    = null;
    }
}

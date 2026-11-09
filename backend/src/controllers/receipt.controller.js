
import Tesseract from "tesseract.js";

const extractReceiptData = (text) => {
    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 2);

    // Normalize spaces and line breaks
    const normalizedText = text.replace(/\s+/g, " ");

    // Extract store name
    const storeName =
        lines.find(
            (line) =>
                !/^(name|date|cashier|bill\s*no\.?|item|qty|price|amount)\s*:?/i.test(
                    line
                )
        ) || null;

    // Extract amount from a line containing Grand Total or Total
    const extractAmountFromLine = (line) => {
        // Match amounts such as 109, 109.00, 1,250.50
        const matches = [
            ...line.matchAll(/(\d[\d,]*(?:\.\d{1,2})?)/g)
        ];

        if (matches.length === 0) return null;

        // Use the last number on the total line
        let amountText = matches[matches.length - 1][1];

        return Number(amountText.replace(/,/g, ""));
    };

    let amount = null;

    // Priority 1: Grand Total
    const grandTotalLine = lines.find((line) =>
        /grand\s*total/i.test(line)
    );

    if (grandTotalLine) {
        amount = extractAmountFromLine(grandTotalLine);
    }

    // Priority 2: Regular Total (excluding Sub Total)
    if (amount === null) {
        const totalLines = lines.filter(
            (line) =>
                /\btotal\b/i.test(line) &&
                !/\b(sub\s*total|grand\s*total)\b/i.test(line)
        );

        if (totalLines.length > 0) {
            amount = extractAmountFromLine(
                totalLines[totalLines.length - 1]
            );
        }
    }

    // Extract date: DD/MM/YY or DD/MM/YYYY
    const dateMatch = normalizedText.match(
        /\b\d{2}[/-]\d{2}[/-]\d{2,4}\b/
    );

    const date = dateMatch ? dateMatch[0] : null;

    return {
        storeName,
        amount,
        date
    };
};

export const scanReceipt = async (req, res) => {

    try {

        // Check whether a file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a receipt image"
            });
        }

        // Read text from the uploaded image
        const result = await Tesseract.recognize(
            req.file.path,
            "eng",
            {
                logger: (m) => console.log(m),
            }

        );

        // Extract receipt information
        const extractedText = result.data.text;

        const receiptData = extractReceiptData(extractedText);

        return res.status(200).json({
            success: true,
            message: "Receipt scanned successfully",
            extractedText,
            receiptData
        });

    } catch (error) {

        console.error("OCR error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to scan receipt"
        });
    }
};

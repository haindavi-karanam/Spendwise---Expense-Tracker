
import Tesseract from "tesseract.js";

const extractReceiptData = (text) => {

    const lines = text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 2);

    // Normalize spaces and line breaks
    const normalizedText = text.replace(/\s+/g, " ");

    // Extract store name (avoid labels like Name, Date, Cashier)
    const storeName = lines.find((line) =>
        !/^(name|date|cashier|bill\s*no\.?|item|qty|price|amount)\s*:?/i.test(line)
    ) || null;

    let amount = null;

    // Priority 1: Find Grand Total
    const grandTotalMatch = normalizedText.match(
        /\bgrand\s*total\b\s*[:\-₹$€£¥]*\s*([\d,]+(?:\.\d{1,2})?)/i
    );

    if (grandTotalMatch) {

        amount = Number(grandTotalMatch[1].replace(/,/g, ""));

    } else {

        // Priority 2: Find standalone Total
        // Exclude Sub Total

        const totalMatches = [
            ...normalizedText.matchAll(
                /\btotal\b\s*[:\-₹$€£¥]*\s*([\d,]+(?:\.\d{1,2})?)/gi
            )
        ];

        const validTotals = totalMatches.filter((match) => {

            const precedingText = normalizedText.slice(
                Math.max(0, match.index - 10),
                match.index
            );

            return !/sub\s*$/i.test(precedingText);
        });

        if (validTotals.length > 0) {

            const selectedTotal =
                validTotals[validTotals.length - 1];

            amount = Number(
                selectedTotal[1].replace(/,/g, "")
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
            "eng"
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

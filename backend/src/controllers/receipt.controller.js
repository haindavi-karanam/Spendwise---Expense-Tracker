import Tesseract from "tesseract.js";

const extractReceiptData = (text) => {
    
    const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 2);

    const storeName = lines.length > 0 ? lines[0] : null;

    const totalMatch = text.match(
        /\bTOTAL\b\s*[:\-]?\s*[$₹]?\s*(\d+(?:\.\d{2})?)/i
    );
    
    const dateMatch = text.match(
        /\b\d{2}\/\d{2}\/\d{4}\b/
    );
    let amount = null;
    let date = null;

    if (dateMatch) {
        date = dateMatch[0];
    }

    if (totalMatch) {
        amount = Number(totalMatch[1]);
    }

    
    return { storeName,amount, date };
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


        // Return the extracted text
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
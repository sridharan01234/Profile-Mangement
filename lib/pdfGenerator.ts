import jsPDF from "jspdf";
import { FormData } from "@/types";

export const downloadAsPDF = (formData: FormData) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Profile Data", 10, 10);

    doc.setFontSize(12);
    const margin = 10;
    const startY = 20;
    let currentY = startY;

    const addEntry = (key: string, value: any, indent: number = 0) => {
        if (currentY > 280) {
            doc.addPage();
            currentY = margin;
        }

        if (typeof value === "string" && value.startsWith("data:image/")) {
            const imgProps = doc.getImageProperties(value);
            const imgHeight = (imgProps.height * 50) / imgProps.width;
            doc.addImage(value, "JPEG", margin + indent, currentY, 50, imgHeight);
            currentY += imgHeight + 10;
        } else if (typeof value === "object" && value !== null) {
            doc.text(`${key}:`, margin + indent, currentY);
            currentY += 10;
            Object.entries(value).forEach(([subKey, subValue]) => {
                addEntry(subKey, subValue, indent + 10);
            });
        } else {
            doc.text(`${key}: ${value}`, margin + indent, currentY);
            currentY += 10;
        }
    };

    Object.entries(formData).forEach(([key, value]) => {
        addEntry(key, value);
    });

    doc.save("profile_data.pdf");
};

export const downloadAsCSV = (formData: FormData) => {
  const csvContent = Object.entries(formData)
    .map(([key, value]) => `${key},${value}`)
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "profile_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

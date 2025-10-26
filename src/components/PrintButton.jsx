import React from "react";
import { Printer } from "lucide-react";
import api from "../utils/api";

const PrintButton = ({
  printData,
  apiUrl,
  generateHtml,
  showAlert,
  btnName
}) => {
  const handlePrint = async () => {
    try {
      let data = printData;

      // 🔹 Fetch data from API if not passed as prop
      if (!data && apiUrl) {
        const res = await api.get(apiUrl);
        data = res.data;
      }

      // 🔹 No data found
      if (!data) {
        showAlert("Error!", "No data available for printing.", "error");
        return;
      }

      // 🔹 Generate HTML content for printing
      const htmlContent = generateHtml(data);
      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        showAlert("Error!", "Pop-up blocked. Please allow pop-ups and try again.", "error");
        return;
      }

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      printWindow.onload = () => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 100);
      };

      showAlert("Success!", "Print dialog opened successfully!", "success");
    } catch (error) {
      console.error("Print error:", error);
      showAlert("Error!", "Failed to prepare print. Please try again.", "error");
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="bg-black/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/20 transition-all duration-200 flex items-center gap-2">
    
      <Printer size={18} />
    {btnName}
    </button>
  );
};

export default PrintButton;

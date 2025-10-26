import React from 'react'
import { FileDown } from "lucide-react";
import api from '../utils/api'

const DownloadButton = ({
  downloadData,
  apiUrl,
  fileName="invoice",
  generateHtml,
  showAlert
}) => {

const handleDownload =async()=>{
  try {
    let data =downloadData;
    // if(!data && apiUrl){
    //   const res =await api.get(apiUrl);
    //   data =res.data
    // }

    if(!data){
      showAlert("error!","no data available to download.","error");
      return
    }

    const htmlContent =generateHtml(data);
    const blob =new Blob([htmlContent],{type:"text/html"});
    const url =URL.createObjectURL(blob);

    const link =document.createElement("a")
      link.href = url;
      link.download = `${fileName}-${data.invoiceNumber || "file"}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showAlert("Success!", "Download successful! Open in browser and press Ctrl+P to save as PDF.", "success");
  } catch (error) {
          console.error("Download error:", error);
      showAlert("Error!", "Failed to generate download. Please try again.", "error");
  }
}


  return (
    <div>
      <button onClick={handleDownload} 
      className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 flex items-center gap-2">
        <FileDown size={18}/>
        Download
      </button>
    </div>
  )
}

export default DownloadButton
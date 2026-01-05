import html2pdf from "html2pdf.js";
import { Link, useNavigate } from "react-router-dom";
import { FiDownload, FiRefreshCw, FiGithub, FiCopy } from "react-icons/fi";
import { useState } from "react";

function Homepage() {
  const navigateTo = useNavigate();
  const fetchedData = sessionStorage.getItem("data");
  const [copied, setCopied] = useState(false);

  const handleReScrape = () => navigateTo("/");
  
  const handleDownloadPDF = () => {
    const worker = html2pdf();
    const opt = {
      margin: 10,
      filename: "Scraped_Data.pdf",
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      html2canvas: { scale: 2 }
    };
    worker.from(fetchedData || "No data available", "string").to("pdf").set(opt).save();
  };

  const handleCopyData = () => {
    navigator.clipboard.writeText(fetchedData || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
               ScrapingBee 🪲
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Web Scraping Results</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCopyData}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <FiCopy className="mr-2" />
              {copied ? "Copied!" : "Copy"}
            </button>
            
            <Link
              to="https://github.com/singodiyashubham87/ScrapeIt"
              target="_blank"
              className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiGithub className="text-xl text-gray-700 dark:text-gray-300" />
            </Link>
          </div>
        </div>

        {/* Data Display Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Scraped Content
              </h2>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                {fetchedData?.length || 0} characters
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="relative">
              <div className="absolute top-4 right-4 z-10">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 md:p-6 overflow-x-auto">
                <pre className="text-sm md:text-base text-gray-800 dark:text-gray-300 font-mono whitespace-pre-wrap break-words leading-relaxed">
                  <code>{fetchedData || "No data scraped yet. Start by scraping a website!"}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <button
            onClick={handleDownloadPDF}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative z-10 flex flex-col items-center">
              <FiDownload className="text-3xl mb-4 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-semibold">Download PDF</span>
              <span className="text-sm opacity-90 mt-2">Export as PDF document</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={handleReScrape}
            className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative z-10 flex flex-col items-center">
              <FiRefreshCw className="text-3xl mb-4 group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-xl font-semibold">New Scrape</span>
              <span className="text-sm opacity-90 mt-2">Scrape another website</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">
              Tips & Information
            </h3>
            <ul className="text-gray-600 dark:text-gray-400 space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <span>Data is stored temporarily in your browser session</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <span>Use the copy button to quickly copy content to clipboard</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <span>PDF export preserves the exact formatting of scraped content</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;

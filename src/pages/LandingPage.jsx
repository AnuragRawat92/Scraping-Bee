import axios from "axios";
import DOMPurify from "dompurify";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { 
  FiGithub, 
  FiSun, 
  FiMoon, 
  FiGlobe, 
  FiDownload,
  FiCode, 
  FiType, 
  FiLogIn, 
  FiLogOut,
  FiSearch,
  FiAlertCircle,
  FiCheckCircle
} from "react-icons/fi";
import { TbFileText } from "react-icons/tb";

function LandingPage() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState("");
  const [alertError, setAlertError] = useState("");
  const [loader, setLoader] = useState(false);
  const [selectedRadioButton, setSelectedRadioButton] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const navigateTo = useNavigate();

  const handleScrapeClick = async () => {
    if (!selectedRadioButton) {
      setAlertError("Please select either Text Only or HTML format");
      setShowModal(true);
    } else if (!isAuthenticated) {
      setAlertError("Please login to continue scraping");
      setShowModal(true);
    } else {
      setLoader(true);
      const urlElement = document.getElementById("url").value;
      const radioElements = document.getElementsByName("contentType");

      const urlRegex = /^(http[s]?:\/\/)(www\.)?[^\s$.?#].[^\s]*$/i;
      if (urlElement === "") {
        setLoader(false);
        setAlertError("Please enter a URL to scrape");
        setShowModal(true);
      } else if (!urlRegex.test(urlElement)) {
        setLoader(false);
        setAlertError("Please enter a valid URL (include http:// or https://)");
        setShowModal(true);
      } else {
        const apiKey = import.meta.env.VITE_API_NINJAS_X_API_KEY;
        const textOnly = radioElements[0].checked ? true : false;
        const url = `https://api.api-ninjas.com/v1/webscraper?url=${urlElement}&text_only=${textOnly}`;

        const res = await axios
          .get(url, {
            headers: { "X-Api-Key": apiKey },
            text_only: textOnly,
          })
          .catch((error) => {
            setLoader(false);
            console.warn(error);
            setAlert("API Error!");
            setAlertError("Please check the URL and try again");
            setShowModal(true);
          });

        if (res) {
          let scrapedData = res.data.data;
          if (!textOnly) {
            scrapedData = DOMPurify.sanitize(`${scrapedData}`);
          }
          sessionStorage.setItem("data", scrapedData);
          setLoader(false);
          navigateTo("homepage");
        }
      }
    }
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) return "Good Morning";
    else if (currentHour >= 12 && currentHour < 18) return "Good Afternoon";
    else return "Good Evening";
  };

  const closeModal = () => setShowModal(false);

  const showModalComponent = () => {
    return (
      <>
        <div
          onClick={closeModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        ></div>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FiAlertCircle className="text-3xl text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {alert || "Alert"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {alertError}
              </p>
              <button
                onClick={closeModal}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const showLoaderImage = () => {
    return (
      <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 mx-auto border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <TbFileText className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-blue-500" />
          </div>
          <p className="mt-6 text-white text-lg font-medium">Scraping website...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800'}`}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-gray-200/10 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <FiGlobe className={`text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                  ScrapingBee 🪲
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-sm`}
              >
                {darkMode ? (
                  <FiSun className="text-lg text-yellow-400" />
                ) : (
                  <FiMoon className="text-lg text-gray-700" />
                )}
              </button>

              <Link
                to="https://github.com/AnuragRawat92/"
                target="_blank"
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} shadow-sm`}
              >
                <FiGithub className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-lg shadow-sm"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-lg shadow-sm"
                >
                  <FiLogIn className="mr-2" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          {isAuthenticated && (
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 dark:from-blue-500/5 dark:to-indigo-600/5 rounded-full mb-6">
              <FiCheckCircle className="text-blue-500 mr-2" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {getGreeting()}, {user.name}!
              </span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Web Scraping
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              Made Simple
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Extract and export web content effortlessly. Enter a URL, choose your format, and scrape with one click.
          </p>
        </div>

        {/* Scraping Interface */}
        <div className="max-w-3xl mx-auto">
          <div className={`rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Input Section */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Enter Website URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiGlobe className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                  <input
                    id="url"
                    type="text"
                    placeholder="https://example.com"
                    className={`block w-full pl-10 pr-4 py-4 text-lg border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
                    onKeyDown={(e) => e.key === 'Enter' && handleScrapeClick()}
                  />
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Select Content Format
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedRadioButton("text")}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${selectedRadioButton === "text" 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border mr-4 flex items-center justify-center ${selectedRadioButton === "text" ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                      {selectedRadioButton === "text" && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div className="text-left">
                      <FiType className="text-2xl text-blue-500 mb-2" />
                      <div className="font-semibold text-white-800 dark:text-white-200">Text Only</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Clean text without HTML tags</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="contentType"
                    value="true"
                    className="hidden"
                    id="textOnly"
                  />
                </button>

                <button
                  onClick={() => setSelectedRadioButton("html")}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 ${selectedRadioButton === "html" 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border mr-4 flex items-center justify-center ${selectedRadioButton === "html" ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'}`}>
                      {selectedRadioButton === "html" && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div className="text-left">
                      <FiCode className="text-2xl text-blue-500 mb-2" />
                      <div className="font-semibold text-white-800 dark:text-white-200">HTML Format</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Preserve HTML structure and tags</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="contentType"
                    value="false"
                    className="hidden"
                    id="radioHtml"
                  />
                </button>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-8">
              <button
                onClick={handleScrapeClick}
                disabled={loader}
                className="group relative w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center">
                  <FiSearch className="mr-3 text-xl group-hover:scale-110 transition-transform" />
                  {loader ? 'Scraping...' : 'Scrape Website'}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>
              </button>
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Press Enter to scrape after entering URL
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <FiGlobe className="text-2xl text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Simple Interface</h3>
              <p className="text-gray-600 dark:text-gray-400">Just paste a URL and click scrape. No complex setup required.</p>
            </div>

            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <FiDownload className="text-2xl text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Easy Export</h3>
              <p className="text-gray-600 dark:text-gray-400">Download scraped data as PDF or copy to clipboard instantly.</p>
            </div>

            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                <FiCheckCircle className="text-2xl text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Secure & Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">Protected scraping with Auth0 and fast API responses.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white-600 dark:text-white-400">
              Made with <span className="text-red-500">❤️</span> by Anurag Rawat
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Powered by API Ninjas • Secure web scraping solution
            </p>
          </div>
        </div>
      </footer>

      {loader && showLoaderImage()}
      {showModal && showModalComponent()}
    </div>
  );
}

export default LandingPage;
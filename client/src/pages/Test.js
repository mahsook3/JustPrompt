import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const sampleKeywords = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "SQL",
  "Bootstrap",
  "SASS",
  "Webpack",
  "REST API",
  "GraphQL",
  "AWS",
  "Firebase",
  "Responsive Design",
  "UI/UX Design",
  "SEO Optimization",
];

const Questionnaire = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [goal, setGoal] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [logoUrl, setLogoUrl] = useState("");

  const handleNext = async () => {
    if (step === 1) {
      localStorage.setItem("companyName", companyName);
    } else if (step === 2) {
      localStorage.setItem("goal", goal);
    } else if (step === 3) {
      // Don't navigate yet, wait for keyword selection
      return setStep(4);
    } else if (step === 4) {
      const data = {
        companyName,
        goal,
        keywords: selectedKeywords,
        logoUrl,
      };
      localStorage.setItem("questionnaireData", JSON.stringify(data));
      // After storing all values, navigate to Dashboard
      navigate("/dashboard");
      return; // Exit function to prevent further steps
    }
    setStep(step + 1); // Increment step to show next question
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1); // Decrement step to show previous question
    }
  };

  const toggleKeyword = (keyword) => {
    const isSelected = selectedKeywords.includes(keyword);
    if (isSelected) {
      setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", "aea1014911ef618a11a303bcebf25ca7");

    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload",
        formData
      );
      if (response.data && response.data.data && response.data.data.url) {
        setLogoUrl(response.data.data.url);
        localStorage.setItem("logoUrl", response.data.data.url); // Store logo URL in localStorage
        handleNext(); // Proceed to the next step after logo upload
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="w-120 bg-white rounded-md shadow-lg p-4">
        {step === 1 && (
          <div className="flex flex-col space-y-4">
            <label htmlFor="companyName" className="mb-1 font-semibold">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              placeholder="Enter your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col space-y-4">
            <label htmlFor="goal" className="mb-1 font-semibold">
              Goal
            </label>
            <input
              id="goal"
              type="text"
              placeholder="What is your goal?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col space-y-4">
            <label className="mb-1 font-semibold">Logo Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full rounded-md px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Company Logo"
                className="mt-2 rounded-md shadow"
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            )}
          </div>
        )}
        {step === 4 && (
          <div className="flex flex-col space-y-4">
            <label className="mb-1 font-semibold">
              Keywords (Select multiple)
            </label>
            <div className="flex flex-wrap">
              {sampleKeywords.map((keyword, index) => (
                <div
                  key={index}
                  onClick={() => toggleKeyword(keyword)}
                  className={`px-3 py-1 rounded-md cursor-pointer m-1 
                                        ${
                                          selectedKeywords.includes(keyword)
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-800"
                                        }
                                        hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {keyword}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleBack}
            className="bg-gray-300 text-gray-800 rounded-md px-4 py-2 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-800 text-white rounded-md px-4 py-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50"
          >
            {step === 4 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;

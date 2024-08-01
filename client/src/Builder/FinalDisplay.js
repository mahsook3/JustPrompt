import React, { useEffect, useState, useCallback } from "react";
import codebase from "../codebase.json";
import Loading from "../components/Loading";

const FinalDisplay = ({ droppedComponents }) => {
  console.log("From FinalDisplay.js", droppedComponents);
  const [finalCode, setFinalCode] = useState("");
  const [finalCss, setFinalCss] = useState("");
  const [finalConfig, setFinalConfig] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComponentCode = useCallback((uuid) => {
    try {
      const component = codebase.find((comp) => comp.uuid === uuid);
      if (!component) {
        throw new Error("Component not found");
      }
      return component;
    } catch (err) {
      console.error("Error fetching component code:", err);
      throw new Error("Error fetching component code");
    }
  }, []);

  useEffect(() => {
    const fetchAllCodes = async () => {
      if (droppedComponents.length === 0) {
        setFinalCode("");
        setFinalCss("");
        setFinalConfig("");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const codes = await Promise.all(
          droppedComponents.map((component) =>
            fetchComponentCode(component.uuid)
          )
        );

        const htmlCode = codes.map((code) => code.html || "").join("\n");
        const cssCode = codes.map((code) => code.tw_css || "").join("\n");
        const configCode = codes.map((code) => code.tw_config || "").join("\n");

        const questionnaireData = JSON.parse(
          localStorage.getItem("questionnaireData")
        );

        const payload = {
          html: htmlCode,
          company: questionnaireData.companyName,
          goal: questionnaireData.goal,
          keywords: questionnaireData.keywords.join(", "),
          color: "questionnaireData.color",
        };

        const response = await fetch(
          "https://codemodifier.onrender.com/generate",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();

        setFinalCode(result.html);
        setFinalCss(cssCode);
        setFinalConfig(configCode);
      } catch (error) {
        console.error("Error fetching component codes:", error.message);
        setError("Error fetching component codes");
      } finally {
        setLoading(false);
      }
    };

    fetchAllCodes();
  }, [droppedComponents, fetchComponentCode]);

  const openInNewTab = () => {
    localStorage.setItem(
      "previewData",
      JSON.stringify({ finalCode, finalCss })
    );
    window.open("/preview-in-new-tab", "_blank");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Preview</h2>
        <button
          onClick={openInNewTab}
          className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="20"
            height="20"
            fill="white"
            viewBox="0 0 26 26"
          >
            <path d="M 12.3125 0 C 10.425781 0.00390625 10.566406 0.507813 11.5625 1.5 L 14.78125 4.71875 L 9.25 10.25 C 8.105469 11.394531 8.105469 13.230469 9.25 14.375 L 11.6875 16.78125 C 12.832031 17.921875 14.667969 17.925781 15.8125 16.78125 L 21.34375 11.28125 L 24.5 14.4375 C 25.601563 15.539063 26 15.574219 26 13.6875 L 26 3.40625 C 26 -0.03125 26.035156 0 22.59375 0 Z M 4.875 5 C 2.183594 5 0 7.183594 0 9.875 L 0 21.125 C 0 23.816406 2.183594 26 4.875 26 L 16.125 26 C 18.816406 26 21 23.816406 21 21.125 L 21 14.75 L 18 17.75 L 18 21.125 C 18 22.160156 17.160156 23 16.125 23 L 4.875 23 C 3.839844 23 3 22.160156 3 21.125 L 3 9.875 C 3 8.839844 3.839844 8 4.875 8 L 8.3125 8 L 11.3125 5 Z"></path>
          </svg>
        </button>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="text-white p-4 rounded-lg">
          <div dangerouslySetInnerHTML={{ __html: finalCode }} />
        </div>
      )}
    </div>
  );
};

export default FinalDisplay;

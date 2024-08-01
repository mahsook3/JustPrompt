import React, { useEffect, useState } from "react";

const PreviewInNewTab = () => {
  const [finalCode, setFinalCode] = useState("");
  const [finalCss, setFinalCss] = useState("");

  useEffect(() => {
    const previewData = JSON.parse(localStorage.getItem("previewData"));
    if (previewData) {
      setFinalCode(previewData.finalCode);
      setFinalCss(previewData.finalCss);
    }
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Preview in New Tab</h2>
      <div className="text-white p-4 rounded-lg">
        {finalCss && <style dangerouslySetInnerHTML={{ __html: finalCss }} />}
        <div dangerouslySetInnerHTML={{ __html: finalCode }} />
      </div>
    </div>
  );
};

export default PreviewInNewTab;

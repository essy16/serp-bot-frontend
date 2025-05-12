import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Botpage.css";

const Botpage = () => {
  const { jobId } = useParams();
  const [fileName, setFileName] = useState("");
  const [location, setLocation] = useState("US");
  const [pacing, setPacing] = useState("Slow & Stealthy");
  const [status, setStatus] = useState("Stopped");
  const [keywords, setKeywords] = useState([]);
  const [jobHistory, setJobHistory] = useState([]);
  const BASE_URL = "https://serp-backend-hedub.ondigitalocean.app";

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !jobId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${BASE_URL}/jobs/${jobId}/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setFileName(file.name);

        const simulatedKeywords = [
          { keyword: "best seo tools", dwellTime: 25 },
          { keyword: "top marketing platform", dwellTime: 30 },
        ];

        const newJob = {
          id: Date.now(),
          fileName: file.name,
          uploadTime: new Date().toLocaleString(),
          keywords: simulatedKeywords,
          location,
          pacing,
          botOutput: `Bot run completed for ${file.name}`,
        };

        setJobHistory([newJob, ...jobHistory]);
        setKeywords(simulatedKeywords);
        setStatus("Uploaded");
      } else {
        const error = await res.json();
        alert(error.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleStartBot = async () => {
    setStatus("Running...");
    try {
      await fetch(`${BASE_URL}/jobs/${jobId}/activate`, {
        method: "POST",
      });
      setTimeout(() => setStatus("Active"), 1500);
    } catch (err) {
      console.error("Start bot error:", err);
    }
  };

  const handleStopBot = async () => {
    try {
      await fetch(`${BASE_URL}/jobs/${jobId}/deactivate`, {
        method: "POST",
      });
      setStatus("Stopped");
    } catch (err) {
      console.error("Stop bot error:", err);
    }
  };

  const handleRerun = (job) => {
    setKeywords(job.keywords);
    setLocation(job.location);
    setPacing(job.pacing);
    setStatus("Re-running...");
    setTimeout(() => setStatus("Active"), 1500);
  };

  return (
    <div className="botpage-container">
      <h1 className="botpage-title">SERP Click Bot Dashboard</h1>

      <div className="form-section">
        <label>
          CSV File:
          <input type="file" onChange={handleFileUpload} />
        </label>
        <div>
          {fileName ? `Selected file: ${fileName}` : "No file selected"}
        </div>
      </div>

      <div className="form-section">
        <label>
          Location:
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="US">US</option>
            <option value="UK">UK</option>
            <option value="CA">Canada</option>
            <option value="DE">Germany</option>
            <option value="AU">Australia</option>
          </select>
        </label>
      </div>

      <div className="form-section">
        <label>
          Pacing Preset:
          <select value={pacing} onChange={(e) => setPacing(e.target.value)}>
            <option value="Slow & Stealthy">Slow & Stealthy</option>
            <option value="Balanced">Balanced</option>
            <option value="Fast Boost">Fast Boost</option>
          </select>
        </label>
      </div>

      <div className="form-section">
        <button onClick={handleStartBot} className="btn-start">
          Start Bot
        </button>
        <button onClick={handleStopBot} className="btn-stop">
          Stop Bot
        </button>
      </div>

      <div className="form-section">
        <strong>Bot Status:</strong> {status}
      </div>

      {keywords.length > 0 && (
        <div className="keywords-table">
          <h3>Active Keywords</h3>
          <table>
            <thead>
              <tr>
                <th>Keyword</th>
                <th>Dwell Time</th>
                <th>Location</th>
                <th>Pacing</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((k, i) => (
                <tr key={i}>
                  <td>{k.keyword}</td>
                  <td>{k.dwellTime}</td>
                  <td>{location}</td>
                  <td>{pacing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="job-history">
        <h3>Job History</h3>
        {jobHistory.length === 0 ? (
          <p>No past jobs yet.</p>
        ) : (
          jobHistory.map((job) => (
            <div className="job-card" key={job.id}>
              <div>
                <strong>File:</strong> {job.fileName}
              </div>
              <div>
                <strong>Uploaded:</strong> {job.uploadTime}
              </div>
              <div>
                <strong>Keywords:</strong>{" "}
                {job.keywords.map((k) => k.keyword).join(", ")}
              </div>
              <div>
                <strong>Location:</strong> {job.location}
              </div>
              <div>
                <strong>Pacing:</strong> {job.pacing}
              </div>
              <div>
                <strong>Logs:</strong> {job.botOutput}
              </div>
              <button onClick={() => handleRerun(job)} className="btn-rerun">
                Re-run Job
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Botpage;

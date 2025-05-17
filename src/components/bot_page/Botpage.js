import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Botpage.css";

const Botpage = () => {
  const { jobId } = useParams();
  const [fileName, setFileName] = useState("");
  const [jobName, setJobName] = useState("");
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("US");
  const [pacing, setPacing] = useState("Slow & Stealthy");
  const [status, setStatus] = useState("Stopped");
  const [clicks, setClicks] = useState([]);
  const BASE_URL = "http://127.0.0.1:5000";

  useEffect(() => {
    if (jobId) {
      fetch(`${BASE_URL}/jobs/${jobId}`)
        .then((res) => res.json())
        .then((data) => {
          setJobName(data.name || "");
          setClientName(data.client_name || "");
        })
        .catch((err) =>
          console.error("Failed to load job name or client:", err)
        );

      fetch(`${BASE_URL}/jobs/${jobId}/clicks`)
        .then((res) => res.json())
        .then((data) => setClicks(data))
        .catch((err) => console.error("Failed to load clicks:", err));
    }
  }, [jobId]);

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
        setStatus("Uploaded");

        // Refresh clicks
        const refreshed = await fetch(`${BASE_URL}/jobs/${jobId}/clicks`);
        const data = await refreshed.json();
        setClicks(data);
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

  const handleRunBot = async () => {
    try {
      const res = await fetch(`${BASE_URL}/jobs/${jobId}/run-bot`, {
        method: "POST",
      });
      const data = await res.json();

      // 🛡️ Defensive check
      if (Array.isArray(data)) {
        setClicks(data);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (err) {
      console.error("Run bot error:", err);
    }
  };

  return (
    <div className="botpage-container">
      <h1 className="botpage-title">
        SERP Click Bot Dashboard
        {clientName && ` - ${clientName}`}
        {jobName && ` / ${jobName}`}
      </h1>

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
        <button onClick={handleRunBot} className="btn-rerun">
          Run Bot Now
        </button>
      </div>

      <div className="form-section">
        <strong>Bot Status:</strong> {status}
      </div>

      <div className="keywords-table">
        <h3>Active Keywords</h3>
        <table>
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Dwell Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clicks.length > 0 ? (
              clicks.map((click, i) => (
                <tr key={i}>
                  <td>{click.keyword}</td>
                  <td>{click.dwell_time}</td>
                  <td>{click.status || "pending"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No keywords uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Botpage;

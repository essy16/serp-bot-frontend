import React, { useState } from "react";

function App() {
  const [fileName, setFileName] = useState("");
  const [location, setLocation] = useState("US");
  const [pacing, setPacing] = useState("Slow & Stealthy");
  const [status, setStatus] = useState("Stopped");
  const [keywords, setKeywords] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    // For now, we won't parse it. Just display the file name.
  };

  const handleStartBot = () => {
    // Placeholder logic:
    setStatus("Running...");
    // In a real app, you'd send the file to the server & parse it
    // Then update 'keywords' from the CSV content
    setTimeout(() => {
      setStatus("Active");
      setKeywords([
        { keyword: "best seo tools", dwellTime: 25, location, pacing },
        { keyword: "top marketing platform", dwellTime: 30, location, pacing },
      ]);
    }, 2000);
  };

  const handleStopBot = () => {
    setStatus("Stopped");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: 20 }}>
      <h1>SERP Click Bot Dashboard</h1>
      <p>Upload CSV, choose location/pacing, and start the bot.</p>

      <div style={{ marginBottom: 20 }}>
        <label>
          CSV File:
          <input type="file" onChange={handleFileUpload} />
        </label>
        <div>{fileName ? `Selected file: ${fileName}` : "No file selected"}</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          Location:
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="US">US</option>
            <option value="UK">UK</option>
            <option value="CA">Canada</option>
            <option value="DE">Germany</option>
            <option value="AU">Australia</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          Pacing Preset:
          <select
            value={pacing}
            onChange={(e) => setPacing(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="Slow & Stealthy">Slow & Stealthy</option>
            <option value="Balanced">Balanced</option>
            <option value="Fast Boost">Fast Boost</option>
          </select>
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={handleStartBot} style={{ marginRight: 8 }}>
          Start Bot
        </button>
        <button onClick={handleStopBot}>Stop Bot</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <strong>Bot Status:</strong> {status}
      </div>

      {keywords.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Keyword</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>
                Dwell Time (sec)
              </th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Location</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Pacing</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((k, i) => (
              <tr key={i}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {k.keyword}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {k.dwellTime}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {k.location}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {k.pacing}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
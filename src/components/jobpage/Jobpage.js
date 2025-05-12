import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../../assets/anna_logo.jpg";
import "./Jobpage.css";

const JobPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [clientDisplayName, setClientDisplayName] = useState("Client");
  const BASE_URL = "http://192.168.100.15:5000";

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const res = await fetch(`${BASE_URL}/clients/${clientId}`);
        if (res.ok) {
          const data = await res.json();
          setClientDisplayName(data.name);
        } else {
          alert("Client not found");
        }
      } catch (err) {
        console.error("Error fetching client by ID:", err);
      }
    };

    if (clientId) fetchClientInfo();
  }, [clientId]);

  useEffect(() => {
    if (!clientId) return;
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${BASE_URL}/clients/${clientId}/jobs`);
        const data = await response.json();
        setJobs(
          data.map((job) => ({
            id: job.id,
            fileName: job.name || `Job ${job.id}`,
            uploadTime: new Date(job.upload_time).toLocaleString(),
            keywordCount: job.keywords.length,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, [clientId]);

  const handleAddJob = async () => {
    const newJobName = prompt("Enter new job file name:");
    if (!newJobName || !clientId) return;

    const keywordInput = prompt("Enter keywords (comma-separated):");
    const keywordList = keywordInput
      ? keywordInput.split(",").map((k) => k.trim())
      : [];

    try {
      const res = await fetch(`${BASE_URL}/clients/${clientId}/jobs/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newJobName,
          keywords: keywordList,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        const newJob = {
          id: result.job_id,
          fileName: newJobName,
          uploadTime: new Date().toLocaleString(),
          keywordCount: keywordList.length,
        };
        setJobs((prev) => [newJob, ...prev]);
      }
    } catch (err) {
      console.error("Error adding job:", err);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJobClick = (jobId) => {
    navigate(`/client/${clientId}/job/${jobId}`);
  };

  return (
    <div className="jobpage-container">
      <div className="jobpage-header">
        <img src={logo} alt="Logo" className="jobpage-logo" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="jobpage-search"
        />
        <button className="jobpage-add-btn" onClick={handleAddJob}>
          + Add Job
        </button>
      </div>

      <div className="job-list">
        <h3>{clientDisplayName}'s Jobs</h3>
        {filteredJobs.length === 0 ? (
          <p>No jobs found. Add one!</p>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() => handleJobClick(job.id)}
            >
              <div>
                <strong>File:</strong> {job.fileName}
              </div>
              <div>
                <strong>Uploaded:</strong> {job.uploadTime}
              </div>
              <div>
                <strong>Keywords:</strong> {job.keywordCount}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobPage;

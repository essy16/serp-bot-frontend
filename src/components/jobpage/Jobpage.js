import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../../assets/anna_logo.jpg";
import "./Jobpage.css";

const JobPage = () => {
  const { clientName } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const [jobs, setJobs] = useState([
    {
      id: "job1",
      fileName: "keywords_April.csv",
      uploadTime: "2024-04-01 12:33",
      keywordCount: 15,
    },
    {
      id: "job2",
      fileName: "seo_campaign.csv",
      uploadTime: "2024-04-10 08:05",
      keywordCount: 22,
    },
  ]);

  const handleAddJob = () => {
    const newJobName = prompt("Enter new job file name:");
    if (newJobName) {
      setJobs([
        {
          id: `job${Date.now()}`,
          fileName: newJobName,
          uploadTime: new Date().toLocaleString(),
          keywordCount: Math.floor(Math.random() * 30) + 1,
        },
        ...jobs,
      ]);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJobClick = (jobId) => {
    navigate(`/client/${encodeURIComponent(clientName)}/job/${jobId}`);
  };

  return (
    <div className="jobpage-container">
      {/* HEADER */}
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

      {/* JOB LIST */}
      <div className="job-list">
        <h3>{clientName}'s Jobs</h3>
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

import React, { useState } from "react";
import logo from "../../assets/anna_logo.jpg";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([
    { name: "Mansour Group", progress: 65 },
    { name: "Nev", progress: 40 },
    { name: "Alejandro Betancourt", progress: 55 },
    { name: "Pearson", progress: 45 },
  ]);
  const navigate = useNavigate();

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    const name = prompt("Enter new client name:");
    if (name) {
      setClients([
        ...clients,
        { name: name.trim(), progress: Math.floor(Math.random() * 100) },
      ]);
    }
  };

  const handleClientClick = (clientName) => {
    navigate(`/client/${encodeURIComponent(clientName)}`);
  };

  return (
    <div className="homepage-container">
      {/* HEADER */}
      <div className="homepage-header">
        <div className="homepage-logo">
          <img src={logo} alt="Logo" />
        </div>

        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="homepage-search"
        />

        <button onClick={handleAddClient} className="homepage-add-btn">
          +
        </button>
      </div>

      {/* DASHBOARD BODY */}
      <div className="dashboard-body">
        <h2 className="dashboard-title">Client Dashboard</h2>

        <div className="client-grid">
          {filteredClients.length === 0 ? (
            <p>No clients found. Kindly add one.</p>
          ) : (
            filteredClients.map((client, index) => (
              <div
                className="client-card"
                key={index}
                onClick={() => handleClientClick(client.name)}
                style={{ cursor: "pointer" }}
              >
                <div className="client-name">{client.name}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${client.progress}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;

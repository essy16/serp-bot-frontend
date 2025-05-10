import React, { useEffect, useState } from "react";
import logo from "../../assets/anna_logo.jpg";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseUrl = "https://serp-backend-hedub.ondigitalocean.app";

const Homepage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch clients from API
  useEffect(() => {
    axios
      .get(`${baseUrl}/clients`)
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Failed to fetch clients:", err));
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = async () => {
    const name = prompt("Enter new client name:");
    if (name) {
      try {
        const res = await axios.post(`${baseUrl}/clients`, { name });
        const newClient = { id: res.data.id, name: name.trim(), progress: 0 };
        setClients([...clients, newClient]);
      } catch (error) {
        console.error("Error adding client:", error);
        alert("Failed to add client");
      }
    }
  };

  const handleClientClick = (clientId) => {
    navigate(`/client/${clientId}/jobs`);
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
            filteredClients.map((client) => (
              <div
                className="client-card"
                key={client.id}
                onClick={() => handleClientClick(client.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="client-name">{client.name}</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${client.total_clicks % 100}%` }}
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

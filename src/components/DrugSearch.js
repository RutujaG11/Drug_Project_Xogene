import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DrugSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    setError("");
    try {
      const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${query}`);
      const conceptGroups = response.data.drugGroup?.conceptGroup || [];
      if (conceptGroups.length > 0) {
        const drugs = conceptGroups.flatMap((group) => group.conceptProperties || []);
        setResults(drugs);
      } else {
        const suggestionResponse = await axios.get(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${query}`);
        const suggestions = suggestionResponse.data.suggestionGroup?.suggestionList?.suggestion || [];
        if (suggestions.length > 0) {
          setResults(suggestions.map((s) => ({ name: s }))); // Wrap suggestions in an object for consistency
        } else {
          setError("No results or suggestions found.");
        }
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while searching.");
    }
  };

  const handleResultClick = (name) => {
    navigate(`/drugs/${name}`);
  };

  return (
    <div className="search-container">
      {/* Header */}
      <header className="header">
        <div className="logo">XOGENE LOGO</div>
        <div className="title">Search for drugs!</div>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter drug name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>🔍 Search</button>
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Results Table */}
      {results.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Drug Name</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx} onClick={() => handleResultClick(result.name)}>
                <td>{result.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DrugSearch;

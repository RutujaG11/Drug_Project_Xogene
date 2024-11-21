import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function DrugDetails() {
  const { drug_name } = useParams();
  const [drugDetails, setDrugDetails] = useState(null);
  const [ndcs, setNdcs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrugDetails = async () => {
      try {
        const response = await axios.get(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drug_name}`);
        const conceptGroups = response.data.drugGroup?.conceptGroup || [];
        const drugs = conceptGroups.flatMap(group => group.conceptProperties || []);
        const drug = drugs.find(d => {
          const nameMatch = d.name?.toLowerCase().includes(drug_name.toLowerCase());
          const synonymMatch = d.synonym?.toLowerCase().includes(drug_name.toLowerCase());
          return nameMatch || synonymMatch;
        });

        if (!drug) {
          setError("Drug details not found.");
          return;
        }

        setDrugDetails(drug);

        if (drug?.rxcui) {
          const ndcResponse = await axios.get(`https://rxnav.nlm.nih.gov/REST/rxcui/${drug.rxcui}/ndcs.json`);
          setNdcs(ndcResponse.data.ndcGroup?.ndcList?.ndc || []);
        }
      } catch (error) {
        console.error("Error fetching drug details:", error);
        setError("Error fetching drug details.");
      }
    };

    fetchDrugDetails();
  }, [drug_name]);

  return (
    <div className="details-container">
      <h2>Drug Details</h2>
      {error ? (
        <p>{error}</p>
      ) : drugDetails ? (
        <>
          {/* Drug Details Table */}
          <table border="1" style={{ width: "50%", margin: "0 auto", textAlign: "left" }}>
            <thead>
              <tr>
                <th colSpan="2" style={{ textAlign: "center" }}>Name of Drug</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>ID:</strong></td>
                <td>{drugDetails.rxcui}</td>
              </tr>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{drugDetails.name}</td>
              </tr>
              <tr>
                <td><strong>Synonym:</strong></td>
                <td>{drugDetails.synonym || "No synonyms available"}</td>
              </tr>
            </tbody>
          </table>

          {/* Associated NDCs Table */}
          <h3 style={{ textAlign: "center", marginTop: "20px" }}>Associated NDCs</h3>
          <table border="1" style={{ width: "50%", margin: "0 auto", textAlign: "left" }}>
            <thead>
              <tr>
                <th>NDCs</th>
              </tr>
            </thead>
            <tbody>
              {ndcs.length > 0 ? (
                ndcs.map((ndc, idx) => (
                  <tr key={idx}>
                    <td>{ndc}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No NDCs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DrugDetails;

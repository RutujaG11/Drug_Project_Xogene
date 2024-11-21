import React, {useState} from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function DrugSearch() {

    const[query,setQuery] = useState("");
    const[result,setResult] = useState([]);
    const[error,setError] = useState("");
    const navigate = useNavigate();

    const handleSearch = async() => {
        setError("");
        try{
            const response = await axios.get(https://rxnav.nlm.nih.gov/REST/drugs.json?name=${query});
            const conceptGroups = response.data.drugGroup.conceptGroup;
            if(conceptGroups){
                const drugs = conceptGroups.flatMap(group => group.conceptProperties || []);
                setResult(drugs);
            }
            else{
                const suggestionResponse = await axios.get(https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${query});
                setResult(suggestionResponse.data.suggestionGroup.suggestionList.suggestion || []);

            }
        }
        catch{
            setError("No results found for your search.");
        }
    };

    const handleResultClick = (name) => {
        navigate(/drugs/${name});
    }

return (
    <div className='search-container'>
        <h2>Search for drugs!</h2>
        <input
        type='text'
        placeholder='Search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        />
    <button onClick={handleSearch}>
        <i class="fa-solid fa-magnifying-glass"></i>   
    </button>     
    {result.length > 0 ? (
        <ul>
            {result.map((result,idx) =>(
            <li key={idx} onClick={() => handleResultClick(result.name || result)}>
                {result.name || result}
            </li>
            ))}
        </ul>
    ):(
        error && <p>{error}</p>
    )}
    </div>
  );
}

export default DrugSearch;

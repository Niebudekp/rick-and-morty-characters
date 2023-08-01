import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CharacterDetails.css"; // Import the CSS file

function CharacterDetails({ selectedCharacter, setSelectedCharacter }) {
  const [episodeList, setEpisodeList] = useState([]);

  useEffect(() => {
    fetchCharacterEpisodes();
  }, [selectedCharacter]);

  const fetchCharacterEpisodes = async () => {
    if (!selectedCharacter) return;

    try {
      const episodeUrls = selectedCharacter.episode;
      const episodePromises = episodeUrls.map((url) => axios.get(url));
      const episodeResponses = await Promise.all(episodePromises);
      const episodes = episodeResponses.map((response) => response.data);
      setEpisodeList(episodes);
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
    }
  };

  const handleBackClick = () => {
    setSelectedCharacter(null);
  };

  return (
    <div className="character-details">
      <div className="character-details-header">
        <h1>{selectedCharacter.name}</h1>
        <button onClick={handleBackClick}>Powrót do listy postaci</button>
      </div>
      <img
        className="character-details-image"
        src={selectedCharacter.image}
        alt={selectedCharacter.name}
      />
      <div className="character-details-info">
        <p>Status: {selectedCharacter.status}</p>
        <p>Species: {selectedCharacter.species}</p>
        <h3>Episodes:</h3>
        <div className="scrollable-table-container">
          <table className="episode-table">
            <thead>
              <tr>
                <th>Episode</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {episodeList.map((episode) => (
                <tr key={episode.id}>
                  <td>{episode.episode}</td>
                  <td>{episode.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CharacterDetails;

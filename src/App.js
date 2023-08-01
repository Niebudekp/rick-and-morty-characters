// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import CharacterDetails from "./CharacterDetails";

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevPageUrl, setPrevPageUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    fetchData("https://rickandmortyapi.com/api/character/");
  }, []);

  useEffect(() => {
    if (searchTerm !== "") {
      fetchSearchData(
        `https://rickandmortyapi.com/api/character/?name=${searchTerm}`
      );
    }
  }, [searchTerm]);

  const fetchData = async (url) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      setData(response.data.results);
      setNextPageUrl(response.data.info.next);
      setPrevPageUrl(response.data.info.prev);
      setCurrentPage(
        getPageNumber(response.data.info.next, response.data.info.prev)
      );
      setTotalPages(response.data.info.pages);
      setIsLoading(false);
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
      setIsLoading(false);
    }
  };

  const fetchSearchData = async (url) => {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      const searchResults = response.data.results;
      if (searchResults.length === 0) {
        setSearchResult([]);
        setIsLoading(false);
        return;
      }
      setSearchResult(searchResults);
      setNextPageUrl(response.data.info.next);
      setPrevPageUrl(response.data.info.prev);
      setCurrentPage(
        getPageNumber(response.data.info.next, response.data.info.prev)
      );
      setTotalPages(response.data.info.pages);
      setIsLoading(false);
    } catch (error) {
      console.error("Błąd pobierania danych:", error);
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    if (value === "") {
      setSearchResult([]);
    } else {
      const filteredResults = data.filter((character) =>
        character.name.toLowerCase().includes(value.toLowerCase())
      );
      if (filteredResults.length === 0) {
        setSearchResult([]);
      }
    }
  };

  const handlePageInputChange = (event) => {
    setPageInput(event.target.value);
  };

  const handlePageInputSubmit = (event) => {
    event.preventDefault();
    if (pageInput >= 1 && pageInput <= totalPages) {
      fetchData(`https://rickandmortyapi.com/api/character/?page=${pageInput}`);
    } else {
      alert("Invalid page number");
    }
  };

  const getPageNumber = (nextUrl, prevUrl) => {
    if (nextUrl) {
      const url = new URL(nextUrl);
      return Number(url.searchParams.get("page")) - 1;
    }
    if (prevUrl) {
      const url = new URL(prevUrl);
      return Number(url.searchParams.get("page")) + 1;
    }
    return 1;
  };

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

//   if (isLoading) {
//     return <div>Ładowanie...</div>;
//   }

  if (selectedCharacter) {
    return (
      <CharacterDetails
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
      />
    );
  }

  return (
    <div className="app-container">
      <h1 className="header">Rick and Morty Characters:</h1>
      <div className="button-container">
        <button disabled={!prevPageUrl} onClick={() => fetchData(prevPageUrl)}>
          Poprzednia strona
        </button>
        <button disabled={!nextPageUrl} onClick={() => fetchData(nextPageUrl)}>
          Następna strona
        </button>
      </div>
      <div className="page-input-container">
        <span>
          Strona {currentPage} z {totalPages}
        </span>
        <form onSubmit={handlePageInputSubmit}>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={pageInput}
            onChange={handlePageInputChange}
          />
          <button type="submit">Przejdź do strony</button>
        </form>
      </div>
      <input
        className="search-box"
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {searchTerm !== "" && searchResult?.length === 0 && (
        <p className="no-results">Brak postaci</p>
      )}
      <div className="character-list">
        {(searchTerm === "" ? data : searchResult)?.map((character, index) => (
          <div
            className="character"
            key={index}
            onClick={() => handleCharacterClick(character)}
          >
            <img
              className="character-image"
              src={character.image}
              alt={character.name}
            />
            <div className="character-info">
              <h2>{character.name}</h2>
              <p>Status: {character.status}</p>
              <p>Species: {character.species}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

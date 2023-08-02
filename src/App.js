// App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import CharacterDetails from "./CharacterDetails";

function App() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [nextPageUrl, setNextPageUrl] = useState("");
    const [prevPageUrl, setPrevPageUrl] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageInput, setPageInput] = useState("");
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    useEffect(() => {
        fetchData();
    }, [searchTerm, currentPage]);

    const fetchData = async() => {
        setIsLoading(true);
        try {
            let url = 'https://rickandmortyapi.com/api/character?page=' + currentPage;
            if(searchTerm !== "") {
                url += `&name=${ searchTerm }`
            }
            const response = await axios.get(url);
            setData(response.data.results);
            setNextPageUrl(response.data.info.next);
            setPrevPageUrl(response.data.info.prev);
            setTotalPages(response.data.info.pages);
        } catch(error) {
            console.error("Błąd pobierania danych:", error);
        }
        setIsLoading(false);
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
    };

    const handlePageInputChange = (e) => {
        setPageInput(e.target.value);
    };

    const handlePageInputSubmit = (e) => {
        e.preventDefault();
        if(pageInput >= 1 && pageInput <= totalPages) {
            setCurrentPage(Number(pageInput))
        } else {
            alert("Invalid page number");
        }
    };

    const handleCharacterClick = (character) => {
        setSelectedCharacter(character);
    };


    const goToNextPage=()=>{
        if(!nextPageUrl) return;
        setCurrentPage(prev => prev + 1)
    }

    const goToPreviousPage=()=>{
        if(!prevPageUrl) return;
        setCurrentPage(prev => prev - 1)
    }

    if(selectedCharacter) {
        return (
            <CharacterDetails
                selectedCharacter={ selectedCharacter }
                setSelectedCharacter={ setSelectedCharacter }
            />
        );
    }

    return (
        <div className="app-container">
            <h1 className="header">Rick and Morty Characters:</h1>
            <div className="button-container">
                <button disabled={ !prevPageUrl } onClick={goToPreviousPage}>
                    Poprzednia strona
                </button>
                <button disabled={ !nextPageUrl } onClick={goToNextPage}>
                    Następna strona
                </button>
            </div>
            <div className="page-input-container">
        <span>
          Strona { currentPage } z { totalPages }
        </span>
                <form onSubmit={ handlePageInputSubmit }>
                    <input
                        type="number"
                        min="1"
                        max={ totalPages }
                        value={ pageInput }
                        onChange={ handlePageInputChange }
                    />
                    <button type="submit">Przejdź do strony</button>
                </form>
            </div>
            <input
                className="search-box"
                type="text"
                placeholder="Search by name"
                value={ searchTerm }
                onChange={ handleSearchChange }
            />
            { data?.length === 0 && (
                <p className="no-results">Brak postaci</p>
            ) }
            <div className="character-list">
                {data.map((character, index) => (
                    <div
                        className="character"
                        key={ index }
                        onClick={ () => handleCharacterClick(character) }
                    >
                        <img
                            className="character-image"
                            src={ character.image }
                            alt={ character.name }
                        />
                        <div className="character-info">
                            <h2>{ character.name }</h2>
                            <p>Status: { character.status }</p>
                            <p>Species: { character.species }</p>
                        </div>
                    </div>
                )) }
            </div>
        </div>
    );
}

export default App;
document.addEventListener('mouseup', async function(e) {
    const selection = window.getSelection().toString().trim();

    if (selection && selection.split(' ').length === 1) {
        const popup = document.getElementById('definitionPopup');

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selection}`);
            const data = await response.json();

            if (data && Array.isArray(data)) {
                let popupContent = `<div class="close-btn" onclick="closePopup()">X</div><h3>${selection}</h3>`;

                data.forEach(entry => {
                    entry.meanings.forEach(meaning => {
                        popupContent += `<div class="partOfSpeech">${meaning.partOfSpeech}</div>`;
                        meaning.definitions.forEach((def, index) => {
                            popupContent += `<div class="definition">${index + 1}. ${def.definition}</div>`;
                            if (def.example) {
                                popupContent += `<div class="example">Example: ${def.example}</div>`;
                            }
                        });

                        if (meaning.synonyms.length > 0) {
                            popupContent += `<div class="synonyms">Synonyms: ${meaning.synonyms.map(syn => `<span onclick="searchWord('${syn}')">${syn}</span>`).join(', ')}</div>`;
                        }

                        if (meaning.antonyms.length > 0) {
                            popupContent += `<div class="antonyms">Antonyms: ${meaning.antonyms.map(ant => `<span onclick="searchWord('${ant}')">${ant}</span>`).join(', ')}</div>`;
                        }
                    });
                });

                popup.innerHTML = popupContent;
                popup.style.right = '0';
                document.body.classList.add('popup-open');
            } else {
                popup.innerHTML = `<div class="close-btn" onclick="closePopup()">X</div><p>No definitions found for "${selection}".</p>`;
                popup.style.right = '0';
                document.body.classList.add('popup-open');
            }
        } catch (error) {
            popup.innerHTML = `<div class="close-btn" onclick="closePopup()">X</div><p>Error fetching definitions.</p>`;
            popup.style.right = '0';
            document.body.classList.add('popup-open');
        }
    } else {
        closePopup();
    }
});

function closePopup() {
    const popup = document.getElementById('definitionPopup');
    popup.style.right = '-300px';
    document.body.classList.remove('popup-open');
}

function searchWord(word) {
    closePopup();
    const selection = word;
    const popup = document.getElementById('definitionPopup');

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selection}`)
        .then(response => response.json())
        .then(data => {
            if (data && Array.isArray(data)) {
                let popupContent = `<div class="close-btn" onclick="closePopup()">X</div><h3>${selection}</h3>`;

                data.forEach(entry => {
                    entry.meanings.forEach(meaning => {
                        popupContent += `<div class="partOfSpeech">${meaning.partOfSpeech}</div>`;
                        meaning.definitions.forEach((def, index) => {
                            popupContent += `<div class="definition">${index + 1}. ${def.definition}</div>`;
                            if (def.example) {
                                popupContent += `<div class="example">Example: ${def.example}</div>`;
                            }
                        });

                        if (meaning.synonyms.length > 0) {
                            popupContent += `<div class="synonyms">Synonyms: ${meaning.synonyms.map(syn => `<span onclick="searchWord('${syn}')">${syn}</span>`).join(', ')}</div>`;
                        }

                        if (meaning.antonyms.length > 0) {
                            popupContent += `<div class="antonyms">Antonyms: ${meaning.antonyms.map(ant => `<span onclick="searchWord('${ant}')">${ant}</span>`).join(', ')}</div>`;
                        }
                    });
                });

                popup.innerHTML = popupContent;
                popup.style.right = '0';
                document.body.classList.add('popup-open');
            } else {
                popup.innerHTML = `<div class="close-btn" onclick="closePopup()">X</div><p>No definitions found for "${selection}".</p>`;
                popup.style.right = '0';
                document.body.classList.add('popup-open');
            }
        })
        .catch(() => {
            popup.innerHTML = `<div class="close-btn" onclick="closePopup()">X</div><p>Error fetching definitions.</p>`;
            popup.style.right = '0';
            document.body.classList.add('popup-open');
        });
}

// Hide popup on click outside
document.addEventListener('click', function(e) {
    const popup = document.getElementById('definitionPopup');
    const isClickInsidePopup = popup.contains(e.target);
    const isClickOnSynonymOrAntonym = e.target.classList.contains('synonyms') || e.target.classList.contains('antonyms');

    if (!isClickInsidePopup && !isClickOnSynonymOrAntonym) {
        closePopup();
    }
});
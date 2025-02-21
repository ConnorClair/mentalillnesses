document.addEventListener('mouseup', async function(e) {
    const selection = window.getSelection().toString().trim();

    if (selection && selection.split(' ').length === 1) {
        await fetchAndDisplayDefinition(selection);
    }
});

async function fetchAndDisplayDefinition(word) {
    const popup = document.getElementById('definitionPopup');

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (data && Array.isArray(data)) {
            let popupContent = `<div class="close-btn" onclick="closePopup()">X</div><h3>${word}</h3>`;

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
                        popupContent += `<div class="synonyms">Synonyms: ${meaning.synonyms.map(syn => `<span onclick="fetchAndDisplayDefinition('${syn}')">${syn}</span>`).join(', ')}</div>`;
                    }

                    if (meaning.antonyms.length > 0) {
                        popupContent += `<div class="antonyms">Antonyms: ${meaning.antonyms.map(ant => `<span onclick="fetchAndDisplayDefinition('${ant}')">${ant}</span>`).join(', ')}</div>`;
                    }
                });
            });

            popup.innerHTML = popupContent;
            popup.style.right = '0';
            document.body.classList.add('popup-open');
            popup.scrollTop = 0; // Reset scroll to top
        } else {
            popup.innerHTML = `<div class="close-btn" onclick="closePopup()">X</div><p>No definitions found for "${word}".</p>`;
            popup.style.right = '0';
            document.body.classList.add('popup-open');
            popup.scrollTop = 0; // Reset scroll to top
        }
    } catch (error) {
        popup.innerHTML = `<div class="close-btn" onclick="closePopup()">X</div><p>Error fetching definitions.</p>`;
        popup.style.right = '0';
        document.body.classList.add('popup-open');
        popup.scrollTop = 0; // Reset scroll to top
    }
}

function closePopup() {
    const popup = document.getElementById('definitionPopup');
    popup.style.right = '-300px';
    document.body.classList.remove('popup-open');
}
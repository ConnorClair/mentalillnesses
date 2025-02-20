document.addEventListener('mouseup', async function(e) {
    const selection = window.getSelection().toString().trim();

    if (selection && selection.split(' ').length === 1) {
        const popup = document.getElementById('definitionPopup');

        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${selection}`);
            const data = await response.json();

            if (data && Array.isArray(data)) {
                let popupContent = `<h3>${selection}</h3>`;

                data.forEach(entry => {
                    entry.meanings.forEach(meaning => {
                        popupContent += `<div class="partOfSpeech">${meaning.partOfSpeech}</div>`;
                        meaning.definitions.forEach((def, index) => {
                            popupContent += `<div class="definition">${index + 1}. ${def.definition}</div>`;
                            if (def.example) {
                                popupContent += `<div class="example">Example: ${def.example}</div>`;
                            }
                        });
                    });
                });

                popup.innerHTML = popupContent;
                popup.style.right = '0';
                document.body.classList.add('popup-open');
            } else {
                popup.textContent = `No definitions found for "${selection}".`;
                popup.style.right = '0';
                document.body.classList.add('popup-open');
            }
        } catch (error) {
            popup.textContent = 'Error fetching definitions.';
            popup.style.right = '0';
            document.body.classList.add('popup-open');
        }
    } else {
        const popup = document.getElementById('definitionPopup');
        popup.style.right = '-300px';
        document.body.classList.remove('popup-open');
    }
});

document.addEventListener('click', function(e) {
    const popup = document.getElementById('definitionPopup');
    if (!popup.contains(e.target)) {
        popup.style.right = '-300px';
        document.body.classList.remove('popup-open');
    }
});
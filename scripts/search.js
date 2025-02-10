function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function search() {
    var query = document.getElementById('searchInput').value.trim();
    if (query !== '') {
        var searchResults = document.getElementById('searchResults');
        // Clear previous search results
        searchResults.innerHTML = '';

        // Define pages and their URLs
        var pages = [
            { title: 'Home', url: 'home.html' },
            { title: 'About Us', url: 'about-us.html' },
            { title: 'Courses', url: 'courses.html' },
            { title: 'News And Events', url: 'news-and-events.html' },
            { title: 'Partners', url: 'partners.html' },
            { title: 'Students', url: 'students.html' }
        ];

        var foundResults = [];

        // Function to fetch page content asynchronously
        function fetchPageContent(page) {
            return fetch(page.url)
                .then(response => response.text())
                .then(html => {
                    var content = html.replace(/<[^>]+>/g, ''); // Remove HTML tags
                    var index = -1;
                    var occurrences = [];
                    var match;
                    // Find all occurrences of the query (case insensitive)
                    var regEx = new RegExp('\\b\\w*' + escapeRegExp(query) + '\\w*\\b', 'gi');
                    while ((match = regEx.exec(content)) !== null) {
                        occurrences.push({ index: match.index, word: match[0] });
                    }
                    if (occurrences.length > 0) {
                        occurrences.forEach(occurrence => {
                            // Extract context around the matched word without cutting off words
                            var contextStartIndex = Math.max(0, occurrence.index - 2); // Start 20 characters before the word
                            var contextEndIndex = Math.min(content.length, occurrence.index + occurrence.word.length + 10); // End 20 characters after the word
                            // Adjust start index to ensure whole words
                            while (contextStartIndex > 0 && !/\s/.test(content[contextStartIndex])) {
                                contextStartIndex--;
                            }
                            // Adjust end index to ensure whole words
                            while (contextEndIndex < content.length && !/\s/.test(content[contextEndIndex])) {
                                contextEndIndex++;
                            }
                            var context = content.substring(contextStartIndex, contextEndIndex);

                            // Extract words around the matched word (limit to 3 words before and after)
                            var words = context.split(/\s+/).filter(word => word !== '');
                            var wordIndex = words.indexOf(occurrence.word);
                            var start = Math.max(0, wordIndex - 3);
                            var end = Math.min(words.length, wordIndex + 4);
                            var wordsAround = words.slice(start, end).join(' ');

                            // Highlight the entire word
                            var highlightedContext = context.replace(new RegExp('(' + escapeRegExp(query) + ')', 'gi'), '<span class="highlight">$1</span>');

                            // Add the entire word to the found results
                            foundResults.push({ page: page, context: highlightedContext, wholeWord: occurrence.word, index: occurrence.index, wordsAround: wordsAround });
                        });
                    }
                });
        }

        // Promise.all to fetch content of all pages asynchronously
        Promise.all(pages.map(page => fetchPageContent(page)))
            .then(() => {
                // Display search results
                if (foundResults.length > 0) {
                    foundResults.forEach(function(result) {
                        var resultBox = document.createElement('div');
                        resultBox.classList.add('search-result-box');

                        var linkElement = document.createElement('a');
                        linkElement.textContent = result.page.title;
                        var linkFragment = `#:~:text=${encodeURIComponent(result.wordsAround)}`; // Include the entire context as the text fragment
                        linkElement.href = result.page.url + linkFragment;
                        linkElement.target = '_blank'; // Open link in a new tab
                        resultBox.appendChild(linkElement);

                        var snippetElement = document.createElement('p');
                        snippetElement.innerHTML = result.context;
                        resultBox.appendChild(snippetElement);

                        searchResults.appendChild(resultBox);
                    });
                } else {
                    var noResultElement = document.createElement('p');
                    noResultElement.textContent = 'No results found.';
                    searchResults.appendChild(noResultElement);
                }
            })
            .catch(error => {
                console.error('Error fetching page content:', error);
            });
    }
}

function searchOnEnter(event) {
    if (event.key === 'Enter') {
        search();
        return false; // Prevent default form submission
    }
}

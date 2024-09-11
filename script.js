document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchButton');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const downloadButton = document.getElementById('downloadButton');
    const viewVerdictsButton = document.getElementById('viewVerdictsButton');
    const modeToggle = document.getElementById('modeToggle');
    const progressBar = document.getElementById('progressBar');
    const papersContainer = document.getElementById('papers-container');
    const pageInfo = document.getElementById('page-info');
    const settingsModal = document.getElementById('settingsModal');
    const verdictsModal = document.getElementById('verdictsModal');
    const closeVerdictsButton = document.getElementById('closeVerdicts');
    const saveSettingsButton = document.getElementById('saveSettings');

    let currentPage = 1;
    let totalPapers = 0;
    let papers = [];

    if (fetchButton) fetchButton.addEventListener('click', fetchPapers);
    if (prevButton) prevButton.addEventListener('click', () => changePage(-1));
    if (nextButton) nextButton.addEventListener('click', () => changePage(1));
    if (downloadButton) downloadButton.addEventListener('click', downloadJSON);
    if (viewVerdictsButton) viewVerdictsButton.addEventListener('click', viewVerdicts);
    if (closeVerdictsButton) closeVerdictsButton.addEventListener('click', closeVerdicts);
    if (saveSettingsButton) saveSettingsButton.addEventListener('click', saveSettings);

    function fetchPapers() {
        const preferences = document.getElementById('preferences').value;
        const isAnnotationMode = modeToggle.checked;

        progressBar.style.display = 'block';
        papersContainer.innerHTML = '';

        fetch('/api/fetch_papers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `preferences=${encodeURIComponent(preferences)}&is_annotation_mode=${isAnnotationMode}`,
        })
        .then(response => {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            
            function readStream() {
                return reader.read().then(({ done, value }) => {
                    if (done) {
                        return;
                    }
                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');
                    lines.forEach(line => {
                        if (line) {
                            const data = JSON.parse(line);
                            if (data.progress) {
                                updateProgress(data.progress);
                            } else if (data.done) {
                                papers = data.papers;
                                totalPapers = data.total;
                                displayPapers();
                                updatePagination();
                            }
                        }
                    });
                    return readStream();
                });
            }

            return readStream();
        })
        .catch(error => {
            console.error('Error:', error);
            progressBar.style.display = 'none';
        });
    }

    function updateProgress(progress) {
        const progressElement = progressBar.querySelector('div');
        progressElement.style.width = `${progress}%`;
    }

    function displayPapers() {
        papersContainer.innerHTML = '';
        papers.forEach(paper => {
            const paperElement = createPaperElement(paper);
            papersContainer.appendChild(paperElement);
        });
        progressBar.style.display = 'none';
    }

    function createPaperElement(paper) {
        const paperDiv = document.createElement('div');
        paperDiv.className = 'paper-card';
        paperDiv.innerHTML = `
            <h2>${paper.title}</h2>
            <p><strong>Authors:</strong> ${paper.authors}</p>
            <p><strong>Abstract:</strong> ${paper.abstract}</p>
            <p><strong>arXiv ID:</strong> ${paper.arxiv_id}</p>
            <p><strong>Published Date:</strong> ${paper.published_date}</p>
            <a href="${paper.pdf_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">PDF</a>
            <a href="${paper.abstract_url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Abstract</a>
            <button class="btn btn-primary vote-button" data-id="${paper.arxiv_id}" data-vote="up">👍</button>
            <button class="btn btn-secondary vote-button" data-id="${paper.arxiv_id}" data-vote="down">👎</button>
            <span class="vote-count">${paper.votes}</span>
        `;

        const voteButtons = paperDiv.querySelectorAll('.vote-button');
        voteButtons.forEach(button => {
            button.addEventListener('click', () => vote(button.dataset.id, button.dataset.vote));
        });

        return paperDiv;
    }

    function vote(arxivId, voteType) {
        fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `arxiv_id=${arxivId}&vote_type=${voteType}`,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const paper = papers.find(p => p.arxiv_id === arxivId);
                if (paper) {
                    paper.votes = data.votes;
                    const paperElement = document.querySelector(`[data-id="${arxivId}"]`).closest('.paper-card');
                    paperElement.querySelector('.vote-count').textContent = data.votes;
                }
            }
        })
        .catch(error => console.error('Error:', error));
    }

    function changePage(direction) {
        currentPage += direction;
        fetch(`/api/get_page?page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                papers = data.papers;
                totalPapers = data.total;
                displayPapers();
                updatePagination();
            })
            .catch(error => console.error('Error:', error));
    }

    function updatePagination() {
        const totalPages = Math.ceil(totalPapers / 10);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    function downloadJSON() {
        const isAnnotationMode = modeToggle.checked;
        window.location.href = `/api/download_json?is_annotation_mode=${isAnnotationMode}`;
    }

    function viewVerdicts() {
        fetch('/api/get_verdicts')
            .then(response => response.json())
            .then(verdicts => {
                const verdictsContainer = document.getElementById('verdictsContainer');
                verdictsContainer.innerHTML = '';
                verdicts.forEach(verdict => {
                    const verdictElement = document.createElement('div');
                    verdictElement.className = 'mb-4 p-4 border rounded';
                    verdictElement.innerHTML = `
                        <h4 class="font-bold">${verdict.title}</h4>
                        <p>${verdict.response}</p>
                        <p class="text-sm text-gray-500">${new Date(verdict.timestamp).toLocaleString()}</p>
                    `;
                    verdictsContainer.appendChild(verdictElement);
                });
                verdictsModal.style.display = 'block';
            })
            .catch(error => console.error('Error:', error));
    }

    function closeVerdicts() {
        verdictsModal.style.display = 'none';
    }

    function saveSettings() {
        const settings = {
            openaiKey: document.getElementById('openaiKey').value,
            maxResults: document.getElementById('maxResults').value,
            papersPerPage: document.getElementById('papersPerPage').value,
            dateRange: document.getElementById('dateRange').value,
            arxivCategories: document.getElementById('arxivCategories').value,
        };

        fetch('/api/update_settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: Object.entries(settings)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&'),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Settings updated successfully');
                settingsModal.style.display = 'none';
            } else {
                alert('Error updating settings: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    }

    // Email copy functionality
    const emailLink = document.getElementById('emailLink');
    if (emailLink) {
        emailLink.addEventListener('click', (event) => {
            event.preventDefault();
            const email = 'anaygupta2004@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                alert('Email address copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy email: ', err);
            });
        });
    }
});
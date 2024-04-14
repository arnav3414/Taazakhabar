document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1;
    const newsPerPage = 12;
    let totalPages;
    let currentQuery = urlParams.get('query') || '';

    function fetchNews(page, query = currentQuery) {
        const apiKey = '1652eb47aa40421eb92575b017648bcc';
        let url;

        if (query) {
            url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}&page=${page}&pageSize=${newsPerPage}`;
        } else {
            url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}&page=${page}&pageSize=${newsPerPage}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const newsList = document.getElementById("newsList");
                newsList.innerHTML = "";
                
                data.articles.forEach(article => {
                    const newsItem = `
                        <div class="col-md-3 mb-4">
                            <div class="card">
                                <div class="img">
                                    <img src="${article.urlToImage}" class="card-img-top" alt="News Image">
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <p class="card-text">${article.description}</p>
                                    <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                                </div>
                            </div>
                        </div>
                    `;
                    newsList.innerHTML += newsItem;
                });

                totalPages = Math.ceil(data.totalResults / newsPerPage);
                updatePagination();
                window.scrollTo(0, 0);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function updatePagination() {
        const paginationList = document.getElementById("paginationList");
        paginationList.innerHTML = "";

        let startPage = currentPage <= 2 ? 1 : currentPage - 1;
        let endPage = currentPage >= totalPages - 1 ? totalPages : currentPage + 1;

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement("li");
            pageItem.className = "page-item";

            if (i === currentPage) {
                pageItem.classList.add("active");
            }

            const pageLink = document.createElement("a");
            pageLink.className = "page-link";
            pageLink.textContent = i;
            pageLink.href = `?page=${i}&query=${currentQuery}`;

            pageLink.addEventListener("click", function(event) {
                event.preventDefault();
                currentPage = i;
                fetchNews(currentPage, currentQuery);
                window.scrollTo(0, 0);
            });

            pageItem.appendChild(pageLink);
            paginationList.appendChild(pageItem);
        }
    }

    fetchNews(currentPage);

    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", event => {
            event.preventDefault();
            const topic = event.target.getAttribute('data-topic');

            if (topic === '') {
                currentQuery = '';
            } else {
                currentQuery = topic;
            }

            currentPage = 1;
            fetchNews(currentPage, currentQuery);
        });
    });

    document.getElementById("searchForm").addEventListener("submit", function(event) {
        event.preventDefault();
        const query = document.getElementById("searchInput").value;
        if (query.trim() !== "") {
            currentQuery = query;
            currentPage = 1;
            fetchNews(currentPage, currentQuery);
        }
    });

    document.querySelector('.brand').addEventListener('click', function() {
        window.location.reload();
    });
});

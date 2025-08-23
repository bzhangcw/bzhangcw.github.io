---
layout: about
title: Search
---

<style>
	#search-container {
	    max-width: 100%;
	    font-family: 'Google Sans Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
	    background-color: #f6f8fa;
	    color: #24292e;
	    padding: 20px;
	    border-radius: 6px;
	    border: 1px solid #e1e4e8;
	    margin: 20px 0;
	}

	.search-input-wrapper {
	    display: flex;
	    align-items: center;
	    background-color: #ffffff;
	    border: 1px solid #d1d5da;
	    border-radius: 6px;
	    padding: 8px 12px;
	}

	.prompt {
	    color: #586069;
	    font-weight: bold;
	    margin-right: 8px;
	    font-family: 'Google Sans Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
	    font-size: 14px;
	}

	input[type=text] {
	    font-family: 'Google Sans Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', monospace;
	    font-size: 15px;
	    outline: none;
	    padding: 0;
	    background: transparent;
	    color: #24292e;
	    width: 100%;
	    border: none;
	    caret-color: #24292e !important; /* Style the cursor to match the text color */
	}

	#results-container {
	    margin: 1rem 0;
	    color: #24292e;
	}

	#results-container li {
	    margin: 8px 0;
	    padding: 12px;
	    background-color: #ffffff;
	    border-radius: 6px;
	    border: 1px solid #e1e4e8;
	    list-style: none;
	}

	#results-container a {
	    color: #0366d6;
	    text-decoration: none;
	    font-weight: 500;
	}

	#results-container a:hover {
	    color: #0366d6;
	    text-decoration: underline;
	}

	.no-results {
	    color: #586069;
	    font-weight: 500;
	    padding: 12px;
	    background-color: #ffffff;
	    border-radius: 6px;
	    border: 1px solid #e1e4e8;
	}

	/* GitHub-style focus states */
	.search-input-wrapper:focus-within {
	    border-color: #0366d6;
	    box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
	}
</style>

<!-- Html Elements for Search -->
<div id="search-container">
    <div class="search-input-wrapper">
        <div class="prompt">@cz> </div>
        <input type="text" id="search-input" placeholder="Enter search term...">
    </div>
    <ol id="results-container"></ol>
</div>

<!-- Script pointing to search-script.js -->
<script src="/search.js" type="text/javascript"></script>

<!-- Configuration -->
<script type="text/javascript">
SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  json: '/search.json',
  searchResultTemplate: '<li><a href="{url}" title="{description}">{title}</a></li>',
  noResultsText: '<div class="no-results">No results found</div>',
  limit: 10,
  fuzzy: false,
  exclude: ['Welcome']
})
</script>
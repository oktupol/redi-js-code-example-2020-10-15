document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('#search');
    const resultList = document.querySelector('#result');
    const resultCount = document.querySelector('#resultCount');
    const loader = document.querySelector('#loader');

    searchForm.addEventListener('submit', event => {
        // Prevents the form from navigating to its target (even if no target is set, the form would cause a reload of the page)
        event.preventDefault();

        // In forms, we can access form controls (inputs, selects, etc.) by using their name.
        // Alternatively, I can use document.getElementById or document.querySelector just like everywhere else
        const searchTerm = searchForm.carManufacturer.value;
        const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${searchTerm}?format=json`;

        // Displaying the loader overlay
        loader.style.display = 'flex';

        // Clearing past results
        resultList.innerHTML = '';
        resultCount.innerHTML = '';

        fetch(url)
            .then(result => result.json())
            .then(data => {
                // Extract the result array from the returned JSON
                const results = data.Results;

                resultCount.innerText = `Got ${results.length} result${results.length !== 1 ? 's' : ''}.`;

                // Sorting by ID
                results.sort((a, b) => a.Model_ID - b.Model_ID);

                for (const result of results) {
                    // Creating a new list entry
                    const listElement = document.createElement('li');

                    // Using regular expressions to transform the make-name into title case
                    const makeName = result.Make_Name.replace(/\b(\w)(\w+)/g, (match, p1, p2) => p1.toUpperCase() + p2.toLowerCase());

                    // Template strings are a great way of dynamically creating small html snippets in javascript.
                    // Alternatively, you can use document.createElement for these elements, too.
                    listElement.innerHTML = `
                        <div class="id">${result.Model_ID}</div>
                        <div class="name">${result.Model_Name}</div>
                        <small>${makeName}</small>
                    `;

                    // Appending the list entry to our result list
                    resultList.appendChild(listElement);
                }
            })
            .catch(error => {
                // If an error occurs during the api-request, we log it to the console
                console.warn(error);
            })
            .finally(() => {
                // The 'finally' method is executed after the api request finishes, regardless of whether there was an error or not.
                // Once the api request is done, remove the loader
                loader.style.display = 'none';
            });
    });
});
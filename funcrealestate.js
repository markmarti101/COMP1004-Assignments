document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const listingsElement = document.getElementById('listings');
    const favouriteListingsbutton = document.getElementById('favouriteListings');
    const manageUsersButton = document.getElementById('manageUsersButton');
    const manageUsersPopup = document.getElementById('manageUsersPopup');
    const closemanageUsersPopup = manageUsersPopup.querySelector('.close');
    const favoritesList = document.getElementById('Favourites');

    // Encode the provided API credentials for Basic Auth
    const basicAuth = btoa('simplyrets:simplyrets');

    // Function to fetch listings from the API
    const fetchListings = async (searchText = '') => {
        try {
            const url = `https://api.simplyrets.com/properties?q=${searchText}`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching properties:', error);
            listingsElement.innerHTML = '<p>Error loading listings. Please check console for details.</p>';
        }
    };

    // Function to display listings on the webpage
    const displayListings = (listings) => {
        if (listings.length === 0) {
            listingsElement.innerHTML = '<p>No listings found.</p>';
            return;
        }
        listingsElement.innerHTML = listings.map(listing => {
            const { address, photos, listPrice, property } = listing;
            return `
                <div class="listing">
                    <img src="${photos[0]}" alt="Listing at ${address.full}">
                    <h3>${address.full}</h3>
                    <p>$${listPrice.toLocaleString()}</p>
                    <p>${property.bedrooms} beds, ${property.bathsFull + (property.bathsHalf ? 0.5 : 0)} baths, ${property.area} sqft</p>
                    <button class="star" data-title="${address.full}">&#9734;</button>
                </div>
            `;
        }).join('');

        // Event listeners for favorite buttons
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', function () {
                this.classList.toggle('favorited');
                if (this.classList.contains('favorited')) {
                    this.innerHTML = '&#9733;';
                    addFavourite(this.getAttribute('data-title'));
                } else {
                    this.innerHTML = '&#9734;';
                    removeFavourite(this.getAttribute('data-title'));
                }
            });
        });
    };

    // Add listing to favorites
    const addFavourite = (title) => {
        const listItem = document.createElement('li');
        listItem.textContent = title;
        favoritesList.appendChild(listItem);
    };

    // Remove listing from favorites
    const removeFavourite = (title) => {
        Array.from(favoritesList.children).forEach(item => {
            if (item.textContent === title) {
                favoritesList.removeChild(item);
            }
        });
    };

    // Event listener for input in search bar to filter listings
    searchBar.addEventListener('input', function () {
        fetchListings(this.value).then(displayListings);
    });

    // Load initial listings with no query to display default set
    fetchListings().then(displayListings).catch(error => console.error('Failed to load initial listings:', error));

    // UI interactions
    favouriteListingsbutton.addEventListener('click', () => {
        favoritesList.style.display = favoritesList.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('contactButton').addEventListener('click', function () {
        document.getElementById('ContactPopup').style.display = 'flex';
    });

    document.querySelector('.close').addEventListener('click', function () {
        document.getElementById('ContactPopup').style.display = 'none';
    });

    manageUsersButton.addEventListener('click', () => {
        manageUsersPopup.style.display = 'flex';
    });

    closemanageUsersPopup.addEventListener('click', () => {
        manageUsersPopup.style.display = 'none';
    });
});

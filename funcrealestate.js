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

document.getElementById('exportFavorites').addEventListener('click', () => {
    try {
        const favorites = [];
        // Ensure the selector matches the list items in the favorites list
        document.querySelectorAll('#Favourites li').forEach(item => {
            favorites.push({ title: item.textContent.trim() }); // Trim text if necessary
        });

        if (favorites.length === 0) {
            alert('No favorites to export.');
            return; // Exit if there are no favorites
        }

        const blob = new Blob([JSON.stringify(favorites, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favorites.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the object URL
    } catch (error) {
        console.error('Error exporting favorites:', error);
        alert('Failed to export favorites.');
    }
});


document.getElementById('importFavorites').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const fileReader = new FileReader();
    fileReader.onload = function() {
        const favorites = JSON.parse(this.result);
        const favoritesList = document.getElementById('Favourites');
        favoritesList.innerHTML = ''; // Clear existing favorites
        favorites.forEach(fav => {
            const listItem = document.createElement('li');
            listItem.textContent = fav.title;
            favoritesList.appendChild(listItem);
        });
    };
    fileReader.readAsText(event.target.files[0]);
});

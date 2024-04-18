document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const listingsElement = document.getElementById('listings');
    const favouriteListingsbutton = document.getElementById('favouriteListings');
    const manageUsersButton = document.getElementById('manageUsersButton');
    const manageUsersPopup = document.getElementById('manageUsersPopup');
    const closemanageUsersPopup = manageUsersPopup.querySelector('.close');


    const listings = [
        { title: 'Modern Apartment in City Center', image: 'images/apartment1.jpg', price: '$1200/mo', description: '2 bed, 2 bath, balcony' },
        { title: 'Cozy Suburban House', image: 'images/house1.jpg', price: '$1500/mo', description: '3 bed, 2 bath, garden' },
        // ... more listings
    ];

    const displayListings = (listings) => {
        listingsElement.innerHTML = listings.map(listing => {
            return `
                <div class="listing">
                    <img src="${listing.image}" alt="${listing.title}">
                    <h3>${listing.title}</h3>
                    <p>${listing.price}</p>
                    <p>${listing.description}</p>
                    <span class="star" data-title="${listing.title}">&#9734;</span>
                </div>
            `;
        }).join('');

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




    const addFavourite = (title) => {
        const listItem = document.createElement('li');
        listItem.textContent = title;
        favoritesList.appendChild(listItem);
    };
    const removeFavourite = (title) => {
        Array.from(favoritesList.children).forEach(item => {
            if (item.textContent === title) {
                favoritesList.removeChild(item);
            }
        });
    };

    const filterListings = (event) => {
        const searchText = event.target.value.toLowerCase();
        const filteredListings = listings.filter(listing => 
            listing.title.toLowerCase().includes(searchText) ||
            listing.description.toLowerCase().includes(searchText)
        );
        displayListings(filteredListings);
    };


    searchBar.addEventListener('input', filterListings);

    displayListings(listings);


    favouriteListingsbutton.addEventListener('click', () => {
        if (favoritesList.style.display === 'none') {
            favoritesList.style.display = 'block';
        } else {
            favoritesList.style.display = 'none';
        }
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


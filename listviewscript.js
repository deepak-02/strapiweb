
import { openModalWithDetails } from './modal.js';


document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:1337/api/products?populate=%2A')
        .then(response => response.json())
        .then(data => {
            const productList = document.querySelector('.product-list');
            console.log(data.data.length);
            data.data.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                <img src="${product.attributes.cover_image?.data?.attributes?.url ? `http://localhost:1337${product.attributes.cover_image.data.attributes.url}` : 'https://imgs.search.brave.com/cUQmU_xPqdXnmj09X355KSrh8Fo9XBT_f_6J4C8fkng/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTIy/OTYyMzU0L3ZlY3Rv/ci9uby1pbWFnZS1h/dmFpbGFibGUtc2ln/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9eGJHelFpTF9V/SU1GRFVadGUxVTBl/bmQwcDNFOGl3b2NJ/T0d0X3N3bHl3RT0'}" alt="${product.attributes.title || 'Default Title'}">
                <h2>${product.attributes.title || 'Default Title'}</h2>
                <p><strong>Brand:</strong> ${product.attributes.brand || 'Default Brand'}</p>
                <p><strong>Price:</strong> $${product.attributes.price || 'Default Price'}</p>
                <div class="description">${product.attributes.description || 'Default Description'}</div>
                <br>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            `;
                productList.appendChild(card);

                const editButton = card.querySelector('.edit-btn');
                editButton.addEventListener('click', function () {
                    // Redirect to the edit page, appending the product ID as a query parameter
                    const editPageUrl = `editData.html?id=${product.id}`;
                    window.location.href = editPageUrl;
                });


                const deleteButton = card.querySelector('.delete-btn');
                deleteButton.addEventListener('click', function () {
                    // Confirm deletion
                    if (confirm('Are you sure you want to delete this product?')) {
                        // Send a DELETE request to your API
                        fetch(`http://localhost:1337/api/products/${product.id}`, {
                            method: 'DELETE',
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                // On successful deletion, remove the card from the DOM
                                productList.removeChild(card);
                            })
                            .catch(error => console.error('Error:', error));
                    }
                });



            });
        })
        .catch(error => console.error('Error:', error));
});


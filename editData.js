
var productsId;
var imgID;

document.addEventListener('DOMContentLoaded', function() {
    // Get the product ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    productsId = productId;

    // Fetch the product details
    fetch(`http://localhost:1337/api/products/${productId}?populate=%2A`)
        .then(response => response.json())
        .then(data => {
            // Correctly access the nested product data
            console.log(data);
            const product = data.data;

            const isEmptyOrNull = value => {
                // Check if the value is a string and trim it
                if (typeof value === 'string') {
                    return !value.trim().length;
                }
                // If the value is not a string, consider it empty or null
                return true;
            };

            imgID = product.attributes.cover_image?.data?.id;
            
            console.log(imgID);
            console.log(productsId);

            // Populate the form fields with the product details, handling null or empty values
            document.getElementById('title').value = isEmptyOrNull(product.attributes.title) ? '' : product.attributes.title;
            document.getElementById('brand').value = isEmptyOrNull(product.attributes.brand) ? '' : product.attributes.brand;
            document.getElementById('description').value = isEmptyOrNull(product.attributes.description) ? '' : product.attributes.description;
            // Populate other fields as necessary
              // Populate the cover image ID, availability, and price fields
              document.getElementById('cover_image').value = product.attributes.cover_image?.data?.id || '';
              document.getElementById('availability').value = product.attributes.availability || '';
              document.getElementById('price').value = product.attributes.price || '';

              // Pre-select the category based on the fetched product data
            const categoryDropdown = document.getElementById('categories');
            if (product.attributes.categories && product.attributes.categories.data && product.attributes.categories.data.length > 0) {
                // Assuming the first category in the array is the one to be selected
                const selectedCategoryId = product.attributes.categories.data[0].id;
                categoryDropdown.value = selectedCategoryId;
            }

            // Create and append the product image
            const productImageDiv = document.querySelector('.product-image');
            const img = document.createElement('img');
            img.src = product.attributes.cover_image?.data?.attributes?.url ? `http://localhost:1337${product.attributes.cover_image.data.attributes.url}` : 'https://imgs.search.brave.com/cUQmU_xPqdXnmj09X355KSrh8Fo9XBT_f_6J4C8fkng/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTIy/OTYyMzU0L3ZlY3Rv/ci9uby1pbWFnZS1h/dmFpbGFibGUtc2ln/bi5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9eGJHelFpTF9V/SU1GRFVadGUxVTBl/bmQwcDNFOGl3b2NJ/T0d0X3N3bHl3RT0';
            img.alt = product.attributes.title || 'Default Title';
            img.style.width = '100px'; // Adjust the width as needed
            img.style.height = '100px'; // Adjust the height as needed
            productImageDiv.appendChild(img);
        })
        .catch(error => console.error('Error:', error));
});



document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Show loading animation
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.innerHTML = 'Loading...';
    submitButton.disabled = true;

    // Convert form data to JSON
    const formData = new FormData(event.target);
    const jsonObject = {};
    formData.forEach((value, key) => {
        if (key === 'categories') {
            jsonObject[key] = value.split(',').map(Number); // Convert categories to array of numbers
        } else {
            jsonObject[key] = value;
        }
    });

    // Send the JSON object to the server
    fetch(`http://localhost:1337/api/products/${productsId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: jsonObject }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Success message
            submitButton.innerHTML = 'Success!';
            setTimeout(() => {
                submitButton.innerHTML = 'Submit';
                submitButton.disabled = false;
            }, 2000); // Reset button after 2 seconds


            // Success message
            const responseDiv = document.createElement('div');
            responseDiv.className = 'response success';
            responseDiv.textContent = 'Product submitted successfully!';
            event.target.insertBefore(responseDiv, submitButton.parentNode);
            setTimeout(() => {
                responseDiv.remove();
            }, 5000); // Remove the message after 5 seconds



        })
        .catch((error) => {
            // Failure message
            submitButton.innerHTML = 'Failed!';
            setTimeout(() => {
                submitButton.innerHTML = 'Submit';
                submitButton.disabled = false;
            }, 2000); // Reset button after 2 seconds


            // Failure message
            const responseDiv = document.createElement('div');
            responseDiv.className = 'response error';
            responseDiv.textContent = 'An error occurred while submitting the product.';
            event.target.insertBefore(responseDiv, submitButton.parentNode);
            setTimeout(() => {
                responseDiv.remove();
            }, 5000); // Remove the message after 5 seconds


        });
});



document.getElementById('imageUploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Show loading animation
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.innerHTML = 'Loading...';
    submitButton.disabled = true;

    // Create a FormData object
    const formData = new FormData(event.target);

    // Define imgId, which should be the ID of the image you want to delete
    let imgId = imgID; // Replace with your actual image ID or a way to dynamically get it

    // Check if imgId is defined and not null or undefined
    if (typeof imgId !== 'undefined' && imgId) {
        // Delete existing image
        fetch(`http://localhost:1337/api/upload/files/${imgId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Proceed with the image upload after successfully deleting the existing image
            return uploadNewImage(formData, submitButton, event);
        })
        .catch((error) => {
            console.error('Error deleting image:', error);
            // Optionally, handle the error or attempt to upload the new image anyway
        });
    } else {
        // If imgId is not defined, proceed directly with the image upload
        uploadNewImage(formData, submitButton, event);
    }
});

function uploadNewImage(formData, submitButton, event) {
    fetch(`http://localhost:1337/api/upload`, {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Success message
        submitButton.innerHTML = 'Success!';
        setTimeout(() => {
            submitButton.innerHTML = 'Upload';
            submitButton.disabled = false;
        }, 2000); // Reset button after 2 seconds

        // Extract the ID from the response and set it as the value of the "Cover Image ID" input field
        const coverImageIdInput = document.getElementById('cover_image');
        if (coverImageIdInput && data[0] && data[0].id) {
            coverImageIdInput.value = data[0].id;
        }

        // Display success message
        const responseDiv = document.createElement('div');
        responseDiv.className = 'response success';
        responseDiv.textContent = 'Image uploaded successfully!';
        event.target.insertBefore(responseDiv, submitButton.parentNode);
        setTimeout(() => {
            responseDiv.remove();
        }, 5000); // Remove the message after 5 seconds
    })
    .catch((error) => {
        // Failure message
        submitButton.innerHTML = 'Failed!';
        setTimeout(() => {
            submitButton.innerHTML = 'Upload';
            submitButton.disabled = false;
        }, 2000); // Reset button after 2 seconds

        // Display failure message
        const responseDiv = document.createElement('div');
        responseDiv.className = 'response error';
        responseDiv.textContent = 'An error occurred while uploading the image.';
        event.target.insertBefore(responseDiv, submitButton.parentNode);
        setTimeout(() => {
            responseDiv.remove();
        }, 5000); // Remove the message after 5 seconds
    });
}

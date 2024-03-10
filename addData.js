


document.getElementById('imageUploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Show loading animation
    const submitButton = event.target.querySelector('button[type="submit"]');
    submitButton.innerHTML = 'Loading...';
    submitButton.disabled = true;

    // Create a FormData object
    const formData = new FormData(event.target);

    // Send the form data to the server
    fetch('http://localhost:1337/api/upload', {
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
    fetch('http://localhost:1337/api/products', {
        method: 'POST',
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

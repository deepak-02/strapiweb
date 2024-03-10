// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//  modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
 if (event.target == modal) {
    modal.style.display = "none";
 }
}

// Function to open the modal and populate it with product details
export function openModalWithDetails(product) {
    console.log("model");
    console.log(document.getElementById('modal-body'));
 document.getElementById('modal-body').innerHTML = `
    <h2>${product.attributes.title}</h2>
    <p><strong>Brand:</strong> ${product.attributes.brand}</p>
    <p><strong>Price:</strong> $${product.attributes.price}</p>
    <p><strong>Description:</strong> ${product.attributes.description}</p>
 `;
 modal.style.display = "block";
}



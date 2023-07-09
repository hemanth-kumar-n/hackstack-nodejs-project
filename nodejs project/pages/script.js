
  fetch('products.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(products) {
    let placeholder = document.querySelector('#data-output');
    let originalProducts = products; // Store the original products for resetting

    function displayProducts(products) {
      let out = "";
      for (let product of products) {
        out += `
          <div class="item">
            <img class="foodImage" src="${product.image}">
            <p>${product.name}</p>
            <p>Rs:${product.price}</p>
            <form method="post" action="/add_to_cart">
              <label>Qty</label>
              <input type="number" name="quantity" min="1" value="1" style="width:30px;">
              <input type="hidden" name="productname" value="${product.name}">
              <input type="hidden" name="productprice" value="${product.price}">
              <button class="menubutton" type="submit" style="border-radius:6px;">add to cart</button>
            </form>
            
            <button class="menubutton" style="border-radius:6px;">delete</button>
          </div>
        `;
      }
      placeholder.innerHTML = out;
    }

    displayProducts(products); // Display all products initially

    // Search bar
    const searchInput = document.querySelector('#search-input');

    searchInput.addEventListener('input', function() {
      const query = searchInput.value.toLowerCase();
      const filteredProducts = originalProducts.filter(function(product) {
        return product.name.toLowerCase().includes(query);
      });
      displayProducts(filteredProducts);
    });
  });


    
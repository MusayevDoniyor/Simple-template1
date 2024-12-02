const api_localhost_url = "http://localhost:3000/";

const productsContainer = document.querySelector(".products__list");
const searchInput = document.getElementById("search");
const addProductForm = document.getElementById("add_product_form");

const modal = document.getElementById("addProductModal");
const modal_open_btn = document.getElementById("modal_open_btn");
const modal_form_cancel_btn = document.getElementById("modal_form_cancel_btn");
const modal_form_submit_btn = document.getElementById("modal_form_submit_btn");

const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoriesContainer = document.getElementById("categories_list");

const likedsContainer = document.getElementById("likeds_list");

const editProfileBtn = document.querySelector(".edit_profile__btn");
const profileItems = document.querySelectorAll(".profile__list__item");

modal_open_btn.addEventListener("click", () => {
  modal.style.display = "block";
});

modal_form_submit_btn.addEventListener("click", () => {
  modal.style.display = "none";
});

modal_form_cancel_btn.addEventListener("click", () => {
  modal.style.display = "none";
});

const fetchProducts = async () => {
  try {
    const response = await fetch(`${api_localhost_url}products`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    return products;
  } catch (error) {
    console.error(error);

    return [];
  }
};

const renderProducts = async (products) => {
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML =
      "<h3 style='color: #1f2937; font-size: 1.25rem; text-decoration: underline;'>No products found</h3>";
  } else {
    products.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product_div");

      productDiv.innerHTML = `
      <h3 class='product__name'>${product.name}</h3>
      <p class='product__info'>${product.info}</p>
      <p class='product__price'>
      Price: <strong>$${product.price}</strong>
      </p>
      <img class='product__img' src="${product.img}" alt="${product.name}" />
      <div class='product__actions'>
      <button class="btn btn_like">${product.liked ? "Unlike" : "Like"}</button>
      <button class="btn btn_delete">Delete</button>
      </div>
      `;

      productsContainer.appendChild(productDiv);

      const likeButton = productDiv.querySelector(".btn_like");
      const deleteButton = productDiv.querySelector(".btn_delete");

      likeButton.addEventListener("click", async () => {
        await toggleLike(product.id, product.liked);
        const products = await fetchProducts();
        renderProducts(products);
      });

      deleteButton.addEventListener("click", async () => {
        await deleteProduct(product.id);
        const products = await fetchProducts();
        renderProducts(products);
      });
    });
  }
};

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.toLowerCase();
  const products = await fetchProducts();
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query)
  );

  renderProducts(filteredProducts);
});

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newProduct = {
    name: document.getElementById("product_name").value,
    info: document.getElementById("product_info").value,
    price: parseFloat(document.getElementById("product_price").value),
    img: document.getElementById("product_imgUrl").value,
    liked: false,
  };

  await fetch(`${api_localhost_url}products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProduct),
  });

  addProductForm.reset();
  const products = await fetchProducts();
  renderProducts(products);
});

const toggleLike = async (id, currentLiked) => {
  await fetch(`${api_localhost_url}products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ liked: !currentLiked }),
  });
};

const deleteProduct = async (id) => {
  const response = await fetch(`${api_localhost_url}products/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    alert("Product deleted successfully");
  } else {
    alert("Failed to delete the product");
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch(`${api_localhost_url}categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const categories = await response.json();

    renderCategories(categories);
  } catch (error) {
    console.error(error);
  }
};

const renderCategories = (categories) => {
  categoriesContainer.innerHTML = "";

  if (categories.length === 0) {
    categoriesContainer.innerHTML =
      "<h3 style='color: #1f2937; font-size: 1.25rem; text-decoration: underline; text-align: center; padding-top: 25px;'>No Categories found</h3>";
  } else {
    categories.forEach((category) => {
      const categoryItem = document.createElement("div");
      categoryItem.classList.add("category_item");
      categoryItem.innerHTML = `
    <h3 class='category__name'>${category.name}</h3>
    <div class='category__actions'>
    <button class="btn btn_edit">Edit</button>
    <button class="btn btn_delete">Delete</button>
      </div>
    `;

      categoriesContainer.appendChild(categoryItem);

      const editButton = categoryItem.querySelector(".btn_edit");
      const deleteButton = categoryItem.querySelector(".btn_delete");

      editButton.addEventListener("click", async () => {
        const newName = prompt("Edit Category Name:", category.name);
        if (newName && newName.trim()) {
          await fetch(`${api_localhost_url}categories/${category.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName.trim() }),
          });
          fetchCategories();
        }
      });

      deleteButton.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this category?")) {
          await fetch(`${api_localhost_url}categories/${category.id}`, {
            method: "DELETE",
          });
          fetchCategories();
        }
      });
    });
  }
};

addCategoryBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const newCategoryName = document.getElementById("newCategory").value.trim();
  if (!newCategoryName) {
    alert("Category name cannot be empty.");
    return;
  }

  await fetch(`${api_localhost_url}categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newCategoryName }),
  });

  document.getElementById("newCategory").value = "";
  fetchCategories();
});

const fetchLikeds = async () => {
  const products = await fetchProducts();
  const likeds = products.filter((product) => product.liked);
  renderLikeds(likeds);
};

const renderLikeds = (likeds) => {
  likedsContainer.innerHTML = "";

  if (likeds.length === 0) {
    likedsContainer.innerHTML =
      "<h3 style='color: #1f2937; font-size: 1.25rem; text-decoration: underline;'>No Liked items found</h3>";
  } else {
    likeds.forEach((liked) => {
      const likedItem = document.createElement("div");
      likedItem.classList.add("liked_item");

      likedItem.innerHTML = `
        <h3 class='liked__name'>${liked.name}</h3>
        <p class='liked__info'>${liked.info}</p>
        <p class='liked__price'>Price: <strong>$${liked.price}</strong></p>
        <img class='liked__img' src="${liked.img}" alt="${liked.name}" />
        <button class="btn btn_unlike">Unlike</button>
      `;

      likedsContainer.appendChild(likedItem);

      const unlikeButton = likedItem.querySelector(".btn_unlike");

      unlikeButton.addEventListener("click", async () => {
        await toggleLike(liked.id, true);
        fetchLikeds();
      });
    });
  }
};

editProfileBtn.addEventListener("click", () => {
  if (editProfileBtn.textContent === "Edit Profile") {
    // When switching to edit mode, populate inputs with existing profile data from localStorage (if available)
    profileItems.forEach((item) => {
      const currentValue = item.textContent.split(":")[1]?.trim() || "";
      const input = document.createElement("input");
      input.type = "text";
      input.value = currentValue;
      input.classList.add("profile__input");
      item.innerHTML = `${item.textContent.split(":")[0]}: `;
      item.appendChild(input);
    });
    editProfileBtn.textContent = "Save Profile";
  } else {
    // Save edited values to localStorage and update the profile items on the page
    profileItems.forEach((item) => {
      const input = item.querySelector("input");
      if (input) {
        const updatedValue = input.value.trim();
        item.innerHTML = `${item.textContent.split(":")[0]}: ${
          updatedValue || "Not Provided"
        }`;

        // Save updated profile data to localStorage
        const profileKey = item.textContent
          .split(":")[0]
          .trim()
          .toLowerCase()
          .replace(" ", "_");
        const profileData = updatedValue || "Not Provided";
        localStorage.setItem(profileKey, profileData);
      }
    });
    editProfileBtn.textContent = "Edit Profile";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  profileItems.forEach((item) => {
    const profileKey = item.textContent
      .split(":")[0]
      .trim()
      .toLowerCase()
      .replace(" ", "_");
    const storedValue = localStorage.getItem(profileKey);
    if (storedValue) {
      item.innerHTML = `${item.textContent.split(":")[0]}: ${storedValue}`;
    }
  });
});

(async () => {
  const products = await fetchProducts();
  renderProducts(products);
  fetchCategories();
  fetchLikeds();
})();

import { data } from "./data.js";

const productsContainer = document.querySelector(".products__list");
const searchInput = document.getElementById("search");
const addProductForm = document.getElementById("add_product_form");

const modal = document.getElementById("addProductModal");
const modal_open_btn = document.getElementById("modal_open_btn");
const modal_form_cancel_btn = document.getElementById("modal_form_cancel_btn");
const modal_form_submit_btn = document.getElementById("modal_form_submit_btn");

const addCategoryBtn = document.getElementById("addCategoryBtn");
const categoriesContainer = document.getElementById("categories_list");

modal_open_btn.addEventListener("click", () => {
  modal.style.display = "block";
});

modal_form_submit_btn.addEventListener("click", () => {
  modal.style.display = "none";
});

modal_form_cancel_btn.addEventListener("click", () => {
  modal.style.display = "none";
});

const renderProducts = (products) => {
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product_div");
    productDiv.innerHTML = `
      <h3 class='product__name'>${product.name}</h3>

      <p class='product__info'>${product.info}</p>

      <p class='product__price'>
        Price:

        <strong>
            $${product.price}
        </strong>
      </p>

      <img class='product__img' src="${product.img}" alt="${product.name}" />

     <div class='product__actions'>
      <button class="btn btn_like">
        ${product.liked ? "Unlike" : "Like"}
      </button>

      <button class="btn btn_delete">Delete</button>
      </div>
    `;

    productsContainer.appendChild(productDiv);

    const likeButton = productDiv.querySelector(".btn_like");
    const deleteButton = productDiv.querySelector(".btn_delete");

    likeButton.addEventListener("click", () => {
      toggleLike(product.id);
    });

    deleteButton.addEventListener("click", () => {
      deleteProduct(product.id);
    });
  });
};

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filteredProducts = data
    .getProducts()
    .filter((product) => product.name.toLowerCase().includes(query));

  renderProducts(filteredProducts);
});

addProductForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newProduct = {
    id: (data.products.length + 2).toString(),
    name: document.getElementById("product_name").value,
    info: document.getElementById("product_info").value,
    price: parseFloat(document.getElementById("product_price").value),
    img: document.getElementById("product_imgUrl").value,
  };

  data.addProduct(newProduct);
  renderProducts(data.getProducts());
  addProductForm.reset();
});

const toggleLike = (id) => {
  data.toggleLikeProduct(id);
  renderProducts(data.getProducts());
};

const deleteProduct = (id) => {
  data.deleteProduct(id);
  renderProducts(data.getProducts());
};

const renderCategories = (categories) => {
  categoriesContainer.innerHTML = "";

  categories.forEach((category) => {
    const categoryItem = document.createElement("div");
    categoryItem.classList.add("category_item");
    categoryItem.innerHTML = `
      <h3 class='category__name'>${category.name}</h3>
      <div class='category__actions'>
        <button class="btn btn_edit" data-id="${category.id}">Edit</button>
        <button class="btn btn_delete" data-id="${category.id}">Delete</button>
      </div>
    `;

    categoriesContainer.appendChild(categoryItem);

    const editButton = categoryItem.querySelector(".btn_edit");
    const deleteButton = categoryItem.querySelector(".btn_delete");

    editButton.addEventListener("click", () => {
      editCategory(category.id);
    });

    deleteButton.addEventListener("click", () => {
      deleteCategory(category.id);
    });
  });
};

const editCategory = (id) => {
  const category = data.categories.find((cat) => cat.id === id);
  if (!category) return;

  const newName = prompt("Edit Category Name:", category.name);
  if (newName && newName.trim()) {
    category.name = newName.trim();
    renderCategories(data.getCategories());
  }
};

const deleteCategory = (id) => {
  if (confirm("Are you sure you want to delete this category?")) {
    data.deleteCategory(id);
    renderCategories(data.getCategories());
  }
};

addCategoryBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const newCategoryName = document.getElementById("newCategory").value.trim();
  if (!newCategoryName) {
    alert("Category name cannot be empty.");
    return;
  }

  const newCategory = {
    id: (data.categories.length + 2).toString(),
    name: newCategoryName,
  };

  data.addCategory(newCategory);
  renderCategories(data.getCategories());

  document.getElementById("newCategory").value = "";
});

renderProducts(data.getProducts());
renderCategories(data.getCategories());

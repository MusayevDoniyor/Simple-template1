export const data = {
  products: [
    {
      id: "1",
      name: "Product 1",
      info: "This product is fully available",
      price: 19.99,
      liked: false,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlndpwDalSNF8TzBG6T7kGv73l0IOReNJpKw&s",
    },
    {
      id: "3",
      name: "Product 3",
      info: "This product is out of stock",
      price: 49.99,
      liked: false,
      img: "https://static.vecteezy.com/system/resources/previews/045/761/913/non_2x/cosmetic-products-on-white-photo.jpg",
    },
    {
      id: "4",
      name: "Product 4",
      info: "This product is on sale",
      liked: false,
      price: 15.99,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQr8aeaQBlKc2eJ-Dt-70JxZRdLog6kJ1XwWw&s",
    },
  ],
  categories: [
    { id: "2", name: "Clothing" },
    { id: "3", name: "Books" },
    { id: "7c11", name: "Technology" },
  ],
  likeds: [],

  // * Product actions

  getProducts() {
    return this.products;
  },

  getProductsById(id) {
    return this.products.find((product) => product.id === id);
  },

  toggleLikeProduct(id) {
    const product = this.products.find((product) => product.id === id);

    if (product) {
      product.liked = !product.liked;

      if (product.liked) {
        if (!this.likeds.find((p) => p.id === id)) {
          this.likeds.push(product);
        }
      } else {
        this.likeds = this.likeds.filter((p) => p.id !== id);
      }
    }

    return product;
  },

  addProduct(newProduct) {
    this.products.push({ ...newProduct, liked: false });
  },

  deleteProduct(id) {
    this.products = this.products.filter((product) => product.id !== id);

    this.likeds = this.likeds.filter((product) => product.id !== id);
  },

  // * Category actions

  getCategories() {
    return this.categories;
  },

  addCategory(newCategory) {
    this.categories.push({ ...newCategory });
  },

  deleteCategory(id) {
    this.categories = this.categories.filter((category) => category.id !== id);
  },

  // * Likeds actions
  getLikeds() {
    return this.likeds;
  },
};

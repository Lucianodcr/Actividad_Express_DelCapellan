import { promises as fs } from "fs";
import express  from "express";

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("No se puede leer el archivo", error);
      return [];
    }
  }

  async getProductById(id) {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const product = products.find((prod) => prod.id === id);

      if (product) {
        console.log(product);
      } else {
        console.log("Producto no encontrado");
      }
    } catch (error) {
      console.log("No se puede leer el archivo", error);
    }
  }

  async addProduct(product) {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const prodCode = products.find((prod) => prod.code === product.code);
      const prodId = products.find((prod) => prod.id === product.id);

      if (prodCode || prodId) {
        console.log("Producto existente");
      } else {
        products.push(product);
        await fs.writeFile(this.path, JSON.stringify(products));
      }
    } catch (error) {
      console.log("No se puede leer el archivo", error);
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const index = products.findIndex((prod) => prod.id === id);

      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        await fs.writeFile(this.path, JSON.stringify(products));
      } else {
        console.log("No existe el producto");
      }
    } catch (error) {
      console.log("No se puede leer el archivo", error);
    }
  }

  async deleteProduct(id) {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const productIndex = products.findIndex((prod) => prod.id === id);

      if (productIndex !== -1) {
        products.splice(productIndex, 1);
        await fs.writeFile(this.path, JSON.stringify(products));
      } else {
        console.log("No existe el producto");
      }
    } catch (error) {
      console.log("No se puede leer el archivo", error);
    }
  }
}

class Product {
  constructor(title, description, price, image, code) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.image = image;
    this.code = code;
    this.id = Product.idIncrement();
  }

  static idIncrement() {
    if (!this.idCounter) {
      this.idCounter = 1;
    } else {
      this.idCounter++;
    }
    return this.idCounter;
  }
}

const filePath = "./products.json";
const productManager = new ProductManager(filePath);


(async () => {
  const products = await productManager.getProducts();
  console.log("All products:", products);

  const product = new Product(
    "212 Vip - Carolina Herrera",
    "Un perfume oriental-amaderado con notas frescas y dulces, diseñado para destacar con un toque de exclusividad",
    48000,
    "./img/212CH",
    101
  );

  await productManager.addProduct(product);
  console.log("Product added:", product);

  const updatedProduct = {
    title: "212 MEN - Carolina Herrera",
    description: "es una fragancia masculina con una mezcla fresca y dulce que representa la energía de Nueva York. Combina notas cítricas en la salida, especias y flores en el corazón, y maderas cálidas en el fondo. Es ideal para hombres modernos que buscan elegancia y sofisticación en su aroma.",
    price: 55000,
    image: "./img/212CH",
    code: 102,
  };

  await productManager.updateProduct(1, updatedProduct);
  console.log("Producto Actualizado:", updatedProduct);

  await productManager.deleteProduct(2);
  console.log("Producto con id 2 eliminado");
})();

const app = express();
const PORT = 3000;

app.get("/products", async (req, res) => {
  const limit = req.query.limit;
  const code = req.query.code;

  let products = await productManager.getProducts();

  if (code) {
    products = products.filter((product) => product.code === parseInt(code));
  }

  if (limit) {
    products = products.slice(0, parseInt(limit));
  }

  res.json(products);
});

app.get("/product/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = await productManager.getProductById(productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Producto no encontrado" });
  }
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});











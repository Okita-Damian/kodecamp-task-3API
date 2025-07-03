const express = require("express");
const app = express();

// express middleware
app.use(express.json());

// port
const PORT = 3000;

app.listen(PORT, () => console.log(`server runing on port ${PORT}....🚀`));

let products = [];

const generateId = () => Math.floor(Math.random() * 100000);

// get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// get products by ID
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((s) => s.id === id);
  if (!product) return res.status(404).json({ message: "product not found" });
  res.json(product);
});

// Create a new product
app.post("/products", (req, res) => {
  const { name, cost, stockStatus } = req.body;

  if (!name || !cost || !stockStatus) {
    res.status(400).json({ message: "All feilds are mandatory" });
  }

  const validateStatus = ["In Stock", "Low Stock", "Out of Stock"];
  if (!validateStatus.includes(stockStatus)) {
    return res.status(400).json({ message: "Invalid stock status" });
  }

  const newProduct = {
    name,
    cost,
    stockStatus,
    createdAt: new Date().toISOString(),
    id: generateId(),
  };

  products.push(newProduct);
  res
    .status(201)
    .json({ message: "product created successfully", product: newProduct });
});

// update the product
app.put("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((s) => s.id === id);
  if (!product) return res.status(404).json({ message: "product not found" });

  const { name, cost } = req.body;

  if (name) product.name = name;
  if (cost) product.cost = cost;

  res.status(200).json({ message: "product updated successfully", product });
});

// update only the stock status
app.patch("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((s) => s.id === id);
  if (!product) return res.status(400).json({ message: "product not found" });

  const { stockStatus } = req.body;

  const validateStatus = ["In Stock", "Low Stock", "Out of Stock"];
  if (!validateStatus.includes(stockStatus)) {
    return res.status(400).json({ message: "Invalid stock status" });
  }

  product.stockStatus = stockStatus;
  res
    .status(200)
    .json({ message: "stock status updated successfully", product });
});

// delete the products by ID
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.findIndex((s) => s.id === id);
  if (product === -1)
    return res.status(404).json({ message: "product not found" });

  products.splice(product, 1);
  res.status(200).json({ message: "product deleted successfully" });
});

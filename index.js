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

  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "product not found", data: product });

  res.status(200).json({
    success: true,
    message: "product fetched successfully",
    data: product,
  });
});

// Create a new product
app.post("/products", (req, res) => {
  const { productName, cost, stockStatus } = req.body;

  if (!productName || !cost || !stockStatus) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are mandatory" });
  }

  const validateStatus = ["in-stock", "low-stock", "out-of-stock"];
  const normalized = stockStatus.toLowerCase();
  if (!validateStatus.includes(normalized)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid stock status. Use in-stock, low-stock, or out-of-stock.",
    });
  }

  const newProduct = {
    productName,
    cost,
    stockStatus: normalized,
    createdAt: new Date().toISOString(),
    id: generateId(),
  };

  products.push(newProduct);
  return res.status(201).json({
    success: true,
    message: "product created successfully",
    data: newProduct,
  });
});

// update the product
app.put("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((s) => s.id === id);
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "product not found" });

  const { productName, cost } = req.body;

  if (productName) product.productName = productName;
  if (cost) product.cost = cost;

  res.status(200).json({
    success: true,
    message: "product updated successfully",
    data: product,
  });
});

// update only the stock status
app.patch("/products/:id/status", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((s) => s.id === id);
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "product not found" });

  const { stockStatus } = req.body;

  const validateStatus = ["in-stock", "low-stock", "out-of-stock"];
  const normalized = stockStatus.toLowerCase();
  if (!validateStatus.includes(normalized)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid stock status. Use in-stock, low-stock, or out-of-stock.",
    });
  }

  product.stockStatus = normalized;
  res.status(200).json({
    success: true,
    message: "stock status updated successfully",
    data: product,
  });
});

// delete the products by ID
app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.findIndex((s) => s.id === id);
  if (product === -1)
    return res.status(404).json({
      success: false,
      message: "product not found",
    });

  const [deleted] = products.splice(product, 1);
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
    data: deleted,
  });
});

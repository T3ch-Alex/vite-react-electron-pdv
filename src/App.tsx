import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cart from "./pages/Cart";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductsForm";
import Sales from "./pages/Sales";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/products/new" element={<ProductForm />} />
        <Route path="/products/:id/edit" element={<ProductForm />} />
      </Routes>
    </BrowserRouter>
  );
}

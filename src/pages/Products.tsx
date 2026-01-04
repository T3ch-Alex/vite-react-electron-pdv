import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../services/product.service";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    ProductService.getAll()
      .then((res) => setProducts(res.products))
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 20,
        minHeight: "100%",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "20vw",
          gap: 10,
        }}
      >
        <h1>PDV</h1>
        <button onClick={() => navigate("/cart")}>Carrinho</button>
        <button onClick={() => navigate("/")}>Produtos</button>
        <button onClick={() => navigate("/sales")}>Vendas</button>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            maxHeight: "10vh",
          }}
        >
          <h1>Produtos</h1>
          <button onClick={() => navigate("/products/new")}>Adicionar</button>
        </div>

        <div
          className="container"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                backgroundColor: "#f2f2ff",
                borderRadius: 6,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <strong>{p.name}</strong>
                <span style={{ fontSize: 12, opacity: 0.7 }}>
                  Estoque: {p.stock} {p.un}
                </span>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => navigate(`/products/${p.id}/edit`)}>
                  Editar
                </button>
                <button
                  onClick={async () => {
                    await ProductService.delete(p.id);
                    const res = await ProductService.getAll();
                    setProducts(res.products);
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

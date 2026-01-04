import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartService } from "../services/cart.service";

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    CartService.getAll()
      .then((res) => setSales(res.carts))
      .catch(console.error);
  }, []);

  function getTotal() {
    let sum: number = 0;

    const filteredSales = sales.filter((s) => s.status == "CLOSED");

    filteredSales.forEach((s) => {
      console.log({ total: s.total });
      sum = sum + s.total;
    });

    console.log({ sum });

    return sum.toFixed(2);
  }

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
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1>Vendas</h1>
          <h2>Total: R$ {getTotal()}</h2>
        </div>

        <div
          className="container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {sales
            .filter((s) => s.status == "CLOSED")
            .map((cart) => (
              <div
                key={cart.id}
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
                  <strong>Venda #{cart.id}</strong>
                  <span style={{ fontSize: 12, opacity: 0.7 }}>
                    Itens: {cart.items?.length ?? 0}
                  </span>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <span>
                    <strong>R$ {cart.total?.toFixed(2)}</strong>
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 8px",
                      borderRadius: 4,
                      background:
                        cart.status === "CHECKED_OUT" ? "#d4edda" : "#fff3cd",
                    }}
                  >
                    {cart.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

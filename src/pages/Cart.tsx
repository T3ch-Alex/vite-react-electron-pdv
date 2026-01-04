import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartService } from "../services/cart.service";
import { ProductService } from "../services/product.service";

export default function Cart() {
  const [cart, setCart] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  if (loading) {
    return <div className="page">Carregando...</div>;
  }

  async function handleInit() {
    try {
      setLoading(true);
      const pRes = await ProductService.getAll();
      setProducts(pRes.products ?? []);

      const cRes = await CartService.create().then((result) => result.cart);
      setCart(cRes);
    } catch (err) {
      console.error(err);
      alert("Erro ao inicializar carrinho/produtos");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    setCart(null);
  }

  async function handleAdd() {
    if (!cart) {
      alert("Carrinho não inicializado");
      return;
    }

    if (!selectedProductId) {
      alert("Selecione um produto");
      return;
    }

    if (quantity <= 0) {
      alert("Quantidade inválida");
      return;
    }

    try {
      const updated = await CartService.addItem(cart.id, {
        productId: Number(selectedProductId),
        quantity,
      }).then((result) => result.cart);
      setCart(updated);
      setSelectedProductId("");
      setQuantity(1);
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar item no carrinho");
    }
  }

  async function handleRemove(itemId: number) {
    if (!cart) return;
    try {
      const updated = await CartService.removeItem(cart.id, itemId);
      setCart(updated);
    } catch (err) {
      console.error(err);
      alert("Erro ao remover item");
    }
  }

  async function handleCheckout() {
    if (!cart) return;
    try {
      await CartService.checkout(cart.id);
      alert("Venda finalizada!");
      const newCart = await CartService.create();
      setCart(newCart);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message ?? "Erro no checkout");
    }
  }

  return (
    <div
      style={{
        flex: 1,
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
          <h1>Carrinho</h1>
          <div>
            <button onClick={handleInit}>Iniciar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        </div>

        {cart ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 6,
              }}
            >
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                }}
              >
                <option value="">-- Selecione um produto --</option>
                {products.map((p) => {
                  return (
                    <option
                      key={p.ID}
                      value={p.ID}
                      label={`${p.name}` + "(estoque:" + `${p.stock}` + ")"}
                    >
                      {p.ID}
                    </option>
                  );
                })}
              </select>

              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: 80 }}
              />

              <button
                onClick={handleAdd}
                disabled={!selectedProductId || quantity <= 0}
              >
                Adicionar
              </button>
            </div>

            <div
              className="container"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 6,
              }}
            >
              {cart.items && cart.items.length > 0 ? (
                cart.items.map((item: any) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 12px",
                      backgroundColor: "#f2f2ff",
                      borderRadius: 6,
                    }}
                  >
                    <div>
                      <strong>{item.product.name}</strong>
                      <div style={{ fontSize: 12, color: "#555" }}>
                        {item.quantity} x R${" "}
                        {Number(item.product.priceSell).toFixed(2)}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <div style={{ alignSelf: "center" }}>
                        Subtotal: R${" "}
                        {(
                          Number(item.product.priceSell) * Number(item.quantity)
                        ).toFixed(2)}
                      </div>
                      <button onClick={() => handleRemove(item.id)}>
                        Remover
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div>Nenhum item no carrinho</div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                Total: R${" "}
                {cart.items
                  ?.reduce((sum: number, it: any) => {
                    return (
                      sum + Number(it.product.priceSell) * Number(it.quantity)
                    );
                  }, 0)
                  .toFixed(2) ?? "0.00"}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleCheckout}
                  disabled={!cart.items || cart.items.length === 0}
                >
                  Finalizar venda
                </button>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

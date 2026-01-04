import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductService } from "../services/product.service";

type FormState = {
  name: string;
  sku: string;
  priceSell: number;
  priceCost: number;
  stock: number;
  un: string;
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormState>({
    name: "",
    sku: "",
    priceSell: 0,
    priceCost: 0,
    stock: 0,
    un: "",
  });

  useEffect(() => {
    if (!isEdit) return;

    ProductService.getById(Number(id)).then((res) => {
      const p = res.product;

      setForm({
        name: p.name,
        sku: p.sku,
        priceSell: Number(p.priceSell),
        priceCost: Number(p.priceCost),
        stock: Number(p.stock),
        un: p.un ?? "",
      });
    });
  }, [id, isEdit]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      if (isEdit) {
        const payload: any = {
          priceSell: form.priceSell,
          priceCost: form.priceCost,
        };

        if (form.name) payload.name = form.name;

        await ProductService.update(Number(id), payload);
      } else {
        await ProductService.create(form);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar produto");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        gap: 20,
      }}
    >
      {/* MENU LATERAL */}
      <div
        className="container"
        style={{
          width: "20vw",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <h1>PDV</h1>
        <button onClick={() => navigate("/cart")}>Carrinho</button>
        <button onClick={() => navigate("/")}>Produtos</button>
        <button onClick={() => navigate("/sales")}>Vendas</button>
      </div>

      {/* CONTEÚDO */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>{isEdit ? "Editar produto" : "Novo produto"}</h1>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 16,
          }}
        >
          {/* GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label>Nome</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                disabled={isEdit}
                required
              />
            </div>

            <div>
              <label>Preço de venda</label>
              <input
                type="number"
                step="0.01"
                name="priceSell"
                value={form.priceSell}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Preço de custo</label>
              <input
                type="number"
                step="0.01"
                name="priceCost"
                value={form.priceCost}
                onChange={handleChange}
                required
              />
            </div>

            {!isEdit && (
              <>
                <div>
                  <label>Estoque inicial</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Unidade</label>
                  <input name="un" value={form.un} onChange={handleChange} />
                </div>
              </>
            )}
          </div>

          {/* AÇÕES */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button type="button" onClick={() => navigate("/")}>
              Cancelar
            </button>
            <button type="submit">
              {isEdit ? "Salvar alterações" : "Criar produto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

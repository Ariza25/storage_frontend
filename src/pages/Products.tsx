import { FiTrash } from "react-icons/fi";
import { useEffect, useState, FormEvent, useCallback } from "react";
import { api } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface ProductProps {
  id: string;
  name: string;
  price: string;
  quantity: string;
  category_id: string;
  created_at: string;
}

function Products() {
  const [errors, setErrors] = useState({
    name: "",
    price: "",
    quantity: "",
    category_id: "",
  });

  const [products, setProducts] = useState<ProductProps[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category_id, setCategoryId] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function notifySuccess() {
    toast.success("Produto cadastrado com sucesso", {
      autoClose: 1500,
    });
  }

  function notifyDelete() {
    toast.success("Produto deletado com sucesso", {
      autoClose: 1500,
    });
  }

  function notifyError() {
    toast.error("Ocorreu um erro. Tente novamente", {
      autoClose: 1500,
    });
  }

  const loadProducts = useCallback(async () => {
    try {
      const response = await api.get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(response.data.product);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      notifyError();
    }
  }, [token]);

  async function handleSubmitProduct(e: FormEvent) {
    e.preventDefault();

    if (!name || !price || !quantity || !category_id) {
      setErrors({
        name: "O campo 'nome' é obrigatório",
        price: "O campo 'preço' é obrigatório",
        quantity: "O campo 'quantidade' é obrigatório",
        category_id: "O campo 'Id da categoria' é obrigatório",
      });
      return;
    }

    try {
      const response = await api.post(
        "/product",
        {
          name,
          price,
          quantity,
          category_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts((allProducts) => [...allProducts, response.data]);

      setName("");
      setPrice("");
      setQuantity("");
      setCategoryId("");

      setErrors({
        name: "",
        price: "",
        quantity: "",
        category_id: "",
      });

      notifySuccess();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      notifyError();
    }
  }

  async function handleDeleteProduct(id: string) {
    try {
      await api.delete("/product", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          id: id,
        },
      });
      notifyDelete();
    } catch (err) {
      console.log("Ocorreu um erro. Tente novamente", err);
      notifyError();
    }
    setProducts((allProducts) =>
      (allProducts || []).filter((product) => product.id !== id)
    );
  }

  const handleInputChange = (field: string, value: string) => {
    // Verifica se o campo está vazio e limpa o erro
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }

    if (field === "name") {
      setName(value);
    } else if (field === "price") {
      setPrice(value);
    } else if (field === "quantity") {
      setQuantity(value);
    } else if (field === "category_id") {
      setCategoryId(value);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      loadProducts();
    }
  }, [token, navigate, loadProducts]);

  return (
    <>
      <ToastContainer />
      <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
        <main className="my-10 w-full md:max-w-2xl">
          <h1 className="font-medium text-center text-white text-4xl">
            Produtos
          </h1>

          <form
            className="flex flex-col my-6 pb-6"
            onSubmit={handleSubmitProduct}
          >
            <label className="font-medium text-white">Nome:</label>
            <input
              type="text"
              placeholder="Digite o nome do Produto"
              className={`w-full mb-5 p-2 rounded ${
                errors.name && !name
                  ? "border-2 border-red-400 placeholder-red-300"
                  : ""
              }`}
              value={name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && !name && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.name}
              </span>
            )}

            <label className="font-medium text-white">Preço:</label>
            <input
              type="text"
              placeholder="Digite o preço do Produto"
              className={`w-full mb-5 p-2 rounded ${
                errors.price && !price
                  ? "border-2 border-red-400 placeholder-red-300"
                  : ""
              }`}
              value={price}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
            {errors.price && !price && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.price}
              </span>
            )}

            <label className="font-medium text-white">Quantidade:</label>
            <input
              type="text"
              placeholder="Digite a quantidade em estoque"
              className={`w-full mb-5 p-2 rounded ${
                errors.quantity && !quantity
                  ? "border-2 border-red-400 placeholder-red-300"
                  : ""
              }`}
              value={quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
            />
            {errors.quantity && !quantity && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.quantity}
              </span>
            )}

            <label className="font-medium text-white">ID da Categoria:</label>
            <input
              type="text"
              placeholder="Digite o Id da categoria do produto"
              className={`w-full mb-5 p-2 rounded ${
                errors.category_id && !category_id
                  ? "border-2 border-red-400 placeholder-red-300"
                  : ""
              }`}
              value={category_id}
              onChange={(e) => handleInputChange("category_id", e.target.value)}
            />
            {errors.category_id && !category_id && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.category_id}
              </span>
            )}

            <input
              type="submit"
              value="Cadastrar"
              className="cursor-pointer rounded w-full p-2 bg-green-500 font-medium"
            />
          </form>
          <hr />
          <section className="flex flex-col pt-6 gap-4">
            {products &&
              products.map((product) => (
                <article
                  key={product.id}
                  className="w-full bg-gray-100 p-2 rounded relative hover:scale-105 duration-200 ps-5"
                >
                  <p>
                    <span className="font-medium me-1">Nome:</span>
                    {product.name}
                  </p>
                  <p>
                    <span className="font-medium me-1">Preço:</span>
                    {product.price}
                  </p>
                  <p>
                    <span className="font-medium me-1">Quantidade:</span>
                    {product.quantity}
                  </p>
                  <p>
                    <span className="font-medium me-1">ID da Categoria:</span>
                    {product.category_id}
                  </p>

                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 w-10 h-10 flex items-center justify-center rounded absolute right-6 top-10"
                  >
                    <FiTrash size={20} color="#FFF" />
                  </button>
                </article>
              ))}
          </section>
        </main>
      </div>
    </>
  );
}

export default Products;

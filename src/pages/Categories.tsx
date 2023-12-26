import { FormEvent, useEffect, useState, useCallback } from "react";
import { FiTrash } from "react-icons/fi";
import { api } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface CategoryProps {
  id: string;
  name: string;
}

function notifySuccess() {
  toast.success("Categoria cadastrada com sucesso", {
    autoClose: 1500,
  });
}

function notifyDelete() {
  toast.success("Categoria excluída com sucesso", {
    autoClose: 1500,
  });
}

function notifyError() {
  toast.error("Ocorreu um erro. Tente novamente", {
    autoClose: 1500,
  });
}

const Categories = () => {
  const [errors, setErrors] = useState({ name: "" });
  const [category, setCategory] = useState<CategoryProps[]>([]);
  const [name, setName] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const loadCategories = useCallback(async () => {
    try {
      const response = await api.get("/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCategory(response.data.customer);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      notifyError();
    }
  }, [token]);

  async function handleSubmitCategory(e: FormEvent) {
    e.preventDefault();

    if (!name) {
      setErrors({ name: "O campo 'nome' é obrigatório" });
      return;
    }

    try {
      const response = await api.post(
        "/category",
        {
          name,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCategory((allCategories) => [...allCategories, response.data]);

      setName("");

      notifySuccess();
    } catch (error) {
      console.error("Erro ao excluir a categoria", error);
      notifyError();
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }

    if (field === "name") {
      setName(value);
    }
  };

  async function handleDeleteCategory(id: string) {
    try {
      await api.delete("/category", {
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
    setCategory((allCategories) =>
      allCategories.filter((category) => category.id !== id)
    );
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      loadCategories();
    }
  }, [token, navigate, loadCategories]);

  return (
    <>
      <ToastContainer />
      <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
        <main className="my-10 w-full md:max-w-2xl">
          <h1 className="font-medium text-center text-white text-4xl">
            Categorias
          </h1>

          <form
            className="flex flex-col my-6 pb-6"
            onSubmit={handleSubmitCategory}
          >
            <label className={`font-medium text-white`}>Nome:</label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              className={`w-full mb-5 p-2 rounded ${errors.name && !name
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

            <input
              type="submit"
              value="Cadastrar"
              className="cursor-pointer rounded w-full p-2 bg-green-500 font-medium"
            />
          </form>
          <hr />
          <section className="flex flex-col pt-6 gap-4">
            {category.map((category) => (
              <article
                key={category.id}
                className="w-full bg-gray-100 p-2 rounded relative hover:scale-105 duration-200"
              >
                <p>
                  <span className="font-medium me-1">ID da Categoria:</span>
                  {category.id}
                </p>
                <p>
                  <span className="font-medium me-1">Nome da Categoria:</span>
                  {category.name}
                </p>

                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-500 w-10 h-10 flex items-center justify-center rounded absolute right-0 top-0"
                >
                  <FiTrash size={18} color="#FFF" />
                </button>
              </article>
            ))}
          </section>
        </main>
      </div>
    </>
  );
};

export default Categories;

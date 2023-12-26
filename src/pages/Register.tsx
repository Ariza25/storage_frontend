import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CategoryProps {
  id: string;
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [register, setRegister] = useState<CategoryProps[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function notifySuccess() {
    toast.success("Usuário cadastrado com sucesso", {
      autoClose: 1500,
    });
  }

  function notifyError() {
    toast.error("Erro ao cadastrar. Tente mais tarde", {
      autoClose: 1500,
    });
  }

  async function handleSubmitRegister(e: FormEvent) {
    e.preventDefault();

    if (!name || !email || !password) {
      setErrors({
        name: "O campo 'nome' é obrigatório",
        email: "O campo 'email' é obrigatório",
        password: "O campo 'senha' é obrigatório",
      });
      return;
    }

    try {
      const response = await api.post("/user/register", {
        name,
        email,
        password,
      });

      setRegister(response.data);
      notifySuccess();
      navigate("/login")

      setName("");
      setEmail("");
      setPassword("");
      setErrors({
        name: "",
        email: "",
        password: "",
      });

    } catch (error) {
      console.error("Error during registration:", error);
      notifyError();
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }

    if (field === "name") {
      setName(value);
    } else if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }
  };

  useEffect(() => {}, [register])

  return (
    <>
      <ToastContainer />
      <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
        <main className="my-10 w-full md:max-w-2xl">
          <h1 className="font-medium text-center text-white text-4xl">
            Cadastre-se
          </h1>

          <form
            className="flex flex-col my-6 pb-6"
            onSubmit={handleSubmitRegister}
          >
            <label className="font-medium text-white">Nome:</label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              className="w-full mb-5 p-2 rounded"
              value={name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            {errors.name && !name && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.name}
              </span>
            )}

            <label className="font-medium text-white">Email:</label>
            <input
              type="text"
              placeholder="Digite seu email"
              className="w-full mb-5 p-2 rounded"
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            {errors.email && !email && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.email}
              </span>
            )}

            <label className="font-medium text-white">Password:</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              className="w-full mb-5 p-2 rounded"
              value={password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
             {errors.password && !password && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.password}
              </span>
            )}

            <input
              type="submit"
              value="Cadastrar"
              className="cursor-pointer rounded w-full p-2 bg-green-500 font-medium"
            />
          </form>
          <hr />

          <span className="text-white flex justify-center mt-2">
            Já possui uma conta?{" "}
            <Link
              className="underline hover:text-slate-400 ms-1 font-bold"
              to="/login"
            >
              Login
            </Link>
          </span>
        </main>
      </div>
    </>
  );
};

export default Register;

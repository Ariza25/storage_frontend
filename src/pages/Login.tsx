import { FormEvent, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CategoryProps {
  email: string;
  password: string;
}

const Register = () => {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [login, setLogin] = useState<CategoryProps[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function notifySuccess() {
    toast.success("Bem vindo", {
      autoClose: 1500,
    });
  }

  function notifyError() {
    toast.error("Email ou senha incorretos", {
      autoClose: 1500,
    });
  }

  const navigate = useNavigate();

  async function handleSubmitLogin(e: FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      setErrors({
        email: "O campo 'email' é obrigatório",
        password: "O campo 'senha' é obrigatório",
      });
      return;
    }

    try {
      const response = await api.post("/user/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);

      setLogin(response.data);
      notifySuccess();
      navigate("/");

      setEmail("");
      setPassword("");
      setErrors({
        email: "",
        password: "",
      });

    } catch (error) {
      console.log(error);
      notifyError();
    }

  }

  const handleInputChange = (field: string, value: string) => {
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }

    if (field === "email") {
      setEmail(value);
    } else if (field === "password") {
      setPassword(value);
    }
  };

  useEffect(() => {}, [login]);

  return (
    <>
      <ToastContainer />
      <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
        <main className="my-10 w-full md:max-w-2xl">
          <h1 className="font-medium text-center text-white text-4xl">Login</h1>

          <form
            className="flex flex-col my-6 pb-6"
            onSubmit={handleSubmitLogin}
          >
            <label className="font-medium text-white">Email:</label>
            <input
              type="text"
              placeholder="Digite seu email"
              className={`w-full mb-5 p-2 rounded ${
                errors.email && !email
                  ? "border-2 border-red-400 placeholder-red-300"
                  : ""
              }`}
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
              className={`w-full mb-5 p-2 rounded ${
                errors.password && !password
                  ? "border-2 border-red-400 placeholder-red-300"
                  : ""
              }`}
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
              value="Entrar"
              className="cursor-pointer rounded w-full p-2 bg-green-500 font-medium"
            />
          </form>
          <hr />

          <span className="text-white flex justify-center mt-2">
            Ainda não possui uma conta?{" "}
            <Link
              className="underline hover:text-slate-400 ms-1 font-bold"
              to="/register"
            >
              Sign In
            </Link>
          </span>
        </main>
      </div>
    </>
  );
};

export default Register;

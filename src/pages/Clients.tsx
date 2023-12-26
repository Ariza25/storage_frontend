import { FiTrash } from "react-icons/fi";
import { useEffect, useState, FormEvent, useCallback } from "react";
import { api } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

interface CustomerProps {
  id: string;
  name: string;
  email: string;
  address: string;
  contact: string;
  status: boolean;
  created_at: string;
}

function Clients() {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
  });
  const [customers, setCustomers] = useState<CustomerProps[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function notifySuccess() {
    toast.success("Cliente cadastrado com sucesso", {
      autoClose: 1500,
    });
  }

  function notifyDelete() {
    toast.success("Cliente deletado com sucesso", {
      autoClose: 1500,
    });
  }

  function notifyError() {
    toast.error("Ocorreu um erro. Tente novamente", {
      autoClose: 1500,
    });
  }

  const loadCustomers = useCallback(async () => {
    try {
      const response = await api.get("/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers(response.data.customer);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      notifyError();
      return;
    }
  }, [token]);

  async function handleSubmitClient(e: FormEvent) {
    e.preventDefault();

    if (!name || !email || !address || !contact) {
      setErrors({
        name: "O campo 'nome' é obrigatório",
        email: "O campo 'email' é obrigatório",
        address: "O campo 'endereço' é obrigatório",
        contact: "O campo 'contato' é obrigatório",
      });
      return;
    }

    try {
      const response = await api.post(
        "/customer",
        {
          name,
          email,
          address,
          contact,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCustomers((allCustomers) => [...allCustomers, response.data]);

      setName('');
      setEmail('');
      setAddress('');
      setContact('');

      setErrors({
        name: "",
        email: "",
        address: "",
        contact: "",
      });

      notifySuccess();
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);
      notifyError();
    }
  }

  const handleDeleteClient = async (id: string) => {
    try {
      await api.delete("/customer", {
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
    setCustomers((allCustomers) =>
      allCustomers.filter((customer) => customer.id !== id)
    );
  };

  const handleInputChange = (field: string, value: string) => {
    // Verifica se o campo está vazio e limpa o erro
    if (value.trim() !== '') {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }

    if (field === 'name') {
      setName(value);
    } else if (field === 'email') {
      setEmail(value);
    } else if (field === 'address') {
      setAddress(value);
    } else if (field === 'contact') {
      setContact(value);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      loadCustomers();
    }
  }, [token, navigate, loadCustomers]);

  return (
    <>
      <ToastContainer />
      <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
        <main className="my-10 w-full md:max-w-2xl">
          <h1 className="font-medium text-center text-white text-4xl">
            Clientes
          </h1>

          <form
            className="flex flex-col my-6 pb-6"
            onSubmit={handleSubmitClient}
          >
            <label className={`font-medium text-white`}>Nome:</label>
            <input
              type="text"
              placeholder="Digite o nome completo"
              className={`w-full mb-5 p-2 rounded ${errors.name && !name
                ? "border-2 border-red-400 placeholder-red-300"
                : ""
                }`}
              value={name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
            {errors.name && !name && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.name}
              </span>
            )}

            <label className={`font-medium text-white`}>Email:</label>
            <input
              type="email"
              placeholder="Digite o email"
              className={`w-full mb-5 p-2 rounded ${errors.email && !email
                ? "border-2 border-red-400 placeholder-red-300"
                : ""
                }`}
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            {errors.email && !email && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.email}
              </span>
            )}

            <label className={`font-medium text-white`}>Endereço:</label>
            <input
              type="text"
              placeholder="Digite o endereço"
              className={`w-full mb-5 p-2 rounded ${errors.address && !address
                ? "border-2 border-red-400 placeholder-red-300"
                : ""
                }`}
              value={address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
            {errors.address && !address && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.address}
              </span>
            )}

            <label className={`font-medium text-white`}>Contato:</label>
            <input
              type="text"
              placeholder="Digite o número de contato"
              className={`w-full mb-5 p-2 rounded ${errors.contact && !contact
                ? "border-2 border-red-400 placeholder-red-300"
                : ""
                }`}
              value={contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
            />
            {errors.contact && !contact && (
              <span className="text-red-500 font-medium mt-[-15px] mb-3">
                {errors.contact}
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
            {customers.map((customer) => (
              <article
                key={customer.id}
                className="w-full bg-gray-100 p-2 rounded relative hover:scale-105 duration-200 ps-5"
              >
                <p>
                  <span className="font-medium me-1">Nome:</span>
                  {customer.name}
                </p>
                <p>
                  <span className="font-medium me-1">Email:</span>
                  {customer.email}
                </p>
                <p>
                  <span className="font-medium me-1">Endereço:</span>
                  {customer.address}
                </p>
                <p>
                  <span className="font-medium me-1">Contato:</span>
                  {customer.contact}
                </p>
                <p>
                  <span className="font-medium me-1">Status:</span>
                  {customer.status ? "Ativo" : "Inativo"}
                </p>

                <button
                  onClick={() => handleDeleteClient(customer.id)}
                  className="bg-red-500 w-10 h-10 flex items-center justify-center rounded absolute right-6 top-12"
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

export default Clients;

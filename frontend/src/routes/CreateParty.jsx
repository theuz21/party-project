import partyFetch from '../axios/config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useToast from '../hook/useToast';
import './Form.css';

const CreateParty = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(0);
  const [image, setImage] = useState('');

  const navigate = useNavigate();

  // Carregar serviços
  useEffect(() => {
    const loadServices = async () => {
      console.log('Carregando serviços...');
      try {
        const res = await partyFetch.get('/services');
        console.log('Serviços carregados:', res.data);
        setServices(res.data);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        useToast("Erro ao carregar serviços", "error");
      }
    };
    loadServices();
  }, []);

  // Adicionar ou remover serviços
  const handleServices = (e, serviceId) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      const serviceToAdd = services.find((service) => service._id === serviceId);
      if (serviceToAdd) {
        setSelectedServices((prevSelected) => [...prevSelected, serviceToAdd]);
        console.log('Serviço adicionado:', serviceToAdd);
      }
    } else {
      setSelectedServices((prevSelected) =>
        prevSelected.filter((service) => service._id !== serviceId)
      );
      console.log('Serviço removido:', serviceId);
    }
  };

  // Função para criar a festa
  const createParty = async (e) => {
    e.preventDefault();

    try {
      const party = {
        title,
        author,
        description,
        budget,
        image: image || "URL da imagem padrão aqui", // Define a imagem personalizada ou uma padrão
        services: selectedServices,
      };

      const res = await partyFetch.post("/parties", party);

      if (res.status === 201) {
        navigate("/");
        useToast(res.data.msg);
      }
    } catch (error) {
      useToast(error.response?.data?.msg || "Erro ao criar festa", "error");
    }
  };

  return (
    <div className="form-page">
      <h2>Crie sua próxima festa</h2>
      <p>Defina o seu orçamento e escolha os serviços</p>
      <form onSubmit={createParty}>
        <label>
          <span>Nome da festa:</span>
          <input
            type="text"
            placeholder="Seja criativo..."
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label>
          <span>Anfitrião:</span>
          <input
            type="text"
            placeholder="Quem está dando a festa?"
            required
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
          />
        </label>
        <label>
          <span>Descrição:</span>
          <textarea
            placeholder="Conte mais sobre a festa..."
            required
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          ></textarea>
        </label>
        <label>
          <span>Orçamento:</span>
          <input
            type="number"
            placeholder="Quanto você pretende investir?"
            required
            onChange={(e) => setBudget(e.target.value)}
            value={budget}
          />
        </label>
        <label>
          <span>Imagem:</span>
          <input
            type="text"
            placeholder="Insira a URL de uma imagem"
            onChange={(e) => setImage(e.target.value)}
            value={image}
            
          />
          
        </label>
        <div>
          <h2>Escolha os serviços</h2>
          <div className="services-container">
            {services.length === 0 && <p>Carregando...</p>}
            {services.length > 0 &&
              services.map((service) => (
                <div className="service" key={service._id}>
                  <img src={service.image} alt={service.name} />
                  <p className="service-name">{service.name}</p>
                  <p className="service-price">R${service.price}</p>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      value={service._id}
                      onChange={(e) => handleServices(e, service._id)}
                    />
                    <span className="checkmark"></span>
                    Marque para solicitar
                  </label>
                </div>
              ))}
          </div>
        </div>
        <input type="submit" value="Criar Festa" className="btn" />
      </form>
    </div>
  );
};

export default CreateParty;

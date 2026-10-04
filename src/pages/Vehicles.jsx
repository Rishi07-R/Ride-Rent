import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Vehicles.css";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        setError(error.message);
        setVehicles([]);
      } else {
        setVehicles(data || []);
      }

      setLoading(false);
    };

    loadVehicles();
  }, []);

  if (loading) {
    return (
      <div className="vehicles-page">
        <section className="vehicles-header">
          <h1>Available Vehicles</h1>
          <p>Loading vehicles...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vehicles-page">
        <section className="vehicles-header">
          <h1>Available Vehicles</h1>
          <p>Unable to load vehicles.</p>
        </section>
        <div className="vehicle-message">
          <h2>Error Loading Vehicles</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="vehicles-page">
        <section className="vehicles-header">
          <h1>Available Vehicles</h1>
          <p>Choose the perfect vehicle for your journey.</p>
        </section>
        <div className="vehicle-message">
          <h2>No Vehicles Available</h2>
          <p>There are currently no vehicles in the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vehicles-page">
      <section className="vehicles-header">
        <h1>Available Vehicles</h1>
        <p>Choose the perfect vehicle for your journey.</p>
      </section>

      <section className="vehicle-list">
        {vehicles.map((vehicle) => (
          <div className="vehicle-card" key={vehicle.id}>
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="vehicle-image"
            />
            <div className="vehicle-content">
              <div className="vehicle-title">
                <div>
                  <h2>{vehicle.name}</h2>
                  <p className="vehicle-type">{vehicle.type}</p>
                </div>
                <p className="vehicle-price">
                  ₹{vehicle.price_per_day}
                  <span>/day</span>
                </p>
              </div>

              <div className="vehicle-info">
                <span>{vehicle.fuel_type}</span>
                <span>{vehicle.transmission}</span>
                <span>{vehicle.seats} Seats</span>
              </div>

              <Link to={`/vehicle/${vehicle.id}`} className="view-button">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Vehicles;
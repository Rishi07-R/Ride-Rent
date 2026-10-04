import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/VehicleDetails.css";

function VehicleDetails() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVehicle = async () => {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
        setVehicle(null);
      } else {
        setVehicle(data);
      }

      setLoading(false);
    };

    loadVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="vehicle-not-found">
        <h1>Loading Vehicle...</h1>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="vehicle-not-found">
        <h1>Vehicle Not Found</h1>
        {error && <p className="booking-error">{error}</p>}
        <Link to="/vehicles">Back to Vehicles</Link>
      </div>
    );
  }

  return (
    <div className="vehicle-details-page">
      <div className="details-container">
        <div className="details-image">
          <img src={vehicle.image} alt={vehicle.name} />
        </div>

        <div className="details-content">
          <p className="details-type">{vehicle.type}</p>
          <h1>{vehicle.name}</h1>
          <p className="details-description">{vehicle.description}</p>

          <div className="details-price">
            ₹{vehicle.price_per_day}
            <span> / day</span>
          </div>

          <div className="details-info">
            <div>
              <strong>Fuel</strong>
              <span>{vehicle.fuel_type}</span>
            </div>
            <div>
              <strong>Transmission</strong>
              <span>{vehicle.transmission}</span>
            </div>
            <div>
              <strong>Seats</strong>
              <span>{vehicle.seats}</span>
            </div>
            <div>
              <strong>Year</strong>
              <span>{vehicle.year}</span>
            </div>
          </div>

          <Link to={`/booking/${vehicle.id}`} className="book-button">
            Book Now
          </Link>

          <Link to="/vehicles" className="back-button">
            Back to Vehicles
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
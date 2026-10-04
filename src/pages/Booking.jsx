import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/Booking.css";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: ""
  });

  useEffect(() => {
    const loadVehicle = async () => {
      setLoadingVehicle(true);
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

      setLoadingVehicle(false);
    };

    loadVehicle();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
    setError("");
  };

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) {
      return 0;
    }
    const pickup = new Date(formData.pickupDate);
    const returnDate = new Date(formData.returnDate);
    const difference = returnDate - pickup;
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays();
  const totalAmount =
    days > 0 && vehicle ? days * Number(vehicle.price_per_day) : 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!formData.pickupDate) {
      setError("Please select a pickup date.");
      return;
    }
    if (!formData.returnDate) {
      setError("Please select a return date.");
      return;
    }
    if (!formData.pickupLocation) {
      setError("Please select a pickup location.");
      return;
    }
    if (days <= 0) {
      setError("Return date must be after the pickup date.");
      return;
    }
    if (!vehicle) {
      setError("Vehicle information is not available.");
      return;
    }

    setLoadingBooking(true);
    setError("");

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          vehicle_id: vehicle.id,
          customer_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          pickup_date: formData.pickupDate,
          return_date: formData.returnDate,
          pickup_location: formData.pickupLocation,
          total_amount: totalAmount,
          status: "Confirmed"
        }
      ])
      .select()
      .single();

    setLoadingBooking(false);

    if (error) {
      setError(error.message);
      return;
    }

    const existingBookings = JSON.parse(
      localStorage.getItem("myBookings") || "[]"
    );
    existingBookings.push(data.id);
    localStorage.setItem("myBookings", JSON.stringify(existingBookings));

    navigate("/my-bookings");
  };

  if (loadingVehicle) {
    return (
      <div className="booking-not-found">
        <h1>Loading Vehicle...</h1>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="booking-not-found">
        <h1>Vehicle Not Found</h1>
        {error && <p className="booking-error">{error}</p>}
        <Link to="/vehicles">Back to Vehicles</Link>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book Your Vehicle</h1>
          <p>Complete the form below to reserve your vehicle.</p>
        </div>

        <div className="booking-content">
          <div className="selected-vehicle">
            <p>Selected Vehicle</p>
            <h2>{vehicle.name}</h2>
            <div className="booking-price">
              ₹{vehicle.price_per_day}
              <span> / day</span>
            </div>
          </div>

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pickupDate">Pickup Date</label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="returnDate">Return Date</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pickupLocation">Pickup Location</label>
              <select
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
              >
                <option value="">Select pickup location</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mysore">Mysore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>

            {error && <p className="booking-error">{error}</p>}

            <div className="booking-summary">
              <div>
                <span>Rental Duration</span>
                <strong>{days > 0 ? `${days} day(s)` : "-"}</strong>
              </div>
              <div>
                <span>Price Per Day</span>
                <strong>₹{vehicle.price_per_day}</strong>
              </div>
              <div className="total-row">
                <span>Total Amount</span>
                <strong>₹{totalAmount}</strong>
              </div>
            </div>

            <button
              type="submit"
              className="confirm-button"
              disabled={loadingBooking}
            >
              {loadingBooking ? "Confirming..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;
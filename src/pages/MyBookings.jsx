import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import "../styles/MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError("");

      const bookingIds = JSON.parse(
        localStorage.getItem("myBookings") || "[]"
      );

      if (bookingIds.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          customer_name,
          email,
          phone,
          pickup_date,
          return_date,
          pickup_location,
          total_amount,
          status,
          created_at,
          vehicles (
            name,
            type
          )
        `)
        .in("id", bookingIds)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        setBookings([]);
      } else {
        setBookings(data || []);
      }

      setLoading(false);
    };

    loadBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    const { error } = await supabase
      .from("bookings")
      .update({ status: "Cancelled" })
      .eq("id", bookingId);

    if (error) {
      setError(error.message);
      return;
    }

    setBookings((previousBookings) =>
      previousBookings.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "Cancelled" }
          : booking
      )
    );
  };

  if (loading) {
    return (
      <div className="no-bookings">
        <h2>Loading bookings...</h2>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      <div className="bookings-header">
        <h1>My Bookings</h1>
        <p>View your vehicle rental booking history.</p>
      </div>

      <div className="bookings-container">
        {error && <div className="booking-error">{error}</div>}

        {bookings.length === 0 ? (
          <div className="no-bookings">
            <h2>No Bookings Yet</h2>
            <p>You haven't made any vehicle bookings yet.</p>
            <Link to="/vehicles">Explore Vehicles</Link>
          </div>
        ) : (
          <div className="booking-list">
            {bookings.map((booking) => (
              <div className="booking-card" key={booking.id}>
                <div className="booking-card-header">
                  <div>
                    <p className="booking-label">Vehicle</p>
                    <h2>{booking.vehicles?.name || "Vehicle"}</h2>
                    <p className="booking-type">{booking.vehicles?.type || ""}</p>
                  </div>
                  <span
                    className={`booking-status ${
                      booking.status ? booking.status.toLowerCase() : ""
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="booking-details">
                  <div>
                    <p>Pickup Date</p>
                    <strong>{booking.pickup_date}</strong>
                  </div>
                  <div>
                    <p>Return Date</p>
                    <strong>{booking.return_date}</strong>
                  </div>
                  <div>
                    <p>Pickup Location</p>
                    <strong>{booking.pickup_location}</strong>
                  </div>
                  <div>
                    <p>Total Amount</p>
                    <strong>₹{booking.total_amount}</strong>
                  </div>
                </div>

                <div className="booking-customer">
                  <p>
                    <strong>Name:</strong> {booking.customer_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {booking.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {booking.phone}
                  </p>
                </div>

                {booking.status === "Confirmed" && (
                  <div className="booking-actions">
                    <button
                      className="cancel-button"
                      onClick={() => cancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";

function Seats() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state;

  const movie = bookingData?.movie;

  const theatre = bookingData?.theatre;
  const date = bookingData?.date;
  const time = bookingData?.time;

  // Show data Admin se aayega
  const [show, setShow] = useState(bookingData?.show || null);

  // ===============================
  // BOOKED SEATS
  // ===============================

  const [bookedSeats, setBookedSeats] = useState(
    bookingData?.show?.bookedSeats || []
  );

  const [loadingShow, setLoadingShow] = useState(
    bookingData?.show ? false : true
  );

  // ===============================
  // GET LATEST SHOW DATA
  // ===============================

  useEffect(() => {
    if (!id || id === "undefined") {
      setLoadingShow(false);
      return;
    }

    fetch(`http://localhost:5000/api/shows/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Show not found");
        }

        return response.json();
      })
      .then((data) => {
        setShow(data);

        // MongoDB se booked seats
        setBookedSeats(data.bookedSeats || []);

        setLoadingShow(false);
      })
      .catch((error) => {
        console.error("Show fetch error:", error);

        // Agar fetch fail ho jaye to existing state use hogi
        setShow(bookingData?.show || null);

        setBookedSeats(
          bookingData?.show?.bookedSeats || []
        );

        setLoadingShow(false);
      });
  }, [id]);

  // ===============================
  // TICKET PRICE
  // ===============================

  const seatPrice = Number(show?.ticketPrice) || 0;

  // ===============================
  // TOTAL SEATS
  // ===============================

  const totalSeats = Number(show?.totalSeats) || 0;

  // ===============================
  // AVAILABLE SEATS
  // ===============================

  const availableSeats =
    Number(
      show?.availableSeats ??
      totalSeats - bookedSeats.length
    );

  // ===============================
  // GENERATE SEAT ROWS
  // ===============================

  const seatsPerRow = 10;

  const rowCount = Math.ceil(
    totalSeats / seatsPerRow
  );

  const rows = Array.from(
    { length: rowCount },
    (_, index) =>
      String.fromCharCode(65 + index)
  );

  // ===============================
  // SELECTED SEATS
  // ===============================

  const [selectedSeats, setSelectedSeats] =
    useState([]);

  // ===============================
  // TOGGLE SEAT
  // ===============================

  const toggleSeat = (seatNumber) => {

    // ==========================================
    // BOOKED SEAT KO SELECT NAHI KAR SAKTE
    // ==========================================

    if (bookedSeats.includes(seatNumber)) {
      return;
    }

    // ==========================================
    // UNSELECT
    // ==========================================

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(
        selectedSeats.filter(
          (seat) => seat !== seatNumber
        )
      );

      return;
    }

    // ==========================================
    // MAXIMUM 8 SEATS
    // ==========================================

    if (selectedSeats.length >= 8) {
      alert(
        "You can select maximum 8 seats."
      );

      return;
    }

    // ==========================================
    // AVAILABLE SEATS CHECK
    // ==========================================

    if (
      selectedSeats.length >=
      availableSeats
    ) {
      alert("No more seats available.");

      return;
    }

    setSelectedSeats([
      ...selectedSeats,
      seatNumber,
    ]);
  };

  // ===============================
  // TOTAL AMOUNT
  // ===============================

  const totalAmount =
    selectedSeats.length * seatPrice;

  // ===============================
  // PAYMENT
  // ===============================

  const handlePayment = () => {

    if (selectedSeats.length === 0) {
      alert(
        "Please select at least one seat."
      );

      return;
    }

    if (!show) {
      alert(
        "Show information not found."
      );

      return;
    }

    navigate("/payment", {
      state: {
        movie,
        theatre,
        date,
        time,

        // Complete show information
        show,

        seats: selectedSeats,

        totalAmount,

        ticketPrice: seatPrice,

        totalSeats,

        availableSeats,
      },
    });
  };

  // ===============================
  // BOOKING DATA NOT FOUND
  // ===============================

  if (!bookingData || !movie) {
    return (
      <div className="booking-not-found">

        <h1>
          Booking Information Not Found
        </h1>

        <Link to="/home">
          ← Back to Home
        </Link>

      </div>
    );
  }

  // ===============================
  // SHOW LOADING
  // ===============================

  if (loadingShow) {
    return (
      <div className="booking-not-found">

        <h1>
          Loading Seats...
        </h1>

        <p>
          Please wait.
        </p>

      </div>
    );
  }

  // ===============================
  // SHOW DATA NOT FOUND
  // ===============================

  if (!show) {
    return (
      <div className="booking-not-found">

        <h1>
          Show Information Not Found
        </h1>

        <p>
          Please go back and select a valid show.
        </p>

        <Link to={`/booking/${id}`}>
          ← Back to Booking
        </Link>

      </div>
    );
  }

  return (
    <div className="seats-page">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <Link to="/home" className="brand-logo">
    <span className="brand-icon">▶</span>

    <span className="brand-text">
      BOOK<span>2</span>WATCH
    </span>
  </Link>

        <div className="nav-links">

          <Link to="/home">
            Home
          </Link>

          <Link to="/movies">
            Movies
          </Link>

          <Link to="/bookings">
            My Bookings
          </Link>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="seats-container">

        {/* ================= HEADING ================= */}

        <div className="seats-heading">

          <p>
            SELECT YOUR SEATS
          </p>

          <h1>
            Choose Your Seats 💺
          </h1>

          <span>
            Select your preferred seats for the movie
          </span>

        </div>


        {/* ================= MOVIE INFO ================= */}

        <div className="seat-movie-info">

          <div>

            <h2>
              {movie.title}
            </h2>

            <p>
              🏢 {theatre}
            </p>

            <p>
              📅 {date} &nbsp; • &nbsp; 🕐 {time}
            </p>

            <p>
              💰 ₹{seatPrice} per seat
              &nbsp; • &nbsp;
              💺 {availableSeats} seats available
            </p>

          </div>

        </div>


        {/* ================= SCREEN ================= */}

        <div className="screen-area">

          <div className="screen">
            SCREEN
          </div>

          <p>
            All eyes this way 🎬
          </p>

        </div>


        {/* ================= LEGEND ================= */}

        <div className="seat-legend">

          <div>
            <span className="legend-seat available"></span>
            Available
          </div>

          <div>
            <span className="legend-seat selected"></span>
            Selected
          </div>

          <div>
            <span className="legend-seat booked"></span>
            Booked
          </div>

        </div>


        {/* ================= SEATS ================= */}

        <div className="seat-layout">

          {totalSeats > 0 ? (

            rows.map((row, rowIndex) => (

              <div
                className="seat-row"
                key={row}
              >

                <span className="row-label">
                  {row}
                </span>


                <div className="seat-group">

                  {Array.from(
                    {
                      length: Math.min(
                        seatsPerRow,
                        totalSeats -
                          rowIndex *
                            seatsPerRow
                      ),
                    },
                    (_, index) => {

                      const seatNumber =
                        `${row}${index + 1}`;

                      // ==========================================
                      // CHECK BOOKED SEAT
                      // ==========================================

                      const isBooked =
                        bookedSeats.includes(
                          seatNumber
                        );

                      // ==========================================
                      // CHECK SELECTED SEAT
                      // ==========================================

                      const isSelected =
                        selectedSeats.includes(
                          seatNumber
                        );

                      return (
                        <button
                          key={seatNumber}
                          type="button"

                          // Booked seat disabled
                          disabled={isBooked}

                          onClick={() =>
                            toggleSeat(
                              seatNumber
                            )
                          }

                          className={`seat ${
                            isBooked
                              ? "booked"
                              : isSelected
                              ? "selected"
                              : "available"
                          }`}
                        >
                          {index + 1}
                        </button>
                      );

                    }
                  )}

                </div>


                <span className="row-label">
                  {row}
                </span>

              </div>

            ))

          ) : (

            <div className="booking-not-found">

              <h2>
                No Seats Available
              </h2>

              <p>
                This show does not have any seats configured.
              </p>

            </div>

          )}

        </div>


        {/* ================= SUMMARY ================= */}

        <div className="seat-summary">

          <div className="selected-seat-info">

            <h3>
              Selected Seats
            </h3>

            <div className="selected-seat-list">

              {selectedSeats.length > 0 ? (

                selectedSeats.map((seat) => (

                  <span key={seat}>
                    {seat}
                  </span>

                ))

              ) : (

                <p>
                  No seats selected
                </p>

              )}

            </div>

          </div>


          <div className="price-info">

            <div>

              <span>
                Seats
              </span>

              <strong>
                {selectedSeats.length}
              </strong>

            </div>


            <div>

              <span>
                Price per seat
              </span>

              <strong>
                ₹{seatPrice}
              </strong>

            </div>


            <div className="total-price">

              <span>
                Total Amount
              </span>

              <strong>
                ₹{totalAmount}
              </strong>

            </div>

          </div>

        </div>


        {/* ================= BUTTONS ================= */}

        <div className="seat-actions">

          <Link
            to={`/booking/${id}`}
            state={{
              movie,
              theatre,
              date,
              time,
              show,
            }}
            className="seat-back-btn"
          >
            ← Back
          </Link>


          <button
            type="button"
            className="payment-btn"
            onClick={handlePayment}
          >
            Proceed to Payment 💳
          </button>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default Seats;
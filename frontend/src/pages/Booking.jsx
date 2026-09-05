import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Booking() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ================= STATES =================

  const [movie, setMovie] = useState(location.state?.movie || null);

  const [cinemas, setCinemas] = useState([]);
  const [shows, setShows] = useState([]);

  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [selectedCinemaId, setSelectedCinemaId] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [selectedShow, setSelectedShow] = useState(null);

  const [loadingMovie, setLoadingMovie] = useState(false);
  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [loadingShows, setLoadingShows] = useState(true);

  const [cinemaError, setCinemaError] = useState("");
  const [showError, setShowError] = useState("");

  // =====================================================
  // GET MOVIE
  // =====================================================

  useEffect(() => {
    if (location.state?.movie) {
      setMovie(location.state.movie);
      return;
    }

    if (!id || id === "undefined") {
      setMovie(null);
      return;
    }

    setLoadingMovie(true);

    fetch(`http://localhost:5000/api/movies/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Movie not found");
        }

        return response.json();
      })
      .then((data) => {
        const movieData = data.movie || data;

        setMovie(movieData);
        setLoadingMovie(false);
      })
      .catch((error) => {
        console.error("Movie fetch error:", error);

        setMovie(null);
        setLoadingMovie(false);
      });
  }, [id, location.state]);

  // =====================================================
  // GET CINEMAS
  // =====================================================

  useEffect(() => {
    fetch("http://localhost:5000/api/cinemas")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cinemas");
        }

        return response.json();
      })
      .then((data) => {
        const allCinemas = Array.isArray(data)
          ? data
          : data.cinemas || [];

        // Only Active cinemas
        const activeCinemas = allCinemas.filter(
          (cinema) =>
            !cinema.status ||
            cinema.status.toLowerCase() === "active"
        );

        setCinemas(activeCinemas);
        setLoadingCinemas(false);
      })
      .catch((error) => {
        console.error("Cinema fetch error:", error);

        setCinemaError(
          "Unable to load cinemas. Please make sure backend is running."
        );

        setLoadingCinemas(false);
      });
  }, []);

  // =====================================================
  // GET SHOWS
  // =====================================================

  useEffect(() => {
    fetch("http://localhost:5000/api/shows")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch shows");
        }

        return response.json();
      })
      .then((data) => {
        const allShows = Array.isArray(data)
          ? data
          : data.shows || [];

        // Only Active shows
        const activeShows = allShows.filter(
          (show) =>
            !show.status ||
            show.status.toLowerCase() === "active"
        );

        setShows(activeShows);
        setLoadingShows(false);
      })
      .catch((error) => {
        console.error("Shows fetch error:", error);

        setShowError(
          "Unable to load shows. Please make sure backend is running."
        );

        setLoadingShows(false);
      });
  }, []);

  // =====================================================
  // GET MOVIE ID
  // =====================================================

  const movieId = movie?._id || movie?.id;

  // =====================================================
  // FILTER SHOWS FOR CURRENT MOVIE
  // =====================================================

  const movieShows = shows.filter((show) => {
    const showMovieId =
      show.movie?._id ||
      show.movie?.id ||
      show.movie;

    return String(showMovieId) === String(movieId);
  });

  // =====================================================
  // SELECT CINEMA
  // =====================================================

  const handleCinemaSelect = (cinema) => {
    setSelectedTheatre(cinema.name);
    setSelectedCinemaId(cinema._id);

    // Cinema change hone par date/time reset
    setSelectedDate("");
    setSelectedTime("");
    setSelectedShow(null);
  };

  // =====================================================
  // GET SHOWS FOR SELECTED CINEMA
  // =====================================================

  const cinemaShows = movieShows.filter((show) => {
    const showCinemaId =
      show.cinema?._id ||
      show.cinema?.id ||
      show.cinema;

    return String(showCinemaId) === String(selectedCinemaId);
  });

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(`${dateString}T00:00:00`);

    if (isNaN(date.getTime())) {
      return dateString;
    }

    const day = date.toLocaleDateString("en-IN", {
      weekday: "long",
    });

    const formattedDate = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });

    return {
      day,
      date: formattedDate,
    };
  };

  // =====================================================
  // GET UNIQUE DATES
  // =====================================================

  const dates = [
    ...new Set(
      cinemaShows
        .map((show) => show.date)
        .filter(Boolean)
    ),
  ]
    .sort()
    .map((dateValue, index) => {
      const formatted = formatDate(dateValue);

      return {
        id: index + 1,
        value: dateValue,
        day: formatted?.day || "",
        date: formatted?.date || dateValue,
      };
    });

  // =====================================================
  // SHOWS FOR SELECTED DATE
  // =====================================================

  const dateShows = cinemaShows
    .filter((show) => show.date === selectedDate)
    .sort((a, b) =>
      String(a.startTime).localeCompare(
        String(b.startTime)
      )
    );

  // =====================================================
  // SELECT DATE
  // =====================================================

  const handleDateSelect = (dateValue) => {
    setSelectedDate(dateValue);

    // Date change hone par time reset
    setSelectedTime("");
    setSelectedShow(null);
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (time) => {
    if (!time) return "";

    // Agar already AM/PM format me hai
    if (
      time.toLowerCase().includes("am") ||
      time.toLowerCase().includes("pm")
    ) {
      return time;
    }

    const parts = time.split(":");

    if (parts.length < 2) {
      return time;
    }

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];

    if (isNaN(hours)) {
      return time;
    }

    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
      hours = 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
  };

  // =====================================================
  // SELECT SHOW TIME
  // =====================================================

  const handleTimeSelect = (show) => {
    setSelectedTime(show.startTime);
    setSelectedShow(show);
  };

  // =====================================================
  // CONTINUE TO SEATS
  // =====================================================

  const handleContinue = () => {
    if (!selectedTheatre) {
      alert("Please select a theatre.");
      return;
    }

    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    if (!selectedTime) {
      alert("Please select a show time.");
      return;
    }

    if (!selectedShow) {
      alert("Please select a valid show.");
      return;
    }

    if (!movieId) {
      alert("Movie ID not found.");
      return;
    }

    // =================================================
    // SEND COMPLETE SHOW DATA TO SEATS PAGE
    // =================================================

    navigate(`/seats/${movieId}`, {
      state: {
        movie: movie,

        theatre: selectedTheatre,

        date: selectedDate,

        time: selectedTime,

        // Complete Show object
        show: selectedShow,
      },
    });
  };

  // =====================================================
  // MOVIE LOADING
  // =====================================================

  if (loadingMovie) {
    return (
      <div className="booking-not-found">
        <h1>Loading Movie...</h1>
        <p>Please wait.</p>
      </div>
    );
  }

  // =====================================================
  // MOVIE NOT FOUND
  // =====================================================

  if (!movie) {
    return (
      <div className="booking-not-found">

        <h1>Movie Not Found</h1>

        <p>
          The movie you are trying to book does not exist.
        </p>

        <Link to="/movies">
          ← Back to Movies
        </Link>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="booking-page">

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

          <Link to="/about">
            About Us
          </Link>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="booking-container">

        {/* ================= HEADING ================= */}

        <div className="booking-heading">

          <p className="booking-label">
            BOOK YOUR TICKET
          </p>

          <h1>
            {movie.title}
          </h1>

          <p>
            Select your theatre, date and show time.
          </p>

        </div>


        {/* ================= MOVIE CARD ================= */}

        <div className="booking-movie-card">

          <img
            src={movie.image}
            alt={movie.title}
          />

          <div>

            <span>
              NOW SHOWING
            </span>

            <h2>
              {movie.title}
            </h2>

            <p>
              🎬 {movie.genre}
            </p>

            <p>
              🕐 {movie.duration}
            </p>

          </div>

        </div>


        {/* =====================================================
            THEATRE
        ===================================================== */}

        <section className="booking-section">

          <div className="booking-section-title">

            <span className="step-number">
              1
            </span>

            <div>

              <h2>
                Select Theatre
              </h2>

              <p>
                Choose your preferred cinema
              </p>

            </div>

          </div>


          {/* ================= CINEMA LOADING ================= */}

          {loadingCinemas && (
            <div className="cinema-loading">
              <p>Loading cinemas...</p>
            </div>
          )}


          {/* ================= CINEMA ERROR ================= */}

          {!loadingCinemas && cinemaError && (
            <div className="cinema-error">
              <p>{cinemaError}</p>
            </div>
          )}


          {/* ================= NO CINEMA ================= */}

          {!loadingCinemas &&
            !cinemaError &&
            cinemas.length === 0 && (
              <div className="cinema-error">

                <p>
                  No active cinemas available.
                </p>

                <small>
                  Please ask admin to add an active cinema.
                </small>

              </div>
            )}


          {/* ================= CINEMA GRID ================= */}

          {!loadingCinemas &&
            cinemas.length > 0 && (

              <div className="theatre-grid">

                {cinemas.map((cinema) => (

                  <button
                    key={cinema._id}
                    type="button"
                    className={`theatre-card ${
                      selectedTheatre === cinema.name
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleCinemaSelect(cinema)
                    }
                  >

                    <span className="theatre-icon">
                      🎬
                    </span>

                    <div>

                      <h3>
                        {cinema.name}
                      </h3>

                      <p>
                        📍{" "}
                        {cinema.location ||
                          cinema.city ||
                          "Location not available"}
                      </p>

                    </div>


                    {selectedTheatre === cinema.name && (

                      <span className="selected-check">
                        ✓
                      </span>

                    )}

                  </button>

                ))}

              </div>

            )}

        </section>


        {/* =====================================================
            DATE
        ===================================================== */}

        <section className="booking-section">

          <div className="booking-section-title">

            <span className="step-number">
              2
            </span>

            <div>

              <h2>
                Select Date
              </h2>

              <p>
                Choose your movie date
              </p>

            </div>

          </div>


          {/* ================= SHOW LOADING ================= */}

          {loadingShows && (
            <div className="cinema-loading">
              <p>
                Loading shows...
              </p>
            </div>
          )}


          {/* ================= SHOW ERROR ================= */}

          {!loadingShows && showError && (
            <div className="cinema-error">
              <p>
                {showError}
              </p>
            </div>
          )}


          {/* ================= NO CINEMA SELECTED ================= */}

          {!loadingShows &&
            !selectedCinemaId && (
              <div className="cinema-error">

                <p>
                  Please select a theatre first.
                </p>

              </div>
            )}


          {/* ================= NO DATE ================= */}

          {!loadingShows &&
            selectedCinemaId &&
            !showError &&
            dates.length === 0 && (
              <div className="cinema-error">

                <p>
                  No shows available for this movie.
                </p>

                <small>
                  Please ask admin to add a show for this cinema.
                </small>

              </div>
            )}


          {/* ================= DATE GRID ================= */}

          {!loadingShows &&
            selectedCinemaId &&
            dates.length > 0 && (

              <div className="date-grid">

                {dates.map((item) => (

                  <button
                    key={item.id}
                    type="button"
                    className={`date-card ${
                      selectedDate === item.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleDateSelect(item.value)
                    }
                  >

                    <span>
                      {item.day}
                    </span>

                    <strong>
                      {item.date}
                    </strong>

                  </button>

                ))}

              </div>

            )}

        </section>


        {/* =====================================================
            TIME
        ===================================================== */}

        <section className="booking-section">

          <div className="booking-section-title">

            <span className="step-number">
              3
            </span>

            <div>

              <h2>
                Select Show Time
              </h2>

              <p>
                Choose your preferred show
              </p>

            </div>

          </div>


          {/* ================= NO DATE ================= */}

          {!selectedDate && (

            <div className="cinema-error">

              <p>
                Please select a date first.
              </p>

            </div>

          )}


          {/* ================= NO TIME ================= */}

          {selectedDate &&
            dateShows.length === 0 && (

              <div className="cinema-error">

                <p>
                  No show time available for this date.
                </p>

              </div>

            )}


          {/* ================= TIME GRID ================= */}

          {selectedDate &&
            dateShows.length > 0 && (

              <div className="time-grid">

                {dateShows.map((show) => (

                  <button
                    key={show._id}
                    type="button"
                    className={`time-card ${
                      selectedShow?._id === show._id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleTimeSelect(show)
                    }
                  >

                    🕐 {formatTime(show.startTime)}

                  </button>

                ))}

              </div>

            )}

        </section>


        {/* =====================================================
            SUMMARY
        ===================================================== */}

        {(selectedTheatre ||
          selectedDate ||
          selectedTime) && (

          <section className="booking-summary">

            <h2>
              Booking Summary
            </h2>


            <div className="summary-row">

              <span>
                Movie
              </span>

              <strong>
                {movie.title}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Theatre
              </span>

              <strong>
                {selectedTheatre || "Not selected"}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Date
              </span>

              <strong>
                {selectedDate
                  ? formatDate(selectedDate)?.date
                  : "Not selected"}
              </strong>

            </div>


            <div className="summary-row">

              <span>
                Show Time
              </span>

              <strong>
                {selectedTime
                  ? formatTime(selectedTime)
                  : "Not selected"}
              </strong>

            </div>


            {/* ================= PRICE ================= */}

            {selectedShow && (

              <div className="summary-row">

                <span>
                  Ticket Price
                </span>

                <strong>
                  ₹{selectedShow.ticketPrice}
                </strong>

              </div>

            )}

          </section>

        )}


        {/* =====================================================
            ACTIONS
        ===================================================== */}

        <div className="booking-actions">

          <Link
            to={`/movie/${movieId}`}
            state={{
              movie: movie,
            }}
            className="booking-back-btn"
          >
            ← Back
          </Link>


          <button
            type="button"
            className="continue-btn"
            onClick={handleContinue}
          >
            Select Seats 💺
          </button>

        </div>

      </main>

    </div>
  );
}

export default Booking;
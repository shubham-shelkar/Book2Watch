import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import Navbar from "../components/Navbar";

function Movies() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH MOVIES FROM BACKEND
  // =========================

  useEffect(() => {
    fetch("http://localhost:5000/api/movies")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }

        return response.json();
      })
      .then((data) => {
        setMovies(data.movies || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Movie fetch error:", err);
        setError("Unable to load movies.");
        setLoading(false);
      });
  }, []);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="movies-page">

      {/* ================= NAVBAR ================= */}

      <Navbar />


      {/* ================= HEADER ================= */}

      <section className="movies-header">

        <p>
          BOOK2WATCH
        </p>

        <h1>
          Explore Movies
        </h1>

        <span>
          Choose your favourite movie and book your seats
        </span>

      </section>


      {/* ================= MOVIES ================= */}

      <main className="movies-container">

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="movies-message">
            Loading movies...
          </div>
        )}


        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="movies-message">
            {error}
          </div>
        )}


        {/* ================= NO MOVIES ================= */}

        {!loading && !error && movies.length === 0 && (
          <div className="movies-message">
            No movies available right now.
          </div>
        )}


        {/* ================= MOVIE GRID ================= */}

        {!loading && !error && movies.length > 0 && (

          <div className="movies-grid">

            {movies.map((movie) => (

              <div
                className="movie-card"
                key={movie._id}
              >

                {/* MOVIE IMAGE */}

                <div className="movie-image-wrapper">

                  <img
                    src={movie.image}
                    alt={movie.title}
                  />

                  <div className="movie-rating">
                    ⭐ {movie.rating}
                  </div>

                </div>


                {/* MOVIE CONTENT */}

                <div className="movie-content">

                  <h2>
                    {movie.title}
                  </h2>

                  <p className="movie-genre">
                    {movie.genre}
                  </p>

                  <p className="movie-duration">
                    🕐 {movie.duration}
                  </p>


                  {/* BOOK NOW */}

                  <Link
                    to={`/movie/${movie._id}`}
                    className="book-now-btn"
                    state={{ movie }}
                  >
                    Book Now 🎟️
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>


      {/* ================= FOOTER ================= */}

      <Footer />

    </div>
  );
}

export default Movies;
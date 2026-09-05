import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function Home() {
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
      const allMovies = Array.isArray(data) ? data : data.movies || [];

    // Home page par sirf top 4 movies
      setMovies(allMovies.slice(0, 4));

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
    <div className="home-page">

      {/* ================= NAVBAR ================= */}

      <Navbar />
      
      {/* ================= HERO SECTION ================= */}

      <section className="hero-section">

        <div className="hero-content">

          <p className="small-title">
            WELCOME TO BOOK2WATCH
          </p>

          <h1>
            Your Movie.
            <br />
            Your Seat.
            <br />
            Your Experience.
          </h1>

          <p className="hero-description">
            Book your favourite movies and enjoy the ultimate
            cinema experience.
          </p>

          <Link
            to="/movies"
            className="explore-btn"
          >
            Explore Movies 🎬
          </Link>

        </div>

      </section>


      {/* ================= MOVIES SECTION ================= */}

      <section className="movies-section">

        <div className="section-heading">

          <div>

            <p>
              NOW SHOWING
            </p>

            <h2>
              Popular Movies
            </h2>

          </div>

          <Link
            to="/movies"
            className="view-all"
          >
            View All →
          </Link>

        </div>


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


        {/* ================= MOVIE CARDS ================= */}

        {!loading && !error && movies.length > 0 && (

          <div className="movie-grid">

            {movies.map((movie) => (

              <div
                className="movie-card"
                key={movie._id}
              >

                {/* MOVIE IMAGE */}

                <div className="movie-image">

                  <img
                    src={movie.image}
                    alt={movie.title}
                  />

                  <span className="rating">
                    ⭐ {movie.rating}
                  </span>

                </div>


                {/* MOVIE INFORMATION */}

                <div className="movie-info">

                  <h3>
                    {movie.title}
                  </h3>

                  <p className="movie-genre">
                    {movie.genre}
                  </p>

                  <div className="movie-details">

                    <span>
                      ⏱️ {movie.duration}
                    </span>

                    <span>
                      🌐 {movie.language}
                    </span>

                  </div>


                  {/* BOOK BUTTON */}

                  <Link
                    to={`/movie/${movie._id}`}
                    className="book-btn"
                    state={{ movie }}
                  >
                    Book Now 🎟️
                  </Link>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* ================= COMMON FOOTER ================= */}

      <Footer />

    </div>
  );
}

export default Home;
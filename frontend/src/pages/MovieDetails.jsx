import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Logo from "../components/Logo";

function MovieDetails() {

  const { id } = useParams();
  const location = useLocation();

  // =========================
  // ALL MOVIES
  // =========================

  const movies = [
    {
      id: 1,
      title: "Spider-Man",
      genre: "Action • Adventure",
      duration: "2h 28m",
      rating: "8.7",
      description:
        "Experience an exciting Spider-Man adventure filled with action, suspense and unforgettable moments.",
      image:
        "https://image.tmdb.org/t/p/w500/1Xgjl22MkAZQUavvOeBq3b5W.jpg",
    },

    {
      id: 2,
      title: "Avengers: Endgame",
      genre: "Action • Sci-Fi",
      duration: "3h 2m",
      rating: "8.4",
      description:
        "The Avengers face their biggest challenge in an epic battle to save the universe.",
      image:
        "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    },

    {
      id: 3,
      title: "Interstellar",
      genre: "Sci-Fi • Drama",
      duration: "2h 49m",
      rating: "8.7",
      description:
        "A group of explorers travel through a wormhole in space in search of a new home for humanity.",
      image:
        "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    },

    {
      id: 4,
      title: "The Batman",
      genre: "Action • Crime",
      duration: "2h 56m",
      rating: "8.2",
      description:
        "Batman investigates a series of mysterious crimes while facing dangerous enemies in Gotham City.",
      image:
        "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    },

    {
      id: 5,
      title: "Joker",
      genre: "Crime • Drama",
      duration: "2h 2m",
      rating: "8.4",
      description:
        "A troubled man slowly transforms into the infamous Joker while struggling with society and his own identity.",
      image:
        "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    },

    {
      id: 6,
      title: "Inception",
      genre: "Action • Sci-Fi",
      duration: "2h 28m",
      rating: "8.8",
      description:
        "A skilled team enters people's dreams to perform an impossible mission involving secrets and memories.",
      image:
        "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    },
  ];

  // =========================
  // GET MOVIE
  // =========================

  const movieFromState = location.state?.movie;

  const movie =
    movieFromState ||
    movies.find((item) => item.id === Number(id));

  // =========================
  // MOVIE NOT FOUND
  // =========================

  if (!movie) {
    return (
      <div className="movie-not-found">

        <h1>Movie Not Found</h1>

        <p>
          The movie you are looking for does not exist.
        </p>

        <Link to="/movies">
          ← Back to Movies
        </Link>

      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="movie-details-page">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <Logo />

        <div className="nav-links">

          <Link to="/home">
            Home
          </Link>

          <Link
            to="/movies"
            className="active"
          >
            Movies
          </Link>

          <Link to="/bookings">
            My Bookings
          </Link>

          <Link to="/about">
            About Us
          </Link>

          <Link
            to="/login"
            className="logout-btn"
          >
            Logout
          </Link>

        </div>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="movie-details-container">

        <Link
          to="/movies"
          className="back-movies"
        >
          ← Back to Movies
        </Link>


        <div className="movie-details-card">

          {/* POSTER */}

          <div className="movie-details-poster">

            <img
              src={movie.image}
              alt={movie.title}
            />

          </div>


          {/* CONTENT */}

          <div className="movie-details-content">

            <p className="details-label">
              NOW SHOWING
            </p>

            <h1>
              {movie.title}
            </h1>

            <div className="movie-meta">

              <span>
                ⭐ {movie.rating}
              </span>

              <span>
                🎭 {movie.genre}
              </span>

              <span>
                🕐 {movie.duration}
              </span>

            </div>


            <p className="movie-description">
              {movie.description}
            </p>


            {/* BOOKING */}

            <div className="booking-box">

              <h2>
                Book Your Tickets
              </h2>

              <p>
                Select your preferred theatre and show timing.
              </p>

              <Link
                to={`/booking/${movie.id}`}
                state={{
                  movie: movie
                }}
                className="details-book-btn"
              >
                Book Tickets 🎟️
              </Link>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default MovieDetails;
import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./models/Movie.js";

dotenv.config();

const movies = [
  // SCI-FI
  {
    title: "Inception",
    type: "movie",
    genre: "sci-fi",
    language: "english",
    ott: "Netflix",
    duration: "2h 28m",
    cast: ["Leonardo DiCaprio"],
    description: "A thief enters dreams to steal secrets.",
    cover: "https://via.placeholder.com/300x450?text=Inception",
  },
  {
    title: "Interstellar",
    type: "movie",
    genre: "sci-fi",
    language: "english",
    ott: "Amazon Prime",
    duration: "2h 49m",
    cast: ["Matthew McConaughey"],
    description: "Humanity searches for a new home.",
    cover: "https://via.placeholder.com/300x450?text=Interstellar",
  },

  // ROMANTIC
  {
    title: "The Notebook",
    type: "movie",
    genre: "romantic",
    language: "english",
    ott: "Netflix",
    duration: "2h 3m",
    cast: ["Ryan Gosling"],
    description: "A timeless love story.",
    cover: "https://via.placeholder.com/300x450?text=The+Notebook",
  },
  {
    title: "Jab We Met",
    type: "movie",
    genre: "romantic",
    language: "hindi",
    ott: "Amazon Prime",
    duration: "2h 18m",
    cast: ["Shahid Kapoor", "Kareena Kapoor"],
    description: "A cheerful girl meets a broken man.",
    cover: "https://via.placeholder.com/300x450?text=Jab+We+Met",
  },

  // THRILLER
  {
    title: "Money Heist",
    type: "series",
    genre: "thriller",
    language: "spanish",
    ott: "Netflix",
    duration: "5 Seasons",
    cast: ["Álvaro Morte"],
    description: "A criminal mastermind plans the biggest heist.",
    cover: "https://via.placeholder.com/300x450?text=Money+Heist",
  },
  {
    title: "Sacred Games",
    type: "series",
    genre: "thriller",
    language: "hindi",
    ott: "Netflix",
    duration: "2 Seasons",
    cast: ["Saif Ali Khan"],
    description: "A cop and a crime lord's story.",
    cover: "https://via.placeholder.com/300x450?text=Sacred+Games",
  },

  // ACTION
  {
    title: "The Dark Knight",
    type: "movie",
    genre: "action",
    language: "english",
    ott: "Netflix",
    duration: "2h 32m",
    cast: ["Christian Bale"],
    description: "Batman faces the Joker.",
    cover: "https://via.placeholder.com/300x450?text=Dark+Knight",
  },

  // COMEDY
  {
    title: "Friends",
    type: "series",
    genre: "comedy",
    language: "english",
    ott: "Netflix",
    duration: "10 Seasons",
    cast: ["Jennifer Aniston"],
    description: "Six friends navigating life in NYC.",
    cover: "https://via.placeholder.com/300x450?text=Friends",
  },

  // DOCUMENTARY
  {
    title: "Our Planet",
    type: "documentary",
    genre: "nature",
    language: "english",
    ott: "Netflix",
    duration: "8 Episodes",
    cast: ["David Attenborough"],
    description: "Exploring Earth's natural wonders.",
    cover: "https://via.placeholder.com/300x450?text=Our+Planet",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Movie.deleteMany();
    await Movie.insertMany(movies);

    console.log("Movies & shows seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();

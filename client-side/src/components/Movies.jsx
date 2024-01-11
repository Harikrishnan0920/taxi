import React, { useEffect, useState } from "react";
import axios from "axios";
import { Api_url } from "../common/env_variable";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import imagennt  from "../assets/imagennt.png"
const Movies = ({ hidesearch }) => {
  const [movies, Setmovies] = useState([""]);
  const [moviescopy, Setmoviescopy] = useState();
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = useState([""]);
  const [opened, setOpened] = useState(false);

  // Filterer
  const [searchParams, setSearchParams] = useState({
    start_year: "2019",
    end_year: "2020",
    min_imdb: 9,
    max_imdb: "",
    genre: "Drama",
    language: "",
    type: "movie",
    sort: "latest",
    page: "1",
  });
  const fallbackImageUrl =
  imagennt
  //data for drop boxes
  const years = Array.from({ length: 2021 - 1970 + 1 }, (_, i) => 2020 - i);
  const imdbOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const genreOptions = [
    "Action",
    "Drama",
    "Comedy",
    "Sci-Fi",
    "Thriller",
    "Animation",
  ];

  useEffect(() => {
    getcurrentmovies();
  }, []);


  //Filter Data Handler
  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };


  let getcurrentmovies = async () => {
    try {
      const response = await axios
        .post(
          `${Api_url}/getfilms`,
          { searchParams: searchParams },

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          console.log('movies',res);
          debugger
          let movieresponse=res?.data?.data
          Setmovies(movieresponse?.[0]?movieresponse:[]);
          Setmoviescopy(movieresponse?.[0]?movieresponse:[]);
        })
        .catch((err) => {console.error(err);Setmovies([])});
    } catch (error) {
      console.log(error);
    }
  };

  //Auto-complete Handler
  const handleMovieList = (event, newInputValue) => {
    setInputValue(newInputValue);
    let titleloader = [];
    if (newInputValue) {
      const filteredOptions = moviescopy?.filter((movie) => {
        if (movie.title.toLowerCase().includes(newInputValue.toLowerCase())) {
          return titleloader.push(movie.title);
        }
      });
      setOptions(titleloader);
      Setmovies(filteredOptions);
    } 
  };

  const handleImageError = (e) => {
    // Replace the failed image with the fallback image
    e.target.src = fallbackImageUrl;
  };

  return (
    <>
      <div className="movies">
        {!hidesearch ? (//Conditional rendering To Activate and Deactivate Search and Filter options
          <div className="mb-5">
         <div className="container">
            <div className="pt20">
              <Autocomplete
                value={value}
                onKeyDown={(event, newValue) => {
                  setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                  if (newInputValue) {
                    handleMovieList(event, newInputValue);
                  }else Setmovies(moviescopy)
                }}
                id="controllable-states-demo"
                options={options}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Pick your Flick" />
                )}
              />
            </div>
           
            <div className="row">
              {opened && (
                <div className="filter_label col-md-10">
                  <label>
                    Start Year:
                    <select
                      name="start_year"
                      value={searchParams.start_year}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    End Year:
                    <select
                      name="end_year"
                      value={searchParams.end_year}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Min IMDb:
                    <select
                      name="min_imdb"
                      value={searchParams.min_imdb}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {imdbOptions.map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Genre:
                    <select
                      name="genre"
                      value={searchParams.genre}
                      onChange={handleInputChange}
                    >
                      <option value="">Select</option>
                      {genreOptions.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                  Language: 
                  </label>
                   <input 
                   placeholder="english,tamil"
                    name="language"
                    value={searchParams.language}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <div className="col-md-2 displayFlex filter_btn">
                <button
                  className="close_btn"
                  onClick={() => {
                    setOpened(!opened);// Show and hide Filter
                  }}
                >
                  {opened ? "Close" : "Filter"}
                </button>
                {opened && (
                  <button
                    className="search_btn"
                    onClick={() => getcurrentmovies()}
                  >
                    Search
                  </button>
                )}
              </div>
            </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="container">
          <main className="card-container row">
            {movies?.length>0 ?
              movies.map((movie, index) => (
                <div key={index} className=" col-md-3 ">
                  <div className="moviecard">
                    <img
                      src={movie?.imageurl?.[0]}
                      alt="Movie Poster"
                      className="card-image"
                      onError={handleImageError}
                      />
                    <h3 className="card-title">{movie.title}</h3>
                    <p className="release-date">Released: {movie.released}</p>
                    <div className="additional-text">
                      <img
                        src={movie?.imageurl?.[0]}
                        alt="Movie Poster"
                        onError={handleImageError}
                        className="additional-image"
                      />
                      <div>
                        <h4>
                          Genre: &nbsp; <span>{movie?.genre?.join(", ")}</span>
                        </h4>
                      </div>
                      <div>
                        <h4>
                          Imdb: &nbsp;<span>{movie?.imdbrating??'Not available'}</span>
                          <br /> Plot :<span> {movie?.synopsis?.length>0?movie?.synopsis:'Not availabe'}</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              )):<div style={hidesearch?{backgroundColor:"inherit"}:{}} className="no_movie_card"><div> oops! ,No movies found </div></div>}
          </main>
        </div>
      </div>
    </>
  );
};

export default Movies;

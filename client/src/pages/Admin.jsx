import React, { useState, useEffect, useRef } from "react";
import SortingHat from "../assets/sorting-hat.png";
import CircularProgress from "@mui/material/CircularProgress";
import Loginform from "../components/Loginform";

// import MenteesList from "../components/MenteesList";
// import MentorsList from "../components/MentorsList";

export default function Admin() {
  const [data, setData] = useState({
    matches: [],
    unmatchedMentors: [],
  });
  const prevDataRef = useRef(); // Reference to store the previous data
  const [hasClickedHat, setHasClickedHat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   fetch("/api/matches")
  //     .then((res) => res.json())
  //     .then((fetchedData) => {
  //       // Check if the new data is different from the previous data
  //       if (
  //         JSON.stringify(prevDataRef.current) !== JSON.stringify(fetchedData)
  //       ) {
  //         setData(fetchedData);
  //         prevDataRef.current = fetchedData;
  //       }
  //     });
  // }, []);

  const handleImageClick = async () => {
    setIsLoading(true);

    try {
      // Start with the POST request
      await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      // Follow up with the GET request
      const res = await fetch("/api/matches");

      // Check for 304 status
      if (res.status === 304) {
        // Data hasn't changed, no need to update state or proceed further
        console.log("Data hasn't changed since the last request.");
        return;
      }

      const fetchedData = await res.json();

      if (JSON.stringify(prevDataRef.current) !== JSON.stringify(fetchedData)) {
        setData(fetchedData);
        prevDataRef.current = fetchedData;
        setHasClickedHat(true);
      }
    } catch (err) {
      console.log(
        `Could not fetch data from the server. He whom shall not be named is to blame.`,
        err
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all matches
  const handleClearMatches = async () => {
    try {
      const response = await fetch("/api/matches/clear-matches", {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("All matches cleared successfully");
        // refresh UI to show cleared matches
        window.location.reload();
      } else {
        console.error("Failed to clear matches");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div>
        {!hasClickedHat && (
          <div>
            <img
              src={SortingHat}
              alt="Click here to sort the mentors and mentees"
              onClick={handleImageClick}
              style={{
                cursor: "pointer",
                width: "auto",
                height: "200px",
                marginTop: "5%",
                marginBottom: "5%", // fixed typo from 'mariginBottom' to 'marginBottom'
              }}
            />
            <h2 className="subtitle">
              Click the sorting hat to generate mentor and mentee matches
            </h2>
            <button className="button is-danger" onClick={handleClearMatches}>
              Clear All Matches
            </button>

            {isLoading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "16px",
                }}
              >
                <CircularProgress />
              </div>
            )}
          </div>
        )}
      </div>

      {hasClickedHat && (
        <>
          {/* Matched mentors and mentees */}
          <div className="columns is-multiline">
            {data.matches.map((match) => (
              <div className="column is-half" key={match.id}>
                <div className="card">
                  <div className="card-content">
                    <p className="title">
                      {match.mentee_first_name} {match.mentee_last_name}
                    </p>
                    <p className="subtitle">Mentee</p>
                  </div>
                  <div className="card-content">
                    <p className="title">
                      {match.mentor_first_name} {match.mentor_last_name}
                    </p>
                    <p className="subtitle">Mentor</p>
                  </div>
                  <div className="card-content">
                    <p>Compatibility Score: {match.compatibility_score}</p>
                    <p>{match.compatibility_description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Unmatched mentors */}
          <section>
            <h2 className="title is-3">Unmatched Mentors</h2>
            <ul>
              {data.unmatchedMentors.map((mentor) => (
                <li key={mentor.id}>
                  {mentor.first_name} {mentor.last_name}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <Loginform />

      {/* 
      
      mentors and mmentees lists 
      <h3 class="title is-3">Mentees : </h3>

      <MenteesList />

      <h3 class="title is-3">Mentors : </h3>

      <MentorsList /> */}
    </div>
  );
}

import { response } from "express";
import { useState, useEffect } from "react";

export default function MenteesList() {
  //   const [menteeList, SetMenteeList] = useState({});

  //   const getMentees = async () => {
  //     try {
  //       const mentees = await fetch(`/api/mentees`);
  //       const result = response.json();
  //       console.log(result);
  //       SetMenteeList(mentees);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   useEffect(() => {
  //     getMentees();
  //   }, []);

  return (
    // <div>
    //   <div className="columns is-multiline">
    //     {result.map((match) => (
    //       <div className="column is-half" key={match.id}>
    //         <div className="card">
    //           <div className="card-content">
    //             <p className="title">
    //               {match.mentee_first_name} {match.mentee_last_name}
    //             </p>
    //             <p className="subtitle">Mentee</p>
    //           </div>
    //           <div className="card-content">
    //             <p className="title">
    //               {match.mentor_first_name} {match.mentor_last_name}
    //             </p>
    //             <p className="subtitle">Mentor</p>
    //           </div>
    //           <div className="card-content">
    //             <p>Compatibility Score: {match.compatibility_score}</p>
    //             <p>{match.compatibility_description}</p>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div>Hello</div>
  );
}

import { useState, useEffect } from "react";

function MentorsList() {
  const [mentorsList, SetMentorsList] = useState([]);

  const getMentors = async () => {
    try {
      const mentors = await fetch(`/api/mentorss`);
      const result = await mentors.json();
      SetMentorsList(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMentors();
    console.log("second mentors list ", menteeList);
  }, []);

  return (
    <div>
      <div>
        <div className="columns is-multiline">
          {mentorsList.map((mentors) => (
            <div className="column is-half" key={mentors.id}>
              <div className="card">
                <div className="card-content">
                  <p className="title">
                    {mentors.first_name} {mentors.last_name}
                  </p>
                  <p className="subtitle">mentors</p>
                  <p> {mentors.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MentorsList;

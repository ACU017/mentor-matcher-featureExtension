import { useState, useEffect } from "react";

function MenteesList() {
  const [menteeList, SetMenteeList] = useState([]);

  const getMentees = async () => {
    try {
      const mentees = await fetch(`/api/mentees`);
      const result = await mentees.json();
      SetMenteeList(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMentees();
    console.log("second mentee list ", menteeList);
  }, []);

  return (
    <div>
      <div>
        <div className="columns is-multiline">
          {menteeList.map((mentee) => (
            <div className="column is-half" key={mentee.id}>
              <div className="card">
                <div className="card-content">
                  <p className="title">
                    {mentee.first_name} {mentee.last_name}
                  </p>
                  <p className="subtitle">Mentee</p>
                  <p> {mentee.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenteesList;

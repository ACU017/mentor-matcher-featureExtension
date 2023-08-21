import { useState, useEffect } from "react";
import MenteesList from "../components/MenteesList";
import MentorsList from "../components/MentorsList";

function Index() {
  return (
    <div>
      <h3 class="title is-3">Mentees : </h3>

      <MenteesList />

      <h3 class="title is-3">Mentors : </h3>

      <MentorsList />
    </div>
  );
}

export default Index;

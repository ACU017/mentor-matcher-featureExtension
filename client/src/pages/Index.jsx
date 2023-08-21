import { useState, useEffect } from "react";
import MenteesList from "../components/MenteesList";

function Index() {
  return (
    <div>
      <p>Mentees : </p>

      <MenteesList />
    </div>
  );
}

export default Index;

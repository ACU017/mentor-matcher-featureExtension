var express = require("express");
var router = express.Router();
const db = require("../model/helper");
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_API_KEY,
});
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");
const openai = new OpenAIApi(configuration);

// get all matches
router.get("/", async function (req, res, next) {
  try {
    const matchedResults = await db(`
    SELECT 
        mentor_mentee.id, 
        mentor_id, 
        mentee_id, 
        compatibility_score, 
        compatibility_description, 
        mentors.first_name AS mentor_first_name, 
        mentors.last_name AS mentor_last_name, 
        mentees.first_name AS mentee_first_name,
        mentees.last_name AS mentee_last_name 
    FROM 
        mentor_mentee 
    INNER JOIN 
        mentors ON mentor_mentee.mentor_id = mentors.id 
    INNER JOIN 
        mentees ON mentor_mentee.mentee_id = mentees.id;
`);

    const unmatchedMentors = await db(
      "SELECT id, first_name, last_name FROM mentors WHERE id NOT IN (SELECT mentor_id FROM mentor_mentee);"
    );

    // Create a combined response
    const combinedResults = {
      matches: matchedResults.data,
      unmatchedMentors: unmatchedMentors.data,
    };

    if (
      !combinedResults.matches.length &&
      !combinedResults.unmatchedMentors.length
    ) {
      res
        .status(404)
        .send({ msg: "There is no data available. Please add more data." });
    } else {
      res.send(combinedResults); // this is the results
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "An error occurred fetching the data." });
  }
});

// remove all matches data from database
router.delete("/clear-matches", async function (req, res, next) {
  try {
    await db("DELETE FROM mentor_mentee;");
    res.send({ msg: "All matches have been deleted." });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "An error occurred deleting the data." });
  }
});

// Send all mentor and mentee questionnaire responses to chatgpt to generate matches
router.post("/", userShouldBeLoggedIn, async function (req, res, next) {
  try {
    // First, delete previous matches from the database
    // await db("DELETE FROM mentor_mentee;");

    console.log("getting mentor responses");

    const mentorResponses = await getQuestionnaireResponses("mentors");
    // console.log(mentorResponses);

    console.log("getting mentee responses");
    const menteeResponses = await getQuestionnaireResponses("mentees");
    // console.log(menteeResponses);
    console.log("calling generateMatches function");

    const matchResults = await generateMatches(
      mentorResponses,
      menteeResponses
    );

    console.log(`match results: ${matchResults}`);

    console.log("deleting previous matches"); // this is what I want to delete

    // insert match results into database mentor_mentee table

    console.log("for loop of match results");
    for (let match of matchResults.matches) {
      const {
        mentor_id,
        mentee_id,
        compatibility_score,
        compatibility_description,
      } = match;

      const query =
        "INSERT INTO mentor_mentee (mentor_id, mentee_id, compatibility_score, compatibility_description) " +
        `VALUES ("${mentor_id}", "${mentee_id}", "${compatibility_score}", "${compatibility_description}");`;

      console.log("inserting new matches to db");
      await db(query);
    }

    console.log("sending match results");
    res.json({ matchResults });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred in the overall endpoint" });
  }
});

const getQuestionnaireResponses = async (tableName) => {
  try {
    const responses = await db(
      `SELECT id, first_name, q1, q2, q3, q4, q5, q6, q7 FROM ${tableName};`
    );

    return responses.data;
  } catch (error) {
    console.error(
      `generateQuestionnaireResponses error for ${tableName}: `,
      error
    );
    throw error;
  }
};

const generateMatches = async (mentorResponses, menteeResponses) => {
  const formatDataSet = {
    // Create a questions table in the database for better scalability
    questions: {
      mentors: {
        q1: "Tell us about your career experience in tech and what technologies are you proficient in?",
        q2: "What are you most passionate about in your career?",
        q3: "What do you believe are the most important qualities of a successful mentor-mentee relationship?",
        q4: "What are you hoping to get out of being a mentor?",
        q5: "What would an ideal mentee profile look like for you?",
        q6: "What was your career before your time at CodeOp?",
        q7: "Are there any parts of your identity that might make you somebody’s role model? (eg: gender, ethnicity, sexual orientation, cultural background)?",
      },

      mentees: {
        q1: "What are your career goals? Is there a specific role in tech that you are interested in?",
        q2: "What would be your ideal mentor profile?",
        q3: "What do you believe are the most important qualities of a successful mentor-mentee relationship?",
        q4: "Are there any parts of your identity that you would like to see reflected in a mentor? (eg: gender, ethnicity, sexual orientation, cultural background)",
        q5: "What skills do you want to develop?",
        q6: "What was your career before joining CodeOp?",
        q7: "What do you hope to achieve through mentorship?",
      },
    },
    mentorResponses,
    menteeResponses,
  };

  try {
    const schemaExample = {
      matches: [
        {
          mentor_id: 2,
          mentee_id: 1,
          compatibility_score: 85,
          compatibility_description: "Example description about compatibility.",
        },
      ],
      unmatched: {
        mentors: [1, 3],
      },
    };

    // ***** WARNING: Do not change the prompt. It is formatted to work with the chatgpt model... unless you want to change the model. *****
    const prompt = `
Based on the provided data for ${menteeResponses.length} mentees and ${
      mentorResponses.length
    } mentors, I need you to:

    HARD REQUIREMENTS:
    DO NOT INCLUDE ANYTHING OUTSIDE OF THE CURLY BRACES OF THE JSON OBJECT. 
    DO NOT USE ANY ESCAPED CHARACTERS IN YOUR DESCRIPTIONS. 
    FINISH YOUR ANSWER.

1. Analyze the responses and match each mentee to one mentor for a software engineering bootcamp.
2. Determine their compatibility using the given questions and answers.
3. Generate a compatibility score ranging from 1 to 100.
4. Craft a description, that's between 400-500 characters, explaining their compatibility. Use their first names in the description.
5. Make sure every mentee is paired with only one mentor.
6. Crucially, include any unmatched mentor's ID in the 'unmatched mentors' section.
7. Provide the results in the following JSON structure: ${JSON.stringify(
      schemaExample
    )}
8. Do not include anything outside of the curly braces of the JSON object.
9. Ensure the returned results do not contain the original question answers.

It's essential to follow these guidelines strictly.

Here is the data: ${JSON.stringify(formatDataSet)}
`;

    // Here is the data: ${JSON.stringify(formatDataSet)}

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful mentor/mentee matcher." },
        { role: "user", content: prompt },
      ],
    });

    let parsedData;
    console.log(
      `This is the data received from chatgpt: ${response.data.choices[0].message.content}`
    );

    // Cleansing the data before parsing
    const cleanseResponseData = (data) => {
      const startIndex = data.indexOf("{");
      if (startIndex !== -1) {
        return data.substring(startIndex);
      }
      return null;
    };
    // Cleansing the data before parsing
    const cleansedResponse = cleanseResponseData(
      response.data.choices[0].message.content
    );

    try {
      parsedData = JSON.parse(cleansedResponse);
    } catch (error) {
      console.error("Error parsing JSON: ", error);
      return;
    }

    console.log("parsed data: ", parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error of generateMatches function", error);
    // res.status(500).json({ error: `An error occurred: ${error.message}` });
    throw error;
  }
};

module.exports = router;

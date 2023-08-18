import React from "react";

export default function TextAreaInput(props) {
  const { question, name, value, handleInputChange } = props;
  return (
    <div>
      <div className="field">
        <label className="label">{question}</label>
        <textarea
          className="textarea"
          name={name}
          value={value}
          onChange={handleInputChange}
          maxLength={500}
        />
      </div>
      <div className="char-count">
        <p className={{ value }.length === 500 ? "warning" : ""}>
          {/*this checks the lenght of the input, however it shows at the bottom  */}
          {value.length}/500
          {value.length === 500 && (
            <span className="warning">
              {" "}
              Maximum number of characters reached
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

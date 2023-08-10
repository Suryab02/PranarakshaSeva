//import { set } from 'mongoose';
import React, { useState } from 'react';

function EventRegistrationForm() {
  const [age, setAge] = useState(50);
  const [name, setName] = useState(Date.now());
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function helper(){
    const dob = new Date(name);
    const diff = Date.now() - dob.getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return age;
  }
  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
    let age = helper();
    console.log(`age`,age)
    setAge(age);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleWebsiteChange = (event) => {
    setWebsite(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !email) {
      setErrorMessage('Please fill out all required fields.');
    } else {
      setErrorMessage('');

    let age = helper()
    setAge(age);
      // Send form data to server or do something with it
      console.log({ age, name, email, website });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="age">Age:</label>
        <input
          type="range"
          id="age"
          name="age"
          min="18"
          max="100"
          value={age}
          onChange={handleAgeChange}
          style={{ width: '100%' }}
          className={age < 18 ? 'hidden' : age < 28 ? 'hidden' : ''}
        />
      </div>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="date"
          id="name"
          name="name"
          value={name}
          onChange={handleNameChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
          className={age < 18 || age >= 18 && age < 28 ? 'hidden' : ''}
        />
      </div>
      <div>
        <label htmlFor="website">Website:</label>
        <input
          type="url"
          id="website"
          name="website"
          value={website}
          onChange={handleWebsiteChange}
          className={age < 18 || age >= 18 && age < 28 ? 'hidden' : ''}
        />
      </div>
      <div>
        <button type="submit">Sign Up</button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
}

export default EventRegistrationForm;
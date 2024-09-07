import React, { useState } from 'react';

function MainPage({ userName, setUserName, numQuestions, setNumQuestions, handleStartQuiz }) {
    const [skipCount, setSkipCount] = useState(0);
    const [error, setError] = useState('');

    const handleNumQuestionsChange = (e) => {
        const value = Math.max(0, Math.min(150, e.target.value)); // Ensure the value is between 0 and 150
        setNumQuestions(value);
        if (value + skipCount > 155) {
            setError('The total of skipped and selected questions should not exceed 155.');
        } else {
            setError('');
        }
    };

    const handleSkipCountChange = (e) => {
        const value = Math.max(0, Math.min(155, e.target.value)); // Ensure the value is between 0 and 155
        setSkipCount(value);
        if (value + numQuestions > 155) {
            setError('The total of skipped and selected questions should not exceed 155.');
        } else {
            setError('');
        }
    };

    const handleUserNameChange = (e) => {
        const value = e.target.value;
        setUserName(value);
    };

    const handleStart = () => {
        
        // Validate numQuestions
        if (numQuestions <= 0) {
            setError('The number of questions to be asked must be greater than 0.');
            return;
        }

        // Validate total count
        if (numQuestions + skipCount > 155) {
            setError('The total of questions to be skipped and selected should not exceed 155.');
            return;
        }

        setError('');
        handleStartQuiz(skipCount, numQuestions);
    };

    return (
        <div>
            <h1>Welcome to the JavaScript Quiz</h1>
            <div>
                <label htmlFor="userName">Name:</label>
                <input 
                    id="userName"
                    type="text" 
                    value={userName} 
                    onChange={handleUserNameChange} 
                />
            </div>
            <div>
                <label htmlFor="skipCount">Enter the number of initial questions to skip (max 155):</label>
                <input 
                    id="skipCount"
                    type="number" 
                    value={skipCount} 
                    onChange={handleSkipCountChange} 
                />
            </div>
            <div>
                <label htmlFor="numQuestions">Enter the total number of questions to be asked (<span>{155 - skipCount}</span>):</label>
                <input 
                    id="numQuestions"
                    type="number" 
                    value={numQuestions} 
                    onChange={handleNumQuestionsChange} 
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>} 
            <button onClick={handleStart}>Start Quiz</button>
        </div>
    );
}

export default MainPage;

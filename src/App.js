import React, { useState } from 'react';
import './App.css'; // Import the CSS file
import MainPage from './components/MainPage';
import QuizPage from './components/QuizPage';
import questions from './data/questions';

function App() {
    const [userName, setUserName] = useState('');
    const [numQuestions, setNumQuestions] = useState(0);
    const [skipCount, setSkipCount] = useState(0);
    const [startQuiz, setStartQuiz] = useState(false);

    const handleStartQuiz = (skip, num) => {
        setSkipCount(skip);
        setNumQuestions(num);
        setStartQuiz(true);
    };

    // Calculate the subset of questions based on skip count and number of questions
    const getQuestionsForQuiz = () => {
        const startIndex = Math.min(skipCount, questions.length);
        const endIndex = Math.min(startIndex + numQuestions, questions.length);
        return questions.slice(startIndex, endIndex);
    };

    return (
        <div className="App">
            {!startQuiz ? (
                <MainPage 
                    userName={userName} 
                    setUserName={setUserName} 
                    numQuestions={numQuestions} 
                    setNumQuestions={setNumQuestions} 
                    handleStartQuiz={handleStartQuiz} 
                />
            ) : (
                <QuizPage questions={getQuestionsForQuiz()} userName={userName} />
            )}
        </div>
    );
}

export default App;

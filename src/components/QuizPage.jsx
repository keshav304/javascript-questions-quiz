import React, { useState,useEffect } from 'react';

function QuizPage({ questions, userName }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [rightAnswers, setRightAnswers] = useState(0); // Track right answers
    const [wrongAnswers, setWrongAnswers] = useState(0); // Track wrong answers
    const [quizEnded, setQuizEnded] = useState(false); // Track if the quiz has ended

    const handleOptionSelect = (option) => {
        if (submitted) return; // Prevent re-selecting options after submission

        setSelectedOption(option);
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;
        const explanation = questions[currentQuestionIndex].explanation;

        if (option.split(':')[0].split('-')[1].trim() === correctAnswer) {
            setFeedback('Correct! ' + explanation);
            setRightAnswers(rightAnswers + 1);
        } else {
            setFeedback(explanation);
            setWrongAnswers(wrongAnswers + 1);
        }
        setSubmitted(true);
    };
    useEffect(() => {
            const handleBeforeUnload = (e) => {
                if (!quizEnded) {
                    e.preventDefault();
                    e.returnValue = ''; // Display a generic message in modern browsers
                }
            };
    
            window.addEventListener('beforeunload', handleBeforeUnload);
    
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
            };
        }, [quizEnded]); // Depend on quizEnded to add/remove event listener
    

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setFeedback('');
            setSubmitted(false); // Reset submitted state for the next question
        }
    };

    const handleEndQuiz = () => {
        setQuizEnded(true);
    };

    const handleRestart = () => {
        window.location.reload(); // Reload the page to restart the quiz
    };

    const { question, code, options, correctAnswer } = questions[currentQuestionIndex];
    const correctOptionLetter = correctAnswer.split(':')[0].trim();

    const totalQuestions = questions.length;
    const scorePercentage = (rightAnswers / totalQuestions) * 100;

    let performanceMessage = '';

    if (scorePercentage >= 70) {
        performanceMessage = 'Well done!';
    } else if (scorePercentage >= 40) {
        performanceMessage = 'Good job!';
    } else {
        performanceMessage = 'Try again!';
    }

    return (
        <div className="quiz-container">
            {quizEnded ? (
                <div className="score-container">
                    <h2 className="score-title">{performanceMessage} {userName}</h2>
                    <p className="score-text">Your Total Score: <span className="score-value">{rightAnswers}</span> out of {totalQuestions}</p>
                    <button className="restart-button" onClick={handleRestart}>Start Quiz Again</button>
                </div>
            ) : (
                <>
                    <h2>Question {currentQuestionIndex + 1}</h2>
                    <h3>{question.split('.')[1].trim()}</h3>
                    <pre>{code}</pre>
                    {options.map((option, index) => {
                        const optionLetter = option.split(':')[0].split('-')[1].trim();
                        const isCorrect = optionLetter === correctOptionLetter;
                        const isSelected = selectedOption && selectedOption.split(':')[0].split('-')[1].trim() === optionLetter;
                        let optionClass = '';

                        if (submitted) {
                            if (isCorrect) {
                                optionClass = 'correct'; // Correct answer
                            } else if (isSelected) {
                                optionClass = 'wrong'; // Incorrectly selected answer
                            }
                        } else if (isSelected) {
                            optionClass = 'highlight'; // Highlight selected option before submission
                        }

                        return (
                            <div
                                key={index}
                                className={`option ${optionClass}`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option}
                            </div>
                        );
                    })}
                    {feedback && <div className="feedback" dangerouslySetInnerHTML={{ __html: feedback }} />}
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button onClick={nextQuestion}>Next Question</button>
                    ) : (
                        <button onClick={handleEndQuiz}>End Quiz</button> // End quiz button
                    )}
                </>
            )}
        </div>
    );
}

export default QuizPage;

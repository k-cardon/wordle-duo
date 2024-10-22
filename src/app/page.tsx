'use client';

import { useEffect, useState, FormEvent } from 'react';

const Home: React.FC = () => {
	const [answer, setAnswer] = useState<string>('');
	const [guess, setGuess] = useState<string>('');
	const [attempts, setAttempts] = useState<string[]>([]);
	const [stage, setStage] = useState<'input' | 'guess'>('input');
	const [message, setMessage] = useState<string>('');
	const [words, setWords] = useState<string[]>([]);
	const [userAddedWord, setUserAddedWord] = useState<string>('');

	useEffect(() => {
		const fetchWords = async () => {
			const res = await fetch('/words.txt');
			const text = await res.text();
			const wordList = text
				.split('\n')
				.map((word) => word.trim().toUpperCase())
				.filter((word) => word.length === 5);
			setWords(wordList);
		};

		fetchWords();
	}, []);

	const handleAnswerSubmit = (e: FormEvent) => {
		e.preventDefault();
		const upperAnswer = answer.toUpperCase();
		if (upperAnswer.length === 5 && /^[A-Z]+$/.test(upperAnswer)) {
			setUserAddedWord(upperAnswer);
			setStage('guess');
			setMessage('');
			setAttempts([]);
			setGuess('');
		} else {
			setMessage('Please enter a valid 5-letter word.');
		}
	};

	const getFeedback = (guess: string) => {
		const feedback = Array(5).fill('absent');
		const answerArray = userAddedWord.split('');
		const guessArray = guess.split('');

		// Check for correct letters first
		guessArray.forEach((letter, index) => {
			if (letter === answerArray[index]) {
				feedback[index] = 'correct';
				answerArray[index] = '';
			}
		});

		// Check for present letters
		guessArray.forEach((letter, index) => {
			if (feedback[index] !== 'correct' && answerArray.includes(letter)) {
				feedback[index] = 'present';
				answerArray[answerArray.indexOf(letter)] = '';
			}
		});

		return feedback;
	};

	const handleGuessSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (attempts.length >= 6) {
			setMessage('No more attempts left!');
			return;
		}

		const upperGuess = guess.toUpperCase();
		const validWord =
			words.includes(upperGuess) || upperGuess === userAddedWord;

		if (validWord) {
			const feedback = getFeedback(upperGuess);
			setAttempts([...attempts, upperGuess]);
			if (upperGuess === userAddedWord) {
				setMessage('Congratulations! You guessed the word!');
			} else {
				setMessage('Wrong guess. Try again!');
			}
			console.log(feedback);
		} else {
			setMessage('Please enter a valid 5-letter word.');
		}

		setGuess('');
	};

	return (
		<div style={{ padding: '20px', textAlign: 'center' }}>
			<h1>Wordle - Two Player Game</h1>
			{stage === 'input' ? (
				<form onSubmit={handleAnswerSubmit}>
					<input
						type='text'
						maxLength={5}
						value={answer}
						className='text-black'
						onChange={(e) =>
							setAnswer(e.target.value.toUpperCase())
						}
						placeholder='Enter answer (5 letters)'
						required
					/>
					<button type='submit'>Set Answer</button>
				</form>
			) : (
				<>
					<h2>Guess the word!</h2>
					<form onSubmit={handleGuessSubmit}>
						<input
							type='text'
							maxLength={5}
							value={guess}
							className='text-black'
							onChange={(e) =>
								setGuess(e.target.value.toUpperCase())
							}
							placeholder='Your guess (5 letters)'
							required
						/>
						<button type='submit'>Submit Guess</button>
					</form>
					<div>
						<h3>Attempts:</h3>
						<div style={{ display: 'grid', gap: '10px' }}>
							{attempts.map((attempt, index) => {
								const feedback = getFeedback(attempt);
								return (
									<div
										key={index}
										style={{
											display: 'flex',
											justifyContent: 'center',
										}}
									>
										{attempt
											.split('')
											.map((letter, letterIndex) => (
												<span
													key={letterIndex}
													style={{
														display: 'inline-block',
														width: '30px',
														height: '30px',
														lineHeight: '30px',
														margin: '0 2px',
														backgroundColor:
															feedback[
																letterIndex
															] === 'correct'
																? 'green'
																: feedback[
																			letterIndex
																	  ] ===
																	  'present'
																	? 'yellow'
																	: 'grey',
														color: 'white',
														textAlign: 'center',
														borderRadius: '5px',
													}}
												>
													{letter}
												</span>
											))}
									</div>
								);
							})}
						</div>
					</div>
				</>
			)}
			{message && <p>{message}</p>}
		</div>
	);
};

export default Home;

// import React, { useState, useEffect, FormEvent } from 'react';

// const Wordle: React.FC = () => {
//   const [answer, setAnswer] = useState<string>('');
//     const [guess, setGuess] = useState<string>('');
//     const [attempts, setAttempts] = useState<string[]>([]);
//     const [stage, setStage] = useState<'input' | 'guess'>('input');
//     const [message, setMessage] = useState<string>('');
//     const [words, setWords] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchWords = async () => {
//         const res = await fetch('/words.txt');
//         const text = await res.text();
//         const wordList = text.split('\n').map(word => word.trim()).filter(word => word.length === 5);
//         setWords(wordList);
//     };

//     fetchWords();
//   }, []);

//   const handleAnswerSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     if (words.includes(answer)) {
//         setStage('guess');
//         setMessage('');
//     } else {
//         setMessage('Please enter a valid 5-letter word.');
//     }
//   };

//   const handleGuessSubmit = (e: FormEvent) => {
//     e.preventDefault();
//     if (attempts.length >= 6) {
//         setMessage('No more attempts left!');
//         return;
//     }

//     if (words.includes(guess)) {
//         setAttempts([...attempts, guess]);
//         if (guess === answer) {
//             setMessage('Congratulations! You guessed the word!');
//         } else {
//             setMessage('Wrong guess. Try again!');
//         }
//     } else {
//         setMessage('Please enter a valid 5-letter word.');
//     }

//     setGuess('');
//   };

//   return (
//     <div className='text-center p-20'>
//     <h1 className='text-4xl font-bold'>Wordle Duo</h1>
//     {stage === 'input' ? (
//       <>
//     <h3 className='text-2xl my-8'>Player 1, enter the answer:</h3>
//     <form onSubmit={handleAnswerSubmit}>
//                     <input
//                         type="text"
//                         className='text-black'
//                         maxLength={5}
//                         value={answer}
//                         onChange={(e) => setAnswer(e.target.value)}
//                         placeholder="Enter answer (5 letters)"
//                         required
//                     />
//                     <button type="submit">Set Answer</button>
//                 </form>
//                 </>
//             ) : (
//               <>
//               <h2>Player 2, guess the word!</h2>
//               <form onSubmit={handleGuessSubmit}>
//                   <input
//                       type="text"
//                       maxLength={5}
//                       value={guess}
//                       onChange={(e) => setGuess(e.target.value)}
//                       placeholder="Your guess (5 letters)"
//                       required
//                   />
//                   <button type="submit">Submit Guess</button>
//               </form>
//               <div>
//                   <h3>Attempts:</h3>
//                   <ul>
//                       {attempts.map((attempt, index) => (
//                           <li key={index}>{attempt}</li>
//                       ))}
//                   </ul>
//               </div>
//           </>
//       )}
//       {message && <p>{message}</p>}
//       </div>
//     );
// };

//     {/* <h3 className='text-center text-2xl my-20'>Player 2, guess the word!</h3>
//     <div className="flex flex-col items-center justify-center text-white font-sans py-6">
//       {guesses.map((guess, index) => (
//         <div key={index} className="flex mb-2">
//           {guess.map((letter, i) => (
//             <div
//               key={i}
//               className={`w-12 h-12 flex items-center justify-center mr-1 rounded-md font-bold ${
//                 index === 0 ? 'bg-red-300' :
//                 index === 1 ? 'bg-orange-300' :
//                 index === 2 ? 'bg-yellow-300' :
//                 index === 3 ? 'bg-green-300' :
//                 index === 4 ? 'bg-blue-300' :
//                 'bg-purple-300'
//               }`}
//             >
//               {letter}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//     </div>  );
// }; */}

// export default Wordle;

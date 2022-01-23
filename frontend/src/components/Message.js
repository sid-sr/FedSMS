/* eslint-disable indent */
import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { RiSpam2Line } from 'react-icons/ri';
import { useLocation } from 'react-router-dom';
import '../styles/message.css';
import db from '../utils/db';

const Message = () => {
	const { state } = useLocation();
	const [spam, setSpam] = useState();

	useEffect(() => {
		setSpam(state.spam)
	}, []);

	const toggleSpam = () => {
		db.messages.update(state.index + 1, { spam: !spam }).then(function () {
			setSpam(!spam)
		});
	};

	return (
		<div className="container">
			<div className="home">
				{
					state.page == 'Junk' ?
						<a href="/junk" className="back">
							<IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
						</a>
						:
						<a href="/allmessages" className="back">
							<IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
						</a>
				}
				<FaUserCircle
					className="Logo"
					size={50}
					style={{ marginBottom: '2px', color: '#D1D3D4' }}
				></FaUserCircle>
			</div>
			<br></br>
			<br></br>
			<div className="homeNew">
				<span>{state ? state.message : ''}</span>
			</div>
			<p className="redtext">
				{' '}
				{spam ? (
					<>
						<RiSpam2Line style={{ fontSize: '16px' }}></RiSpam2Line>
						<span style={{ marginLeft: '10px' }}>Marked as spam.</span>
						<button
							style={{
								marginLeft: '3px',
								color: '#007aff',
								backgroundColor: 'black',
								border: 'none',
							}}
							onClick={toggleSpam}
						>
							Unmark
						</button>
					</>
				) : (
					<>
						<button
							style={{
								marginLeft: '3px',
								color: 'red',
								backgroundColor: 'black',
								border: 'none',
							}}
							onClick={toggleSpam}
						>
							<RiSpam2Line style={{ fontSize: '16px' }}></RiSpam2Line>&nbsp;
							Mark as spam
						</button>
					</>
				)}
			</p>
			<div>
				<p className=".textCard"></p>
			</div>
		</div>
	);
};

export default Message;

import '../styles/home.css';
import { IoIosArrowBack } from 'react-icons/io';
function Junk() {
  return (
    <div className="container">
      <a href="/home" className="backText">
        <IoIosArrowBack style={{ marginBottom: '2px' }}></IoIosArrowBack>
        <span>Back</span>
      </a>
      <h1 className="settingsHeading">Junk</h1>
    </div>
  );
}

export default Junk;

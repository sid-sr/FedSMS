import { AiTwotoneSetting } from 'react-icons/ai';
import { IoIosArrowForward } from 'react-icons/io';
import { IoChatbubblesOutline, IoTrashBinOutline } from 'react-icons/io5';
import '../styles/home.css';

function Home() {
  return (
    <div className="container">
      <a href="/Settings">
        <AiTwotoneSetting
          style={{
            float: 'right',
            marginRight: '8%',
            fontSize: '28px',
            marginTop: '5%',
            color: '#007aff',
          }}
        ></AiTwotoneSetting>
      </a>
      <h1 className="settingsHeading">Messages</h1>

      <br></br>
      <br></br>
      <div className="homeCard">
        <a href="/" className="nextMessage">
          <IoChatbubblesOutline
            size={27}
            style={{ marginBottom: '2px' }}
          ></IoChatbubblesOutline>
        </a>
        <a href="/allmessages" style={{ marginLeft: '20px' }}>
          <span>All Messages</span>
          <IoIosArrowForward
            style={{ marginTop: '6px', float: 'right', marginRight: '10%' }}
          ></IoIosArrowForward>
        </a>
        <hr className="divider3" />
        <a href="/" className="nextMessage">
          <IoTrashBinOutline
            size={25}
            style={{ marginBottom: '2px' }}
          ></IoTrashBinOutline>
        </a>
        <a href="/junk" style={{ marginLeft: '20px' }}>
          <span>Junk</span>
          <IoIosArrowForward
            style={{ marginTop: '6px', float: 'right', marginRight: '10%' }}
          ></IoIosArrowForward>
        </a>
      </div>
      <br />
    </div>
  );
}

export default Home;

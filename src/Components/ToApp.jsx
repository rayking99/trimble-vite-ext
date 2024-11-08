import './../App.css';
import Connect from './Connect';
import Coloured from './Coloured';
import Snapshot from './Snapshot';
// import OtherComponent from './Components/OtherComponent'; // Assume this is any other component that will use the API object

function ToApp() {
  return (
    <>
      <Connect>
        <h1>Playing</h1>
        <Coloured />
        <Snapshot />
        {/* <OtherComponent /> */}
      </Connect>
    </>
  );
}

export default ToApp;

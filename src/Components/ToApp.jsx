import './../App.css';
import Connect from './Connect';
import Coloured from './Coloured';
import Snapshot from './Snapshot';
import ObjectSearch from './ObjectSearch';

function ToApp() {
  return (
    <>
      <Connect>
        <h1>TCEXT</h1>
        <ObjectSearch />
        <Coloured />
        <Snapshot />
        {/* <OtherComponent /> */}
      </Connect>
    </>
  );
}

export default ToApp;
import { useState, useContext } from "react";
import ApiContext from "./ApiContext";

const Snapshot = () => {
  const api = useContext(ApiContext);
  const [imageUrl, setImageUrl] = useState(null);

  async function takeAPicture() {
    const snapshotUrl = await api.viewer.getSnapshot();
    // A Promise which resolves to a Data URL string containing a base64 encoded image.
    console.log(snapshotUrl);
    setImageUrl(snapshotUrl);
  }

  return (
    <div>
      <button
        onClick={takeAPicture}
        style={{
          color: "orange",
          backgroundColor: "black",
          padding: "10px",
          borderRadius: "5px",
          border: "none",
        }}
      >
        Take Picture
      </button>
      {/* fit the snapshot to the width of the panel */}
      {imageUrl && (
        <img src={imageUrl} alt="Snapshot" style={{ width: "100%" }} />
      )}
    </div>
  );
};

export default Snapshot;

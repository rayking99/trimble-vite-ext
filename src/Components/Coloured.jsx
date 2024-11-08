import { useContext, useState } from "react";
import ApiContext from "./ApiContext";

const Coloured = () => {
  const [colouredObjects, setColouredObjects] = useState([]);
  const [totalObjects, setTotalObjects] = useState(0);

  const api = useContext(ApiContext);

  async function getColouredObjects() {
    const models = await api.viewer.getColoredObjects();
    console.log(models);

    let allObjects = [];
    models.forEach(model => {
      allObjects = allObjects.concat(model.objects);
    });

    setColouredObjects(allObjects);
    setTotalObjects(allObjects.length);
  }

  return (
    <div>
      <button onClick={getColouredObjects}
      style={{
        color: "orange",
        backgroundColor: "black",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
      }}
      
      >Get Coloured Objects</button>
      <p>THERE ARE {totalObjects} COLOURED OBJECTS!</p>
      <div>
        {colouredObjects.map((object) => (
          <div key={object.id} style={{ color: object.color }}>
            {object.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coloured;
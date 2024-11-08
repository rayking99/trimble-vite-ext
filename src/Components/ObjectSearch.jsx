// ObjectSearch.jsx
import { useState, useContext, useEffect } from "react";
import ApiContext from "./ApiContext";
import "./ObjectSearch.css";

const ObjectSearch = () => {
  const api = useContext(ApiContext);
  const [searchStrings, setSearchStrings] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const allowedKeys = ["Type", "Label", "PID"];
  const filterOptions = ["Type", "Label", "PID"];

  useEffect(() => {
    console.log("Initializing ObjectSearch component");
    refreshSearchStrings();
  }, []);

  useEffect(() => {
    if (hasSearched) {
      console.log("Updating search results");
      setSearchResults(filterSearchResults());
    }
  }, [searchQuery, searchStrings, hasSearched]);

  const refreshSearchStrings = async () => {
    try {
      console.log("Fetching visible elements");
      const visibleElements = await api.viewer.getObjects("visible");
      const selector = visibleElements.map((elem) => ({
        modelId: elem.modelId,
        objectIds: elem.objects.map((obj) => obj.id),
      }));

      const searchElements = [];
      for (const sel of selector) {
        console.log(`Fetching properties for modelId: ${sel.modelId}`);
        const objProps = await api.viewer.getObjectProperties(sel.modelId, sel.objectIds);
        const dictObjProps = objProps.map((obj) => {
          const propsDict = obj.properties.reduce((acc, prop) => {
            if (prop.properties) {
              prop.properties.forEach((p) => {
                if (allowedKeys.includes(p.name)) acc[p.name] = p.value;
              });
            } else {
              if (allowedKeys.includes(prop.name)) acc[prop.name] = prop.value;
            }
            return acc;
          }, {});
          return { modelId: sel.modelId, objId: obj.id, propsDict };
        });
        searchElements.push(...dictObjProps);
      }
      setSearchStrings(searchElements);
      console.log("Search strings:", searchElements);
    } catch (error) {
      console.error("Error fetching objects:", error);
    }
  };

  const filterSearchResults = () => {
    console.log(`Filtering results with query: "${searchQuery}"`);
    if (!searchQuery) return [];
    const filtered = searchStrings.filter(({ propsDict }) =>
      Object.values(propsDict).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    // Ensure uniqueness based on 'Type'
    const unique = [];
    const seen = new Set();
    filtered.forEach((item) => {
      const key = item.propsDict.Type;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    });

    console.log("Unique filtered results:", unique);
    return unique;
  };

  async function selectObjects(selectorObj) {
    const currentSelection = await api.viewer.getSelection();
    await api.viewer.setSelection(currentSelection, "remove");
    for (const NEL_Type in selectorObj) {
      for (const modelId in selectorObj[NEL_Type]) {
        const selector = {
          modelObjectIds: [
            {
              modelId: modelId,
              objectRuntimeIds: selectorObj[NEL_Type][modelId],
              recursive: false,
            },
          ],
          output: {
            loadProperties: false,
          },
          selected: false,
        };

        const response = await api.viewer.setSelection(selector, "add");
        console.log("Response:", response);
      }
    }
  }

  const handleSearchInputChange = (e) => {
    console.log("Search input changed:", e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted with query:", searchQuery);
    setHasSearched(true);
    setSearchResults(filterSearchResults());
  };

  const handleSelect = async (obj) => {
    console.log("Selecting objects with Type:", obj.propsDict.Type);
    const matchingObjects = searchStrings.filter(
      (item) => item.propsDict.Type === obj.propsDict.Type
    );
    const selectorObj = {};

    matchingObjects.forEach((item) => {
      if (!selectorObj[item.propsDict.Type]) {
        selectorObj[item.propsDict.Type] = {};
      }
      if (!selectorObj[item.propsDict.Type][item.modelId]) {
        selectorObj[item.propsDict.Type][item.modelId] = [];
      }
      selectorObj[item.propsDict.Type][item.modelId].push(item.objId);
    });

    await selectObjects(selectorObj);
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit} className="form-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search..."
        />
        <button type="submit">Search</button>
      </form>
      <hr />
      {hasSearched && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {filterOptions.map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((obj) => (
                <tr key={obj.propsDict.Type}>
                  {filterOptions.map((key) => (
                    <td key={key}>{obj.propsDict[key]}</td>
                  ))}
                  <td>
                    <button onClick={() => handleSelect(obj)}>&rarr;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <hr />
    </div>
  );
}

export default ObjectSearch;
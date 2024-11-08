import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as WorkspaceAPI from "trimble-connect-workspace-api";
import { ApiProvider } from "./ApiContext";

const Connect = ({ children }) => {
  const [api, setAPI] = useState(null);

  useEffect(() => {
    async function connectToWorkspace() {
      const api = await WorkspaceAPI.connect(window.parent, () => {}, 30000);
      setAPI(api);
    }
    connectToWorkspace();
  }, []);

  return <ApiProvider value={api}>{children}</ApiProvider>;
};

Connect.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Connect;

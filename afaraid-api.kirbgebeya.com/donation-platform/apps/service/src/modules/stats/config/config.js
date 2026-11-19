import { configs as dbConfigs } from "../../../config/db.js";

const configs = {
  development: { ...dbConfigs.development },
  test: { ...dbConfigs.test },
  production: { ...dbConfigs.production },
};

export default configs;

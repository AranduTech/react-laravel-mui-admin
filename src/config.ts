import configInstance from "./internals/singletons/Config";

const config = configInstance.config.bind(configInstance);

export default config;


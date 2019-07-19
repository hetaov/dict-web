
const database = process.env.NODE_ENV;
const config = {
  unit: 'dict-unit',
  production: 'dict-production',
  development: 'dict-local',
};
export default config[database] ? config[database] : config.development;

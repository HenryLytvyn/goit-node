import getEnvVar from './getEnvVar.js';

export default function getEnvBool(name, defaultValue) {
  const value = getEnvVar(name, defaultValue);
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Process.env['${name}'] should be boolean type`);
}

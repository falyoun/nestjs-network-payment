
export interface NgeniusModuleInterface {
  ngeniusApiKey: string;
  outletReference: string;
}
export interface EnvironmentVariables {
  port: number;
  ngeniusModuleInterface: NgeniusModuleInterface;
}

export default (): EnvironmentVariables => ({
  port: +process.env.PORT,
  ngeniusModuleInterface: {
    ngeniusApiKey: process.env.NGENIUS_API_KEY,
    outletReference: process.env.NGENIUS_OUTLET_REFERENCE,
  }
});

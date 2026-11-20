type CarInfo = {
  id: number;
  brand: string;
  model: string;
  year: number;
  color: string;
  image: string;
  countryCode: string;
  generation: string;
};

type CarSpecs = {
  type: string;
  engine: string;
  engineLayout: string;
  valves: number;
  valvetrain: string;
  displacement: number; // L
  traction: string;
  aspiration: string;
  weight: number[]; // [kg, lb]
  transmission: string;
  wheels: string;
  steering: string;
  brakes: string;
};

type CarPerformance = {
  torque: number[]; // [Nm, RPM]
  topSpeed: number[]; // [km/h, mph]
  acceleration: number; // 0-100 km/h, em s
  hp: number;
  consumption: number; // km/L
};

type CarRules = {
  allowAWD: boolean;
  allowNOS: boolean;
  allowedAspirations: string[];
  canChangeTraction: boolean;
  maxHP: number;
};

type CarHistory = {
  curiosities: string[];
  appearances: string[];
};

export interface Car {
  info: CarInfo;
  specs: CarSpecs;
  performance: CarPerformance;
  rules: CarRules;
  history: CarHistory;
}

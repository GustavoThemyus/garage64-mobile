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
  weight: number[]; // Kg (lb)
  transmission: string;
  wheels: string;
  direction: string;
  brakes: string;
};

type CarPerformance = {
  torque: number[]; // [Nm], [RPM]
  topSpeed: number[]; // ~(number)km/h (~(number)mph)
  acceleration: number; // 0-100km/h ~(number)s
  hp: number; // HP
  consumption: number; // ~(number)Km/L
};

type CarRules = {
  allowAWD: boolean;
  allowNOS: boolean;
  allowedAspirations: string[];
  canChangeTraction: boolean;
  maxHP: number; // ~(number) HP
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

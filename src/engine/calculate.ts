import { ASPIRATIONS, findPartOption } from "../data/partsCatalog";
import { BuildConfig, CalculatedBuild, PartField } from "../types/build";
import { Car } from "../types/car";
import { getFactoryConfig } from "./config";

// Modelo de cálculo da v1. Não são dados reais de performance (spec 12): é um
// modelo simples e previsível. Toda fórmula é uma RAZÃO em relação à configuração
// de fábrica, então a configuração de fábrica reproduz o mock exatamente.
//
//   hp          = hpBase x (cilindrada/base)^0.9 x (aspiração/base) x (válvulas/base)^0.3 x NOS
//   torque      = torqueBase x (hp/hpBase)^0.95
//   peso        = pesoBase + 55 kg por litro extra + equipamento + peças + AWD
//   topSpeed    = topSpeedBase x (hp/hpBase)^(1/3)        (limitada pelo arrasto)
//   0-100       = tempoBase x sqrt((peso/hp)/(pesoBase/hpBase)) x câmbio x tração
//   consumo     = consumoBase / (cilindrada^0.8 x aspiração x (peso/base)^0.3 x peças)

const NOS_POWER_FACTOR = 1.12;
const WEIGHT_PER_EXTRA_LITER = 55;
const AWD_WEIGHT = 70;
const AWD_LAUNCH_GAIN = 0.95;
const AWD_LAUNCH_LOSS = 1.06;
const PART_FIELDS: PartField[] = ["transmission", "wheels", "steering", "brakes"];

export function calculateBuild(car: Car, config: BuildConfig): CalculatedBuild {
  const factory = getFactoryConfig(car);
  const base = car.performance;
  const baseWeight = car.specs.weight[0];

  const displacementRatio = config.displacement / car.specs.displacement;
  const valvesRatio =
    car.specs.valves > 0 ? config.valves / car.specs.valves : 1;
  const aspiration = ASPIRATIONS[config.aspiration];
  const factoryAspiration = ASPIRATIONS[factory.aspiration];

  const parts = PART_FIELDS.map((field) =>
    findPartOption(car, field, config[field]),
  );
  const partsWeight = parts.reduce((sum, part) => sum + part.weightDelta, 0);
  const accelerationParts = parts.reduce(
    (product, part) => product * part.accelerationFactor,
    1,
  );
  const consumptionParts = parts.reduce(
    (product, part) => product * part.consumptionFactor,
    1,
  );

  const hp =
    base.hp *
    displacementRatio ** 0.9 *
    (aspiration.power / factoryAspiration.power) *
    valvesRatio ** 0.3 *
    (config.nos ? NOS_POWER_FACTOR : 1);

  const awdChanged = config.awd !== factory.awd;
  const awdWeight = awdChanged ? (config.awd ? AWD_WEIGHT : -AWD_WEIGHT) : 0;
  const awdLaunch = awdChanged
    ? config.awd
      ? AWD_LAUNCH_GAIN
      : AWD_LAUNCH_LOSS
    : 1;

  const weightKg =
    baseWeight +
    (config.displacement - car.specs.displacement) * WEIGHT_PER_EXTRA_LITER +
    (aspiration.weight - factoryAspiration.weight) +
    partsWeight +
    awdWeight;

  const powerRatio = hp / base.hp;
  const topSpeedRatio = powerRatio ** (1 / 3);

  const acceleration =
    base.acceleration *
    Math.sqrt(weightKg / hp / (baseWeight / base.hp)) *
    accelerationParts *
    awdLaunch;

  const consumption =
    base.consumption /
    (displacementRatio ** 0.8 *
      (aspiration.consumption / factoryAspiration.consumption) *
      (weightKg / baseWeight) ** 0.3 *
      consumptionParts);

  return {
    weightKg: Math.round(weightKg),
    performance: {
      hp: Math.round(hp),
      torque: [Math.round(base.torque[0] * powerRatio ** 0.95), base.torque[1]],
      topSpeed: [
        Math.round(base.topSpeed[0] * topSpeedRatio),
        Math.round(base.topSpeed[1] * topSpeedRatio),
      ],
      acceleration: Math.round(acceleration * 10) / 10,
      consumption: Math.round(consumption * 10) / 10,
    },
  };
}

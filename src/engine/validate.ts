import { ASPIRATIONS } from "../data/partsCatalog";
import { BuildConfig, BuildWarning } from "../types/build";
import { Car } from "../types/car";
import { normalizeAspiration } from "./aspiration";
import { calculateBuild } from "./calculate";
import { getFactoryConfig } from "./config";

// Valida a build contra as regras do próprio carro (car.rules, spec 5.3).
// Nunca bloqueia: configuração inválida vira aviso e pode ser salva com ele.
export function validateBuild(car: Car, config: BuildConfig): BuildWarning[] {
  const { rules } = car;
  const factory = getFactoryConfig(car);
  const warnings: BuildWarning[] = [];

  const tractionChanged = config.awd !== factory.awd;

  if (config.awd && !factory.awd && !rules.allowAWD) {
    warnings.push({
      code: "awd-not-supported",
      message: `The ${car.info.model} does not support all-wheel drive.`,
    });
  }

  if (tractionChanged && !rules.canChangeTraction) {
    warnings.push({
      code: "traction-change-not-allowed",
      message: "This car does not allow changing its traction layout.",
    });
  }

  if (config.nos && !rules.allowNOS) {
    warnings.push({
      code: "nos-not-supported",
      message: "The engine is not reinforced for nitrous oxide.",
    });
  }

  const allowed = rules.allowedAspirations
    .map(normalizeAspiration)
    .filter((id) => id !== null);
  if (!allowed.includes(config.aspiration)) {
    warnings.push({
      code: "aspiration-not-allowed",
      message: `${ASPIRATIONS[config.aspiration].label} is not supported on this engine.`,
    });
  }

  const { performance } = calculateBuild(car, config);
  if (performance.hp > rules.maxHP) {
    warnings.push({
      code: "hp-over-limit",
      message: `About ${performance.hp} HP is above the ${rules.maxHP} HP this car can handle.`,
    });
  }

  return warnings;
}

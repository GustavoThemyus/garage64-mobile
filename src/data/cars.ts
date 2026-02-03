import { Car } from "../types/car";

export const cars: Car[] = [
  {
    // Skyline
    info: {
      id: 1,
      brand: "Nissan",
      model: "Skyline GT-R R34",
      year: 1999,
      color: "Bayside Blue",
      image:
        "https://www.solido.com/wp-content/uploads/2020/12/s1804301-nissan-r34-gtr-bayside-blue-1999-01.jpg",
      countryCode: "JP",
      generation: "10th Gen",
    },
    specs: {
      type: "Sports coupe",
      engine: "RB26DETT",
      engineLayout: "I6 (Inline-6)",
      valves: 24,
      valvetrain: "DOHC (belt-driven)",
      displacement: 2.6,
      traction: "4x4 (AWD)",
      aspiration: "Twin-Turbocharged (parallel)",
      weight: 1560,
      transmission: "6-speed manual (Getrag V160)",
      wheels: "18 inch OEM forged alloys (Front 9J / Rear 9J)",
      direction: "Hydraulic rack-and-pinion steering",
      brakes: "Brembo ventilated discs (4-piston front / 2-piston rear)",
    },
    performance: {
      torque: [392, 4400],
      topSpeed: 250,
      acceleration: 4.9,
      hp: 276,
      consumption: 8,
    },
    rules: {
      allowAWD: true,
      allowedAspirations: ["Single-Turbo", "Twin-Turbo"],
      canChangeTraction: false,
      maxHP: 1000,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Supra
    info: {
      id: 2,
      brand: "Toyota",
      model: "Supra MK4",
      year: 2001,
      color: "White",
      image:
        "https://www.solido.com/wp-content/uploads/2023/12/toyota-supra-mk-4-01.jpg",
      countryCode: "JP",
      generation: "4th Gen",
    },
    specs: {
      type: "Sports Coupe (GT)",
      engine: "2JZ-GTE",
      engineLayout: "I6 (Inline-6)",
      valves: 24,
      valvetrain: "DOHC (chain-driven)",
      displacement: 3.0,
      traction: "4x2 (RWD)",
      aspiration: "Sequential Twin-Turbocharged",
      weight: 1490,
      transmission: "6-speed manual (Getrag V160)",
      wheels: "17 inch OEM alloy (Front 8J / Rear 9J)",
      direction: "Hydraulic rack-and-pinion steering",
      brakes: "Ventilated disc brakes (4-piston front / 2-piston rear)",
    },
    performance: {
      torque: [451, 3600],
      topSpeed: 250,
      acceleration: 4.9,
      hp: 276,
      consumption: 7,
    },
    rules: {
      allowAWD: true,
      allowedAspirations: ["Turbo", "Twin-Turbo"],
      canChangeTraction: false,
      maxHP: 1000,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Porsche 911
    info: {
      id: 3,
      brand: "Porsche",
      model: "911 Carrera",
      year: 1994,
      color: "Red",
      image:
        "https://www.solido.com/wp-content/uploads/2025/09/s1810104-porsche-911-993-carrera-rs-indischrot-1997-01-600x399.jpg",
      countryCode: "DE",
      generation: "964 Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "M64/04",
      engineLayout: "F6 (Flat-6 / Boxer)",
      valves: 12,
      valvetrain: "SOHC (per bank), chain-driven",
      displacement: 3.8,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1210,
      transmission: "5-speed manual (G50/10)",
      wheels: "18 inch magnesium Speedline (Front 9J / Rear 11J)",
      direction: "Manual rack-and-pinion (no power steering)",
      brakes:
        "Ventilated discs (Big Red 4-piston calipers, derived from 964 Turb)",
    },
    performance: {
      torque: [360, 5250],
      topSpeed: 280,
      acceleration: 4.5,
      hp: 296,
      consumption: 6,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA Only"],
      canChangeTraction: false,
      maxHP: 420,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 4,
      brand: "Ford",
      model: "Mustang Shelby",
      year: 1967,
      color: "Black / Gold Stripes",
      image:
        "https://www.solido.com/wp-content/uploads/2023/01/1-18-shelby-gt500-black-gold-stripes-black-1967-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Muscle car",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 5,
      brand: "Honda",
      model: "Civic EG6",
      year: 1991,
      color: "White",
      image:
        "https://www.solido.com/wp-content/uploads/2024/06/1-18-honda-civic-eg6-white-1991-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 6,
      brand: "Mazda",
      model: "RX7",
      year: 1999,
      color: "Neon Green",
      image:
        "https://www.solido.com/wp-content/uploads/2026/02/1-18-mazda-rx7-fd3rs-solido-works-neon-green-1999-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 7,
      brand: "BMW",
      model: "E36 Coupé M3",
      year: 1999,
      color: "Blue",
      image:
        "https://www.solido.com/wp-content/uploads/2024/10/1-43-bmw-e36-coupe-m3-blue-1999-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 8,
      brand: "Subaru",
      model: "Impreza 22B",
      year: 1998,
      color: "Black",
      image:
        "https://www.solido.com/wp-content/uploads/2024/11/1-18-subaru-impreza-22b-black-1998-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 9,
      brand: "Mercedes-Benz",
      model: "560 SEC AMG",
      year: 1990,
      color: "Blue",
      image:
        "https://www.solido.com/wp-content/uploads/2022/09/mercedes-benz-560-sec-amg-wide-body-signal-red-1990-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 10,
      brand: "Nissan",
      model: "Silvia S15 Spec-R",
      year: 1999,
      color: "Light Green",
      image:
        "https://www.solido.com/wp-content/uploads/2025/06/s1812203-nissan-silvia-s15-spec-r-aero-solido-works-1999-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 11,
      brand: "Aston Martin",
      model: "Aston Martin DB5",
      year: 1964,
      color: "Metallic Red",
      image:
        "https://www.solido.com/wp-content/uploads/2024/10/s1807103-aston-martin-db5-metallic-red-1964-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 12,
      brand: "Opel",
      model: "Omega 3000",
      year: 1990,
      color: "Magmarot Red",
      image:
        "https://www.solido.com/wp-content/uploads/2024/06/1-18-opel-omega-3000-24v-red-1990-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 13,
      brand: "McLaren",
      model: "F1 GT-R",
      year: 1996,
      color: "Orange Papaya",
      image:
        "https://www.solido.com/wp-content/uploads/2021/11/s1804104-mclaren-f1-gt-r-orange-papaya-1996-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },

  {
    // Mustang
    info: {
      id: 14,
      brand: "Alpine",
      model: "Alpine A110 1600S",
      year: 1967,
      color: "Red",
      image:
        "https://www.solido.com/wp-content/uploads/2024/06/1-18-alpine-a110-1600s-red-1969-01.jpg",
      countryCode: "US",
      generation: "1st Gen",
    },
    specs: {
      type: "Sports Coupe",
      engine: "FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: 1700,
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: 215,
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowedAspirations: ["NA only"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: "Knowed as 'Godzilla'...",
      appearances: [
        "Fast & Furious",
        "Forza Horizon Series",
        "Need for Speed Series",
      ],
    },
  },
];

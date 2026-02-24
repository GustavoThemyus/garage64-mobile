import { Car } from "../types/car";
import { filterCars } from "./filterCars";

export const carsMoch: Car[] = [
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
      generation: "10th Gen (R34, 1999 - 2002)",
    },
    specs: {
      type: "Sports Coupe",
      engine: "Nissan RB26DETT",
      engineLayout: "I6 (Inline-6)",
      valves: 24,
      valvetrain: "DOHC (belt-driven)",
      displacement: 2.6,
      traction: "4x4 (AWD)",
      aspiration: "Twin-Turbocharged (parallel)",
      weight: [1560, 3395],
      transmission: "6-speed manual (Getrag V160)",
      wheels: "18 inch OEM forged alloys (Front 9J / Rear 9J)",
      direction: "Hydraulic rack-and-pinion steering",
      brakes: "Brembo ventilated discs (4-piston front / 2-piston rear)",
    },
    performance: {
      torque: [392, 4400],
      topSpeed: [250, 155],
      acceleration: 4.9,
      hp: 276,
      consumption: 8,
    },
    rules: {
      allowAWD: true,
      allowNOS: true,
      allowedAspirations: ["Single-Turbo", "Twin-Turbo"],
      canChangeTraction: false,
      maxHP: 1000,
    },
    history: {
      curiosities: [
        "Known as 'Godzilla', the R34 introduced the famous Multi-Function Display (MFD) developed with assistance from engineers connected to Polyphony Digital, showing real-time engine and driving telemetry.",
        "ATTESA E-TS AWD normally sends most power to the rear, behaving like an RWD car until slip is detected.",
        "Despite the official 280 PS limit from Japan's “gentlemen's agreement,” real output is widely believed to be higher.",
        "The RB26 is known for its iron block strength and ability to handle extreme boost levels.",
      ],
      appearances: [
        "2 Fast 2 Furious (Driven by Brian O'Conner.",
        "Gran Turismo",
        "Need for Speed",
        "Forza",
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
      generation: "4th Gen (A80, 1993 - 2002)",
    },
    specs: {
      type: "Sports Coupe",
      engine: "Toyota 2JZ-GTE",
      engineLayout: "I6 (Inline-6)",
      valves: 24,
      valvetrain: "DOHC (chain-driven)",
      displacement: 3.0,
      traction: "4x2 (RWD)",
      aspiration: "Sequential Twin-Turbocharged",
      weight: [1490, 3285],
      transmission: "6-speed manual (Getrag V160)",
      wheels: "17 inch OEM alloy (Front 8J / Rear 9J)",
      direction: "Hydraulic rack-and-pinion steering",
      brakes: "Ventilated disc brakes (4-piston front / 2-piston rear)",
    },
    performance: {
      torque: [451, 3600],
      topSpeed: [250, 155],
      acceleration: 4.9,
      hp: 276,
      consumption: 7,
    },
    rules: {
      allowAWD: true,
      allowNOS: true,
      allowedAspirations: ["Turbo", "Twin-Turbo"],
      canChangeTraction: false,
      maxHP: 1000,
    },
    history: {
      curiosities: [
        "The 2JZ-GTE became one of the most respected performance engines ever due to its closed-deck iron block and massively overbuilt internals.",
        "Sequential twin turbos deliver strong low-end torque while maintaining top-end power.",
        "The A80 Supra emphasized aerodynamic efficiency, featuring a very low drag coefficient (~0.31).",
        "Official horsepower was capped by Japan's 280 PS agreement, but real output is widely believed to exceed that figure.",
      ],
      appearances: [
        "The Fast and the Furious (2001), as Brian O'Conner's orange Supra.",
        "Gran Turismo",
        "Need for Speed",
        "Forza",
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
      generation: "964 Gen 911 (1989 - 1994)",
    },
    specs: {
      type: "Sports Coupe",
      engine: "Porsche M64/04",
      engineLayout: "F6 (Flat-6 / Boxer)",
      valves: 12,
      valvetrain: "SOHC (per bank), chain-driven",
      displacement: 3.8,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: [1210, 2680],
      transmission: "5-speed manual (G50/10)",
      wheels: "18 inch magnesium Speedline (Front 9J / Rear 11J)",
      direction: "Manual rack-and-pinion (no power steering)",
      brakes:
        "Ventilated discs (Big Red 4-piston calipers, derived from 964 Turbo)",
    },
    performance: {
      torque: [360, 5250],
      topSpeed: [280, 174],
      acceleration: 4.5,
      hp: 296,
      consumption: 6,
    },
    rules: {
      allowAWD: false,
      allowNOS: false,
      allowedAspirations: ["Naturally Aspirated"],
      canChangeTraction: false,
      maxHP: 420,
    },
    history: {
      curiosities: [
        "Built primarily for homologation, with roughly 90-100 units produced, making it one of the rarest air-cooled 911 variants.",
        "Features seam-welded chassis reinforcement, thinner glass, aluminum panels, and minimal sound insulation.",
        "Uses a race-derived version of the M64 engine, closely related to the Carrera Cup competition motor.",
        "Deletes most comfort equipment, including rear seats and power steering, emphasizing driver skill and mechanical feedback.",
      ],
      appearances: [
        "Not a mainstream car, but highly respected in collector auctions",
        "Appears in high-end simulators and racing titles such as Gran Turismo",
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
      engine: "Ford FE 428 Police Interceptor",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "OHV (pushrod)",
      displacement: 7.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: [1700, 3750],
      transmission: "4-speed manual (Toploader)",
      wheels: "15 inch steel or styled steel wheels",
      direction: "Recirculating ball steering (power-assisted optional)",
      brakes: "Front disc / rear drum (power brakes optional)",
    },
    performance: {
      torque: [569, 3200],
      topSpeed: [215, 137],
      acceleration: 6.5,
      hp: 355,
      consumption: 4,
    },
    rules: {
      allowAWD: false,
      allowNOS: true,
      allowedAspirations: ["Naturally Aspirated"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: [
        "The 1967 Mustang Shelby GT-500 is essentially the peak of human evolution, it's the only machine capable of making a grown man weep with joy while simultaneously making his insurance agent weep in terror. If God had a mid-life crisis, he wouldn't buy a Porsche, he'd buy a 1967 Shelby, just to prove he still has better taste than the rest of us.",
        "The 1967 Shelby GT-500 is the automotive equivalent of dropping a live grenade into a library, it makes everything else look painfully boring, slow, and overly engineered, proving that human beings peaked in 1967 and have just been adjusting fuel injection ever since.",
        "The 1967 Shelby GT-500 is essentially what happens when God decides to apologize for the existence of the minivan. It is less of a car and more of a geological event fueled by gasoline and the sheer audacity of Carroll Shelby. Driving one isn't a commute, it's a high-stakes negotiation with physics where the exhaust note does all the talking and your neighbors do all the crying. It is, quite frankly, the peak of human achievement—everything we've invented since, from the internet to sliced bread, has just been a desperate attempt to distract ourselves from the fact that we'll never top this.",
      ],
      appearances: [
        "Frequently featured in classic car media and American muscle documentaries.",
        "Appears across numerous racing games including Gran Turismo and Forza.",
        "The Shelby Mustang line became one of the strongest symbols of the 1960s muscle car era.",
      ],
    },
  },

  {
    // Civic
    info: {
      id: 5,
      brand: "Honda",
      model: "Civic EG6",
      year: 1991,
      color: "White",
      image:
        "https://www.solido.com/wp-content/uploads/2024/06/1-18-honda-civic-eg6-white-1991-01.jpg",
      countryCode: "JP",
      generation: "5th Gen (EG chassis, 1991 - 1995)",
    },
    specs: {
      type: "Hatchback",
      engine: "Honda B16A",
      engineLayout: "I4 (Inline-4)",
      valves: 16,
      valvetrain: "DOHC VTEC, belt-driven",
      displacement: 1.6,
      traction: "4x2 (FWD)",
      aspiration: "Naturally Aspirated",
      weight: [1050, 2315],
      transmission: "5-speed manual",
      wheels: "15 inch OEM alloy (Front 6J / Rear 6J)",
      direction:
        "Rack-and-pinion steering (manual or hydraulic assist depending on spec)",
      brakes: "Front ventilated discs / rear solid discs",
    },
    performance: {
      torque: [150, 7000],
      topSpeed: [215, 134],
      acceleration: 7.2,
      hp: 168,
      consumption: 11,
    },
    rules: {
      allowAWD: false,
      allowNOS: true,
      allowedAspirations: ["Naturally Aspirated", "Single Turbo"],
      canChangeTraction: false,
      maxHP: 400,
    },
    history: {
      curiosities: [
        "The EG6 SiR was one of the first compact cars to deliver 100+ hp per liter naturally aspirated, a major engineering milestone in the early 1990s.",
        "Featured factory VTEC, allowing a high redline near 8,200 rpm — unusually high for its era.",
        "Double-wishbone suspension on all four corners gave it handling superior to many larger sports cars.",
        "Extremely popular in Japanese street racing culture and later became a global tuning icon.",
      ],
      appearances: ["Gran Turismo", "Forza Motorsport"],
    },
  },

  {
    // Mazda
    info: {
      id: 6,
      brand: "Mazda",
      model: "RX7",
      year: 1999,
      color: "Neon Green",
      image:
        "https://www.solido.com/wp-content/uploads/2026/02/1-18-mazda-rx7-fd3rs-solido-works-neon-green-1999-01.jpg",
      countryCode: "JP",
      generation: "3rd Gen (FD3S, 1992 - 2002",
    },
    specs: {
      type: "Sports Coupe",
      engine: "Mazda 13B-REW",
      engineLayout: "Rotary (2-rotor)",
      valves: 0,
      valvetrain: "N/A (rotary ports)",
      displacement: 2.6,
      traction: "4x2 (RWD)",
      aspiration: "Sequential Twin-Turbocharged",
      weight: [1270, 2800],
      transmission: "5-speed manual",
      wheels: "17 inch OEM alloy (Front 8J / Rear 8.5J)",
      direction: "Rack-and-pinion, hydraulic",
      brakes: "Ventilated discs (4-piston front / 2-piston rear)",
    },
    performance: {
      torque: [294, 5000],
      topSpeed: [250, 155],
      acceleration: 5.1,
      hp: 276,
      consumption: 6,
    },
    rules: {
      allowAWD: false,
      allowNOS: false,
      allowedAspirations: ["Naturally Aspirated", "Single Turbo", "Twin Turbo"],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: [
        "The RX-7 FD was the first mass-produced car to use a sequential twin-turbo system on a rotary engine.",
        "Known for near 50:50 weight distribution and extremely low polar moment, producing legendary steering precision.",
        "Rotary engines are compact and rev smoothly but demand strict maintenance (oil metering, cooling, apex seals).",
        "The 1999 models belong to the final evolution of the FD, benefiting from chassis and reliability refinements.",
      ],
      appearances: [
        "The Fast and the Furious: Tokyo Drift (Han's RX-7)",
        "Gran Turismo",
        "Forza",
        "Need for Speed",
      ],
    },
  },

  {
    // BMW
    info: {
      id: 7,
      brand: "BMW",
      model: "E36 Coupé M3",
      year: 1999,
      color: "Blue",
      image:
        "https://www.solido.com/wp-content/uploads/2024/10/1-43-bmw-e36-coupe-m3-blue-1999-01.jpg",
      countryCode: "DE",
      generation: "3rd Gen M3 (E36, 1992 - 1999)",
    },
    specs: {
      type: "Grand Tourer",
      engine: "BMW S50B32",
      engineLayout: "I6 (Inline-6)",
      valves: 24,
      valvetrain: "DOHC, Double VANOS, chain-driven",
      displacement: 3.2,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: [1460, 3220],
      transmission: "6-speed manual (Getrag 420G)",
      wheels: "17 inch OEM forged alloy (Front ~7.5J / Rear ~8.5J)",
      direction: "Hydraulic rack-and-pinion steering",
      brakes: "Ventilated discs front and rear with ABS",
    },
    performance: {
      torque: [350, 3250],
      topSpeed: [250, 155],
      acceleration: 5.4,
      hp: 316,
      consumption: 8,
    },
    rules: {
      allowAWD: false,
      allowNOS: false,
      allowedAspirations: [
        "Naturally Aspirated",
        "Supercharged",
        "Single Turbo",
      ],
      canChangeTraction: false,
      maxHP: 600,
    },
    history: {
      curiosities: [
        "The European-spec M3 used individual throttle bodies and advanced variable valve timing (Double VANOS), making it one of the most technologically sophisticated NA engines of the 1990s.",
        "Redline approaches 8,000 rpm, unusually high for a 3.2L engine of its era.",
        "Often praised for having one of the best handling balances ever engineered in a road car.",
        "The US-market M3 differed significantly, using the less powerful S52 engine (~240 hp).",
      ],
      appearances: ["Gran Turismo", "Forza Motorsport", "Need for Speed"],
    },
  },

  {
    // Impreza
    info: {
      id: 8,
      brand: "Subaru",
      model: "Impreza 22B",
      year: 1998,
      color: "Black",
      image:
        "https://www.solido.com/wp-content/uploads/2024/11/1-18-subaru-impreza-22b-black-1998-01.jpg",
      countryCode: "JP",
      generation: "1st Gen Impreza (GC8, 1992 - 2000)",
    },
    specs: {
      type: "Sports Coupe",
      engine: "Subaru EJ22G",
      engineLayout: "F4 (Flat-4 / Boxer)",
      valves: 16,
      valvetrain: "DOHC, belt-driven",
      displacement: 2.2,
      traction: "4x4 (AWD - Symmetrical AWD)",
      aspiration: "Single Turbocharged",
      weight: [1270, 2800],
      transmission: "5-speed manual (close-ratio, heavy-duty gearbox)",
      wheels: "17 inch forged BBS (Front ~8J / Rear ~8J)",
      direction: "Hydraulic rack-and-pinion steering",
      brakes: "Ventilated discs with 4-piston front / 2-piston rear calipers",
    },
    performance: {
      torque: [363, 3200],
      topSpeed: [248, 154],
      acceleration: 4.5,
      hp: 276,
      consumption: 7,
    },
    rules: {
      allowAWD: true,
      allowNOS: false,
      allowedAspirations: ["Naturally Aspirated (rare)", "Single Turbo"],
      canChangeTraction: false,
      maxHP: 500,
    },
    history: {
      curiosities: [
        "Built to celebrate Subaru's third consecutive World Rally Championship manufacturers' title and the brand's 40th anniversary.",
        "Production was extremely limited: 400 units for Japan, plus small numbers for export markets, making it one of the rarest Imprezas ever made.",
        "Features widened fenders, unique suspension tuning by Subaru Tecnica International (STI), and a shorter wheelbase feel due to aggressive geometry.",
        "The 2.2L engine was chosen for improved torque and rally durability rather than peak horsepower.",
      ],
      appearances: [
        "Driven by inspiration from Colin McRae.",
        "Gran Turismo",
        "Forza",
        "Need for Speed",
      ],
    },
  },

  {
    // Mercedes
    info: {
      id: 9,
      brand: "Mercedes",
      model: "560 SEC AMG",
      year: 1990,
      color: "Red",
      image:
        "https://www.solido.com/wp-content/uploads/2022/09/mercedes-benz-560-sec-amg-wide-body-signal-red-1990-01.jpg",
      countryCode: "DE",
      generation: "W126 S-Class Coupe (C126, 1981 - 1991)",
    },
    specs: {
      type: "Grand Tourer",
      engine: "Mercedes-Benz M117 V8 (AMG-modified)",
      engineLayout: "V8",
      valves: 16,
      valvetrain: "SOHC, timing chain",
      displacement: 5.5,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: [1700, 3750],
      transmission: "4-speed automatic (reinforced in AMG builds)",
      wheels: "17 AMG Aero / Monoblock alloys",
      direction: "Recirculating ball steering with hydraulic power assist",
      brakes: "Ventilated disc brakes with ABS",
    },
    performance: {
      torque: [500, 4400],
      topSpeed: [280, 174],
      acceleration: 5.5,
      hp: 385,
      consumption: 5,
    },
    rules: {
      allowAWD: false,
      allowNOS: false,
      allowedAspirations: ["Naturally Aspirated"],
      canChangeTraction: false,
      maxHP: 450,
    },
    history: {
      curiosities: [
        "Before Mercedes officially acquired AMG (merger began in the early 1990s), AMG operated as an independent tuner, meaning each car could differ significantly.",
        "The 560 SEC AMG became famous for combining S-Class luxury with supercar-level speed, something rare in the late 1980s.",
        "Known for aggressive widebody kits, deeper air dams, performance cams, ported heads, and custom interiors.",
        "Nicknamed by enthusiasts as one of the original 'autobahn missiles.'",
      ],
      appearances: [
        "Seen in classic car events and collector auctions due to its rarity.",
      ],
    },
  },

  {
    // Silvia
    info: {
      id: 10,
      brand: "Nissan",
      model: "Silvia S15 Spec-R",
      year: 1999,
      color: "Light Green",
      image:
        "https://www.solido.com/wp-content/uploads/2025/06/s1812203-nissan-silvia-s15-spec-r-aero-solido-works-1999-01.jpg",
      countryCode: "JP",
      generation: "7th Gen Silvia (S15, 1999 - 2002)",
    },
    specs: {
      type: "Sports Coupe",
      engine: "Nissan SR20DET",
      engineLayout: "I4 (Inline-4)",
      valves: 16,
      valvetrain: "DOHC, timing chain, VTC (Variable Timing Control on intake)",
      displacement: 2.0,
      traction: "4x2 (RWD)",
      aspiration: "Single Turbocharged (ball-bearing turbo)",
      weight: [1270, 2760],
      transmission: "6-speed manual / 4-speed automatic optional",
      wheels: "17 inch OEM alloy (Front ~7.5J / Rear ~8J)",
      direction: "Hydraulic rack-and-pinion steering",
      brakes: "Ventilated discs (4-piston front / 2-piston rear on Spec-R)",
    },
    performance: {
      torque: [275, 4800],
      topSpeed: [250, 155],
      acceleration: 5.5,
      hp: 247,
      consumption: 9,
    },
    rules: {
      allowAWD: false,
      allowNOS: true,
      allowedAspirations: ["Naturally Aspirated", "Single Turbo"],
      canChangeTraction: false,
      maxHP: 500,
    },
    history: {
      curiosities: [
        "The Spec-R received a ball-bearing turbocharger, improving spool time and throttle response compared to earlier SR20DET versions.",
        "Featured a helical limited-slip differential, greatly enhancing traction during spirited driving.",
        "One of the lightest Japanese turbo sports coupes of its era, contributing to excellent handling balance.",
        "Production ended in 2002, marking the final Silvia, as Nissan never produced a direct successor.",
      ],
      appearances: [
        "Extremely popular in drifting culture",
        "Forza Horizon",
        "Need for Speed",
        "Gran Turismo",
      ],
    },
  },

  {
    // Aston Martin
    info: {
      id: 11,
      brand: "Aston Martin",
      model: "Aston Martin DB5",
      year: 1964,
      color: "Metallic Red",
      image:
        "https://www.solido.com/wp-content/uploads/2024/10/s1807103-aston-martin-db5-metallic-red-1964-01.jpg",
      countryCode: "GB",
      generation: "DB5 (1963 - 1965, evolution of the DB4)",
    },
    specs: {
      type: "Grand Tourer",
      engine: "Aston Martin Tadek Marek Inline-6",
      engineLayout: "I6 (Inline-6)",
      valves: 24,
      valvetrain: "DOHC, timing chain",
      displacement: 4.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: [1530, 3350],
      transmission: "5-speed manual (ZF) / 3-speed automatic optional",
      wheels: "15 chrome wire wheels (knock-off hubs)",
      direction: "Recirculating ball steering",
      brakes: "Servo-assisted disc brakes front and rear (Girling)",
    },
    performance: {
      torque: [390, 4500],
      topSpeed: [233, 142],
      acceleration: 7.0,
      hp: 282,
      consumption: 5,
    },
    rules: {
      allowAWD: false,
      allowNOS: false,
      allowedAspirations: [
        "Naturally Aspirated",
        "Supercharged (rare aftermarket)",
      ],
      canChangeTraction: false,
      maxHP: 350,
    },
    history: {
      curiosities: [
        "The DB5 introduced several luxury features uncommon in the early 1960s, including power windows, reclining seats, and optional air conditioning.",
        "Built using a lightweight Superleggera (Italian for “super light”) body construction method by Carrozzeria Touring.",
        "Considered one of the most beautiful grand tourers ever designed, blending performance with handcrafted luxury.",
        "Only about 1,059 units were produced, enhancing its collector value.",
      ],
      appearances: [
        "Goldfinger (1964), James Bond's car",
        "Thunderball",
        "GoldenEye",
        "Skyfall",
        "No Time to Die",
      ],
    },
  },

  {
    // Omega
    info: {
      id: 12,
      brand: "Opel",
      model: "Omega 3000",
      year: 1990,
      color: "Magmarot Red",
      image:
        "https://www.solido.com/wp-content/uploads/2024/06/1-18-opel-omega-3000-24v-red-1990-01.jpg",
      countryCode: "DE",
      generation: "Omega A (First Generation, 1986 - 1993)",
    },
    specs: {
      type: "Sedan",
      engine: "Opel C30SE",
      engineLayout: "I6 (Inline-6)",
      valves: 24,
      valvetrain: "DOHC, timing chain",
      displacement: 3.0,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: [1450, 3150],
      transmission: "5-speed manual / 4-speed automatic optional",
      wheels: "16 inch OEM alloy",
      direction: "Hydraulic rack-and-pinion steering",
      brakes: "Ventilated front discs / solid rear discs with ABS",
    },
    performance: {
      torque: [260, 4200],
      topSpeed: [240, 149],
      acceleration: 7.5,
      hp: 201,
      consumption: 8,
    },
    rules: {
      allowAWD: false,
      allowNOS: false,
      allowedAspirations: [
        "Naturally Aspirated",
        "Single Turbo",
        "Supercharged",
      ],
      canChangeTraction: false,
      maxHP: 320,
    },
    history: {
      curiosities: [
        "The Omega 3000 served as Opel's flagship performance sedan before the arrival of the Lotus Omega, which pushed the platform into true supercar territory.",
        "Known for combining German executive comfort with strong autobahn performance.",
        "Aerodynamic design helped achieve a relatively low drag coefficient for its class (~0.28-0.30 depending on trim).",
        "Widely used in European highway patrol fleets due to its high-speed stability.",
      ],
      appearances: ["Not popular in mainstrean"],
    },
  },

  {
    // McLaren
    info: {
      id: 13,
      brand: "McLaren",
      model: "F1 GT-R",
      year: 1996,
      color: "Orange Papaya",
      image:
        "https://www.solido.com/wp-content/uploads/2021/11/s1804104-mclaren-f1-gt-r-orange-papaya-1996-01.jpg",
      countryCode: "GB",
      generation: "McLaren F1 (1992 - 1998) — F1 GTR Racing Variant",
    },
    specs: {
      type: "Race Car",
      engine: "BMW S70/2 V12 (race-modified)",
      engineLayout: "V12",
      valves: 48,
      valvetrain: "DOHC, timing chain",
      displacement: 6.1,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: [1050, 2315],
      transmission: "6-speed sequential manual (straight-cut gears)",
      wheels: "18 inch center-lock racing wheels",
      direction: "Unassisted rack-and-pinion steering",
      brakes: "Carbon fiber ventilated racing discs",
    },
    performance: {
      torque: [651, 5200],
      topSpeed: [215, 199],
      acceleration: 3.2,
      hp: 600,
      consumption: 1,
    },
    rules: {
      allowAWD: false,
      allowNOS: false,
      allowedAspirations: ["Naturally Aspirated"],
      canChangeTraction: false,
      maxHP: 650,
    },
    history: {
      curiosities: [
        "Developed when McLaren was persuaded to race the F1 despite it originally being designed purely as a road car.",
        "Won the 1995 24 Hours of Le Mans overall, an extraordinary achievement for a car derived from a production vehicle.",
        "Features a full carbon-fiber monocoque — revolutionary for the early 1990s.",
        "The cockpit maintains the legendary central driving position, improving weight distribution and visibility.",
        "Aerodynamic bodywork, massive cooling ducts, and stripped interior transformed the road-going F1 into a dominant endurance machine.",
      ],
      appearances: [
        "Legendary status in motorsport history, especially tied to the 24 Hours of Le Mans.",
        "Gran Turismo",
        "Forza Motorsport",
      ],
    },
  },

  {
    // Alpine
    info: {
      id: 14,
      brand: "Alpine",
      model: "Alpine A110 1600S",
      year: 1967,
      color: "Red",
      image:
        "https://www.solido.com/wp-content/uploads/2024/06/1-18-alpine-a110-1600s-red-1969-01.jpg",
      countryCode: "FR",
      generation: "1st Gen (A110, 1963 - 1977)",
    },
    specs: {
      type: "Sports Coupe",
      engine: "Renault Cléon-Fonte",
      engineLayout: "I4 (Inline-4)",
      valves: 8,
      valvetrain: "OHV (pushrod), timing chain",
      displacement: 1.6,
      traction: "4x2 (RWD)",
      aspiration: "Naturally Aspirated",
      weight: [750, 1620],
      transmission: "5-speed manual",
      wheels: "13 inch alloy wheels",
      direction: "Rack-and-pinion steering (unassisted)",
      brakes:
        "Disc brakes front / rear (early versions had rear discs replacing older drums)",
    },
    performance: {
      torque: [140, 3200],
      topSpeed: [215, 130],
      acceleration: 6.5,
      hp: 136,
      consumption: 11,
    },
    rules: {
      allowAWD: false,
      allowNOS: false,
      allowedAspirations: ["Naturally Aspirated"],
      canChangeTraction: false,
      maxHP: 180,
    },
    history: {
      curiosities: [
        "Built with a fiberglass body, drastically reducing weight and giving the car an exceptional power-to-weight ratio for the 1960s.",
        "Rear-engine layout provided excellent traction on loose rally surfaces but required skilled driving due to lift-off oversteer tendencies.",
        "The A110 helped establish Alpine as a serious motorsport manufacturer before Renault fully integrated the brand.",
        "Its engineering philosophy prioritized agility over raw horsepower.",
      ],
      appearances: ["Inaugural World Rally Championship (1973)"],
    },
  },
];
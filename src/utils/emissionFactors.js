// India electricity grid factor for FY 2025-26
export const GRID_ELECTRICITY_FACTOR = 0.675;

// Vehicle information used by the demonstration
export const VEHICLES = {
  "Honda City": {
    fuel: "Petrol",
    efficiency: "17.8 km/L",
    kgPerKm: 2.30 / 17.8
  },

  "TVS Apache": {
    fuel: "Petrol",
    efficiency: "40 km/L",
    kgPerKm: 2.30 / 40
  },

  "Tata Nexon EV": {
    fuel: "Electricity",
    efficiency: "0.15 kWh/km",
    kgPerKm: 0.15 * GRID_ELECTRICITY_FACTOR
  }
};

// Average transport factors
// Public transport factors are per passenger-kilometre.
export const TRANSPORT_FACTORS = {
  "Bus": 0.104,
  "Train": 0.035,
  "Taxi / Cab": 0.209,
  "Flight": 0.229,
  "Bicycle": 0,
  "Walking": 0
};

// Household fuel factors
export const HOUSEHOLD_FUEL_FACTORS = {
  "LPG": {
    factor: 2.9961,
    unit: "kg"
  },

  "Diesel (Generator)": {
    factor: 2.685,
    unit: "litres"
  },

  "Kerosene": {
    factor: 2.5279,
    unit: "litres"
  }
};

// Approximate water-supply electricity emissions.
// 0.000203 kg per litre, derived from an Indian
// water-supply energy-intensity study and the grid factor.
export const WATER_FACTOR = 0.000203;
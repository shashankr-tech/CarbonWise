// India electricity grid factor for FY 2025-26
export const GRID_ELECTRICITY_FACTOR = 0.675;

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
import { createSlice, current } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// Helper functions for Orderbook
export const groupByPrice = (levels: number[][], direction: "asc" | "desc"): number[][] => {
  const groupedlevels = levels
    .map((level, idx) => {
      const nextLevel = levels[idx + 1];
      const prevLevel = levels[idx - 1];

      if (nextLevel && level[0] === nextLevel[0]) {
        return [level[0], level[1] + nextLevel[1], level[2] + nextLevel[2]];
      } else if (prevLevel && level[0] === prevLevel[0]) {
        return [];
      } else {
        return level;
      }
    })
    .filter((level) => level.length > 0);

  // Sorting levels according to Asks or Bids
  if (direction === "asc") return groupedlevels.sort((a, b) => a[0] - b[0]);
  else return groupedlevels.sort((a, b) => b[0] - a[0]);
};

// Action helpers
const removePriceLevel = (price: number, levels: number[][]): number[][] =>
  levels.filter((level) => level[0] !== price);

const updatePriceLevel = (updatedLevel: number[], levels: number[][]): number[][] => {
  return levels.map((level) => {
    if (level[0] === updatedLevel[0]) {
      level = updatedLevel;
    }
    return level;
  });
};

const levelExists = (price: number, levels: number[][]): boolean => levels.some((level) => level[0] === price);

const addPriceLevel = (level: number[], levels: number[][]): number[][] => {
  return [...levels, level];
};

const updateLevels = (levels: number[][], order: number[]) => {
  let updatedLevels = [];
  const levelPrice = order[0];
  const levelCount = order[1];

  // Rounding amount of the order for later processes
  order[2] = Number(Math.abs(order[2]).toFixed(2));

  if (levelCount === 0) {
    updatedLevels = removePriceLevel(levelPrice, levels);
  } else {
    if (levelExists(levelPrice, levels)) {
      updatedLevels = updatePriceLevel(order, levels);
    } else {
      updatedLevels = addPriceLevel(order, levels);
    }
  }

  return updatedLevels;
};

// Adding TotalSums to the level as 4th element of the level if it's not exists
// TotalSums will be used to calculate the background visualization of the level
const addTotalSums = (levels: number[][]): number[][] => {
  const totalSums: number[] = [];

  return levels.map((order: number[], idx) => {
    const amount: number = Number(Math.abs(order[2]).toFixed(2));
    const updatedLevel = [...order];
    const totalSum: number = idx === 0 ? amount : Number((amount + totalSums[idx - 1]).toFixed(2));
    updatedLevel[3] = totalSum;
    totalSums.push(totalSum);
    return updatedLevel;
  });
};

const getMaxTotalSum = (orders: number[][]): number => {
  const totalSums: number[] = orders.map((order) => order[2]);
  return Math.max(...totalSums);
};

export type OrderbookState = {
  bids: number[][];
  asks: number[][];
  maxTotalBids: number;
  maxTotalAsks: number;
};

const initialState: OrderbookState = {
  bids: [],
  asks: [],
  maxTotalBids: 0,
  maxTotalAsks: 0,
};

export const orderbookSlice = createSlice({
  name: "orderbook",
  initialState, // `createSlice` will infer the state type from the `initialState` argument
  reducers: {
    // Payload -> [PRICE, COUNT, AMOUNT]
    updateBids: (state, { payload }) => {
      const groupedLevels = groupByPrice(updateLevels(current(state).bids, payload), "desc");

      state.maxTotalBids = getMaxTotalSum(groupedLevels);
      state.bids = addTotalSums(groupedLevels);
    },
    updateAsks: (state, { payload }) => {
      const groupedLevels = groupByPrice(updateLevels(current(state).bids, payload), "asc");

      state.maxTotalAsks = getMaxTotalSum(groupedLevels);
      state.asks = addTotalSums(groupedLevels);
    },
  },
});

// Action creators are generated for each reducer function
export const { updateAsks, updateBids } = orderbookSlice.actions;

export const selectAsks = (state: RootState) => state.orderbook.asks;
export const selectBids = (state: RootState) => state.orderbook.bids;
export const selectMaxTotalAsks = (state: RootState) => state.orderbook.maxTotalAsks;
export const selectMaxTotalBids = (state: RootState) => state.orderbook.maxTotalBids;

export default orderbookSlice.reducer;

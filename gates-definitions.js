const Gates = {
  And: {
    label: "AND",
    inputs: 2,
    outputs: 1,
    logic: (signals) => signals.every((s) => s),
  },
  Or: {
    label: "OR",
    inputs: 2,
    outputs: 1,
    logic: (signals) => signals.some((s) => s),
  },
  Xor: {
    label: "XOR",
    inputs: 2,
    outputs: 1,
    logic: (signals) => {
      if (signals.length === 2) {
        return signals[0] ^ signals[1];
      }
      return false; // Unsupported case
    },
  },
  Not: {
    label: "NOT",
    inputs: 1,
    outputs: 1,
    logic: (signals) => {
      if (signals.length === 1) {
        return !signals[0];
      }
      return false; // Unsupported case
    },
  },
  Nor: {
    label: "NOR",
    inputs: 2,
    outputs: 1,
    logic: (signals) => !signals.some((s) => s),
  },
  Nand: {
    label: "NAND",
    inputs: 2,
    outputs: 1,
    logic: (signals) => !signals.every((s) => s),
  },
  Xnor: {
    label: "XNOR",
    inputs: 2,
    outputs: 1,
    logic: (signals) => {
      if (signals.length === 2) {
        return !(signals[0] ^ signals[1]);
      }
      return false; // Unsupported case,
    },
  },
};

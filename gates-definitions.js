const Gates = {
  And: {
    label: "And",
    inputs: 2,
    outputs: 1,
    logic: (signals) => signals.every((s) => s),
  },
  Or: {
    label: "Or",
    inputs: 2,
    outputs: 1,
    logic: (signals) => signals.some((s) => s),
  },
  Xor: {
    label: "Xor",
    inputs: 2,
    outputs: 1,
    logic: (signals) => {
      if (signals.length === 2) {
        return signals[0] ^ signals[1];
      }
      console.log("Found unsupported logic operaion for gate XOR");
      return false; // Unsupported case
    },
  },
  Not: {
    label: "Not",
    inputs: 1,
    outputs: 1,
    logic: (signals) => {
      if (signals.length === 1) {
        return !signals[0];
      }
      console.log("Found unsupported logic operaion for gate NOT");
      return false; // Unsupported case
    },
  },
  Nor: {
    label: "Nor",
    inputs: 2,
    outputs: 1,
    logic: (signals) => !signals.some((s) => s),
  },
  Nand: {
    label: "Nand",
    inputs: 2,
    outputs: 1,
    logic: (signals) => !signals.every((s) => s),
  },
  Xnor: {
    label: "Xnor",
    inputs: 2,
    outputs: 1,
    logic: (signals) => {
      if (signals.length === 2) {
        return !(signals[0] ^ signals[1]);
      }
      console.log("Found unsupported logic operaion for gate XNOR");
      return false; // Unsupported case,
    },
  },
};

const getGateByName = (name) => {
  return Gates[name];
}

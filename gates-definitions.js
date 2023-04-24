const Gates = {
  And: {
    inputs: 2,
    outputs: 1,
    logic: (signalA, signalB) => signalA && signalB,
  },
  Or: {
    inputs: 2,
    outputs: 1,
    logic: (signalA, signalB) => signalA || signalB,
  },
  Xor: {
    inputs: 2,
    outputs: 1,
    logic: (signalA, signalB) => signalA ^ signalB,
  },
  Not: {
    inputs: 1,
    outputs: 1,
    logic: (signalA) => !signalA,
  },
  Nor: {
    inputs: 2,
    outputs: 1,
    logic: (signalA, signalB) => !(signalA || signalB),
  },
  Nand: {
    inputs: 2,
    outputs: 1,
    logic: (signalA, signalB) => !(signalA && signalB),
  },
  Xnor: {
    inputs: 2,
    outputs: 1,
    logic: (signalA, signalB) => !(signalA ^ signalB),
  },
};

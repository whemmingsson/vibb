class TruthTable {
    constructor() {
        this.table = [];
    }
    generate() {
        noLoop();
        const numberOfInputs = state.objects.buttons.length;
        const permutations = MathUtils.generatePermutations(numberOfInputs);

        // First, set all buttons to false in the sketch
        state.objects.buttons.forEach((b) => {
            b.toogle(false);
        });

        for (let i = 0; i < permutations.length; i++) {
            const permutation = permutations[i];
            for (let j = 0; j < permutation.length; j++) {
                const button = state.objects.buttons[j];
                button.toggle(permutation[j]);
            }

            // Apply the logic as if it were a real sketch
            [...state.objects.gates, ...state.objects.outputs].forEach((c) => c.logic());

            // Now, get the outputs
            const outputs = [];
            state.objects.outputs.forEach((o) => {
                outputs.push(o.on);
            });

            this.table.push({
                inputs: permutation,
                outputs: outputs
            });
        }

        loop();


        console.log(this.table);
    }
}

const TruthTableUtils = {
    generate: () => {
        const table = new TruthTable();
        table.generate();
        return table;
    }
}

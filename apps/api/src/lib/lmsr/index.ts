interface Outcome {
  title: string;
  price: number;
  volume: number;
}

class LMSRLogic {
  private readonly b: number = 1000;

  private outcomes: Outcome[];
  private selectedOutcomeIndex: number;
  private orderQty: number;

  constructor(
    outcomes: Outcome[],
    selectedOutcomeIndex: number,
    orderQty: number,
  ) {
    this.outcomes = outcomes;
    this.selectedOutcomeIndex = selectedOutcomeIndex;
    this.orderQty = orderQty;
  }

  /**
   * @param quantities
   * @returns a number that is the cost depended on the quantity
   */
  private cost(quantities: number[]): number {
    const maxQ = Math.max(...quantities.map((qty) => qty / this.b)); // Getting the largest qty from the array
    // Sum of exponentials
    const sumExp = quantities
      .map((qty) => Math.exp(qty / this.b - maxQ))
      .reduce((acc, val) => acc + val, 0);
    const cost = this.b * (maxQ + Math.log(sumExp)); // Cost
    return cost;
  }
  /**
   * @param quantities
   * @returns returns an array of numbers that is the price array.
   */
  private prices(quantities: number[]): number[] {
    const maxQ = Math.max(...quantities.map((qty) => qty / this.b));
    const expVals = quantities.map((qty) => Math.exp(qty / this.b - maxQ)); // Exponetial array
    const sumExp = expVals.reduce((acc, val) => acc + val, 0);
    const prices = expVals.map((val) => val / sumExp);
    return prices;
  }

  /**
   * This is a buy function
   * @returns calculated outcomes and cost of a trade.
   */
  buy(): { calculatedOutcomes: Outcome[]; tradeCost: number } {
    const providedQty = this.outcomes.map((outcome) => outcome.volume);
    const addQty = [...providedQty];
    addQty[this.selectedOutcomeIndex] += this.orderQty;

    const tradeCost = this.cost(addQty) - this.cost(providedQty);
    const newPrices = this.prices(addQty);
    const newVolumeForSelectedQty =
      this.outcomes[this.selectedOutcomeIndex].volume + this.orderQty;
    const calculatedOutcomes = this.outcomes.map((outcome, i) => ({
      ...outcome,
      price: newPrices[i],
      volume:
        i === this.selectedOutcomeIndex
          ? newVolumeForSelectedQty
          : this.outcomes[i].volume,
    }));

    return { calculatedOutcomes, tradeCost };
  }

  /**
   * This is a sell function
   * @returns calculated outcomes and return to the user
   */
  sell(): { calculatedOutcomes: Outcome[]; returnToTheUser: number } {
    const providedQty = this.outcomes.map((outcome) => outcome.volume);
    const subtractedQty = [...providedQty];
    subtractedQty[this.selectedOutcomeIndex] -= this.orderQty;

    const returnToTheUser = this.cost(subtractedQty) - this.cost(providedQty);
    const newPrices = this.prices(subtractedQty);
    const newVolumeForSelectedQty =
      this.outcomes[this.selectedOutcomeIndex].volume - this.orderQty;
    const calculatedOutcomes = this.outcomes.map((outcome, i) => ({
      ...outcome,
      price: newPrices[i],
      volume:
        i === this.selectedOutcomeIndex
          ? newVolumeForSelectedQty
          : this.outcomes[i].volume,
    }));

    return { calculatedOutcomes, returnToTheUser };
  }
}

export { LMSRLogic };

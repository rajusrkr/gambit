import { Decimal } from "decimal.js";

Decimal.set({ precision: 36 });

class LMSRLogic {
  private readonly b: number = 1000;
  private selectedOutcomeIndex: number;
  private orderQty: number;
  private volumes: number[];

  constructor(
    selectedOutcomeIndex: number,
    orderQty: number,
    volumes: number[],
  ) {
    this.selectedOutcomeIndex = selectedOutcomeIndex;
    this.orderQty = orderQty;
    this.volumes = volumes;
  }

  /**
   * @param volumes a number array
   * @returns a decimal number
   */
  private cost(volumes: number[]): Decimal {
    const b = new Decimal(String(this.b));
    const scaledVolume = volumes.map((v) => new Decimal(String(v)).div(b));
    const maxQ = Decimal.max(...scaledVolume);

    const sumExp = volumes.reduce((acc, vol) => {
      const vDivB = new Decimal(String(vol)).div(b);
      const exponent = vDivB.minus(maxQ);
      return acc.plus(exponent.exp());
    }, new Decimal(0));

    const totalCost = b.times(maxQ.plus(sumExp.ln()));
    return totalCost;
  }

  /**
   * @param volumes
   * @returns array of decimals
   */
  private prices(volumes: number[]): string[] {
    const b = new Decimal(String(this.b));
    const scaledVolume = volumes.map((v) => new Decimal(String(v)).div(b));
    const maxQ = Decimal.max(...scaledVolume);

    const expVals = volumes.map((v) =>
      Decimal.exp(new Decimal(String(v)).div(b).minus(maxQ)),
    );
    const sumExp = expVals.reduce((acc, val) => acc.plus(val), new Decimal(0));

    const prices = expVals.map((val) => val.div(sumExp).toString());
    return prices;
  }

  /**
   * This is a buy function
   * @returns calculated outcomes and cost of a trade.
   */
  buy(): {
    newVolumes: number[];
    tradeCost: Decimal;
    newPrices: string[];
  } {
    const providedQty = [...this.volumes];
    const addVolumes = [...this.volumes];
    addVolumes[this.selectedOutcomeIndex] += this.orderQty;

    const tradeCost = this.cost(addVolumes).minus(this.cost(providedQty));
    const newPrices = this.prices(addVolumes);

    return { tradeCost, newPrices, newVolumes: addVolumes };
  }

  /**
   * This is a sell function
   * @returns calculated outcomes and return to the user
   */
  sell(): {
    returnToTheUser: Decimal;
    newPrices: string[];
    newVolumes: number[];
  } {
    const providedVolumes = [...this.volumes];
    const subTractVolumes = [...this.volumes];
    subTractVolumes[this.selectedOutcomeIndex] -= this.orderQty;

    const returnToTheUser = this.cost(providedVolumes).minus(
      this.cost(subTractVolumes),
    );
    const newPrices = this.prices(providedVolumes);

    return { returnToTheUser, newPrices, newVolumes: providedVolumes };
  }
}

export { LMSRLogic };

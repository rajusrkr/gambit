# LMSR (Logarithmic Market Scoring Rule)

LMSR is the gold standard mechanism for calculating price for prediction markets. It was introduced by **Robin Hanson** in early 2002. Highliting feature of this formula is - there is always liquidity in a market even when there are not many traders available, its like trader against mathematical formula.

In LMSR we have a *cost* function and a *price* function.

> Cost function

cost = b * ln(e^(q1/b) + e^(q2/b))
> `b` is the liquidity parameter. A smaller `b` means market will move faster. A larger `b` will move the price slowly. `ln` is natural logarithm. `e` is the Euler's number. `q` is quantity.

Cost function you can assume a price of a entire market based on the volumes. To get a trade cost you must need to calculate the cost based on old volumes and cost based on the new volume and then you substract the old cost from new. If the old cost is `a` and new cost is `b` then trade cost will be `b-a`.

> Cost funtion in `lmsr/index.ts`
```javascript
  private cost(quantities: number[]): number {
    const maxQ = Math.max(...quantities.map((qty) => qty / this.b));
    const sumExp = quantities
      .map((qty) => Math.exp(qty / this.b - maxQ))
      .reduce((acc, val) => acc + val, 0);
    const cost = this.b * (maxQ + Math.log(sumExp));
    return cost;
  }
```

Here we have `maxQ` this is the max quantity. But why do we need it? will get to it shortly.

The LMSR function requires calculating `e^q/b`. Lets assume the q is 50000 and the b is 1000 so we have to calculate `e^50000/1000 = e^50 which equals to 5184705528587756000000`. If `q` gets much larger the computer hits `Infinity` the floating point overflow. And the whole program crashes.

Now think of `10`. You can write it as `10` or you can write it as `(15 - 5)`. It looks different but it is the same exact number.

The `maxQ` works the similar. It help us to prevent the floating point overflow.

``` javascript
const myArr = [50000, 40000, 25000]
const maxQ = Math.max(...myArr.map((qty) => qty / this.b));
// maxQ will be 50
```

Now get back to that `e^50`. If we do `e^50-maxQ` that equals to `e^0`. See now it is much much smaller and no floating point error.
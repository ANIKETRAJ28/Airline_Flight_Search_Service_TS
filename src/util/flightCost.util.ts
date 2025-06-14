// interface IEconomySeats {
//   window_one: number;
//   window_two: number;
//   window_three: number;
// };

// interface IPremiumSeats {
//   window_one: number;
//   window_two: number;
// };

// interface IBusinessSeats {
//   window_one: number;
//   window_two: number;
// };

// interface IFlightWindowSeatsAndPrice {
//   seats: IEconomySeats | IPremiumSeats | IBusinessSeats;
//   flight_cost: number;
// }

// function getPremiumCost(): IFlightWindowSeatsAndPrice {
//     // simulate the cost of premium by window from lower window to higher window
//     // the first window will be 1.5X of the base cost, and the second window will be 2X
//     if(premium_window_one > 0) {
//       this.cost = this.base_class_cost * 1.5;
//       this.premium_window_one -= 1;
//     } else if(this.premium_window_two > 0) {
//       this.cost = this.base_class_cost * 2;
//       this.premium_window_two -= 1;
//     } else {
//       throw new Error("No premium seats available");
//     }
//     return {
//       seats: {
//         window_one: this.premium_window_one,
//         window_two: this.premium_window_two,
//       },
//       flight_cost: this.cost,
//     };
//   }

// class FlightCost {
//   private base_class_cost: number;
//   private cost: number;
//   private seats: number;
//   // economy class windows for seats
//   private economy_window_one: number;
//   private economy_window_two: number;
//   private economy_window_three: number;
//   // premium class window from seats
//   private premium_window_one: number;
//   private premium_window_two: number;
//   // business class windows from seats
//   private business_window_one: number;
//   private business_window_two: number;

//   constructor(
//     base_class_cost: number,
//     premium_window_one: number,
//     premium_window_two: number,
//     business_window_one: number,
//     business_window_two: number,
//   ) {
//     this.base_class_cost = base_class_cost;
//     this.premium_window_one = premium_window_one;
//     this.premium_window_two = premium_window_two;
//     this.business_window_one = business_window_one;
//     this.business_window_two = business_window_two;
//   }

//   getEconomyCost(economy_window_one: number,
//     economy_window_two: number,
//     economy_window_three: number,): IFlightWindowSeatsAndPrice {
//     // simulate the cost of economy by window from lower window to higher window
//     // the first window will be 1X of the base cost, second window will be 1.2X, and the third window will be 1.5X
//     this.economy_window_one = economy_window_one;
//     this.economy_window_two = economy_window_two;
//     this.economy_window_three = economy_window_three;
//     if(this.economy_window_one > 0) {
//       this.cost = this.base_class_cost * 1;
//       this.economy_window_one -= 1;
//     } else if(this.economy_window_two > 0) {
//       this.cost = this.base_class_cost * 1.2;
//       this.economy_window_two -= 1;
//     } else if(this.economy_window_three > 0) {
//       this.cost = this.base_class_cost * 1.5;
//       this.economy_window_three -= 1;
//     } else {
//       throw new Error("No economy seats available");
//     }
//     return {
//       seats: {
//         window_one: this.economy_window_one,
//         window_two: this.economy_window_two,
//         window_three: this.economy_window_three,
//       },
//       flight_cost: this.cost,
//     };
//   }
// }

const fs = require("fs");

let items = ["Gloves", "Mask"];
let country = ["UK", "Germany"];

const initialInventory = () => {
  return {
    UK: {
      Mask: {
        quantity: 100,
        price: 65,
      },
      Gloves: {
        quantity: 100,
        price: 100,
      },
    },
    Germany: {
      Mask: {
        quantity: 100,
        price: 100,
      },
      Gloves: {
        quantity: 50,
        price: 150,
      },
    },
  };
};

let inventory = { ...initialInventory() };

const passportCountryVerification = (request) => {
  if (/^B[0-9]{3}[a-zA-Z]{2}[a-zA-Z0-9]{7}$/.test(request.Passport)) {
    request.Passport = "UK";
  } else if (/^A[a-zA-Z]{2}[a-zA-Z0-9]{9}$/.test(request.Passport)) {
    request.Passport = "Germany";
  } else request.Passport = "optional";

  return request;
};

const requestParser = (input) => {
  let request = {};

  if (items.includes(input[1])) {
    request.Country = input[0];
    request[input[1]] = input[2];
    request[input[3]] = input[4];
    request.Passport = "optional";
  } else {
    request.Country = input[0];
    request[input[2]] = input[3];
    request[input[4]] = input[5];
    request.Passport = input[1];
    passportCountryVerification(request);
  }

  return request;
};

const minimumSalesPrice = (request) => {
  let ans = 0;

  if (
    request.Mask >
      inventory.UK.Mask.quantity + inventory.Germany.Mask.quantity ||
    request.Gloves >
      inventory.UK.Gloves.quantity + inventory.Germany.Gloves.quantity
  ) {
    return 0;
  } else {
    if (request.Country == "UK") {
      if (request.Mask > inventory.UK.Mask.quantity) {
        ans += inventory.UK.Mask.quantity * inventory.UK.Mask.price;
        request.Mask -= inventory.UK.Mask.quantity;
        inventory.UK.Mask.quantity = 0;
        inventory.Germany.Mask.quantity -= request.Mask;
        if (request.Passport == "Germany") {
          if (request.Mask % 10 == 0) {
            ans +=
              inventory.Germany.Mask.price * request.Mask +
              (400 - 400 * 0.2) * (request.Mask / 10);
          } else {
            ans +=
              inventory.Germany.Mask.price * request.Mask +
              (400 - 400 * 0.2) * (Math.floor(request.Mask / 10) + 1);
          }
        } else {
          if (request.Mask % 10 == 0) {
            ans +=
              inventory.Germany.Mask.price * request.Mask +
              400 * (request.Mask / 10);
          } else {
            ans +=
              inventory.Germany.Mask.price * request.Mask +
              400 * (Math.floor(request.Mask / 10) + 1);
          }
        }
      } else {
        ans += request.Mask * inventory.UK.Mask.price;
        inventory.UK.Mask.quantity -= request.Mask;
      }

      if (request.Gloves > inventory.UK.Gloves.quantity) {
        ans += inventory.UK.Gloves.quantity * inventory.UK.Gloves.price;
        request.Gloves -= inventory.UK.Gloves.quantity;
        inventory.UK.Gloves.quantity = 0;
        inventory.Germany.Gloves.quantity -= request.Gloves;
        if (request.Passport == "Germany") {
          if (request.Gloves % 10 == 0) {
            ans +=
              inventory.Germany.Gloves.price * request.Gloves +
              (400 - 400 * 0.2) * (request.Gloves / 10);
          } else {
            ans +=
              inventory.Germany.Gloves.price * request.Gloves +
              (400 - 400 * 0.2) * (Math.floor(request.Gloves / 10) + 1);
          }
        } else {
          if (request.Gloves % 10 == 0) {
            ans +=
              inventory.Germany.Gloves.price * request.Gloves +
              400 * (request.Gloves / 10);
          } else {
            ans +=
              inventory.Germany.Gloves.price * request.Gloves +
              400 * (Math.floor(request.Gloves / 10) + 1);
          }
        }
      } else {
        ans += request.Gloves * inventory.UK.Gloves.price;
        inventory.UK.Gloves.quantity -= request.Gloves;
      }
    } else if (request.Country == "Germany") {
      if (request.Passport == "UK") {
        if (request.Mask > inventory.UK.Mask.quantity) {
          ans +=
            inventory.UK.Mask.quantity * inventory.UK.Mask.price +
            (400 - 400 * 0.2) * (inventory.UK.Mask.quantity / 10);
          request.Mask -= inventory.UK.Mask.quantity;
          inventory.UK.Mask.quantity = 0;
          inventory.Germany.Mask.quantity -= request.Mask;
          ans += inventory.Germany.Mask.price * request.Mask;
        } else {
          if (request.Mask % 10 == 0) {
            inventory.UK.Mask.quantity -= request.Mask;
            ans +=
              inventory.UK.Mask.price * request.Mask +
              (400 - 400 * 0.2) * (request.Mask / 10);
          } else {
            ans +=
              inventory.UK.Mask.price * (Math.floor(request.Mask / 10) * 10) +
              (400 - 400 * 0.2) * Math.floor(request.Mask / 10);
            request.Mask -= Math.floor(request.Mask / 10) * 10;

            inventory.Germany.Mask.quantity -= request.Mask;
            ans += inventory.Germany.Mask.price * request.Mask;
          }
        }

        if (request.Gloves > inventory.UK.Gloves.quantity) {
          ans +=
            inventory.UK.Gloves.quantity * inventory.UK.Gloves.price +
            (400 - 400 * 0.2) * (inventory.UK.Gloves.quantity / 10);
          request.Gloves -= inventory.UK.Gloves.quantity;
          inventory.UK.Gloves.quantity = 0;
          inventory.Germany.Gloves.quantity -= request.Gloves;
          ans += inventory.Germany.Gloves.price * request.Gloves;
        } else {
          if (request.Gloves % 10 == 0) {
            inventory.UK.Gloves.quantity -= request.Gloves;
            ans +=
              inventory.UK.Gloves.price * request.Gloves +
              (400 - 400 * 0.2) * (request.Gloves / 10);
          } else if (request.Gloves % 10 == 9) {
            inventory.UK.Gloves.quantity -= request.Gloves;
            ans +=
              inventory.UK.Gloves.price * request.Gloves +
              (400 - 400 * 0.2) * (Math.floor(request.Gloves / 10) + 1);
          } else {
            ans +=
              inventory.UK.Gloves.price *
                (Math.floor(request.Gloves / 10) * 10) +
              (400 - 400 * 0.2) * Math.floor(request.Gloves / 10);
            inventory.UK.Gloves.quantity -=
              Math.floor(request.Gloves / 10) * 10;
            request.Gloves -= Math.floor(request.Gloves / 10) * 10;

            inventory.Germany.Gloves.quantity -= request.Gloves;
            ans += inventory.Germany.Gloves.price * request.Gloves;
          }
        }
      } else {
        if (request.Mask > inventory.Germany.Mask.quantity) {
          ans += inventory.Germany.Mask.quantity * inventory.Germany.Mask.price;
          request.Mask -= inventory.Germany.Mask.quantity;
          inventory.Germany.Mask.quantity = 0;
          inventory.UK.Mask.quantity -= request.Mask;
          if (request.Mask % 10 == 0) {
            ans +=
              inventory.UK.Mask.price * request.Mask +
              400 * (request.Mask / 10);
          } else {
            ans +=
              inventory.UK.Mask.price * request.Mask +
              400 * (Math.floor(request.Mask / 10) + 1);
          }
        } else {
          ans += request.Mask * inventory.Germany.Mask.price;
          inventory.Germany.Mask.quantity -= request.Mask;
        }

        if (request.Gloves > inventory.UK.Gloves.quantity) {
          ans +=
            inventory.UK.Gloves.quantity * inventory.UK.Gloves.price +
            400 * (inventory.UK.Gloves.quantity / 10);
          request.Gloves -= inventory.UK.Gloves.quantity;
          inventory.UK.Gloves.quantity = 0;
          inventory.Germany.Gloves.quantity -= request.Gloves;
          ans += inventory.Germany.Gloves.price * request.Gloves;
        } else {
          if (request.Gloves % 10 == 0) {
            inventory.UK.Gloves.quantity -= request.Gloves;
            ans +=
              inventory.UK.Gloves.price * request.Gloves +
              400 * (request.Gloves / 10);
          } else if (request.Gloves % 10 == 9) {
            inventory.UK.Gloves.quantity -= request.Gloves;
            ans +=
              inventory.UK.Gloves.price * request.Gloves +
              400 * (Math.floor(request.Gloves / 10) + 1);
          } else {
            ans +=
              inventory.UK.Gloves.price *
                (Math.floor(request.Gloves / 10) * 10) +
              400 * Math.floor(request.Gloves / 10);
            inventory.UK.Gloves.quantity -=
              Math.floor(request.Gloves / 10) * 10;
            request.Gloves -= Math.floor(request.Gloves / 10) * 10;

            inventory.Germany.Gloves.quantity -= request.Gloves;
            ans += inventory.Germany.Gloves.price * request.Gloves;
          }
        }
      }
    }
  }

  return ans;
};

const responseFormat = async (ans) => {
  if (ans == 0) {
    return Promise.resolve(
      `OUT_OF_STOCK:${inventory.UK.Mask.quantity}:${inventory.Germany.Mask.quantity}:${inventory.UK.Gloves.quantity}:${inventory.Germany.Gloves.quantity}`
    );
  }
  return Promise.resolve(
    `${ans}:${inventory.UK.Mask.quantity}:${inventory.Germany.Mask.quantity}:${inventory.UK.Gloves.quantity}:${inventory.Germany.Gloves.quantity}`
  );
};

const inventoryManagement = async () => {
  try {
    let filename = process.argv[2];

    let data = fs.readFileSync(filename, { encoding: "utf-8" });
    data = data.split("\n");

    for (let i = 0; i < data.length; i++) {
      inventory = { ...initialInventory() };

      input = data[i].split(":");

      const request = requestParser(input);

      const msb = minimumSalesPrice(request);

      const output = await responseFormat(msb);

      console.log("INPUT : ", data[i]);
      console.log("OUTPUT : ", output);
    }
  } catch (error) {
    console.log("error:", error);
  }
};

inventoryManagement();

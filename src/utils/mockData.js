const endpoints = {
  "0": "GET /",
  "1": "GET /stocks",
  "2": "POST /stocks",
  "3": "GET /stocks/:quote",
  "4": "GET/stocks/:quote/forecast",
  "5": "POST/stocks/:quote/forecast",
  "6": "PATCH/stocks/:quote/forecast/:id",
  "7": "DELETE /stocks/:quote/forecast/:id",
  "8": "GET /users/:username",
  "9": "POST /users/register",
  "10": "POST /users/login",
  "11": "POST /users/logout"
};

const mockUserData = [
  {
    id: "efda0939-3101-f362-83fd-f3936fa3",
    username: "stockguru",
    password: "123456789",
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@expressmail.com"
  },
  {
    id: "0aaa648b-5d1d-bfc8-af4b-b1597a95",
    username: "stockshorter",
    password: "123456789",
    firstName: "John",
    lastName: "Smith",
    email: "johnsmith@expressmail.com"
  }
];

const mockUser = {
  id: "d5a6dcd6-ee26-04f9-9ec7-85834271f082",
  username: "stocknoob",
  password: "123456789",
  firstName: "Jon",
  lastName: "Wong",
  email: "jonwong@expressmail.com"
};

const mockStockData = {
  id: "573545fe-3736-59a6-3392-8e0f0589",
  quote: "AAPL",
  forecast: [
    {
      id: "34298392-1ff3-0fb0-573f-72f44e15",
      userId: "efda0939-3101-f362-83fd-f3936fa3",
      position: "long",
      targetPrice: 380,
      timeFrame: "1 year",
      title: "Apple: The New iPhone Opportunity",
      rationale:
        "One of the reasons that technology giant Apple (AAPL) has seen its shares soar to new all-time highs recently is the expected iPhone supercycle coming this year. With the company getting ready to launch new 5G compatible phones, investors are betting that iPhone upgrade rates will soar, leading to new revenue and profit records."
    },
    {
      id: "6048bd45-c7dc-0edf-a14b-c3daf10b",
      userId: "0aaa648b-5d1d-bfc8-af4b-b1597a95",
      position: "short",
      targetPrice: 300,
      timeFrame: "3 months",
      title: "Apple Supplier Rumor: An Awesome Short Entry Point",
      rationale: `One analyst stated that 2019-nCoV will only have a 10% impact on iPhone shipments. Again, I find analyst comments hard to believe, as their main constituents are their own clients. Public companies are a bit more trustworthy, as they must act to benefit investors.

        Case in point, Sony (NYSE:SNE), a supplier to Apple, has given a much more dire warning. The word Sony's CFO used in regard to the impact of 2019-nCoV on its smartphone image sensor supply was "enormous," which is not a word that describes "10%." Sony holds 70% of the market share in this category.`
    }
  ]
};

const mockDatabase = [
  {
    id: "573545fe-3736-59a6-3392-8e0f0589",
    quote: "AAPL",
    forecast: [
      {
        id: "34298392-1ff3-0fb0-573f-72f44e15",
        userId: "efda0939-3101-f362-83fd-f3936fa3",
        position: "long",
        targetPrice: 380,
        timeFrame: "1 year",
        title: "Apple: The New iPhone Opportunity",
        rationale:
          "One of the reasons that technology giant Apple (AAPL) has seen its shares soar to new all-time highs recently is the expected iPhone supercycle coming this year. With the company getting ready to launch new 5G compatible phones, investors are betting that iPhone upgrade rates will soar, leading to new revenue and profit records."
      },
      {
        id: "6048bd45-c7dc-0edf-a14b-c3daf10b",
        userId: "0aaa648b-5d1d-bfc8-af4b-b1597a95",
        position: "short",
        targetPrice: 300,
        timeFrame: "3 months",
        title: "Apple Supplier Rumor: An Awesome Short Entry Point",
        rationale: `One analyst stated that 2019-nCoV will only have a 10% impact on iPhone shipments. Again, I find analyst comments hard to believe, as their main constituents are their own clients. Public companies are a bit more trustworthy, as they must act to benefit investors.
        
        Case in point, Sony (NYSE:SNE), a supplier to Apple, has given a much more dire warning. The word Sony's CFO used in regard to the impact of 2019-nCoV on its smartphone image sensor supply was "enormous," which is not a word that describes "10%." Sony holds 70% of the market share in this category.`
      }
    ]
  },
  {
    id: "9cc1492b-6e2e-5777-db10-bf3dd79f",
    quote: "MSFT",
    forecast: [
      {
        id: "5963d40a-098b-d04d-b953-41072afa",
        userId: "efda0939-3101-f362-83fd-f3936fa3",
        position: "long",
        targetPrice: 200,
        timeFrame: "1 year",
        title: "Microsoft's Azure Strategy Pays Off",
        rationale: `Microsoft appears to be on a roll on all fronts.
        
        The recently announced results sent the stock soaring to record high levels as the company delivered a stellar performance shattering all market expectations.`
      },
      {
        id: "06564fa0-095a-867a-a0b3-36f36b04",
        userId: "0aaa648b-5d1d-bfc8-af4b-b1597a95",
        position: "short",
        targetPrice: 170,
        timeFrame: "6 months",
        title: "Microsoft: Too Fast, Too High",
        rationale: `Microsoft stock price has been growing at a super-exponential rate. And this is very similar to how the bubble grows.
        
        In terms of analysis of internal growth, the company is overvalued by all key parameters.
        
        Microsoft is clearly overvalued relative to the main blue chips in Nasdaq.`
      }
    ]
  }
];

module.exports = {
  endpoints,
  mockStockData,
  mockUser,
  mockDatabase,
  mockUserData
};

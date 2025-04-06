export interface TimelineEvent {
  id: string
  title: string
  date: Date
  description: string
  category: string
  imageUrl?: string
}

export const careerEvents: TimelineEvent[] = [
  {
    id: "c1",
    title: "Zip2 Corporation",
    date: new Date("1995-02-01"),
    description:
      "Elon Musk co-founded Zip2, a company that provided business directories and maps for newspapers. This was his first major entrepreneurial venture after dropping out of Stanford's PhD program.",
    category: "Company",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c2",
    title: "Zip2 Sold to Compaq",
    date: new Date("1999-02-01"),
    description: "Compaq acquired Zip2 for $307 million. Musk received $22 million for his 7% share of the company.",
    category: "Exit",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c3",
    title: "X.com Founded",
    date: new Date("1999-03-01"),
    description:
      "Musk founded X.com, an online financial services and email payment company, using $10 million from the sale of Zip2.",
    category: "Company",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c4",
    title: "PayPal Merger",
    date: new Date("2000-03-01"),
    description:
      "X.com merged with Confinity, which operated a service called PayPal. The combined company focused on the PayPal service.",
    category: "Merger",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c5",
    title: "PayPal CEO",
    date: new Date("2000-10-01"),
    description:
      "Musk was appointed as CEO of PayPal, but was later replaced by Peter Thiel in September 2000 due to disagreements over the company's direction.",
    category: "Leadership",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c6",
    title: "PayPal Sold to eBay",
    date: new Date("2002-10-01"),
    description:
      "eBay acquired PayPal for $1.5 billion. Musk, the largest shareholder with 11.7%, received $165 million.",
    category: "Exit",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c7",
    title: "SpaceX Founded",
    date: new Date("2002-05-01"),
    description:
      "Musk founded Space Exploration Technologies Corp. (SpaceX) with the goal of reducing space transportation costs and enabling the colonization of Mars.",
    category: "Company",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c8",
    title: "Tesla Investment",
    date: new Date("2004-02-01"),
    description:
      "Musk led the Series A funding round for Tesla Motors, investing $6.5 million and becoming the company's chairman.",
    category: "Investment",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c9",
    title: "Falcon 1 First Launch",
    date: new Date("2006-03-24"),
    description:
      "SpaceX's first Falcon 1 rocket launch failed to reach orbit. This was the first of three consecutive failures.",
    category: "SpaceX",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c10",
    title: "Tesla Roadster Unveiled",
    date: new Date("2006-07-19"),
    description: "Tesla unveiled the Roadster, its first electric car, at a private event in Santa Monica, California.",
    category: "Tesla",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c11",
    title: "Tesla CEO",
    date: new Date("2008-10-01"),
    description:
      "Musk took over as CEO of Tesla Motors while remaining its chairman. The company was facing financial difficulties at the time.",
    category: "Leadership",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c12",
    title: "Falcon 1 Success",
    date: new Date("2008-09-28"),
    description:
      "SpaceX's Falcon 1 successfully reached orbit, becoming the first privately developed liquid-fuel rocket to do so.",
    category: "SpaceX",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c13",
    title: "NASA Contract",
    date: new Date("2008-12-23"),
    description:
      "SpaceX was awarded a $1.6 billion NASA contract for 12 cargo resupply missions to the International Space Station.",
    category: "SpaceX",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c14",
    title: "Tesla IPO",
    date: new Date("2010-06-29"),
    description:
      "Tesla Motors went public on NASDAQ, raising $226 million. It was the first American car company to go public since Ford in 1956.",
    category: "Tesla",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c15",
    title: "Model S Delivery",
    date: new Date("2012-06-22"),
    description: "Tesla began deliveries of the Model S, its second car model and first luxury sedan.",
    category: "Tesla",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c16",
    title: "Dragon Docks with ISS",
    date: new Date("2012-05-25"),
    description:
      "SpaceX's Dragon spacecraft became the first commercial vehicle to dock with the International Space Station.",
    category: "SpaceX",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c17",
    title: "SolarCity Chairman",
    date: new Date("2013-01-01"),
    description:
      "Musk became chairman of SolarCity, a solar energy services company founded by his cousins Peter and Lyndon Rive.",
    category: "Leadership",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c18",
    title: "Hyperloop Concept",
    date: new Date("2013-08-12"),
    description:
      "Musk published a white paper outlining the concept of the Hyperloop, a high-speed transportation system.",
    category: "Innovation",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c19",
    title: "Tesla Gigafactory Announced",
    date: new Date("2014-02-26"),
    description:
      "Tesla announced plans to build a Gigafactory to produce lithium-ion batteries at scale, reducing costs.",
    category: "Tesla",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c20",
    title: "Falcon 9 First Landing",
    date: new Date("2015-12-22"),
    description:
      "SpaceX successfully landed a Falcon 9 first stage at Landing Zone 1, a major milestone in developing reusable rockets.",
    category: "SpaceX",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c21",
    title: "Tesla Acquires SolarCity",
    date: new Date("2016-11-21"),
    description: "Tesla acquired SolarCity for $2.6 billion, expanding into solar energy production and storage.",
    category: "Acquisition",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c22",
    title: "Neuralink Founded",
    date: new Date("2016-07-01"),
    description:
      "Musk co-founded Neuralink, a neurotechnology company developing implantable brain–machine interfaces.",
    category: "Company",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c23",
    title: "The Boring Company Founded",
    date: new Date("2016-12-01"),
    description:
      "Musk founded The Boring Company to construct tunnels to reduce urban traffic and enable high-speed transportation.",
    category: "Company",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c24",
    title: "Model 3 Production",
    date: new Date("2017-07-01"),
    description:
      "Tesla began production of the Model 3, its mass-market electric vehicle, though it faced significant production challenges.",
    category: "Tesla",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c25",
    title: "Falcon Heavy Launch",
    date: new Date("2018-02-06"),
    description:
      "SpaceX successfully launched the Falcon Heavy, the most powerful operational rocket at the time, with Musk's Tesla Roadster as the payload.",
    category: "SpaceX",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c26",
    title: "SEC Settlement",
    date: new Date("2018-09-29"),
    description:
      "Musk settled with the SEC over fraud charges related to tweets about taking Tesla private. He stepped down as chairman but remained CEO.",
    category: "Controversy",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c27",
    title: "Crew Dragon Demo-2",
    date: new Date("2020-05-30"),
    description:
      "SpaceX launched astronauts to the ISS for the first time, marking the return of human spaceflight capability to the United States.",
    category: "SpaceX",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c28",
    title: "Tesla Joins S&P 500",
    date: new Date("2020-12-21"),
    description: "Tesla was added to the S&P 500 index, becoming one of the most valuable companies in the world.",
    category: "Tesla",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c29",
    title: "Richest Person in the World",
    date: new Date("2021-01-07"),
    description:
      "Musk surpassed Jeff Bezos to become the richest person in the world, with a net worth of over $185 billion.",
    category: "Achievement",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c30",
    title: "Twitter Acquisition",
    date: new Date("2022-10-27"),
    description: "Musk acquired Twitter for $44 billion and took the company private, renaming it to X in 2023.",
    category: "Acquisition",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "c31",
    title: "Starship Test Flight",
    date: new Date("2023-04-20"),
    description:
      "SpaceX conducted the first integrated flight test of Starship, the largest and most powerful rocket ever built.",
    category: "SpaceX",
    imageUrl: "/placeholder.svg?height=200&width=300",
  },
]


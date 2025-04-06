export interface BlogPost {
  id: string
  title: string
  content: string
  date: string
  author: string
  imageUrl?: string
}

export const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "Elon Musk's SpaceX Achieves Another Successful Launch",
    content:
      "SpaceX successfully launched another batch of Starlink satellites into orbit, continuing its mission to provide global internet coverage. The Falcon 9 rocket lifted off from Cape Canaveral and deployed 60 satellites, bringing the total number in orbit to over 1,500.",
    date: "2023-06-15",
    author: "Tech Reporter",
    imageUrl: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "2",
    title: "Tesla Unveils New Battery Technology",
    content:
      "Tesla has announced a breakthrough in battery technology that could significantly increase the range of its electric vehicles. The new cells, which will be produced in-house, are expected to reduce costs by up to 50% while improving energy density by 30%.",
    date: "2023-05-20",
    author: "EV Enthusiast",
    imageUrl: "/placeholder.svg?height=300&width=600",
  },
  {
    id: "3",
    title: "Neuralink Receives FDA Approval for Human Trials",
    content:
      "Elon Musk's neurotechnology company, Neuralink, has received FDA approval to begin human trials of its brain-computer interface. The device, which is implanted into the brain, aims to help people with neurological conditions control computers and mobile devices with their thoughts.",
    date: "2023-04-10",
    author: "Science Correspondent",
    imageUrl: "/placeholder.svg?height=300&width=600",
  },
]


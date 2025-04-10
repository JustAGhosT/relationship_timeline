// Sample data for the relationship timeline
// These samples can be loaded directly into the application

export const sampleData: Record<string, any[]> = {
  // Basic example with 3 relationships
  basic: [
    {
      id: "1",
      name: "First Relationship",
      startDate: "2010-01-01T00:00:00.000Z",
      endDate: "2012-12-31T00:00:00.000Z",
      color: "#4f46e5", // indigo-600
      details: "This was my first serious relationship. We met in college and dated for about 3 years.",
      moreInfoUrl: "",
      highlights: [
        {
          date: "2010-06-15T00:00:00.000Z",
          title: "First vacation together",
          description: "We went to the beach for a week",
        },
        {
          date: "2011-12-25T00:00:00.000Z",
          title: "First holiday together",
          description: "Spent Christmas with their family",
        },
      ],
      children: [],
    },
    {
      id: "2",
      name: "Second Relationship",
      startDate: "2013-05-01T00:00:00.000Z",
      endDate: "2015-08-31T00:00:00.000Z",
      color: "#0891b2", // cyan-600
      details: "We met through mutual friends and had a good connection for a couple of years.",
      moreInfoUrl: "",
      highlights: [
        {
          date: "2014-02-14T00:00:00.000Z",
          title: "Valentine's Day trip",
          description: "Weekend getaway to the mountains",
        },
      ],
      children: [],
    },
    {
      id: "3",
      name: "Current Relationship",
      startDate: "2016-03-15T00:00:00.000Z",
      endDate: "2023-12-31T00:00:00.000Z",
      color: "#16a34a", // green-600
      details: "My current partner. We've been together for several years and have built a life together.",
      moreInfoUrl: "",
      highlights: [
        {
          date: "2017-07-04T00:00:00.000Z",
          title: "Moved in together",
          description: "Got our first apartment",
        },
        {
          date: "2019-12-31T00:00:00.000Z",
          title: "Got engaged",
          description: "Proposed during New Year's Eve celebration",
        },
        {
          date: "2021-06-12T00:00:00.000Z",
          title: "Wedding day",
          description: "Got married in a small ceremony",
        },
      ],
      children: [
        {
          id: "c1",
          name: "First Child",
          conceptionDate: "2021-09-01T00:00:00.000Z",
          birthDate: "2022-06-01T00:00:00.000Z",
          details: "Our first child together",
        },
      ],
    },
  ],

  // Complex example with overlapping relationships and multiple children
  complex: [
    {
      id: "1",
      name: "High School Sweetheart",
      startDate: "2005-09-01T00:00:00.000Z",
      endDate: "2009-06-30T00:00:00.000Z",
      color: "#4f46e5", // indigo-600
      details: "My high school relationship that continued into early college years.",
      moreInfoUrl: "",
      highlights: [
        {
          date: "2006-05-20T00:00:00.000Z",
          title: "Prom night",
          description: "Went to senior prom together",
        },
        {
          date: "2008-08-15T00:00:00.000Z",
          title: "College decision",
          description: "Decided to attend different colleges but stay together",
        },
      ],
      children: [],
    },
    {
      id: "2",
      name: "College Relationship",
      startDate: "2009-03-01T00:00:00.000Z", // Note: Overlaps with previous
      endDate: "2012-12-31T00:00:00.000Z",
      color: "#0891b2", // cyan-600
      details: "Met during sophomore year of college. Started dating before officially ending previous relationship.",
      moreInfoUrl: "",
      highlights: [
        {
          date: "2010-03-15T00:00:00.000Z",
          title: "Spring break trip",
          description: "First vacation together to Florida",
        },
        {
          date: "2012-05-20T00:00:00.000Z",
          title: "Graduation",
          description: "Graduated college together",
        },
      ],
      children: [
        {
          id: "c1",
          name: "Surprise Child",
          conceptionDate: "2012-08-15T00:00:00.000Z",
          birthDate: "2013-05-15T00:00:00.000Z",
          details: "Conceived near the end of our relationship, born after we broke up",
        },
      ],
    },
    {
      id: "3",
      name: "Post-College Fling",
      startDate: "2013-02-01T00:00:00.000Z",
      endDate: "2013-09-30T00:00:00.000Z",
      color: "#7c3aed", // violet-600
      details: "Brief relationship after college while starting first job.",
      moreInfoUrl: "",
      highlights: [],
      children: [],
    },
    {
      id: "4",
      name: "Long-Term Partner",
      startDate: "2014-01-15T00:00:00.000Z",
      endDate: "2019-11-30T00:00:00.000Z",
      color: "#ea580c", // orange-600
      details: "Serious long-term relationship that lasted nearly 6 years.",
      moreInfoUrl: "",
      highlights: [
        {
          date: "2015-04-10T00:00:00.000Z",
          title: "Moved in together",
          description: "Got our first apartment",
        },
        {
          date: "2017-07-22T00:00:00.000Z",
          title: "Adopted a pet",
          description: "Adopted our first dog together",
        },
        {
          date: "2018-12-25T00:00:00.000Z",
          title: "Engagement",
          description: "Got engaged on Christmas morning",
        },
      ],
      children: [
        {
          id: "c2",
          name: "First Planned Child",
          conceptionDate: "2016-01-15T00:00:00.000Z",
          birthDate: "2016-10-15T00:00:00.000Z",
          details: "Our first child together",
        },
        {
          id: "c3",
          name: "Second Child",
          conceptionDate: "2018-03-01T00:00:00.000Z",
          birthDate: "2018-12-01T00:00:00.000Z",
          details: "Our second child",
        },
      ],
    },
    {
      id: "5",
      name: "Rebound Relationship",
      startDate: "2019-09-01T00:00:00.000Z", // Note: Overlaps with previous
      endDate: "2020-03-31T00:00:00.000Z",
      color: "#dc2626", // red-600
      details: "Started seeing someone new before officially ending previous relationship.",
      moreInfoUrl: "",
      highlights: [],
      children: [],
    },
    {
      id: "6",
      name: "Pandemic Relationship",
      startDate: "2020-06-01T00:00:00.000Z",
      endDate: "2022-02-28T00:00:00.000Z",
      color: "#16a34a", // green-600
      details: "Met during the pandemic. Relationship developed quickly due to lockdowns.",
      moreInfoUrl: "",
      highlights: [
        {
          date: "2020-11-15T00:00:00.000Z",
          title: "Moved in together",
          description: "Decided to quarantine together permanently",
        },
      ],
      children: [],
    },
    {
      id: "7",
      name: "Current Partner",
      startDate: "2022-05-15T00:00:00.000Z",
      endDate: "2023-12-31T00:00:00.000Z",
      color: "#f59e0b", // amber-500
      details: "My current relationship. Still going strong and building a future together.",
      moreInfoUrl: "",
      highlights: [
        {
          date: "2023-01-01T00:00:00.000Z",
          title: "New Year's resolution",
          description: "Decided to get more serious about our future",
        },
      ],
      children: [
        {
          id: "c4",
          name: "Stepchild",
          conceptionDate: "2019-05-01T00:00:00.000Z", // Note: Before relationship started
          birthDate: "2020-02-01T00:00:00.000Z",
          details: "My partner's child from a previous relationship",
        },
      ],
    },
  ],

  // Sample specifically designed to test analysis features
  analysis: [
    {
      id: "1",
      name: "First Relationship",
      startDate: "2010-01-01T00:00:00.000Z",
      endDate: "2013-06-30T00:00:00.000Z",
      color: "#4f46e5", // indigo-600
      details: "First serious relationship with several overlaps and out-of-range children.",
      moreInfoUrl: "",
      highlights: [],
      children: [
        {
          id: "c1",
          name: "In-Range Child",
          conceptionDate: "2011-05-01T00:00:00.000Z", // Within relationship timeframe
          birthDate: "2012-02-01T00:00:00.000Z",
          details: "Conceived during the relationship",
        },
        {
          id: "c2",
          name: "Out-of-Range Child",
          conceptionDate: "2009-05-01T00:00:00.000Z", // Before relationship started
          birthDate: "2010-02-01T00:00:00.000Z",
          details: "Conceived before the relationship started",
        },
      ],
    },
    {
      id: "2",
      name: "Overlapping Relationship",
      startDate: "2012-01-01T00:00:00.000Z", // Overlaps with First Relationship
      endDate: "2014-12-31T00:00:00.000Z",
      color: "#0891b2", // cyan-600
      details: "This relationship overlaps with the first one for 18 months.",
      moreInfoUrl: "",
      highlights: [],
      children: [
        {
          id: "c3",
          name: "Overlap Child",
          conceptionDate: "2012-06-15T00:00:00.000Z", // During overlap period
          birthDate: "2013-03-15T00:00:00.000Z",
          details: "Conceived during the overlap period",
        },
      ],
    },
    {
      id: "3",
      name: "Gap Relationship",
      startDate: "2015-06-01T00:00:00.000Z", // After a gap
      endDate: "2017-12-31T00:00:00.000Z",
      color: "#16a34a", // green-600
      details: "Relationship after a period of being single.",
      moreInfoUrl: "",
      highlights: [],
      children: [
        {
          id: "c4",
          name: "Post-Relationship Child",
          conceptionDate: "2018-03-01T00:00:00.000Z", // After relationship ended
          birthDate: "2018-12-01T00:00:00.000Z",
          details: "Conceived after the relationship ended",
        },
      ],
    },
    {
      id: "4",
      name: "Multiple Overlap Relationship",
      startDate: "2017-06-01T00:00:00.000Z", // Overlaps with Gap Relationship
      endDate: "2019-06-30T00:00:00.000Z",
      color: "#dc2626", // red-600
      details: "This relationship overlaps with both the previous and next relationships.",
      moreInfoUrl: "",
      highlights: [],
      children: [],
    },
    {
      id: "5",
      name: "Recent Relationship",
      startDate: "2019-01-01T00:00:00.000Z", // Overlaps with Multiple Overlap Relationship
      endDate: "2022-12-31T00:00:00.000Z",
      color: "#f59e0b", // amber-500
      details: "Most recent relationship with multiple analysis flags.",
      moreInfoUrl: "",
      highlights: [],
      children: [
        {
          id: "c5",
          name: "Another Person's Child",
          conceptionDate: "2020-05-01T00:00:00.000Z",
          birthDate: "2021-02-01T00:00:00.000Z",
          details: "Child that belongs to someone else",
        },
        {
          id: "c6",
          name: "Future Child",
          conceptionDate: "2023-05-01T00:00:00.000Z", // After relationship ended
          birthDate: "2024-02-01T00:00:00.000Z",
          details: "Conceived after the relationship ended",
        },
      ],
    },
  ],
}


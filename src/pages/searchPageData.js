

export const categoryOptions = [
  { id: 'hotels', label: 'Hotels', count: 532, icon: 'bed' },
  { id: 'restaurants', label: 'Restaurants', count: 108, icon: 'restaurant' },
  { id: 'local-food', label: 'Local food', count: 260, icon: 'food' },
  { id: 'bars', label: 'Bars & Lounges', count: 347, icon: 'glass' },
  { id: 'parks', label: 'Parks & Recs', count: 54, icon: 'tree' },
  { id: 'cafes', label: 'Cafes', count: 64, icon: 'coffee' },
  { id: 'entertainment', label: 'Entertainment', count: 10, icon: 'ticket' },
  { id: 'shopping', label: 'Shopping', count: 36, icon: 'bag' },
  { id: 'wellness', label: 'Beauty & Wellness', count: 98, icon: 'sparkles' },
  { id: 'services', label: 'Services', count: 330, icon: 'briefcase' },
]

const screenshotNames = [
  'Sky Bar',
  'The Grill Restaurant',
  'Grand Orchid Hotel',
  'The Place Restaurant',
]

const rankedPlaces = [...(directoryData.places ?? [])].sort((first, second) => {
  const firstPreferred = screenshotNames.some((name) => first.name?.includes(name)) ? 1 : 0
  const secondPreferred = screenshotNames.some((name) => second.name?.includes(name)) ? 1 : 0

  if (firstPreferred !== secondPreferred) return secondPreferred - firstPreferred

  const firstScore = (first.verified ? 500 : 0) + (first.rating?.totalReviews ?? 0)
  const secondScore = (second.verified ? 500 : 0) + (second.rating?.totalReviews ?? 0)
  return secondScore - firstScore
})

export const recommendedPlaces = rankedPlaces.slice(0, 9)


import React from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import { FaBed, FaUtensils, FaHamburger, FaCocktail, FaTree } from 'react-icons/fa'

const IMG =
  'https://i.pinimg.com/736x/22/c2/c5/22c2c520f3dfead37f645e9d9974fb3c.jpg'

const categories = [
  { slug: 'hotels', name: 'Hotels', count: '164 spots', Icon: FaBed, pos: 'object-left' },
  { slug: 'restaurants', name: 'Restaurants', count: '412 spots', Icon: FaUtensils, pos: 'object-center' },
  { slug: 'local-food', name: 'Local food', count: '295 spots', Icon: FaHamburger, pos: 'object-right' },
  { slug: 'bars-lounges', name: 'Bars & Lounges', count: '128 spots', Icon: FaCocktail, pos: 'object-top' },
  { slug: 'parks-recreation', name: 'Parks & Rec', count: '46 places', Icon: FaTree, pos: 'object-bottom' },
]

const CategoryCard = ({ slug, name, count, Icon, pos }) => (
  <Link
    to={`/categories/${slug}`}
    className="group relative block h-24 w-full overflow-hidden rounded-xl sm:h-28 lg:h-32"
  >
    <img
      src={IMG}
      alt=""
      loading="lazy"
      referrerPolicy="no-referrer"
      className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${pos}`}
    />

    {/* Dark gradient so the text stays readable */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

    {/* Icon */}
    <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm sm:h-9 sm:w-9">
      <Icon size={14} />
    </span>

    {/* Text */}
    <div className="absolute inset-x-3 bottom-3 text-white">
      <h3 className="truncate text-sm font-bold sm:text-base">{name}</h3>
      <p className="text-[11px] text-white/85 sm:text-xs">{count}</p>
    </div>
  </Link>
)

const Popular = () => {
  return (
    <section className="w-full bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
            Popular Categories
          </h2>
          <Link
            to="/categories"
            className="flex shrink-0 items-center gap-1 text-xs font-medium text-gray-800 transition-colors hover:text-[#3B82F6] sm:text-sm"
          >
            View all categories
            <FiChevronRight size={16} />
          </Link>
        </div>

        {/* Mobile: swipeable row. Desktop: 5 columns */}
        <div className="-mx-4 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:px-0">
          {categories.map((cat) => (
            <div
              key={cat.slug}
              className="w-[42vw] flex-none snap-start sm:w-[30vw] md:w-auto"
            >
              <CategoryCard {...cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Popular
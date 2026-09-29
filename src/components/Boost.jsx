import React from 'react'
import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'

const IMG =
  'https://i.pinimg.com/736x/22/c2/c5/22c2c520f3dfead37f645e9d9974fb3c.jpg'

const stats = [
  { value: '10,000', label: 'WEBSITE VISITORS MONTHLY' },
  { value: '5,000', label: 'PAGE VIEWS DAILY' },
]

const Boost = () => {
  return (
    <section className="w-full bg-slate-50/60 py-8 sm:py-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-8 lg:grid-cols-[minmax(0,45fr)_minmax(0,55fr)] lg:gap-10 lg:px-10">
        {/* Image with caption box */}
        <div className="relative h-64 w-full overflow-hidden rounded-md sm:h-80 md:h-full md:min-h-[20rem] lg:min-h-[22rem]">
          <img
            src={IMG}
            alt="People enjoying a neighborhood spot"
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-x-3 bottom-3 rounded-md bg-black/65 p-4 text-white sm:inset-x-4 sm:bottom-4 sm:p-5">
            <h3 className="text-base font-bold leading-snug sm:text-lg">
              Turn nearby discovery into a familiar face.
            </h3>
            <p className="mt-1 text-xs text-white/75 sm:text-sm">
              Reach people already looking for their next spot.
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p className="text-[10px] font-bold tracking-wide text-[#F59E0B] sm:text-xs">
            LOCALSPOT BOOST
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Put your business on the neighborhood&apos;s radar.
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-500 sm:text-base">
            LocalSpot Boost places your venue in front of nearby people when
            they&apos;re deciding where to shop, eat, and spend time.
          </p>

          {/* Stats */}
          <div className="mt-6 flex items-stretch gap-6 sm:gap-8">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={i > 0 ? 'border-l border-gray-300 pl-6 sm:pl-8' : ''}
              >
                <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[9px] tracking-wide text-gray-500 sm:text-[10px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA + sponsored tag */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              to="/list-business"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#60A5FA] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#3B82F6] sm:justify-start"
            >
              List your business on LocalSpot
              <FiChevronRight size={16} />
            </Link>

            <p className="text-center text-[9px] tracking-wide text-gray-500 sm:text-right sm:text-[10px]">
              SPONSORED PARTNER · AD PLACEMENT
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Boost
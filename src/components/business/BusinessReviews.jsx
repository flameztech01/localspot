import React, { useState, useEffect } from 'react'
import {
  FiStar,
  FiMessageSquare,
  FiCornerUpLeft,
  FiChevronRight,
  FiChevronDown,
  FiCheckCircle,
  FiX,
} from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'

const defaultReviews = [
  {
    id: 1,
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=11',
    rating: 5,
    date: '2 days ago',
    venue: 'The Copper Chimney Bistro',
    text: 'Absolutely amazing experience! The seafood okra was out of this world. The staff were very attentive and the ambiance was perfect for a quiet dinner. Highly recommend!',
    helpful: 24,
    replied: false,
  },
  {
    id: 2,
    name: 'Sarah Smith',
    avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    date: '1 week ago',
    venue: 'Skyline Terrace & Craft Lounge',
    text: 'Great food and lovely atmosphere. The only reason I am giving 4 stars is because we had to wait a bit for a table despite having a reservation. But the food made up for it.',
    helpful: 12,
    replied: true,
    reply: 'Thank you for your feedback, Sarah! We apologize for the wait and will work on improving our reservation system.',
  },
  {
    id: 3,
    name: 'Michael Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    rating: 5,
    date: '2 weeks ago',
    venue: 'Palmwood Suites',
    text: 'One of the best restaurants in Port Harcourt. The catfish pepper soup is a must-try. Clean environment and excellent service.',
    helpful: 38,
    replied: false,
  },
  {
    id: 4,
    name: 'Emily Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    date: '3 weeks ago',
    venue: 'The Copper Chimney Bistro',
    text: 'Celebrated my birthday here and it was fantastic. The staff went above and beyond. The live band was a nice touch!',
    helpful: 19,
    replied: true,
    reply: 'Happy belated birthday, Emily! We are so glad you chose to celebrate with us.',
  },
]

const renderStars = (rating, size = 12) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FaStar
        key={i}
        size={size}
        className={i <= rating ? 'text-amber-400' : 'text-neutral-200'}
      />
    )
  }
  return stars
}

const BusinessReviews = () => {
  const [reviews, setReviews] = useState(defaultReviews)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [filter, setFilter] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)

  // Lock body scroll when bottom sheet is open
  useEffect(() => {
    document.body.style.overflow = selectedReview ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedReview])

  const handleReplySubmit = (id) => {
    if (!replyText.trim()) return
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, replied: true, reply: replyText } : r
      )
    )
    setReplyingTo(null)
    setReplyText('')
  }

  const filteredReviews =
    filter === 'All'
      ? reviews
      : filter === 'Unanswered'
      ? reviews.filter((r) => !r.replied)
      : reviews.filter((r) => r.rating === 5)

  // Calculate rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length
    const percentage = reviews.length ? (count / reviews.length) * 100 : 0
    return { star, count, percentage }
  })

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  const filterOptions = ['All', 'Unanswered', '5 Star']

  return (
    <section className="w-full bg-[#FAFAFA] py-12">
      {/* Section Header (Padded) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Customer Reviews
          </h2>
          <p className="text-sm text-neutral-500 mt-2 font-light">
            Monitor feedback, engage with customers, and build your reputation.
          </p>
        </div>

        {/* Filter Dropdown (Custom) */}
        <div className="relative self-start sm:self-auto shrink-0">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold tracking-wider text-black bg-transparent border border-neutral-300 rounded-lg hover:bg-black hover:text-white transition-all duration-300 uppercase"
          >
            {filter}
            <FiChevronDown
              size={14}
              className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsFilterOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-neutral-200 rounded-lg shadow-lg py-1 z-40">
                {filterOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setFilter(opt)
                      setIsFilterOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                      filter === opt
                        ? 'bg-black text-white'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full border-t border-neutral-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
          
          {/* ========== Rating Summary (Left sidebar on desktop) ========== */}
          <div className="lg:w-80 shrink-0 lg:border-r border-b lg:border-b-0 border-neutral-200 bg-white p-6 lg:py-10">
            <div className="flex flex-col items-center lg:items-start">
              <span className="text-6xl font-semibold tracking-tighter text-black">
                {averageRating}
              </span>
              <div className="flex items-center gap-1 mt-3">
                {renderStars(Math.round(parseFloat(averageRating)), 16)}
              </div>
              <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 mt-3">
                Based on {reviews.length} reviews
              </span>
            </div>

            {/* Distribution Bars */}
            <div className="mt-8 space-y-3">
              {ratingBreakdown.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-neutral-600 font-medium">{star}</span>
                  <FaStar size={10} className="text-amber-400" />
                  <div className="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-6 text-right text-neutral-500 font-medium">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ========== Reviews Feed (Right) ========== */}
          <div className="flex-1 min-w-0">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-20 bg-white">
                <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mx-auto mb-4 border border-neutral-200">
                  <FiMessageSquare size={20} />
                </div>
                <h3 className="text-sm font-semibold text-black uppercase tracking-wider">
                  No reviews found
                </h3>
                <p className="text-xs text-neutral-500 mt-2 font-light">
                  Try changing your filter.
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <React.Fragment key={review.id}>
                  {/* ============ MOBILE: Slim List Row ============ */}
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="lg:hidden w-full flex items-center gap-3 p-4 bg-white border-b border-neutral-200 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-11 h-11 rounded-full object-cover shrink-0 border border-neutral-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-black truncate">
                          {review.name}
                        </h4>
                        {review.replied && (
                          <FiCheckCircle
                            size={12}
                            className="text-emerald-500 shrink-0"
                          />
                        )}
                      </div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 mt-0.5 truncate">
                        {review.venue}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.rating, 10)}
                        </div>
                        <span className="text-[10px] text-neutral-400">
                          {review.date}
                        </span>
                      </div>
                    </div>
                    <FiChevronRight
                      size={18}
                      className="text-neutral-300 shrink-0"
                    />
                  </button>

                  {/* ============ DESKTOP: Full Row ============ */}
                  <div className="hidden lg:block bg-white border-b border-neutral-200 hover:bg-neutral-50 transition-colors duration-300 p-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-11 h-11 rounded-full object-cover shrink-0 border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-black">
                                {review.name}
                              </h4>
                              {review.replied && (
                                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                                  <FiCheckCircle size={10} className="stroke-[3]" />
                                  Replied
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 mt-0.5">
                              {review.venue} · {review.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {renderStars(review.rating, 12)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="mt-4 text-sm text-neutral-600 leading-relaxed font-light">
                      {review.text}
                    </p>

                    {/* Actions Row */}
                    <div className="mt-4 flex items-center justify-between pt-4 border-t border-neutral-100">
                      <span className="text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                        {review.helpful} found helpful
                      </span>
                      {!review.replied ? (
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === review.id ? null : review.id
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
                        >
                          <FiCornerUpLeft size={12} />
                          Reply
                        </button>
                      ) : null}
                    </div>

                    {/* Existing Reply */}
                    {review.replied && review.reply && (
                      <div className="mt-4 ml-4 p-4 bg-neutral-50 border-l-2 border-black">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                          Your Reply
                        </p>
                        <p className="text-xs text-neutral-600 leading-relaxed font-light">
                          {review.reply}
                        </p>
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === review.id && (
                      <div className="mt-4">
                        <textarea
                          rows={2}
                          placeholder="Write your response..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-black resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null)
                              setReplyText('')
                            }}
                            className="px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-black"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(review.id)}
                            className="px-5 py-2 text-xs font-semibold tracking-wider text-white bg-black rounded-lg hover:bg-neutral-800 transition-colors uppercase"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM SHEET MODAL (Mobile Only) ================= */}
      {selectedReview && (
        <div className="lg:hidden fixed inset-0 z-[70] flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setSelectedReview(null)
              setReplyingTo(null)
              setReplyText('')
            }}
          />

          {/* Sheet */}
          <div className="relative w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Drag Handle */}
            <div className="sticky top-0 z-10 bg-white pt-3 pb-2 flex justify-center rounded-t-3xl">
              <div className="w-10 h-1 bg-neutral-300 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setSelectedReview(null)
                setReplyingTo(null)
                setReplyText('')
              }}
              className="absolute top-3 right-4 p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors z-20"
            >
              <FiX size={18} />
            </button>

            {/* Reviewer Info */}
            <div className="px-6 pt-6 pb-4 flex items-center gap-4 border-b border-neutral-100">
              <img
                src={selectedReview.avatar}
                alt={selectedReview.name}
                className="w-14 h-14 rounded-full object-cover border border-neutral-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-black truncate">
                    {selectedReview.name}
                  </h3>
                  {selectedReview.replied && (
                    <FiCheckCircle size={14} className="text-emerald-500" />
                  )}
                </div>
                <p className="text-[10px] font-medium uppercase tracking-widest text-neutral-400 mt-0.5">
                  {selectedReview.venue} · {selectedReview.date}
                </p>
                <div className="flex items-center gap-0.5 mt-1.5">
                  {renderStars(selectedReview.rating, 12)}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              {/* Review Text */}
              <p className="text-sm text-neutral-600 leading-relaxed font-light">
                {selectedReview.text}
              </p>

              {/* Helpful Count */}
              <div className="mt-4 text-[10px] font-medium uppercase tracking-widest text-neutral-400">
                {selectedReview.helpful} found helpful
              </div>

              {/* Existing Reply */}
              {selectedReview.replied && selectedReview.reply && (
                <div className="mt-6 p-4 bg-neutral-50 border-l-2 border-black">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1">
                    Your Reply
                  </p>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {selectedReview.reply}
                  </p>
                </div>
              )}

              {/* Reply Actions */}
              {!selectedReview.replied && (
                <div className="mt-6">
                  {replyingTo === selectedReview.id ? (
                    <>
                      <textarea
                        rows={3}
                        placeholder="Write your response..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full px-3 py-3 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-black resize-none"
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyText('')
                          }}
                          className="flex-1 py-3 text-xs font-semibold text-black border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            handleReplySubmit(selectedReview.id)
                            setSelectedReview((prev) => ({
                              ...prev,
                              replied: true,
                              reply: replyText,
                            }))
                          }}
                          className="flex-1 py-3 text-xs font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 transition-colors uppercase tracking-wider"
                        >
                          Submit
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setReplyingTo(selectedReview.id)}
                      className="w-full py-3 text-xs font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 transition-colors uppercase tracking-wider inline-flex items-center justify-center gap-2"
                    >
                      <FiCornerUpLeft size={14} />
                      Write a Reply
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default BusinessReviews
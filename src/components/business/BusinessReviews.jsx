import React, { useState } from 'react'
import { FiStar, FiMessageSquare, FiCornerDownRight, FiCheck } from 'react-icons/fi'

const sampleReviews = [
  {
    id: 1,
    author: 'Chinedu Eze',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: '2 days ago',
    placeName: 'Royal Crown Bistro',
    comment:
      'Superb dining atmosphere and fast service! The grilled fish was seasoned to perfection. Will definitely bring my colleagues here again.',
    reply: 'Thank you so much Chinedu! We are thrilled you enjoyed the grilled fish.',
  },
  {
    id: 2,
    author: 'Amara Nwosu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    date: '1 week ago',
    placeName: 'The Skyview Lounge & Grill',
    comment:
      'Lovely ambience for an evening drink. Parking was a bit tight around 8pm, but the security team helped guide us.',
    reply: null,
  },
]

const BusinessReviews = () => {
  const [reviews, setReviews] = useState(sampleReviews)
  const [replyText, setReplyText] = useState({})
  const [activeReplyId, setActiveReplyId] = useState(null)

  const handleSendReply = (reviewId) => {
    const text = replyText[reviewId]
    if (!text?.trim()) return

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, reply: text.trim() } : r))
    )
    setActiveReplyId(null)
    setReplyText((prev) => ({ ...prev, [reviewId]: '' }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Customer Reviews & Inquiries</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Read what local visitors are saying and engage directly by responding to reviews.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
                  <p className="text-xs text-gray-400">
                    Reviewed <span className="font-medium text-gray-600">{review.placeName}</span> •{' '}
                    {review.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold">
                <FiStar size={12} className="fill-amber-400 text-amber-400" />
                {review.rating}.0
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>

            {/* Owner Response */}
            {review.reply ? (
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-blue-900">
                <FiCornerDownRight className="text-blue-500 mt-0.5 shrink-0" size={15} />
                <div>
                  <span className="font-bold text-blue-700 block mb-0.5">Response from Owner:</span>
                  <p className="text-gray-700">{review.reply}</p>
                </div>
              </div>
            ) : activeReplyId === review.id ? (
              <div className="space-y-2 pt-2">
                <textarea
                  rows={2}
                  placeholder="Write a courteous public reply..."
                  value={replyText[review.id] || ''}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [review.id]: e.target.value })
                  }
                  className="w-full text-xs rounded-xl border border-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(review.id)}
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActiveReplyId(review.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <FiMessageSquare size={13} />
                Reply to this review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BusinessReviews

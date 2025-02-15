import React from 'react'

function Landing() {
  return (
    <div className='mt-12'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-3xl font-bold text-blue-600">1,245</h3>
            <p className="text-gray-500 text-lg">Total Bookings</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-3xl font-bold text-green-600">15</h3>
            <p className="text-gray-500 text-lg">Upcoming Events</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-3xl font-bold text-red-600">8,910</h3>
            <p className="text-gray-500 text-lg">Tickets Sold</p>
          </div>
        </div>

        <div className="bg-white mt-6 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Bookings
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <p className="text-gray-700 font-medium">
                John Doe - Delhi to Mumbai
              </p>
              <span className="text-blue-600 font-semibold">Confirmed</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <p className="text-gray-700 font-medium">
                Sarah Smith - kasol to Goa
              </p>
              <span className="text-green-600 font-semibold">Completed</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-100 rounded-lg">
              <p className="text-gray-700 font-medium">
                Michael Brown - Ahmedabad to Surat
              </p>
              <span className="text-red-600 font-semibold">Pending</span>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Landing

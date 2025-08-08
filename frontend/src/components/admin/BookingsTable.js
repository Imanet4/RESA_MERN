import React from 'react';

const BookingsTable = ({ bookings }) => {
  return (
    <>
      <h2 className="mb-3">All Bookings</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Room</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Amount Paid</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.user?.name}</td>
                <td>{booking.room?.name}</td>
                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                <td>${booking.amountPaid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BookingsTable;
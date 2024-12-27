'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, InputGroup, FormControl, Spinner, ListGroup, Alert, Modal } from 'react-bootstrap';
import { format } from 'date-fns';

const LeaveRequests = () => {
  // State variables
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');

  // Fetch leave requests with search and sort options
  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`http://localhost:5000/api/leave-requests?search=${search}&sort=${sort}`)
      .then((response) => {
        setLeaveRequests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching leave requests:", error);
        setError('Error fetching leave requests. Please try again later.');
        setLoading(false);
      });
  }, [search, sort]);

  // Handle search input change
  const handleSearchChange = (e) => setSearch(e.target.value);

  // Handle sorting option change
  const handleSortChange = (order) => setSort(order);

  // Handle opening the modal to change the status
  const handleChangeStatus = (request, status) => {
    setSelectedRequest(request);
    setStatusToUpdate(status);
    setShowModal(true);
  };

  // Handle status update in the backend
  const updateLeaveRequestStatus = () => {
    if (!selectedRequest || !statusToUpdate) return;

    axios
      .patch(`http://localhost:5000/api/leave-requests/${selectedRequest.id}/status`, { status: statusToUpdate })
      .then(() => {
        alert(`Leave request ${statusToUpdate === 'Approved' ? 'approved' : 'rejected'}`);
        setLeaveRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest.id ? { ...req, status: statusToUpdate } : req
          )
        );
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        setShowModal(false);
      });
  };

  // Delete leave request
  const deleteLeaveRequest = (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      axios
        .delete(`http://localhost:5000/api/leave-requests/${id}`)
        .then(() => {
          alert('Leave request deleted successfully');
          setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
        })
        .catch((error) => console.error('Error deleting leave request:', error));
    }
  };

  // Format date to a readable format
  const formatDate = (date) => {
    return format(new Date(date), 'PPPppp'); // You can adjust the format as needed
  };

  return (
    <div className="container mt-4">
      {/* Search input */}
      <InputGroup className="mb-4">
        <FormControl
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by name or date"
        />
        <Button variant="outline-secondary" onClick={() => handleSortChange(sort === 'asc' ? 'desc' : 'asc')}>
          {sort === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
        </Button>
      </InputGroup>

      {/* Error alert */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Loading state */}
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <ListGroup>
          {/* List of leave requests */}
          {leaveRequests.map((request) => (
            <ListGroup.Item key={request.id} className="d-flex justify-content-between align-items-center">
              <div>
                <h5>{request.name}</h5>
                <p>
                  {formatDate(request.start_date)} - Status:{' '}
                  <span className={`text-${request.status === 'Approved' ? 'success' : request.status === 'Pending' ? 'warning' : 'danger'}`}>
                    {request.status}
                  </span>
                </p>
              </div>

              <div>
                {/* Delete button */}
                <Button variant="danger" size="sm" onClick={() => deleteLeaveRequest(request.id)}>
                  Delete
                </Button>

                {/* Approve/Reject buttons (only for "Pending" status) */}
                {request.status === 'Pending' && (
                  <>
                    <Button variant="success" size="sm" className="ms-2" onClick={() => handleChangeStatus(request, 'Approved')}>
                      Approve
                    </Button>
                    <Button variant="danger" size="sm" className="ms-2" onClick={() => handleChangeStatus(request, 'Rejected')}>
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Modal for status update */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Leave Request Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {statusToUpdate === 'Approved' ? 'approve' : 'reject'} this leave request?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={updateLeaveRequestStatus}>
            Confirm {statusToUpdate === 'Approved' ? 'Approval' : 'Rejection'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeaveRequests;

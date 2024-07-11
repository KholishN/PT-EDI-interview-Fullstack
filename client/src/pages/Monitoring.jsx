import React, { useEffect, useState } from 'react';
import { API } from "../config/api";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FormProvider, useForm } from '../context/context'; // Sesuaikan path sesuai dengan struktur folder Anda

const Monitoring = () => {
  const navigate = useNavigate();
  const { setEditId } = useForm(); // Dapatkan setEditId dari context
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    position: '',
    dateOfBirth: '',
    placeOfBirth: ''
  });

  // State for handling delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchData(page, sizePerPage);
  }, [page, sizePerPage]);

  const columns = [
    { dataField: 'name', text: 'Nama', sort: true },
    { dataField: 'placeOfBirth', text: 'Tempat Lahir', sort: true },
    { dataField: 'dateOfBirth', text: 'Tanggal Lahir', sort: true },
    { dataField: 'position', text: 'Posisi', sort: true },
    {
      dataField: 'action',
      text: 'Action',
      sort: false,
      formatter: (cell, row) => (
        <div className="action-buttons">
          <Button variant="info" onClick={() => handleEdit(row)}>Edit</Button>{' '}
          <Button variant="danger" onClick={() => handleDelete(row)}>Delete</Button>
        </div>
      ),
      headerStyle: { textAlign: 'center' },
      style: { textAlign: 'center' }
    },
  ];

  const fetchData = async (page, sizePerPage) => {
    try {
      const response = await API.post("/list-forms", {
        search: {
          name: filters.name,
          position: filters.position,
          dateOfBirth: filters.dateOfBirth,
          placeOfBirth: filters.placeOfBirth
        },
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sort: "name",
        order: "desc"
      });

      if (response.data.status === "0") {
        setData(response.data.data);
        setTotalSize(response.data.total);
        setMessage('');
      } else {
        setMessage('Failed to fetch data');
      }
    } catch (err) {
      setMessage('Error fetching data');
    }
  };

  const handleDelete = (row) => {
    setDeleteTarget(row);
    setShowDeleteModal(true);
  };

  const handleEdit = (row) => {
    setEditId(row.idUser); 
    navigate('/form'); 
  }

  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        const response = await API.post("/delete-form", {id:deleteTarget.idUser});
        
        await fetchData(page, sizePerPage);

        setShowDeleteModal(false);
        setDeleteTarget(null);
        const alert = (
          <Alert variant="success" className="py-1">
            {response.data.message}
          </Alert>
        );
        setMessage(alert);
      } catch (error) {
        const alert = (
          <Alert variant="danger" className="py-1">
            {error.response.data.message}
          </Alert>
        );
        setMessage(alert);
      }
    }
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const onTableChange = (type, { page, sizePerPage }) => {
    setPage(page);
    setSizePerPage(sizePerPage);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(page, sizePerPage);
  };

  return (
    <FormProvider> {/* Menggunakan FormProvider */}
    <div className="container mt-4">
      <h1>Monitoring</h1>
      {message && message}
      <Form className="mb-3" onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by Name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by Position"
              name="position"
              value={filters.position}
              onChange={handleFilterChange}
            />
          </Col>
          <Col>
            <Button type="submit">Apply Filters</Button>
          </Col>
        </Row>
      </Form>

      <div className="mt-3">
        <BootstrapTable
          keyField='email'
          data={data}
          columns={columns}
          pagination={paginationFactory({
            page,
            sizePerPage,
            totalSize,
            onPageChange: (page, sizePerPage) => setPage(page),
            onSizePerPageChange: (sizePerPage, page) => setSizePerPage(sizePerPage)
          })}
          onTableChange={onTableChange}
          striped
          hover
          condensed
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={closeDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {deleteTarget && deleteTarget.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  </FormProvider>
  );
};

export default Monitoring;

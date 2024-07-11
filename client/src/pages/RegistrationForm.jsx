import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Alert, Card, Modal, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { API } from "../config/api";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { useForm } from '../context/context';

const RegistrationForm = () => {
  const { editId } = useForm();
  const [position, setPosition] = useState('');
  const [name, setName] = useState('');
  const [noKTP, setNoKTP] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState('');
  const [religion, setReligion] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [status, setStatus] = useState('');
  const [ktpAddress, setKtpAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [willingness, setWillingness] = useState('');
  const [expectedSalery, setExpectedSalery] = useState('');
  const [email, setEmail] = useState('');
  const [education, setEducation] = useState([]);
  const [training, setTraining] = useState([{ trainingName: '', certification: '', year: '' }]);
  const [workHistory, setWorkHistory] = useState([{ company: '', position: '', lastSalary: '', year: '' }]);
  const [skills, setSkills] = useState([{ skillName: '' }]);
  const [message, setMessage] = useState('');
  
  //education table
  const [educationData, setEducationData] = useState([]);
  const [totalSizeEducation, setTotalSizeEducation] = useState(0);
  const [pageEducation, setPageEducation] = useState(1);
  const [sizePerPageEducation, setSizePerPageEducation] = useState(10);
  const [sortFieldEducation, setSortFieldEducation] = useState('year');
  const [sortOrderEducation, setSortOrderEducation] = useState('desc');
  const [showModalEducation, setShowModalEducation] = useState(false);
  const [newEducationData, setNewEducationData] = useState({
    degree: '',
    institution: '',
    major: '',
    year: '',
    gpa: ''
  });
  const [validationEducationErrors, setValidationEducationErrors] = useState({
    degree: '',
    institution: '',
    major: '',
    year: '',
    gpa: ''
  });
  
  //training table
  const [trainingData, setTrainingData] = useState([]);
  const [totalSizeTraining, setTotalSizeTraining] = useState(0);
  const [pageTraining, setPageTraining] = useState(1);
  const [sizePerPageTraining, setSizePerPageTraining] = useState(10);
  const [sortFieldTraining, setSortFieldTraining] = useState('year');
  const [sortOrderTraining, setSortOrderTraining] = useState('desc');
  const [showModalTraining, setShowModalTraining] = useState(false);
  const [newTrainingData, setNewTrainingData] = useState({
    trainingName: '',
    certification: '',
    year: '',
  });

   //workhistory table
   const [workhistoryData, setWorkhistoryData] = useState([]);
   const [totalSizeWorkhistory, setTotalSizeWorkhistory] = useState(0);
   const [pageWorkhistory, setPageWorkhistory] = useState(1);
   const [sizePerPageWorkhistory, setSizePerPageWorkhistory] = useState(10);
   const [sortFieldWorkhistory, setSortFieldWorkhistory] = useState('year');
   const [sortOrderWorkhistory, setSortOrderWorkhistory] = useState('desc');
   const [showModalWorkhistory, setShowModalWorkhistory] = useState(false);
   const [newWorkhistoryData, setNewWorkhistoryData] = useState({
    company: '',
    position: '',
    lastSalery: '',
    year: ''
   });

    //skill table
    const [skillData, setSkillData] = useState([]);
    const [totalSizeSkill, setTotalSizeSkill] = useState(0);
    const [pageSkill, setPageSkill] = useState(1);
    const [sizePerPageSkill, setSizePerPageSkill] = useState(10);
    const [sortFieldSkill, setSortFieldSkill] = useState('skill');
    const [sortOrderSkill, setSortOrderSkill] = useState('desc');
    const [showModalSkill, setShowModalSkill] = useState(false);
    const [newSkillData, setNewSkillData] = useState({
     skill: ''
    });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            "Content-type": "application/json"
          },
          withCredentials: true
        };

        const body = {userId : editId}

        const response = await API.post("/form", body,config);

        if (response.data.status === "0") {
          const formData = response.data.data;
          setPosition(formData.position || '');
          setName(formData.name || '');
          setNoKTP(formData.noKTP || '');
          setPlaceOfBirth(formData.placeOfBirth || '');
          setDateOfBirth(formData.dateOfBirth ? moment(formData.dateOfBirth, 'DD-MMM-YYYY').toDate() : null);
          setGender(formData.gender || '');
          setReligion(formData.religion || '');
          setBloodType(formData.bloodType || '');
          setStatus(formData.status || '');
          setKtpAddress(formData.ktpAddress || '');
          setCurrentAddress(formData.currentAddress || '');
          setPhoneNumber(formData.phoneNumber || '');
          setEmergencyContact(formData.emergencyContact || '');
          setWillingness(formData.willingness || '');
          setExpectedSalery(formData.expectedSalery || '');
          setEmail(formData.email || '');
          setEducation(formData.education || []);
          setTraining(formData.training || []);
          setWorkHistory(formData.workHistory || []);
          setSkills(formData.skills || []);
          fetchEducation();
          fetchTraining();
          fetchWorkhistory();
          fetchSkill();
        }

      } catch (err) {
        console.log("Form Error:", err);
      }
    };

    fetchData();
  }, []);

  const handleChangeDate = (date) => {
    setDateOfBirth(date);
  };

  const columnsEducation = [
    { dataField: 'degree', text: 'Jenjang Pendidikan Terakhir', sort: true },
    { dataField: 'institution', text: 'Nama Institusi Akademik', sort: true },
    { dataField: 'major', text: 'Jurusan', sort: true },
    { dataField: 'year', text: 'Tahus Lulus', sort: true },
    { dataField: 'gpa', text: 'IPK', sort: true },
  ];

  const onTableChangeEducation = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setPageEducation(page);
    setSizePerPageEducation(sizePerPage);
    setSortFieldEducation(sortField);
    setSortOrderEducation(sortOrder);
  };

  const fetchEducation = async () => {
    try {
      const response = await API.post('/list-educations', {
        search: {
          degree: '',
          institution: ''
        },
        offset: (pageEducation - 1) * sizePerPageEducation,
        limit: sizePerPageEducation,
        sort: sortFieldEducation,
        order: sortOrderEducation
      });

      setEducation(response.data.data);
      setEducationData(response.data.data);
      setTotalSizeEducation(response.data.total);
      setPageEducation(pageEducation);
      setSizePerPageEducation(sizePerPageEducation);

      console.log(education)
    } catch (err) {
      console.error("Error fetching education data:", err);
    }
  };

 

  const handleEducationChange = (e, index, field) => {
    const updatedEducation = [...education];
    updatedEducation[index][field] = e.target.value;
    setEducation(updatedEducation);
  };

  const handleAddEducation = () => {
    setNewEducationData({
      degree: '',
      institution: '',
      major: '',
      year: '',
      gpa: ''
    });
    setShowModalEducation(true);
  };

  const handleCloseModalEducation = () => {
    setShowModalEducation(false);
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    const error = validateField(field, value);

    setValidationEducationErrors({ ...validationEducationErrors, [field]: error });
    handleModalEducationInputChange(e, field);
  };

  const handleSubmitModalEducation = () => {
    const updatedEducation = [...education, newEducationData];
    setEducation(updatedEducation);
    console.log(updatedEducation)
    setShowModalEducation(false);
  };

  const handleModalEducationInputChange = (e, field) => {
    setNewEducationData({
      ...newEducationData,
      [field]: e.target.value
    });
  };

  const validateField = (field, value) => {
    if (!value) {
      return `${field} is required.`;
    }
    if (field === 'gpa' && (parseFloat(value) < 0 || parseFloat(value) > 4.0)) {
      return 'GPA must be between 0.00 and 4.00.';
    }
    return '';
  };

  //training
  const columnsTraining = [
    { dataField: 'trainingName', text: 'Nama Kursus/Seminar', sort: true },
    { dataField: 'certification', text: 'Sertifikat(ada/tidak)', sort: true },
    { dataField: 'year', text: 'Tahun', sort: true }
  ];

  const onTableChangeTraining = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setPageTraining(page);
    setSizePerPageTraining(sizePerPage);
    setSortFieldTraining(sortField);
    setSortOrderTraining(sortOrder);
  };

  const fetchTraining = async () => {
    try {
      const response = await API.post('/list-trainings', {
        search: {
          degree: '',
          institution: ''
        },
        offset: (pageTraining - 1) * sizePerPageTraining,
        limit: sizePerPageTraining,
        sort: sortFieldTraining,
        order: sortOrderTraining
      });

      setTraining(response.data.data);
      setTrainingData(response.data.data);
      setTotalSizeTraining(response.data.total);
      setPageTraining(pageTraining);
      setSizePerPageTraining(sizePerPageTraining);

    } catch (err) {
      console.error("Error fetching Training data:", err);
    }
  };

 

  const handleTrainingChange = (e, index, field) => {
    const updatedTraining = [...training];
    updatedTraining[index][field] = e.target.value;
    setTraining(updatedTraining);
  };

  const handleAddTraining = () => {
    setNewTrainingData({
      trainingName: '',
      certification: '',
      year: ''
    });
    setShowModalTraining(true);
  };

  const handleCloseModalTraining = () => {
    setShowModalTraining(false);
  };

  const handleSubmitModalTraining = () => {
    const updatedTraining = [...training, newTrainingData];
    setTraining(updatedTraining);
    setShowModalTraining(false);
  };

  const handleModalTrainingInputChange = (e, field) => {
    setNewTrainingData({
      ...newTrainingData,
      [field]: e.target.value
    });
  };


  //workhistory
  const columnsWorkhistory = [
    { dataField: 'company', text: 'Nama Perusahaan', sort: true },
    { dataField: 'position', text: 'Posisi Terakhir', sort: true },
    { dataField: 'lastSalery', text: 'Pendapatan Terakhir', sort: true },
    { dataField: 'year', text: 'Tahun', sort: true }
  ];

  const onTableChangeWorkhistory = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setPageWorkhistory(page);
    setSizePerPageWorkhistory(sizePerPage);
    setSortFieldWorkhistory(sortField);
    setSortOrderWorkhistory(sortOrder);
  };

  const fetchWorkhistory = async () => {
    try {
      const response = await API.post('/list-work-hitories', {
        search: {
          degree: '',
          institution: ''
        },
        offset: (pageWorkhistory - 1) * sizePerPageWorkhistory,
        limit: sizePerPageWorkhistory,
        sort: sortFieldWorkhistory,
        order: sortOrderWorkhistory
      });

     
      setWorkHistory(response.data.data);
      setWorkhistoryData(response.data.data);
      setTotalSizeWorkhistory(response.data.total);
      setPageWorkhistory(pageWorkhistory);
      setSizePerPageWorkhistory(sizePerPageWorkhistory);
    } catch (err) {
      console.error("Error fetching Workhistory data:", err);
    }
  };
 
  const handleWorkhistoryChange = (e, index, field) => {
    const updatedWorkhistory = [...workHistory];
    updatedWorkhistory[index][field] = e.target.value;
    setWorkHistory(updatedWorkhistory);
  };

  const handleAddWorkhistory = () => {
    setNewWorkhistoryData({
      company: '',
      position: '',
      lastSalery: '',
      year: ''
    });
    setShowModalWorkhistory(true);
  };

  const handleCloseModalWorkhistory = () => {
    setShowModalWorkhistory(false);
  };

  const handleSubmitModalWorkhistory = () => {
    const updatedWorkhistory = [...workHistory, newWorkhistoryData];
    setWorkHistory(updatedWorkhistory);
    setShowModalWorkhistory(false);
  };

  const handleModalWorkhistoryInputChange = (e, field) => {
    setNewWorkhistoryData({
      ...newWorkhistoryData,
      [field]: e.target.value
    });
  };

    //skill
    const columnsSkill = [
      { dataField: 'skill', text: 'Skill', sort: true }
    ];
  
    const onTableChangeSkill = (type, { page, sizePerPage, sortField, sortOrder }) => {
      setPageSkill(page);
      setSizePerPageSkill(sizePerPage);
      setSortFieldSkill(sortField);
      setSortOrderSkill(sortOrder);
    };
  
    const fetchSkill = async () => {
      try {
        const response = await API.post('/list-skills', {
          search: {
            degree: '',
            institution: ''
          },
          offset: (pageSkill - 1) * sizePerPageSkill,
          limit: sizePerPageSkill,
          sort: sortFieldSkill,
          order: sortOrderSkill
        });
  
        setSkills(response.data.data);
        setSkillData(response.data.data);
        setTotalSizeSkill(response.data.total);
        setPageSkill(pageSkill);
        setSizePerPageSkill(sizePerPageSkill);
      } catch (err) {
        console.error("Error fetching Skill data:", err);
      }
    };
   
    const handleSkillChange = (e, index, field) => {
      const updatedSkill = [...skills];
      updatedSkill[index][field] = e.target.value;
      setSkills(updatedSkill);
    };
  
    const handleAddSkill = () => {
      setNewSkillData({
        skill: ''
      });
      setShowModalSkill(true);
    };
  
    const handleCloseModalSkill = () => {
      setShowModalSkill(false);
    };
  
    const handleSubmitModalSkill = () => {
      const updatedSkill = [...skills, newSkillData];
      setSkills(updatedSkill);
      setShowModalSkill(false);
    };
  
    const handleModalSkillInputChange = (e, field) => {
      setNewSkillData({
        ...newSkillData,
        [field]: e.target.value
      });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        userId : editId,
        position,
        name,
        noKTP,
        placeOfBirth,
        dateOfBirth: dateOfBirth ? moment(dateOfBirth).format('DD-MMM-YYYY') : '',
        gender,
        religion,
        bloodType,
        status,
        ktpAddress,
        currentAddress,
        phoneNumber,
        emergencyContact,
        willingness,
        expectedSalery,
        education,
        training,
        workHistory,
        skills
      };

      const config = {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      };

      const response = await API.post("/update-form", formData, config);

      setMessage("Form submitted successfully!");

      fetchEducation();
      fetchTraining();
      fetchWorkhistory();
      fetchSkill();
      const alert = (
        <Alert variant="success" className="py-1">
          {response.data.message}
        </Alert>
      );
      setMessage(alert);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Submit Form Error:", err);
      const alert = (
        <Alert variant="danger" className="py-1">
          {err.response.data.message}
        </Alert>
      );
      setMessage(alert);
      window.scrollTo(0, 0);
    }
  };

  return (
    <Container fluid className="py-4" style={{ backgroundColor: "#f0f0f0" }}>
      <h2 className="text-center mb-4">BIODATA CALON KARYAWAN</h2>
      {message && <p>{message}</p>}
      <Card className="p-4" style={{ border: '1px solid #ddd', backgroundColor: "#fff" }}>
        <Form onSubmit={handleSubmit}>
          {/* Form Inputs */}
          <Row className="mb-3">
            <Col>
              <Form.Label>Posisi Yang Dilamar</Form.Label>
              <Form.Control type="text" value={position} onChange={(e) => setPosition(e.target.value)} placeholder="Posisi Yang Anda Dilamar" />
            </Col>
            <Col>
              <Form.Label>Nama</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>No. KTP</Form.Label>
              <Form.Control type="text" value={noKTP} onChange={(e) => setNoKTP(e.target.value)} placeholder="Nomor KTP Anda" />
            </Col>
            <Col>
              <Form.Label>Tempat Lahir</Form.Label>
              <Form.Control type="text" value={placeOfBirth} onChange={(e) => setPlaceOfBirth(e.target.value)} placeholder="Tempat Lahir Anda" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Tanggal Lahir</Form.Label>
              <InputGroup>
                <DatePicker
                  selected={dateOfBirth}
                  onChange={handleChangeDate}
                  dateFormat="dd-MMM-yyyy"
                  placeholderText="Pilih Tanggal"
                  className="form-control"
                />
              </InputGroup>
            </Col>
            <Col>
              <Form.Label>Jenis Kelamin</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Laki-Laki"
                  name="gender"
                  type="radio"
                  id="laki-laki"
                  checked={gender === 'Laki-Laki'}
                  onChange={() => setGender('Laki-Laki')}
                />
                <Form.Check
                  inline
                  label="Perempuan"
                  name="gender"
                  type="radio"
                  id="perempuan"
                  checked={gender === 'Perempuan'}
                  onChange={() => setGender('Perempuan')}
                />
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Agama</Form.Label>
              <Form.Control type="text" value={religion} onChange={(e) => setReligion(e.target.value)} placeholder="Agama Anda" />
            </Col>
            <Col>
              <Form.Label>Golongan Darah</Form.Label>
              <Form.Control type="text" value={bloodType} onChange={(e) => setBloodType(e.target.value)} placeholder="Golongan Darah Anda" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Status</Form.Label>
              <Form.Control type="text" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Status Anda" />
            </Col>
            <Col>
              <Form.Label>Alamat Sesuai KTP</Form.Label>
              <Form.Control type="text" value={ktpAddress} onChange={(e) => setKtpAddress(e.target.value)} placeholder="Alamat Sesuai KTP Anda" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Alamat Sekarang</Form.Label>
              <Form.Control type="text" value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} placeholder="Alamat Sekarang Anda" />
            </Col>
            <Col>
              <Form.Label>No. Handphone</Form.Label>
              <Form.Control type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Nomor Handphone Anda" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Kontak Darurat</Form.Label>
              <Form.Control type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Kontak Darurat Anda" />
            </Col>
            <Col>
              <Form.Label>Bersedia Ditempatkan Di Seluruh Kantor Perushaan (Ya/Tidak)</Form.Label>
              <Form.Control type="text" value={willingness} onChange={(e) => setWillingness(e.target.value)} placeholder="Kemauan Anda" />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Expected Salary</Form.Label>
              <Form.Control type="text" value={expectedSalery} onChange={(e) => setExpectedSalery(e.target.value)} placeholder="Expected Salary Anda" />
            </Col>
            <Col>
              <Form.Label>Email</Form.Label>
              <Form.Control disabled type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Anda" />
            </Col>
          </Row>

          {/* Education Table */}
          <Row className="mb-3">
            <Col>
              <h5>Pendidikan</h5>
              <Button variant="success" onClick={handleAddEducation} className="mb-3 float-end">
                Tambah Pendidikan
              </Button>
              <BootstrapTable
                keyField='id'
                data={education}
                columns={columnsEducation}
                pagination={paginationFactory({
                  page: pageEducation,
                  sizePerPage: sizePerPageEducation,
                  totalSize: totalSizeEducation,
                  onPageChange: (page, sizePerPage) => fetchEducation(page, sizePerPage),
                  onSizePerPageChange: (sizePerPage, page) => fetchEducation(page, sizePerPage)
                })}
                onTableChange={onTableChangeEducation}
                striped
                hover
                condensed
              />
            </Col>
          </Row>

          {/* Modal for Adding Education */}
          <Modal show={showModalEducation} onHide={handleCloseModalEducation}>
      <Modal.Header closeButton>
        <Modal.Title>Tambah Pendidikan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Jenjang Pendidikan Terakhir</Form.Label>
          <Form.Control
            type="text"
            value={newEducationData.degree}
            onChange={(e) => handleInputChange(e, 'degree')}
            placeholder="Degree"
            isInvalid={!!validationEducationErrors.degree}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationEducationErrors.degree}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nama Institusi Akademik</Form.Label>
          <Form.Control
            type="text"
            value={newEducationData.institution}
            onChange={(e) => handleInputChange(e, 'institution')}
            placeholder="Institution"
            isInvalid={!!validationEducationErrors.institution}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationEducationErrors.institution}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Jurusan</Form.Label>
          <Form.Control
            type="text"
            value={newEducationData.major}
            onChange={(e) => handleInputChange(e, 'major')}
            placeholder="Major"
            isInvalid={!!validationEducationErrors.major}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationEducationErrors.major}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tahun Lulus</Form.Label>
          <Form.Control
            type="number"
            value={newEducationData.year}
            onChange={(e) => handleInputChange(e, 'year')}
            placeholder="Year"
            isInvalid={!!validationEducationErrors.year}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationEducationErrors.year}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>IPK</Form.Label>
          <Form.Control
            step="0.01"
            max="4.0"
            type="number"
            value={newEducationData.gpa}
            onChange={(e) => handleInputChange(e, 'gpa')}
            placeholder="GPA"
            isInvalid={!!validationEducationErrors.gpa}
            required
          />
          <Form.Control.Feedback type="invalid">
            {validationEducationErrors.gpa}
          </Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModalEducation}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmitModalEducation}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>

          {/* Training Table */}
          <Row className="mb-3">
            <Col>
              <h5>Riwayat Pelatihan</h5>
              <Button variant="success" onClick={handleAddTraining} className="mb-3 float-end">
                Tambah Pelatihan
              </Button>
              <BootstrapTable
                keyField='id'
                data={training}
                columns={columnsTraining}
                pagination={paginationFactory({
                  page: pageTraining,
                  sizePerPage: sizePerPageTraining,
                  totalSize: totalSizeTraining,
                  onPageChange: (page, sizePerPage) => fetchTraining(page, sizePerPage),
                  onSizePerPageChange: (sizePerPage, page) => fetchTraining(page, sizePerPage)
                })}
                onTableChange={onTableChangeTraining}
                striped
                hover
                condensed
              />
            </Col>
          </Row>

          {/* Modal for Adding Training */}
          <Modal show={showModalTraining} onHide={handleCloseModalTraining}>
            <Modal.Header closeButton>
              <Modal.Title>Tambah Pendidikan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nama Kursus/Seminar</Form.Label>
                <Form.Control type="text" value={newTrainingData.trainingName} onChange={(e) => handleModalTrainingInputChange(e, 'trainingName')} placeholder="Nama Kursus/Seminar" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Sertifikat(ada/tidak)</Form.Label>
                <Form.Control type="text" value={newTrainingData.certification} onChange={(e) => handleModalTrainingInputChange(e, 'certification')} placeholder="Institution" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tahun</Form.Label>
                <Form.Control type="text" value={newTrainingData.year} onChange={(e) => handleModalTrainingInputChange(e, 'year')} placeholder="Tahun" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModalTraining}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmitModalTraining}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          {/* WorkHistory Table */}
          <Row className="mb-3">
            <Col>
              <h5>Riwayat Pekerjaan</h5>
              <Button variant="success" onClick={handleAddWorkhistory} className="mb-3 float-end">
                Tambah Pekerjaan
              </Button>
              <BootstrapTable
                keyField='id'
                data={workHistory}
                columns={columnsWorkhistory}
                pagination={paginationFactory({
                  page: pageWorkhistory,
                  sizePerPage: sizePerPageWorkhistory,
                  totalSize: totalSizeWorkhistory,
                  onPageChange: (page, sizePerPage) => fetchWorkhistory(page, sizePerPage),
                  onSizePerPageChange: (sizePerPage, page) => fetchWorkhistory(page, sizePerPage)
                })}
                onTableChange={onTableChangeWorkhistory}
                striped
                hover
                condensed
              />
            </Col>
          </Row>

          {/* Modal for Adding WorkHistory */}
          <Modal show={showModalWorkhistory} onHide={handleCloseModalWorkhistory}>
            <Modal.Header closeButton>
              <Modal.Title>Tambah Pekerjaan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Nama Perusahaan</Form.Label>
                <Form.Control type="text" value={newWorkhistoryData.company} onChange={(e) => handleModalWorkhistoryInputChange(e, 'company')} placeholder="Nama Perusahaan" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Posisi Terakhir</Form.Label>
                <Form.Control type="text" value={newWorkhistoryData.position} onChange={(e) => handleModalWorkhistoryInputChange(e, 'position')} placeholder="Posisi Terakhir" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pendapatan Terakhir</Form.Label>
                <Form.Control type="text" value={newWorkhistoryData.lastSalery} onChange={(e) => handleModalWorkhistoryInputChange(e, 'lastSalery')} placeholder="Pendapatan Terakhir" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tahun</Form.Label>
                <Form.Control type="text" value={newWorkhistoryData.year} onChange={(e) => handleModalWorkhistoryInputChange(e, 'year')} placeholder="Tahun" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModalWorkhistory}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmitModalWorkhistory}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Skill Table */}
          <Row className="mb-3">
            <Col>
              <h5>Skills</h5>
              <Button variant="success" onClick={handleAddSkill} className="mb-3 float-end">
                Tambah Skill
              </Button>
              <BootstrapTable
                keyField='id'
                data={skills}
                columns={columnsSkill}
                pagination={paginationFactory({
                  page: pageSkill,
                  sizePerPage: sizePerPageSkill,
                  totalSize: totalSizeSkill,
                  onPageChange: (page, sizePerPage) => fetchSkill(page, sizePerPage),
                  onSizePerPageChange: (sizePerPage, page) => fetchSkill(page, sizePerPage)
                })}
                onTableChange={onTableChangeSkill}
                striped
                hover
                condensed
              />
            </Col>
          </Row>

          {/* Modal for Adding Skill */}
          <Modal show={showModalSkill} onHide={handleCloseModalSkill}>
            <Modal.Header closeButton>
              <Modal.Title>Tambah Pekerjaan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Skill</Form.Label>
                <Form.Control type="text" value={newSkillData.skill} onChange={(e) => handleModalSkillInputChange(e, 'skill')} placeholder="Skill" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModalSkill}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmitModalSkill}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default RegistrationForm;

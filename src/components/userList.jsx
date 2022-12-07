import React, { useEffect, useState } from "react";
import axios from 'axios';
import Swal from 'sweetalert2';

/* MUI Dependencies */
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/Card';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';


const UserList = () => {

    const [rows,setRows] = useState([]);
    const [open,setOpen] = useState(false);

    const [userId,setUserId] = useState('');
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [mobile,setMobile] = useState('');
    
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState('')
    const [fileURL, setFileURL] = useState('')

  
    const columns = [
        {
            field: '_id',
            headerName: 'id',
            width: 250,
            headerClassName: 'header-style',
          },
        {
          field: 'name',
          headerName: 'Name',
          width: 250,
          headerClassName: 'header-style',
        },
        {
          field: 'email',
          headerName: 'Email',
          width: 250,
          headerClassName: 'header-style',
        },
        {
          field: 'mobile',
          headerName: 'Mobile No.',
          width: 250,
          headerClassName: 'header-style',
        },
        {
            field: 'image_url',
            headerName: 'Image',
            width: 400,
            headerClassName: 'header-style',
            renderCell: (params) => {
              let img_url = 'http://localhost:4001/images/'+params.row.image_url
              if(params.row.image_url){
              return (
                <>
                  <img src={img_url} width="50px" height="50px" />
                </>
              );
              }
            },
          },
        {
          field: 'action',
          headerName: 'Action',
          sortable: false,
          headerAlign: 'center',
          headerClassName: 'header-style',
          width: 250,
          renderCell: (params) => {
            return (
              <>
                  <Button variant="contained"
                  style={{marginRight:'20px'}}
                  onClick={function EditRow() {
                     axios
                     .get(
                       `http://localhost:4001/` + params.id,
                     )
                     .then((res) => {
                        if(res.status === 200){
                            setOpen(true);
                            setUserId(res.data.user._id);
                            setName(res.data.user.name);
                            setEmail(res.data.user.email);
                            setMobile(res.data.user.mobile);
                            setFileURL('http://localhost:4001/images/'+res.data.user.image_url);
                            setFileName(res.data.user.image_url);
                        }
                     });

                  }}>
                    Edit
                  </Button>
                  <Button
                      variant="contained"
                      style={{backgroundColor:'red'}}
                     onClick={function DeleteRow() {
                        Swal.fire({
                          title: 'Are you sure?',
                          text: "You won't be able to revert this!",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#0f3c81',
                          confirmButtonText: 'Yes, delete it!',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire('Deleted!', '', 'success')
                            axios
                              .delete(
                                `http://localhost:4001/${params.id}`
                              )
                              .then((res) => {
                                if (res.status === 200) {
                                    getAllUser();
                                }
                              });
                          }
                        });
                      }}
                      >
                        delete
                  </Button>
                </> 
            );
          },
        }
      ];

    useEffect(() => {
        getAllUser();
      }, []);

    // Get all use list
    function getAllUser(){
        axios
      .get(
        'http://localhost:4001/',
      )
      .then((res) => {
        setRows(res.data.user);
      });
    }  

    // Open dialog
      const handleClickOpen = () => {
        setUserId('')
        setName('');
        setEmail('');
        setMobile('');
        setFile('');
        setFileName(undefined);
        setFileURL('');
        setOpen(true);
      };
    
    // Close dialog  
      const handleClose = () => {
        setOpen(false);
      };

      function imageChange(e) {
        setFile(e.target.files[0]);
        setFileURL(URL.createObjectURL(e.target.files[0]));
        setFileName(e.target.files[0].name);
      }

    // Click save button event
    function handleSubmit(event){
        event.preventDefault();
        let formData = new FormData()
        formData.append('photo', file)
        
      // User Id exist
        if(userId !== ''){
           const bodyparam = {
              email: email,
              name: name,
              mobile: mobile,
              image_url:fileName
            };
          axios.patch(
              `http://localhost:4001/upload/`+userId,
              formData
            )
              .then((response) => {
                if (response.status === 201) {
           axios.patch(
                    `http://localhost:4001/`+userId,
                    bodyparam
                  )
                    .then((response) => {
                      if (response.status === 201) {
                        getAllUser();
                        handleClose();
                      } else {
                      }
                    })
                    .catch((error) => {
                        handleClose();
                    });
                } else {
                }
              })
              .catch((error) => {
                  handleClose();
              });

        }else{
        const bodyparam = {
            email: email,
            name: name,
            mobile: mobile,
            image_url:fileName
          };
        axios.post(
            `http://localhost:4001/upload`,
            formData
          )
            .then((response) => {
              if (response.status === 200) {
            axios.post(
                  `http://localhost:4001/`,
                  bodyparam
                )
                  .then((response) => {
                    if (response.status === 200) {
                      getAllUser();
                      handleClose();
                    } else {
                    }
                  })
                  .catch((error) => {
                      handleClose();
                  });
              } else {

              }      
            })
            .catch((error) => {
                handleClose();
            });
        }    
    }
  
    
    return (
        <div>
            <Card style={{ marginTop: '50px', padding: '20px' }}>
            <div>  
              <Button variant="contained" style={{marginBottom:'30px'}} onClick={handleClickOpen}>Add User</Button>
            </div>
            <Box style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                rowsPerPageOptions={[5, 10, 15, 20]}
                pagination
                checkboxSelection
                getRowId={(row) => row._id}
            />
            </Box>
            </Card>

            <Dialog open={open} onClose={handleClose} maxWidth={'md'} fullWidth={true}>
        <DialogTitle>User</DialogTitle>
        <DialogContent>
        <form onSubmit={handleSubmit}> 
        <input type="hidden" value={userId} /> 
          <TextField
            id="fullWidth"
            label="Name"
            type="name"
            name="name"
            sx={{ width: '100%', marginTop: '8px' }}
            value={name}
            onChange={event => setName(event.target.value)}
            required
          />
          <TextField
            id="fullWidth"
            label="Email Address"
            type="email"
            name="email"
            sx={{ width: '100%', marginTop: '8px' }}
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
          />
          <TextField
            id="fullWidth"
            label="Mobile"
            type="number"
            name="mobile"
            sx={{ width: '100%', marginTop: '8px' }}
            value={mobile}
            onChange={event => setMobile(event.target.value)}
            required
          />
          <div>
            <input type="file" name="photo" onChange={imageChange} />
            {fileName !== undefined ? (
            <img src={fileURL} width="200px" height="200px" /> ):null}
          </div>
          <div style={{float:'right'}}>
            <Button variant="contained" onClick={handleSubmit}>Save</Button>
            <Button variant="outlined" onClick={handleClose} style={{marginLeft:'15px'}}>Cancel</Button>
          </div>
          </form>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions> */}
      </Dialog>
        </div>
    )
}

export default UserList;
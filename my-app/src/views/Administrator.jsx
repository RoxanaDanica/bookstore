import BookForm from "../components/BookForm";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState } from "react";
import { useEffect } from "react";
import { deleteBook, getBooks } from "../api/books";
import { useNavigate } from "react-router";
import { addDocument } from "../api/uploadFile"; 

// import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Button from '@mui/joy/Button';
import SvgIcon from '@mui/joy/SvgIcon';
import { styled } from '@mui/joy';


function Administrator() {
    const [books, setBooks] = useState([]);
    let navigate = useNavigate();

    useEffect(() => {
        console.log('home page');
        getBooks().then((response) => {
            console.log(response.data);
            setBooks(response.data);
        })
    }, []);
    const removeBook = async(id) => {
      await deleteBook(id);
      const updatedBooks = books.filter(b => b.id != id);
      setBooks(updatedBooks);
    } 

    const handleEdit = (id) => {
        navigate(`/formular/${id}`,  { state: { disabled: false } });
        console.log('id home',id)
    }

    const handleState = (id) => {  
        navigate(`/formular/${id}`, { state: { disabled: true } });  
        console.log('id administartor view mode', id);
    };
    const handleAddBook = () => {
        navigate('/formular', { state: { disabled: false } });
    }
    const uploadFileRouter = (event) => {
        const file = event.target.files[0];

        console.log('document out', file);
        if(document) {
            console.log('document', document);
            addDocument(file);
        }
    }
    const columns = [
        { field: 'isbn', headerName: 'ISBN', width: 130 },
        { field: 'title', headerName: 'Title', width: 150 },
        { field: 'author', headerName: 'Author', width: 150 },
        {
            field: 'coverImage',
            headerName: 'Copertă',
            width: 150,
            sortable: false,
            renderCell: (params) => {
                return (
                <img
                    src={params.value ? params.value: 'https://www.blurb.com/blog/wp-content/uploads/2020/07/20200717_BookCoversExplained_Inline_Images_v1_01-1-1024x600.jpg'}     
                    alt={params.row.title} 
                    className="w-full h-full object-contain rounded-md"
                />
                
                )
            }
        },
        {
            field: 'actions',              
            headerName: 'Actions',    
            width: 180,
            sortable: false,
            renderCell: (params) => (
            <>
                <button  onClick={() => handleEdit(params.row.id)} className="mr-2 px-2 py-1 bg-green-500 text-white border-none rounded cursor-pointer" >  Edit </button>
                <button onClick={() => removeBook(params.row.id)}  className="px-2 py-1 bg-red-500 text-white border-none rounded cursor-pointer"> Delete </button>
            </>
            )
        }
    ];  
    const rows = books.map(book => ({
        id: book.id,
        isbn: book.isbn,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,

    }));
    const paginationModel = { page: 0, pageSize: 15 };
    const VisuallyHiddenInput = styled('input')`
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        bottom: 0;
        left: 0;
        white-space: nowrap;
        width: 1px;
    `;
    return(
        <>
            <h3></h3>
           <Box sx={{display:"flex", gap: 2, paddingBottom:"30px", width: "100%", justifyContent:"space-between"}}>
                <h3 className="m-0" >Add new book</h3>
                <Button onClick={handleAddBook} size="small" variant="outlined">Add</Button>
           </Box>
            <Box sx={{display:"flex", gap: 2, paddingBottom:"30px", width: "100%", justifyContent:"space-between"}}>
                <h3 className="m-0">Add an Excel with books</h3>
                <Button
                    component="label"
                    // enctype="multipart/form-data"
                    role={undefined}
                    tabIndex={-1}
                    variant="outlined"
                    color="neutral"
                    startDecorator={
                    <SvgIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round"  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg> 
                    </SvgIcon> }  >Upload a file <VisuallyHiddenInput type="file" accept=".xlsx" onChange={uploadFileRouter} />
                </Button>
           </Box>
            <Paper sx={{ height: 850, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[15, 30]}
                checkboxSelection
                sx={{ border: 0 }}
                onCellClick={(params) => {
                    if (params.field !== 'actions') {
                        handleState(params.row.id);
                    }
                }}
            />
            </Paper>
        </>
    )
};

export default Administrator;
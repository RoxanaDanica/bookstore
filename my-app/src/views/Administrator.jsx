import BookForm from "../components/BookForm";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState } from "react";
import { useEffect } from "react";
import { deleteBook, getBooks } from "../api/books";
import { useNavigate } from "react-router";

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
                    style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '4px'
                    }}
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
                <button  onClick={() => handleEdit(params.row.id)} style={{ marginRight: '8px', padding: '4px 8px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}} >  Edit </button>
                <button onClick={() => removeBook(params.row.id)}  style={{  padding: '4px 8px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}> Delete </button>
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
    return(
        <>

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
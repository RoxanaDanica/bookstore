import { useForm, Controller } from 'react-hook-form';
import { getBook, updateBook, addBook } from '../api/books';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useLocation, useParams } from 'react-router';
import { useEffect, useState } from 'react';

function BookForm() {
  let params = useParams();
  const bookId = params.bookId;
  console.log('bookId',bookId);
  const { register, setValue, handleSubmit, control, formState, formState: { errors }} = useForm({
    title: '',
    author: '',
    genre: '',
    publisher: '',
    publicationYear: '',
    isbn: '',
    leanguage: '',
    description: '',
    coverImage: '',
    rating: '',
    availableCopies: '',
    price: ''
  });
  
  const [isDisabled, setIsDesabled] = useState(false); 
  const location = useLocation();
  const { disabled } = location.state;

  useEffect(()=> {
    if(disabled != null) {
      setIsDesabled(disabled);
    }
    getBook(bookId).then(initialBook => {
      for (const book in initialBook) {
        setValue(book, initialBook[book])
      }
    });
  }, []);
 
  useEffect(() => {
    console.log('Errors: ', errors);
  }, [formState]);

  const onSubmit = data => {
    if(bookId) {
      updateBook(bookId, data);
      console.log('edit book', data);
    } else {
      addBook(data);
      console.log('add new book',data);
    }
  }

  return (
    <>
    <h3> 
      { !disabled ? "Edit Form" : "Form Book"} 
    </h3>
    <form  onSubmit={handleSubmit(onSubmit)}>
      {/* <input type="number" placeholder="id" {...register("id", {required: true})} /> */}
        <Box sx={{ width: '900px', display: 'flex', gap: 2, mb: 2, }}>
            {!bookId ? (<Controller
              name="id" 
              rules={{ required: {
                value: true,
                message: 'ID is required'
              } }}
              control={control}
              render={({ field }) => <TextField type='number' disabled={isDisabled} helperText={formState.errors.id ? formState.errors.id.message: ''} fullWidth={true} error={formState.errors.id ? true: false}   size="small" {...field}  id="outlined-error-helper-text" label="ID" />}
            />) : ''}
            <Controller
              name="title" 
              rules={{ required: {
                value: true,
                message: 'Title is required'
              } }}
              control={control}
              render={({ field }) => <TextField type='text' disabled={isDisabled} helperText={formState.errors.title ? formState.errors.title.message: ''} fullWidth={true} error={formState.errors.title ? true: false}   size="small" {...field}  id="outlined-error-helper-text" label="Title" />}
            />
            <Controller
              name="author" 
              rules={{ required:{
                value: true,
                message: "Author is required"
              } }}
              control={control}
              render={({ field }) => <TextField type='text' disabled={isDisabled} helperText={formState.errors.author ? formState.errors.author.message : '' } fullWidth={true}  size="small" {...field} error={formState.errors.author  ? true: false} id="outlined-error-helper-text" label="Author" />}
            />
        </Box>
        <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
          <Controller
            name="genre" 
            rules={{ required:{
              value: true,
              message: 'Genre is required'
            }}}
            control={control}
            render={({ field }) => <TextField type='text'  disabled={isDisabled} helperText={formState.errors.genre ? formState.errors.genre.message : ''} fullWidth={true}  size="small" {...field} error={formState.errors.genre  ? true: false} id="outlined-error-helper-text" label="Genre" />}
          />
          <Controller
            name="publisher" 
            rules={{ required: {
              value: true,
              message: "Publisher is required"
            }}}
            control={control}
            render={({ field }) => <TextField type='text' helperText={formState.errors.publisher ? formState.errors.publisher.message : ''} disabled={isDisabled} fullWidth={true}  size="small" {...field} error={formState.errors.publisher ? true: false} id="outlined-error-helper-text" label="Publisher"/>}
          />
        </Box>
        <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
          <Controller
            name="publicationYear" 
            rules={{
              required: {
                value: true,
                message: 'The book must have a publication year'
              },
              max: {
                value: 2025,
                message: 'Year must not be greated than 2025'
              },
            }}
            control={control}
            render={({ field }) =>
              <TextField
                  disabled={isDisabled}
                  fullWidth={true}
                  type='number'
                  size="small"
                  {...field}
                  error={formState.errors?.publicationYear ? true: false}
                  helperText={formState.errors?.publicationYear ? formState.errors.publicationYear.message: ''}
                  id="outlined-error-helper-text"
                  label="Publication Year" 
                />}
          />
          <Controller
            name="isbn" 
            rules={{ required: {
              value: true,
              message: "ISBN  is required"
            }}}
            control={control}
            render={({ field }) => <TextField type='number'  disabled={isDisabled} helperText={formState.errors.isbn  ? formState.errors.isbn.message: ''} fullWidth={true}  size="small" {...field} error={formState.errors.isbn  ? true: false} id="outlined-error-helper-text" label="ISBN" />}
          />
        </Box>
        <Box sx={{  width: '900px', display: 'flex', flexDirection: 'column', gap: 2, mb: 2, }}>
          <Controller
            name="language" 
            rules={{ required: {
              value: true,
              message: "Language  is required"
            }}}
            control={control}
            render={({ field }) => <TextField type='text' helperText={formState.errors.language  ? formState.errors.language.message: ''}  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={formState.errors.language  ? true: false} id="outlined-error-helper-text" label="Language" />}
          />
           <Controller
            name="pages" 
            rules={{ required: {
              value: true,
              message: "Pages is required"
            }}}
            control={control}
            render={({ field }) => <TextField type='number' helperText={formState.errors.pages  ? formState.errors.pages.message: ''}  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={formState.errors.pages  ? true: false} id="outlined-error-helper-text" label="pages" />}
          />
          <Controller
            name="description" 
            rules={{ required: {
              value: true,
              message: "Description  is required"
            }}}
            control={control}
            render={({ field }) => <TextField type='text' helperText={formState.errors.description  ? formState.errors.description.message: ''}  disabled={isDisabled} fullWidth={true}  multiline minRows={4}  size="small" {...field} error={formState.errors.description  ? true: false} id="outlined-error-helper-text" label="Description" />}
          />
        </Box>


         <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
            <Controller
            name="coverImage" 
            control={control}
            render={({ field }) => <TextField disabled={isDisabled} fullWidth={true}  size="small" {...field} error={false} label="Cover Image" />}
          />
          <Controller
            name="rating" 
              rules={{ required: {
              value: true,
              message: "Rating is required"
            }}}
            control={control}
            render={({ field }) => <TextField type='number'  helperText={formState.errors.rating  ? formState.errors.rating.message: ''} disabled={isDisabled} fullWidth={true}  size="small" {...field} error={formState.errors.rating  ? true: false} id="outlined-error-helper-text" label="rating" />}
          />
         </Box>
         <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
            <Controller 
            name="availableCopies" 
            rules={{ required: {
              value: true,
              message: "Available Copies is required"
            }}}
            control={control}
            render={({ field }) => <TextField type='number' helperText={formState.errors.availableCopies  ? formState.errors.availableCopies.message: ''} disabled={isDisabled} fullWidth={true}  size="small" {...field} error={formState.errors.availableCopies  ? true: false} id="outlined-error-helper-text" label="Available Copies" />}
          />
          <Controller
            name="price" 
            rules={{ required: {
              value: true,
              message: 'Price is required'
            } }}
            control={control}
            render={({ field }) => <TextField type='number' helperText={formState.errors.price  ? formState.errors.price.message: ''}  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={formState.errors.price  ? true: false}  id="outlined-error-helper-text" label="Price" />}
          />
         </Box>

        <input type="submit" />
    </form>
    </>
  )
}

export default BookForm;
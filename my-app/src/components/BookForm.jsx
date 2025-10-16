import { useForm, Controller } from 'react-hook-form';
import { getBook, updateBook } from '../api/books';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useLocation, useParams } from 'react-router';
import { useEffect, useState } from 'react';

function BookForm() {
  let params = useParams();
  const bookId = params.bookId;
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
    setIsDesabled(disabled);
    getBook(bookId).then(initialBook => {
      for (const book in initialBook) {
        setValue(book, initialBook[book])
      }
    });
  }, []);
 
  useEffect(() => {
    console.log(errors);
  }, [formState]);

  const onSubmit = data => {
    updateBook(bookId, 
      data
    );
    console.log(data);
  }
  const title = register('title', { required: true});
  const author = register('author', { required: true});
  const price = register('price', { required: true,  pattern: {
            value: /d+/,
            message: "This input is number only.",
          },});
  return (
    <>
    <h3> 
      { !disabled ? "Edit Form" : "Form Book"} 
    </h3>
    <form  onSubmit={handleSubmit(onSubmit)}>
      {/* <input type="number" placeholder="id" {...register("id", {required: true})} /> */}
        <Box sx={{ width: '900px', display: 'flex', gap: 2, mb: 2, }}>
        
           <Controller
              name="title" 
              rules={{ required: "Title is required" }}
              control={control}
              render={({ field }) => <TextField inputRef={title.ref}  disabled={isDisabled} fullWidth={true} error={errors.title} helperText={errors? errors.title : ''}  size="small" {...field}  id="outlined-error-helper-text" label="Title" helperText={''} />}
            />
            <Controller
              name="author" 
              rules={{ required: "Author is required" }}
              control={control}
              render={({ field }) => <TextField inputRef={author.ref} disabled={isDisabled} fullWidth={true}  size="small" {...field} error={errors.author} helperText={errors? errors.author : ''} id="outlined-error-helper-text" label="Author" helperText={''} />}
            />
        </Box>
        <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
          <Controller
            name="genre" 
            control={control}
            render={({ field }) => <TextField  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Genre" helperText={''} />}
          />
          <Controller
            name="publisher" 
            control={control}
            render={({ field }) => <TextField  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Publisher" helperText={''} />}
          />
        </Box>
        <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
          <Controller
            name="publicationYear" 
            control={control}
            render={({ field }) => <TextField  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Publication Year" helperText={''} />}
          />
          <Controller
            name="isbn" 
            control={control}
            render={({ field }) => <TextField  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="ISBN" helperText={''} />}
          />
        </Box>
        <Box sx={{  width: '900px', display: 'flex', flexDirection: 'column', gap: 2, mb: 2, }}>
          <Controller
            name="language" 
            control={control}
            render={({ field }) => <TextField  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Language" helperText={''} />}
          />
          <Controller
            name="description" 
            control={control}
            render={({ field }) => <TextField  disabled={isDisabled} fullWidth={true}  multiline minRows={4}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Description" helperText={''} />}
          />
        </Box>


         <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
            <Controller
            name="coverImage" 
            control={control}
            render={({ field }) => <TextField  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Cover Image" helperText={''} />}
          />
          <Controller
            name="rating" 
            control={control}
            render={({ field }) => <TextField  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="rating" helperText={''} />}
          />
         </Box>
         <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
            <Controller 
            name="availableCopies" 
            control={control}
            render={({ field }) => <TextField  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Available Copies" helperText={''} />}
          />
          <Controller
            name="price" 
            rules={{ required: "Price" }}
            control={control}
            render={({ field }) => <TextField inputRef={price.ref}  disabled={isDisabled} fullWidth={true}  size="small" {...field} error={errors.price} helperText={errors? errors.price : ''}  id="outlined-error-helper-text" label="Price" helperText={''} />}
          />
         </Box>

        <input type="submit" />
    </form>
    </>
  )
}

export default BookForm;
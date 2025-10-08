import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { getBook } from '../api/books';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

function BookForm({ bookId }) {
  const { register, handleSubmit, control /*formState: { errors }*/ } = useForm({
    defaultValues: async () => {
      const data = await getBook(bookId);
      return {
        ...data
      }
    }
  });
  const [book, setBook] = useState('');
  
  // useEffect(()=> {
  //   getBook(bookId).then((response) => {
  //       console.log(response.data);
  //       setBook(response.data);
  //   })
  // }, []);

  const onSubmit = data => {
    console.log(data);
  }
  
  
  return (
    <form  onSubmit={handleSubmit(onSubmit)}>
      {/* <input type="number" placeholder="id" {...register("id", {required: true})} /> */}
        <Box sx={{ width: '900px', display: 'flex', gap: 2, mb: 2, }}>
        
           <Controller
              name="title" 
              control={control}
              render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Title" helperText={''} />}
            />
            <Controller
              name="author" 
              control={control}
              render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Author" helperText={''} />}
            />
        </Box>
        <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
          <Controller
            name="genre" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Genre" helperText={''} />}
          />
          <Controller
            name="publisher" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Publisher" helperText={''} />}
          />
        </Box>
        <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
          <Controller
            name="publicationYear" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Publication Year" helperText={''} />}
          />
          <Controller
            name="isbn" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="ISBN" helperText={''} />}
          />
        </Box>
        <Box sx={{  width: '900px', display: 'flex', flexDirection: 'column', gap: 2, mb: 2, }}>
          <Controller
            name="language" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Language" helperText={''} />}
          />
          <Controller
            name="description" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  multiline minRows={4}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Description" helperText={''} />}
          />
        </Box>
      
         <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
            <Controller
            name="coverImage" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Cover Image" helperText={''} />}
          />
          <Controller
            name="rating" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="rating" helperText={''} />}
          />
         </Box>
         <Box sx={{  width: '900px', display: 'flex', gap: 2, mb: 2, }}>
            <Controller
            name="availableCopies" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Available Copies" helperText={''} />}
          />
          <Controller
            name="price" 
            control={control}
            render={({ field }) => <TextField fullWidth={true}  size="small" {...field} error={false} id="outlined-error-helper-text" label="Price" helperText={''} />}
          />
         </Box>
      {/* <input type="text" placeholder="title" {...register("title", {required: true})}/>
      <input type="text" placeholder="author" {...register("author", {required: true})} />
      <input type="text" placeholder="genre" {...register("genre")} />
      <input type="text" placeholder="publisher" {...register("publisher", {required: true})} />
      <input type="number" placeholder="publicationYear" {...register("publicationYear", {required: true})} />
      <input type="text" placeholder="isbn" {...register("isbn", { maxLength: 15})} />
      <input type="text" placeholder="language" {...register("language", {required: true})} />
      <textarea {...register("description", {required: true})} />
      <input type="text" placeholder="coverImage" {...register("coverImage")} />
      <input type="text" placeholder="rating" {...register("rating", {required: true })} />
      <input type="number" placeholder="availableCopies" {...register("availableCopies", {required: true})} /> 
      <input type="number" placeholder="price" {...register("price", {required: true})} /> */}

      <input type="submit" />
    </form>
  );
}

export default BookForm;
import { useLocation } from "react-router";
import BookForm from "../components/BookForm";

function Formular() {
    const { bookId } = useLocation().state;

    return(
        <>
            <BookForm bookId={bookId}/>
        </>
    )
}

 export default Formular;
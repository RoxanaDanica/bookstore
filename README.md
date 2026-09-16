# Ivory & Ink

Ivory & Ink is a full-stack online bookstore built with React, Node.js, Express, MySQL, Python, and Tailwind CSS. The application provides separate functionality for customers and administrators and covers the complete shopping flow, from discovering a book to placing an order.

Customers can browse and filter the catalogue, search for books, view detailed information, manage a shopping cart, leave reviews, and place orders. Registered customers can also access their order history, while visitors can complete the checkout as guests.

The project also includes Ivy, an AI book assistant built with FastAPI, LangChain, and Ollama. Ivy can answer questions about books, check prices and stock, suggest books based on what the customer is looking for, add books to the shopping cart, and write and publish reviews.

## Demo

The demo presents a complete customer flow, including book search, Ivy interactions, reviews, cart management, guest checkout, and order placement.

**[Watch the Demo](https://youtu.be/TfzNV3JNhgo)**

https://github.com/user-attachments/assets/fd506673-b6ce-42d6-a39c-5e18492269dc

---

## Customer Features

Customers can browse a catalogue containing several thousand books and filter it by author, category, and price. Books can be searched using information such as title, author, or ISBN, and each book has a dedicated page containing its description, authors, categories, publication information, rating, price, stock availability, and customer reviews.

Books can be added to the shopping cart, quantities can be changed, and items can be removed before checkout. Stock is validated when cart quantities change, and active carts temporarily reserve their books. Database transactions and row-level locking are used when checking availability to safely handle multiple customers trying to reserve the same book.

Checkout includes customer information, shipping, courier selection, and payment method. Visitors can complete an order as guests, while registered customers are authenticated using JWT and can also access their previous orders.

Customers can rate books from one to five stars and leave written reviews, which are displayed on the corresponding book page.

---

## Administrator Features

The application includes a separate administration area for managing the bookstore catalogue. Administrators can add, edit, and delete books, update their information, price, and stock, and select multiple books for bulk deletion.

Multiple books can also be imported at once using an **Excel file**, making it easier to add larger sets of books without entering every record manually.

---

## Ivy AI Assistant

Ivy is a conversational book assistant implemented as a separate Python service using **FastAPI, LangChain, and Ollama**.

It can provide information about books, including the author, publication year, price, and current stock. Customers can also ask Ivy for suggestions, such as finding a good fiction book based on what they would like to read.

Ivy can perform actions inside the bookstore through four tools:

- `get_book_info`
- `check_stock`
- `add_book_to_cart`
- `give_review`

For example, a customer can simply ask:

```text
Add "The Harry Bosch Novels" to my cart.
```

Ivy can also help when the customer does not know what to write in a review. The customer can provide a rating and ask Ivy to write the review:

```text
Give "The Harry Bosch Novels" 5 stars and write a review for me.
```

Ivy generates the review and submits it for the selected book. Cart and review actions are performed through the existing Express REST API rather than modifying the database directly.

---

## Technical Overview

Ivory & Ink is divided into three main parts: a React frontend, a Node.js/Express backend, and a separate Python service for the AI assistant.

The React frontend handles the customer and administrator interfaces and communicates with the backend through REST APIs. The Express backend contains the main application logic for books, users, reviews, carts, and orders, while MySQL is used for persistent data storage.

The backend follows a routes → services → persistence structure. Routes handle HTTP requests, services contain the business logic, and the persistence layer is responsible for database operations. Book authors and categories are stored using many-to-many relationships, allowing the catalogue to support books with multiple authors and categories and making filtering more efficient.

Cart operations use database transactions and row-level locking when stock availability is checked. Quantities placed in active carts are treated as temporary reservations, preventing customers from reserving more copies than are available. Order creation is also transactional: the order, its items, stock updates, and cart completion are committed together, or rolled back if the operation fails.

I developed Ivy as a tool-using AI agent using LangChain, FastAPI, and a locally running Ollama model. Based on the user's request, the agent can select and execute dedicated tools for retrieving book information, checking stock, adding books to the cart, and submitting reviews. The tools communicate with the existing Express REST API instead of accessing MySQL directly, keeping the AI layer separate from the application's business and persistence logic.

---

## Testing

Playwright is used for end-to-end testing of the main customer flows, including search, cart operations, reviews, and real interactions with Ivy.

The project also includes unit testing with Jest.

---

## Technologies

**Frontend:** React, React Router, Tailwind CSS, Material UI, Axios, React Hook Form, Zod  
**Backend:** Node.js, Express, MySQL, JWT  
**AI:** Python, FastAPI, LangChain, Ollama  
**Testing:** Playwright, Jest

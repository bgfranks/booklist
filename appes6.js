class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");
    // create tr
    const row = document.createElement("tr");

    //insert calls
    row.innerHTML = `<td>${book.title}</td>
  <td>${book.author}</td>
  <td>${book.isbn}</td>
  <td><a href="#" class="delete">x</a></td>`;

    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement("div");
    // add classes
    div.className = `alert ${className}`;
    //add text
    div.appendChild(document.createTextNode(message));
    //get parent
    const containter = document.querySelector(".container");
    const form = document.querySelector("#book-form");

    // Insert Alert
    containter.insertBefore(div, form);

    //Timeout after 3 seconds
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book) {
      const ui = new UI();

      //add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function(book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// DOM Load event
document.addEventListener("DOMContentLoaded", Store.displayBooks);

// Event listeners
document.getElementById("book-form").addEventListener("submit", function(e) {
  // Get form Values
  const title = document.getElementById("title").value,
    authour = document.getElementById("author").value,
    isbn = document.getElementById("isbn").value;

  // Instantiate book
  const book = new Book(title, authour, isbn);

  // Instantiate UI
  const ui = new UI();

  // Validate
  if (title === "" || author === "" || isbn === "") {
    //error alert
    ui.showAlert("Please fill in all fields", "error");
  } else {
    // Add Book to List
    ui.addBookToList(book);

    //Add to Local Storage
    Store.addBook(book);

    //show success
    ui.showAlert("Book Added", "success");

    // Clear fields
    ui.clearFields();
  }

  e.preventDefault();
});

// Event Listener for Delete
document.getElementById("book-list").addEventListener("click", function(e) {
  //instantiate UI
  const ui = new UI();

  // Delete Book
  ui.deleteBook(e.target);

  // remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //showe message
  ui.showAlert("Book Removed!", "success");

  e.preventDefault();
});

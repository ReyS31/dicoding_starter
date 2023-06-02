const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
            .type('application/json')
            .code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
            .type('application/json')
            .code(400);
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    })
        .type('application/json')
        .code(201);
};

const getBooksHandler = (request, h) => {
    const { reading, finished, name } = request.query;
    let innerBooks = books;

    if (reading !== undefined) {
        innerBooks = innerBooks.filter((book) => book.reading === (reading === '1'));
    }

    if (finished !== undefined) {
        innerBooks = innerBooks.filter((book) => book.finished === (finished === '1'));
    }

    if (name !== undefined) {
        innerBooks = innerBooks.filter(
            (book) => book.name.toLowerCase()
                .includes(name.toLowerCase()),
        );
    }

    return h.response({
        status: 'success',
        data: {
            books: innerBooks.map((book) => {
                const { id, name: bookName, publisher } = book;
                return { id, name: bookName, publisher };
            }),
        },
    });
};

const getBookHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((bk) => bk.id === bookId)[0];
    if (book === undefined) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        })
            .type('application/json')
            .code(404);
    }

    return h.response({
        status: 'success',
        data: {
            book,
        },
    });
};

const updateBookHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    if (index === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
            .type('application/json')
            .code(404);
    }

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        })
            .type('application/json')
            .code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        })
            .type('application/json')
            .code(400);
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    const updatedBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        updatedAt,
    };

    books[index] = { ...books[index], ...updatedBook };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
};

const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((bk) => bk.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).type('application/json').code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
        .type('application/json')
        .code(404);
};

module.exports = {
    addBookHandler,
    getBooksHandler,
    getBookHandler,
    updateBookHandler,
    deleteBookHandler,
};

import BookModel from '../models/Book.js';
import GenreModel from '../models/Genre.js';
import ReviewModel from '../models/Review.js';
import UserModel from '../models/User.js';
/* It is a wonderful meditation on history and the paths of connectivity that join all forms of life. The book is moving, surprising and beautifully crafted. One of my favourites by this brilliant writer. */

const createBook = async (req, res, next) => {
  try {
    const fileName = Date.now() + '_' + req.files.image.name;
    const data = {
      title: req.body.title,
      author: req.body.combinedName,
      year: parseInt(req.body.year),
      publisher: req.body.publisher,
      genre: req.body.genre,
      description: req.body.description,
      pages: req.body.pages,
      price: parseFloat(req.body.price),
      ISBN: req.body.isbn,
      image: {
        fileName: fileName,
        data: req.files.image.data,
        thumbnail: `${process.env.THUMBNAIL}${fileName}`,
      },
    };
    const book = await BookModel.create(data);

    const genre = await GenreModel.findOne({ genre: req.body.genre });
    if (!genre) {
      const genre = await GenreModel.create({ genre: req.body.genre });
    }

    res.json({ success: true, message: 'The book was uploaded successfully.' });
  } catch (error) {
    next(error);
  }
};

const genreBook = async (req, res, next) => {
  try {
    const books = await BookModel.find({ genre: req.body.genre }).select({
      title: 1,
      author: 1,
      year: 1,
      publisher: 1,
      genre: 1,
      description: 1,
      avgRating: 1,
      price: 1,
      ISBN: 1,
      'image.thumbnail': 1,
      /*  pic: 1, */
    });
    res.json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const books = await BookModel.find().select({
      title: 1,
      author: 1,
      year: 1,
      publisher: 1,
      genre: 1,
      description: 1,
      avgRating: 1,
      price: 1,
      ISBN: 1,
      'image.thumbnail': 1,
      /* pic: 1, */
    });
    res.json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params.id).select('-reviews');
    res.send({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    if (req.files?.image?.name) {
      const fileName = Date.now() + '_' + req.files.image.name;
      const data = {
        fileName: fileName,
        data: req.files.image.data,
        thumbnail: `${process.env.THUMBNAIL}${fileName}`,
      };
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { image: data },
        { new: true }
      );
    }
    if (req.body?.title) {
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { title: req.body.title },
        { new: true }
      );
    }
    if (req.body?.author) {
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { author: req.body.author },
        { new: true }
      );
    }
    if (req.body?.year) {
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { year: req.body.year },
        { new: true }
      );
    }
    if (req.body?.publisher) {
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { publisher: req.body.publisher },
        { new: true }
      );
    }
    if (req.body?.genre) {
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { genre: req.body.genre },
        { new: true }
      );
    }
    if (req.body?.description) {
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { description: req.body.description },
        { new: true }
      );
    }
    if (req.body?.pages) {
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { pages: req.body.pages },
        { new: true }
      );
    }
    if (req.body?.price) {
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { price: req.body.price },
        { new: true }
      );
    }
    if (req.body?.ISBN) {
      await BookModel.findByIdAndUpdate(
        req.params.id,
        { ISBN: req.body.ISBN },
        { new: true }
      );
    }

    res.json({ success: true, message: 'Book updated successfully.' });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    // delete book's reviews and ref's in users' docs:
    const findReviews = await ReviewModel.find({ book: req.params.id });
    const deleteRefsInUser = (reviewsArr) => {
      const promises = reviewsArr.map(async (i) => {
        return await UserModel.updateOne(
          { reviews: i._id },
          { $pull: { reviews: i._id } },
          { new: true }
        );
      });
      return Promise.all(promises);
    };
    deleteRefsInUser(findReviews);
    const deleteRevDocs = (reviewsArr) => {
      const promises = reviewsArr.map(async (i) => {
        return await ReviewModel.findByIdAndDelete(i._id);
      });
      return Promise.all(promises);
    };
    deleteRevDocs(findReviews);
    // delete the book itself:
    await BookModel.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'The book was successfully deleted.' });
  } catch (error) {
    next(error);
  }
};

const searchBook = async (req, res, next) => {
  try {
    const unPlused = req.params.regex.replaceAll('+', ' ');
    const book = await BookModel.find({
      $or: [
        { title: { $regex: unPlused, $options: 'i' } }, //{ $regex: unPlused }
        { author: { $regex: unPlused, $options: 'i' } },
      ],
    });
    res.json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

export {
  createBook,
  genreBook,
  getAllBooks,
  searchBook,
  updateBook,
  deleteBook,
  getBookById,
};

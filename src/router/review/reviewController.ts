import { RequestHandler } from "express";
import { ReviewType, ReviewByCommentsType } from "./reviewTypes";
import { Review, ReviewModel } from "./reviewModel";
import { User } from "../user/userModel";
import { MongoModelToViewModel } from "../common/util/modelCopy";
import logger from "../common/util/logger";
import ModelValidator from "../common/util/validator";
import { deleteImage, savePhotoByReference } from "./reviewService";

export const getReview: RequestHandler = async (req, res) => {
  try {
    if (req.query.page === "" || req.query.page === undefined) {
      throw "page is required";
    }
    let reviewByComments: ReviewByCommentsType[] = [];

    const reviews: ReviewModel[] = await Review.find()
      .populate("Author")
      .sort({ WrittenDate: -1 })
      .skip(req.query.page * 5)
      .limit(5);
    reviews.forEach(review => {
      MongoModelToViewModel(
        review,
        new ReviewByCommentsType(),
        (error: any, result: ReviewByCommentsType) => {
          if (error) {
            throw error;
          }
          result.ID = review._id;
          result.AuthorEmail = review.Author.email;
          result.AuthorPicture = review.Author.picture;
          reviewByComments.push(result);
        }
      );
    });
    setTimeout(() => {
      res.status(200).send(reviewByComments);
    }, 2000);
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

export const getSearch: RequestHandler = async (req, res) => {
  try {
    console.log(req.query.searchString);
    if (!req.query.searchString) {
      throw "query is required";
    }
    let reviewDTO: any = {
      byName: [],
      byAddress: []
    };

    const reviewsByName: ReviewModel[] = await Review.find({
      locationName: { $regex: req.query.searchString, $options: ["i", "g"] }
    })
      .populate("Author")
      .sort({ WrittenDate: -1 })
      .limit(5);
    const reviewsByAddress: ReviewModel[] = await Review.find({
      address: { $regex: req.query.searchString, $options: ["i", "g"] }
    })
      .populate("Author")
      .sort({ WrittenDate: -1 })
      .limit(5);
    reviewsByName.forEach(review => {
      MongoModelToViewModel(
        review,
        new ReviewByCommentsType(),
        (error: any, result: ReviewByCommentsType) => {
          if (error) {
            throw error;
          }
          result.ID = review._id;
          result.AuthorEmail = review.Author.email;
          result.AuthorPicture = review.Author.picture;
          reviewDTO.byName.push(result);
        }
      );
    });
    reviewsByAddress.forEach(review => {
      MongoModelToViewModel(
        review,
        new ReviewByCommentsType(),
        (error: any, result: ReviewByCommentsType) => {
          if (error) {
            throw error;
          }
          result.ID = review._id;
          result.AuthorEmail = review.Author.email;
          result.AuthorPicture = review.Author.picture;
          reviewDTO.byAddress.push(result);
        }
      );
    });
    res.status(200).send(reviewDTO);
  } catch (err) {
    res.status(400).send({ error: err });
  }
};

export const postReview: RequestHandler = async (req: any, res) => {
  try {
    logger.debug(req.body);
    let review: ReviewType = new ReviewType();
    ModelValidator(req.body, review, (err: any) => {
      if (err) {
        throw err;
      }
      review = req.body;
    });
    //const author = await User.findOne({ email: reviewDAO.AuthorEmail })
    const author: any = await User.findOne({ Email: req.user.Email });

    let newReview: ReviewModel = new Review({
      ReviewContentText: review.ReviewContentText,
      PlaceRate: review.PlaceRate,
      Author: author._id,
      LocationReferenceID: review.LocationReferenceID,
      LocationName: review.LocationName,
      Address: review.Address,
      GeoLocation: {
        Lat: review.GeoLocation.Lat,
        Lng: review.GeoLocation.Lng
      },
      Photos: review.Photos
    });

    const reviewSaveResult = await newReview.save();
    author.Reviews.push(reviewSaveResult._id);
    const userSaveResult = await author.save();

    savePhotoByReference(review.Photos, newReview._id, (err: any) => {
      if (err) {
        throw err;
      }
      if (userSaveResult) {
        res.status(200).send({ status: "success" });
      }
    });
  } catch (error) {
    logger.debug("review post -> ", error);
    res.status(400).send({ error: error });
  }
};

export const deleteReview: RequestHandler = async (req: any, res) => {
  try {
    if (req.params.id === "" || req.params.id === undefined) {
      throw "id params is required";
    }

    deleteImage(req.params.id, (error: any) => {
      if (error) {
        console.log("file delete error: ", error);
      }
    });

    const reviewResult = await Review.findById(req.params.id);
    if (!reviewResult) {
      throw "finding review data result by id is null";
    }

    const userResult: any = await User.findById(reviewResult.Author);
    if (req.user.email !== userResult.email) {
      throw "user is not valid";
    }

    let index = userResult.Reviews.indexOf(req.params.id as any);
    if (index > -1) {
      userResult.Reviews.splice(index, 1);
      userResult.save();
    }
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).send({ status: "success" });
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

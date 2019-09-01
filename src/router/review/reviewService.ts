import axios from "axios";
import fs from "fs";
import path from "path";
import logger from "../common/util/logger";
import rimraf from "rimraf";

export function savePhotoByReference(
  photoRef: any,
  reviewID: string,
  cb: CallableFunction
) {
  try {
    let filename = path.join("photos", `${reviewID.toString()}/`);
    logger.debug(filename);
    fs.mkdirSync(filename, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      console.log(err);
      cb(err.code);
    }
  }

  let promises = photoRef.map((refID: any) => {
    const url = `https://maps.googleapis.com/maps/api/place/photo?key=${process.env.GOOGLE_KEY}&photoreference=${refID}&maxheight=600`;
    let photoPath = path.join(
      "photos",
      reviewID.toString(),
      `${refID.toString()}.png`
    );
    return downloadImage(url, photoPath);
  });

  Promise.all(promises)
    .then(saved => {
      cb(null);
    })
    .catch(error => {
      cb(error);
    });
}

const downloadImage = (url: string, image_path: string) =>
  axios({
    url,
    responseType: "stream"
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on("finish", () => resolve())
          .on("error", (e: any) => reject(e));
      })
  );

export const deleteImage = (id: string, cb: CallableFunction) => {
  try {
    const photoPath = path.join("photos", id);
    rimraf(photoPath, error => {
      if (error) {
        cb(error);
      }
      cb(null);
    });
  } catch (error) {
    cb(error);
  }
};

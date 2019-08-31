import bcrypt from "bcrypt";
import crypto from "crypto";
import { Observable } from "rxjs";
import { UserRegisterType, UserType } from "./userTypes";
import { User } from "./userModel";
import { MongoModelToViewModel } from "../common/util/modelCopy";

export function getUserInfo(Email: string): Observable<UserType> {
  return new Observable(observer => {
    User.findOne({ Email: Email })
      .then(user => {
        if (user === null) {
          observer.error("can not find a user");
        }
        let userData: UserType = new UserType();
        MongoModelToViewModel(user, userData, (err: any, result: UserType) => {
          if (err) {
            observer.error(err);
          }
          observer.next(result);
        });
      })
      .catch(err => {
        observer.error(err);
      });
  });
}

export function userRegistration(
  model: UserRegisterType
): Promise<boolean | string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(model.Password, 10, function(err, hash) {
      if (err) {
        reject("bcrypt error");
      }
      // Store hash in your password DB.
      let newUser = new User({
        Name: model.Name,
        Address: model.Address,
        Email: model.Email,
        Password: hash,
        Picture: getAvatar(model.Email)
      });
      newUser
        .save()
        .then(res => {
          console.log(res);
          resolve(true);
        })
        .catch(err => {
          if (err.code === 11000) {
            reject("email already used");
          } else {
            reject(`${err} : bad happend while we are saving user data`);
          }
        });
    });
  });
}

function getAvatar(Email: string, size: number = 200): string {
  const md5 = crypto
    .createHash("md5")
    .update(Email)
    .digest("hex");
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
}

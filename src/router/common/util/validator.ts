export default function ModelValidator(
  input: any,
  model: any,
  cb: CallableFunction
) {
  console.log(Object.keys(input) + ", " + Object.keys(model));
  if (Object.keys(input).length != Object.keys(model).length) {
    cb("All Model fields should be required");
  }
  Object.keys(input).forEach(key => {
    if (input[key] === "") {
      cb("Model has empty data");
    }
    if (!model.hasOwnProperty(key)) {
      cb(`${key} is not belong to register model`);
    }
  });
  cb(null);
}

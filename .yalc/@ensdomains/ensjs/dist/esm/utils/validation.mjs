// src/utils/validation.ts
import { MINIMUM_DOT_ETH_CHARS } from "./consts.mjs";
import { checkLabel, isEncodedLabelhash, saveName } from "./labels.mjs";
import { normalise, split } from "./normalise.mjs";
var validateName = (name) => {
  const nameArray = name.split(".");
  const hasEmptyLabels = nameArray.some((label) => label.length === 0);
  if (hasEmptyLabels)
    throw new Error("Name cannot have empty labels");
  const normalisedArray = nameArray.map((label) => {
    if (label === "[root]") {
      return label;
    }
    return isEncodedLabelhash(label) ? checkLabel(label) || label : normalise(label);
  });
  const normalisedName = normalisedArray.join(".");
  saveName(normalisedName);
  return normalisedName;
};
var validateTLD = (name) => {
  const labels = name.split(".");
  return validateName(labels[labels.length - 1]);
};
var parseInput = (input) => {
  let nameReference = input;
  let isValid = false;
  try {
    nameReference = validateName(input);
    isValid = true;
  } catch {
  }
  const normalisedName = isValid ? nameReference : void 0;
  const labels = nameReference.split(".");
  const tld = labels[labels.length - 1];
  const isETH = tld === "eth";
  const labelDataArray = split(nameReference);
  const isShort = (labelDataArray[0].output?.length || 0) < MINIMUM_DOT_ETH_CHARS;
  if (labels.length === 1) {
    return {
      type: "label",
      normalised: normalisedName,
      isShort,
      isValid,
      is2LD: false,
      isETH,
      labelDataArray
    };
  }
  const is2LD = labels.length === 2;
  return {
    type: "name",
    normalised: normalisedName,
    isShort: isETH && is2LD ? isShort : false,
    isValid,
    is2LD,
    isETH,
    labelDataArray
  };
};
var checkIsDotEth = (labels) => labels.length === 2 && labels[1] === "eth";
export {
  checkIsDotEth,
  parseInput,
  validateName,
  validateTLD
};

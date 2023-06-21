import { combineReducers } from "redux";
import language from "./language";
import bot from "./bot";
import docQA from "./docQA";

export default combineReducers({
  language: language,
  bot: bot,
  docQA: docQA,
});

import "server-only";
import { customAlphabet } from "nanoid";
import { LOGIN_CODE_ALPHABET, LOGIN_CODE_LENGTH } from "@/core/constants/login.const";

/** A fresh login code. */
export const newLoginCode = customAlphabet(LOGIN_CODE_ALPHABET, LOGIN_CODE_LENGTH);

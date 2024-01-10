import fs from "fs"
import { lg } from "./logger.js"

export const extractTxt = (
    fileName: string
):
    | {
          success: true
          data: string
      }
    | {
          success: false
          data: null
      } => {
    try {
        const currentDir = process.cwd()
        const txt = fs.readFileSync(`${currentDir}/${fileName}`, "utf8")
        return {
            success: true,
            data: txt,
        }
    } catch (e) {
        lg.error(`Error reading file ${fileName}`)
        return {
            success: false,
            data: null,
        }
    }
}

import { uploadOperation } from '../api/operationLog'
import { isAuth } from '../helpers/auth'
const auth = isAuth()
export const submitLog = (accesspage, operation, editorValue, runResult) => {
  uploadOperation({
    username: auth.username,
    access_page: accesspage,
    user_operation: operation,
    user_code: editorValue,
    error_information: runResult,
  })
}

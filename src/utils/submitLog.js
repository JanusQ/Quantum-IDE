import { uploadOperation } from '@/api/operationLog'
const auth = JSON.parse(localStorage.getItem('USERDATA') || '{}')
export const submitLog = (accesspage, operation, editorValue, runResult) => {
  if (auth.username) {
    uploadOperation({
      username: auth.username,
      access_page: accesspage,
      user_operation: operation,
      user_code: editorValue,
      error_information: runResult,
    })
  }
}

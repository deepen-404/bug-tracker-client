export const AUTH_KEYS = {
  CURRENT_USER: 'currentUser',
} as const

export const BUG_KEYS = {
  BUG_BY_ID: 'bugById',
  MY_BUGS: 'myBugs',
  ASSIGNED_BUGS: 'assignedBugs',
  UNASSIGNED_BUGS: 'unassignedBugs',
  SEARCH_BUGS: 'searchBugs',
  CREATE_BUG: 'createBug',
  UPDATE_BUG: 'updateBug',
  UPDATE_BUG_STATUS: 'updateBugStatus',
  ASSIGN_BUG: 'assignBug',
  UNASSIGN_BUG: 'unassignBug',
  DELETE_BUG: 'deleteBug',
} as const

export const USER_KEYS = {
  DEVELOPERS: 'developers',
} as const

export const ATTACHMENT_KEYS = {
  UPLOAD_ATTACHMENT: 'uploadAttachment',
  DOWNLOAD_ATTACHMENT: 'downloadAttachment',
  DELETE_ATTACHMENT: 'deleteAttachment',
} as const

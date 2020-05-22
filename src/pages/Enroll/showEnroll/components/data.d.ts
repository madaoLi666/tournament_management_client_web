export interface unitInfo {
  unit_name?: string
  unit_leader?: string
  leader_phone?: string | number
  leader_email?: string
  coach1?: string
  coach2?: string
  coach1_phone?: string
  coach2_phone?: string
}
export interface personProject {
  name?: string
  id_card?: string
  sex?: string
  birthday?: string
  affiliated_group?: string
  enroll_group?: string
  enroll_project?: string
  // 两个是表格用的
  operation?: React.ReactNode
  key?: number
}
export interface teamProject {
  key?: string
  project_name?: string
  enroll_group?: string
  team_name?: string
  team_member?: string
  man?: number
  woman?: number
}

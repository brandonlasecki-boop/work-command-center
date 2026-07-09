export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          color: string
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_shares: {
        Row: {
          access_token: string
          company_id: string
          created_at: string
          expires_at: string | null
          id: string
          last_accessed_at: string | null
          revoked_at: string | null
          viewer_email: string
          viewer_name: string
        }
        Insert: {
          access_token: string
          company_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          last_accessed_at?: string | null
          revoked_at?: string | null
          viewer_email: string
          viewer_name: string
        }
        Update: {
          access_token?: string
          company_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          last_accessed_at?: string | null
          revoked_at?: string | null
          viewer_email?: string
          viewer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_shares_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logs: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          log_date: string
          project_id: string | null
          title: string
          work_item_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          log_date?: string
          project_id?: string | null
          title: string
          work_item_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          log_date?: string
          project_id?: string | null
          title?: string
          work_item_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_logs_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_items"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          manual_progress_override: number | null
          name: string
          priority: Database["public"]["Enums"]["project_priority"]
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          manual_progress_override?: number | null
          name: string
          priority?: Database["public"]["Enums"]["project_priority"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          manual_progress_override?: number | null
          name?: string
          priority?: Database["public"]["Enums"]["project_priority"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      work_item_attachments: {
        Row: {
          company_id: string
          created_at: string
          file_name: string
          file_size: number
          id: string
          mime_type: string | null
          project_id: string
          storage_path: string
          work_item_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          file_name: string
          file_size?: number
          id?: string
          mime_type?: string | null
          project_id: string
          storage_path: string
          work_item_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          file_name?: string
          file_size?: number
          id?: string
          mime_type?: string | null
          project_id?: string
          storage_path?: string
          work_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_item_attachments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_item_attachments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_item_attachments_work_item_id_fkey"
            columns: ["work_item_id"]
            isOneToOne: false
            referencedRelation: "work_items"
            referencedColumns: ["id"]
          },
        ]
      }
      work_items: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          parent_id: string | null
          project_id: string
          sort_order: number
          status: Database["public"]["Enums"]["work_item_status"]
          title: string
          type: Database["public"]["Enums"]["work_item_type"]
          updated_at: string
          weight: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          parent_id?: string | null
          project_id: string
          sort_order?: number
          status?: Database["public"]["Enums"]["work_item_status"]
          title: string
          type: Database["public"]["Enums"]["work_item_type"]
          updated_at?: string
          weight?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          parent_id?: string | null
          project_id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["work_item_status"]
          title?: string
          type?: Database["public"]["Enums"]["work_item_type"]
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "work_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "work_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      project_priority: "low" | "medium" | "high" | "urgent"
      project_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "blocked"
        | "paused"
      work_item_status:
        | "not_started"
        | "in_progress"
        | "completed"
        | "blocked"
        | "waiting_on_approval"
        | "waiting_on_carrier"
        | "waiting_on_spruce"
      work_item_type: "phase" | "subphase" | "task"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]

export type Company = Tables<"companies">
export type CompanyShare = Tables<"company_shares">
export type Project = Tables<"projects">
export type WorkItem = Tables<"work_items">
export type WorkItemAttachment = Tables<"work_item_attachments">
export type DailyLog = Tables<"daily_logs">
export type ProjectStatus = Enums<"project_status">
export type ProjectPriority = Enums<"project_priority">
export type WorkItemType = Enums<"work_item_type">
export type WorkItemStatus = Enums<"work_item_status">

export type WorkItemAttachmentWithUrl = WorkItemAttachment & {
  url?: string | null
}

export type WorkItemNode = WorkItem & {
  children: WorkItemNode[]
  progress: number
  derivedStatus: WorkItemStatus
}

export type ProjectWithProgress = Project & {
  progress: number
  company?: Company
}

export type CompanyWithProgress = Company & {
  progress: number
  projectCount: number
  activeProjectCount: number
}

export type CompanyShareWithCompany = CompanyShare & {
  company: Company
}

export type DailyLogWithRelations = DailyLog & {
  company?: Company | null
  project?: Project | null
}

export type DailyLogEnriched = DailyLogWithRelations & {
  work_item?: Pick<WorkItem, "id" | "title" | "description" | "project_id"> | null
  attachments: WorkItemAttachmentWithUrl[]
}

export type DashboardTodayStats = {
  tasksCompleted: number
  workLogs: number
  onTrackPercent: number
  averageProgress: number
}

export type DashboardSummary = {
  companies: CompanyWithProgress[]
  activeProjects: ProjectWithProgress[]
  todayLogs: DailyLogWithRelations[]
  focusItems: (WorkItem & { project: Project; company: Company })[]
  recentWins: DailyLogEnriched[]
  todayStats: DashboardTodayStats
}

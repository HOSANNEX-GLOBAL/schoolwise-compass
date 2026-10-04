export type EnrollmentStatus = "active" | "inactive";

export type EnrollmentAPI = {
  id: number;
  academic_year_id: number;
  classroom_id: number | null;
  school_level_id: number;
  student_id: number;
  status: EnrollmentStatus;
  created_at: string;
  updated_at: string;

  student: {
    id: number;
    name: string;
    bi: string;
    date_of_birth: string;
    gender: number;
    guardian: string;
    guardian_phone: string;
    address: string;
    student_number: string;
    school_level_id: number;
    created_at: string;
    updated_at: string;
  };

  classroom?: {
    id: number;
    academic_year_id: number;
    capacity: number;
    cycle: string;
    name: string;
    room: string;
    school_level_id: number;
    teacher_id: number;
    created_at: string;
    updated_at: string;
  } | null;

  academic_year: {
    id: number;
    active: boolean;
    name: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
  };

  school_level: {
    id: number;
    code: string;
    name: string;
    created_at: string;
    updated_at: string;
  };
};

export type Enrollment = {
  id: number;

  studentId: number;
  studentName: string;
  studentNumber: string;
  bi: string;
  dateOfBirth: string;
  guardian: string;
  guardianPhone: string;
  address: string;

  classroomId: number | null;
  classroomName: string | null;
  classroomRoom: string | null;

  academicYearId: number;
  academicYearName: string;

  schoolLevelId: number;
  schoolLevelName: string;

  status: EnrollmentStatus;
};

export type EnrollmentForm = {
  id?: number;
  student_id: number;
  classroom_id: number | null;
  academic_year_id: number;
  school_level_id: number;
};

export type EnrollmentStatusUpdateForm = {
  id: number;
  status: EnrollmentStatus;
};

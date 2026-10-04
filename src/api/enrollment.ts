import {
  Enrollment,
  EnrollmentAPI,
  EnrollmentForm,
  EnrollmentStatusUpdateForm,
} from "@/types/enrollment.ds";

import { api } from "./client";

const transformEnrollmentAPIToEnrollment = (
  enrollment: EnrollmentAPI
): Enrollment => ({
  id: enrollment.id,

  studentId: enrollment.student_id,
  studentName: enrollment.student.name,
  studentNumber: enrollment.student.student_number,
  bi: enrollment.student.bi,
  dateOfBirth: enrollment.student.date_of_birth,
  guardian: enrollment.student.guardian,
  guardianPhone: enrollment.student.guardian_phone,
  address: enrollment.student.address,

  classroomId: enrollment.classroom_id,
  classroomName: enrollment.classroom?.name ?? null,
  classroomRoom: enrollment.classroom?.room ?? null,

  academicYearId: enrollment.academic_year_id,
  academicYearName: enrollment.academic_year.name,

  schoolLevelId: enrollment.school_level_id,
  schoolLevelName: enrollment.school_level.name,

  status: enrollment.status,
});



export const getEnrollments = async (): Promise<Enrollment[]> => {
  const response = await api.get<EnrollmentAPI[]>("/enrollments");
  console.log("getEnrollments response:", response.data);
  return response.data.map(transformEnrollmentAPIToEnrollment);
};

export const postEnrollment = async (
  enrollment: Omit<EnrollmentForm, "id">
): Promise<Enrollment> => {
  const response = await api.post<EnrollmentAPI>(
    "/enrollments",
    { enrollment }
  );

  return transformEnrollmentAPIToEnrollment(response.data);
};

export const putEnrollment = async (
  enrollment: EnrollmentForm
): Promise<Enrollment> => {
  const response = await api.put<EnrollmentAPI>(
    `/enrollments/${enrollment.id}`,
    { enrollment }
  );

  return transformEnrollmentAPIToEnrollment(response.data);
};

export const updateEnrollmentStatus = async (
  enrollment: EnrollmentStatusUpdateForm
): Promise<Enrollment> => {
  const response = await api.post<EnrollmentAPI>(
    `/enrollments/${enrollment.id}/update_status`,
    { enrollment }
  );

  console.log("updateEnrollmentStatus response:", response.data);

  return transformEnrollmentAPIToEnrollment(response.data);
};
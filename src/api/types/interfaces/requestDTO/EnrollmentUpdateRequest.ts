import CourseStatus from "../../enums/CourseStatus";

export interface EnrollmentUpdateRequest{
    student_id?: string,
    course_id?: string,
    enrollment_date?: Date,
    status?: CourseStatus
}
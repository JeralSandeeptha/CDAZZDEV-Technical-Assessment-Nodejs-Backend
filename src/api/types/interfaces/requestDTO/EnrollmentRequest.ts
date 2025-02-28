import CourseStatus from "../../enums/CourseStatus";

export interface EnrollmentRequest{
    student_id: string,
    course_id: string,
    enrollment_date: Date,
    status: CourseStatus
}
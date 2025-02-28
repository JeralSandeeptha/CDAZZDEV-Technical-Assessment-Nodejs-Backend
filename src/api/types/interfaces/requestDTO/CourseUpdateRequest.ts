export interface CourseUpdateRequest{
    image?: string,
    title?: string,
    description?: string,
    instructor?: string,
    start_date?: Date,
    end_date?: Date,
}
import api from './axios';

export const uploadLecture = (formData) =>
  api.post('/lectures/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const uploadLectureToTopic = (topicId, formData) =>
  api.post(`/topics/${topicId}/lectures/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getTopicLectures = (topicId) =>
  api.get(`/topics/${topicId}/lectures`);

export const generateQuizFromLecture = (lectureId) =>
  api.post(`/lectures/${lectureId}/generate-quiz`);

export const generateStudyPlanFromLecture = (lectureId) =>
  api.post(`/lectures/${lectureId}/generate-study-plan`);

export const getLectures = () => api.get('/lectures');

export const deleteLecture = (lectureId) => api.delete(`/lectures/${lectureId}`);

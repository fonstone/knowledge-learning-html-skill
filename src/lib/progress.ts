export function getLessonKey(chapterId: string, lessonId: string): string {
  return `rust-tutorial-completed-${chapterId}-${lessonId}`;
}

export function isLessonCompleted(chapterId: string, lessonId: string): boolean {
  return localStorage.getItem(getLessonKey(chapterId, lessonId)) === 'true';
}

export function markLessonComplete(chapterId: string, lessonId: string): void {
  localStorage.setItem(getLessonKey(chapterId, lessonId), 'true');
}

export function resetLesson(chapterId: string, lessonId: string): void {
  localStorage.removeItem(getLessonKey(chapterId, lessonId));
}

export function getLastVisited(): string | null {
  return localStorage.getItem('rust-tutorial-last-visited');
}

export function setLastVisited(path: string): void {
  localStorage.setItem('rust-tutorial-last-visited', path);
}

export function migrateOldProgressKey(): void {
  if (localStorage.getItem('rust-tutorial-completed') !== null) {
    localStorage.removeItem('rust-tutorial-completed');
  }
}

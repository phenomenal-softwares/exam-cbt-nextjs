export function getGradeAndRemark(score, total) {
  const percentage = (score / total) * 100;

  if (percentage >= 70) return { grade: "A", remark: "Excellent" };
  if (percentage >= 60) return { grade: "B", remark: "Very Good" };
  if (percentage >= 50) return { grade: "C", remark: "Good" };
  if (percentage >= 45) return { grade: "D", remark: "Fair" };
  if (percentage >= 40) return { grade: "E", remark: "Poor" };
  return { grade: "F", remark: "Fail" };
}

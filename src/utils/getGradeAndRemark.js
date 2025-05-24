export function getGradeAndRemark(score) {
  if (score >= 18) return { grade: "A", remark: "Excellent" };
  if (score >= 15) return { grade: "B", remark: "Very Good" };
  if (score >= 12) return { grade: "C", remark: "Good" };
  if (score >= 10) return { grade: "D", remark: "Fair" };
  if (score >= 7) return { grade: "E", remark: "Poor" };
  return { grade: "F", remark: "Fail" };
}

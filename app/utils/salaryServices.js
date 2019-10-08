class SalaryServices {
  static async sprintSalary(issues) {
    issues = await issues
    let aggregated = {
      estimate : 0,
      remaining : 0,
      actual : 0,
      final : 0
    }
    let meta={}
    
    for (let item of issues.issues) {
      let issue = {
        key: item.key,
        name: item.fields.summary,
        estimate: item.fields.timetracking.originalEstimateSeconds,
        remaining: item.fields.timetracking.remainingEstimateSeconds,
        actual: item.fields.aggregatetimespent
      }
           
      meta = {
        sprintName: item.fields.sprint.name,
        projectName: item.fields.project.name
      }      
      
      aggregated.estimate = aggregated.estimate + issue.estimate
      aggregated.remaining = aggregated.remaining + issue.remaining
      if(issue.actual!=null){
      aggregated.actual = aggregated.actual + issue.actual
      }

      
      
    }
    aggregated.final = (1.1 * (aggregated.actual/3600) + 0.9 * ((aggregated.estimate/3600) - (aggregated.remaining/3600))) / 80

    return {aggregated,meta}
  }
}

module.exports = SalaryServices

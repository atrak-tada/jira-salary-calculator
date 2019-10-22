class SalaryServices {
  static async sprintSalary(issues,totalHours) {
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
        estimate: (item.fields.timetracking.originalEstimateSeconds)?item.fields.timetracking.originalEstimateSeconds:0,
        remaining: (item.fields.timetracking.remainingEstimateSeconds)?item.fields.timetracking.remainingEstimateSeconds:0,
        actual: (item.fields.aggregatetimespent)?item.fields.aggregatetimespent:0
      }  
        
      meta = {
        sprintName: (item.fields.sprint)?item.fields.sprint.name:item.fields.closedSprints[0].name,
        projectName: item.fields.project.name
      }      
      
      aggregated.estimate = aggregated.estimate + issue.estimate
      aggregated.remaining = aggregated.remaining + issue.remaining
      if(issue.actual!=null){
      aggregated.actual = aggregated.actual + issue.actual
      }
      
      
    }
    aggregated.final = (0.5 * (aggregated.actual/3600) +1.5 * ((aggregated.estimate/3600) - (aggregated.remaining/3600))) / totalHours

    return {aggregated,meta}
  }
}

module.exports = SalaryServices
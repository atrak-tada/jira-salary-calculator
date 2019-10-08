jiraservices = require('../utils/JiraServices')
salaryServices = require('../utils/salaryServices')
const db = require('../utils/knex')
var Validate = require('indicative/validator')
// var asyncRedis = require('async-redis');
// const client = asyncRedis.createClient();

class JiraController {
    static async login(ctx) {
        ctx.body = ctx.jwtToken
    }
    static async getAllBoards(ctx) {
        console.log('test');
        
        // client.set("language","nodejs")
        // var ARRAY_VALUE_KEY = 'myapp:entities:arrays:1';
        // var myPrimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 31, 37];

        // client.rpush.apply(client, [ARRAY_VALUE_KEY].concat(myPrimes));
        // client.rpop('angularjs')  
        // client.lrange(ARRAY_VALUE_KEY, 0, -1, function(err, result){
            // if(err){
                // console.error(err);
            // }
            // console.log(result);
        // });
    
        // console.log(lang);
        
        // let lan=await client.get("language")
        // console.log(lan);
        // client.hmset("tools","webserver","expressjs","database","mongoDB","devops","jenkins")
        // let getall = await client.hgetall("tools")
        // console.log(getall);
        
        // client.auth('Q12345',function(err,reply) {
        //     console.log(reply);
        //    });
        // const value = await client.get("boards")
        // if (value) {
        //     ctx.body = JSON.parse(value)
        //     console.log(1);
        // } else {
            let jira = ctx.jira
            const boards = await jira.getAllBoards();
            // await client.set("boards", JSON.stringify(boards), 'EX', 60);
            ctx.body = boards
            // console.log(2);
        // }
    }
    static async getAllSprints(ctx) {
        const data = ctx.request.body
        let jira = ctx.jira
        // const value = await client.get(data.boardId)
        // if (value) {
        //     ctx.body = JSON.parse(value)
        // } else {
            const rules = {
                boardId: 'required|number'
            }
            try {
                let t = await Validate.validate(data, rules)
                if (t.boardId) {
                    let sprints = await jira.getAllSprints(data.boardId)
                    // await client.set(data.boardId, JSON.stringify(sprints), 'EX', 60);
                    ctx.body = sprints
                    return sprints
                }
            } catch (error) {
                if (error.statusCode === 404) {
                    ctx.body = 'NotFound'
                } else {
                    ctx.body = error
                }
            }
        // }
    }
    static async getAllIssues(ctx) {
        const data = ctx.request.body
        let jira = ctx.jira
        // const value = await client.get(data.boardId + '-' + data.sprintId)
        // if (value) {
        //     console.log('1');
        //     ctx.body = JSON.parse(value)
        // } else {
            console.log('2');
            const rules = {
                boardId: 'required|integer',
                sprintId: 'required|integer'
            }
            try {
                let t = await Validate.validate(data, rules)

                if (t.boardId && t.sprintId) {
                    let Issues = await jira.getSprintIssues(data.boardId, data.sprintId)
                    // await client.set(data.boardId + '-' + data.sprintId, JSON.stringify(Issues), 'EX', 60);
                    ctx.body = Issues
                    return Issues
                }
            } catch (error) {
                if (error.statusCode === 404) {
                    ctx.body = 'NotFound'
                } else {
                    ctx.body = error
                }
            }
        // }
    }
    static async salary(ctx) {
        const rules = {
            boardId: 'required|integer',
            sprintId: 'required|integer',
            sprintSalary: 'required|integer'
        }
        const data = ctx.request.body
        try {
            let t = await Validate.validate(data, rules)
            if (t.boardId && t.sprintId && t.sprintSalary) {
                const current_time = new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Tehran'
                });
                let issues = await jiraservices.getAllIssuesOfUser(ctx)
                let salary = await salaryServices.sprintSalary(issues)
                let response = {
                    ProjectName: salary.meta.projectName,
                    SprintName: salary.meta.sprintName,
                    RemainingSeconds: salary.aggregated.remaining / 3600,
                    EstimatedSeconds: salary.aggregated.estimate / 3600,
                    AcutalSeconds: salary.aggregated.actual / 3600,
                    FinalRatio: salary.aggregated.final,
                    BaseSprintSalary: ctx.request.body.sprintSalary,
                    FinalSprintSalary: Math.floor(parseFloat(data.sprintSalary) * (parseFloat(salary.aggregated.final) / 2))
                }
                let userName = await ctx.jira.getCurrentUser()
                let token = Math.floor(10000000 + Math.random() * 90000000)
                let jsoned_issues = await JSON.stringify(issues)
                let q = db('history').insert({
                    'userName': userName.name,
                    'projectName': salary.meta.projectName,
                    'sprintName': salary.meta.sprintName,
                    'RemainingSeconds': salary.aggregated.remaining,
                    'EstimatedSeconds': salary.aggregated.estimate,
                    'AcutalSeconds': salary.aggregated.actual,
                    'FinalRatio': salary.aggregated.final,
                    'BaseSprintSalary': parseFloat(ctx.request.body.sprintSalary),
                    'FinalSprintSalary': Math.floor(parseFloat(ctx.request.body.sprintSalary) * (parseFloat(salary.aggregated.final) / 2)),
                    'issues': jsoned_issues,
                    'token': token,
                    'created_at': current_time,
                    'updated_at': current_time
                }).then()
                ctx.body = response
            }
        } catch (error) {
            if (error.statusCode === 404) {
                ctx.body = 'NotFound'
            } else {
                ctx.body = error
            }
        }
    }
    static async getAllThisUserHistory(ctx) {
        let userName = await ctx.jira.getCurrentUser()
        let histories = await db('history').select('projectName', 'sprintName', 'RemainingSeconds', 'EstimatedSeconds',
            'AcutalSeconds', 'FinalRatio', 'BaseSprintSalary', 'FinalSprintSalary', 'token')
            .where('userName', userName.name)
        ctx.body = histories
    }
    static async getHistoryByToken(ctx) {
        let histories = await db('history').select('*').where('token', ctx.params.token)
        ctx.body = histories
    }
    static async getAllHistories(ctx) {
        let histories = await db('history').select('*')
        ctx.body = histories
    }
}
module.exports = JiraController
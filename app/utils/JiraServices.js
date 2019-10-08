var jwt = require('jsonwebtoken');
var key = require('../config/sk');
const axios = require('axios')
const base64 = require('js-base64')
class JiraServices {

    static async getAllIssuesOfUser(ctx) {

        const token = ctx.request.headers.authorization
        if (token) {
            var auth = jwt.verify(token, key.secret)
        }
        else if (ctx.request.body.username && ctx.request.body.password) {
            var auth = {
                username: ctx.request.body.username,
                password: ctx.request.body.password
            }
        }
        let { data } = await axios({
            url: `http://jira.ham-sun.com/rest/agile/latest/board/${ctx.request.body.boardId}/sprint/${ctx.request.body.sprintId}/issue?jql=assignee in (currentUser())`,
            headers: {
                Authorization: 'Basic ' + base64.Base64.toBase64(auth.username + '.' + auth.password)
            },
            auth: auth
        })
        // ctx.body=data
        return data
    }
}
module.exports = JiraServices
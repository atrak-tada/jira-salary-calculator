'use strict';

const Router = require('koa-router');
const JiraController = require('./controllers/JiraController');


const router = new Router();
router.get('/', JiraController.login_form)
router.post('/login', JiraController.login)
// router.get('/menu',JiraController.menu)
router.get('/jira/boards', JiraController.getAllBoards)
router.post('/jira/sprints', JiraController.getAllSprints)
router.post('/jira/Issues', JiraController.getAllIssues)
router.post('/jira/sprint/salary', JiraController.salary)
router.get('/jira/sprint/salary', JiraController.salary)

router.get('/histories/user', JiraController.getAllThisUserHistory)
router.get('/histories/token/:token', JiraController.getHistoryByToken)
router.get('/histories', JiraController.getAllHistories)


module.exports = router;

const frisby = require('frisby');
const Joi = require('joi')

it ('GET should return a status of 200 OK', function () {
  return frisby
    .get('http://127.0.0.1:7070/api/v1/mobile/course-executions/10')
    .expect('status', 200)
    .expect('jsonTypes', {
        description : Joi.string(),
        id : Joi.number()
    //     // title : Joi.string(),
    //     // icon_path : Joi.string()
    //     // chnnel_title : Joi.string()
    });


});



    // .expect('jsonTypes', {
    //     id : Joi.number(),
    //     title : Joi.string(),
    //     icon_path : Joi.string()
    // });

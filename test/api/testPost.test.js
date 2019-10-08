const frisby = require('frisby');
// const headers = {
//     authorization : 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMxLCJpYXQiOjE1NjY5OTMyMDJ9.HArHdgywTG8S4wLcZJMmAPHV4dzhpTNFNhUwq11ZhuY'
// }
it ('POST should return a status of 200 status', async function () {
  return frisby
//   .setup({
//     request: {
//       headers: {
//         'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMxLCJpYXQiOjE1Njc0MDc2OTJ9.0-BQIAtAWX8wYRg_Lhu_-oZ4Jxfak9y0mC1PWOKEr0g' 
//       }
//     }
// })
    .post('http://127.0.0.1:7070/api/v1/mobile/login', {
      username:"09190734266",
      password:"123"
    })
    .expect('status', 200)
    
});
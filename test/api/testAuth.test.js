const frisby = require('frisby');

// The 'setup' function only affects a single test
it ('runs setup only for a single test', function () {
  return frisby
    .setup({
      request: {
        headers: {
          'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMxLCJpYXQiOjE1NjczMjU1NzZ9.QK5kdCRxff93DdM5x5zWUfe2V2hxs73ozIKuoNpWSyU' 
    }
      }
    })
    .get('http://127.0.0.1:7070/api/v1/mobile/profile')
    .expect('status', 200);
});
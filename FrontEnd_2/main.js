    var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello Vue!',
      num1: 1
    },
    methods: {
        handleChange(value) {
          console.log(value)
        }
      }
  });


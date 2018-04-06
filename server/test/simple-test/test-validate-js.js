const Schema = require('validate')

const userValidate = new Schema({
  username: {
    type: 'string',
    required: true,
    length: { min: 3 }
  },
  name: {
    type: 'string',
    required: true
  },
  pets: [{
    name: { type: 'string' },
    animal: { enum: ['cat', 'dog'] }
  }],
  address: {
    street: {
      type: 'string',
      required: true
    },
    city: {
      type: 'string',
      required: true
    },
    zip: {
      type: 'string',
      match: /[0-9]+/,
      required: true
    }
  }
})

userValidate.message({
  required: (name1) => `${name1} 不能为空`,
  length: (prop, ctx, { min, max }) => `${prop}, ${min}, ${max}`
})



obj = {
  username: 'dd'
}


const errors = userValidate.validate(obj);

console.log(errors.toString(), 'eee');




const yyyyValidateFunc = val => /^yyyy$/.test(val);
const carValidate = new Schema({
  color: {
    type: 'string',
    use: { yyyyValidateFunc }
  }
})
carValidate.message({
  yyyyValidateFunc: (path, obj) => `${path} 不合法，不能为： ${obj.color}`,
})
var car = {
  color: `aaaa`
};
const error = carValidate.validate(car);
console.log(error + '', 'car');
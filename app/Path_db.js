const path = require('path')

/*****/

let URL = {
	"app_data":path.join(__dirname,'../app_data'),

}

/********PARA USO COMPILADO ****
let URL = {
	"app_data":path.join(__dirname,'../../app_data'),
}
/******/

module.exports = URL;
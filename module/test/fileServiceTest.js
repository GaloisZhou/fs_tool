"use strict";

var fileService = require('../service/fileService');


function testCheckRemove() {
    console.log("fileService.checkRemove('filename123', 'filename123') == true", fileService.checkRemove('filename123', 'filename123') == true);
    console.log("fileService.checkRemove('filename123', '*123') == true", fileService.checkRemove('filename123', '*123') == true);
    console.log("fileService.checkRemove('filename123', 'file*') == true", fileService.checkRemove('filename123', 'file*') == true);
    console.log("fileService.checkRemove('filename123', '*filename123') == true", fileService.checkRemove('filename123', '*filename123') == true);
    console.log("fileService.checkRemove('filename123', 'filename123*') == true", fileService.checkRemove('filename123', 'filename123*') == true);

    console.log("fileService.checkRemove('filename123', 'filename1234*') == false", fileService.checkRemove('filename123', 'filename1234*') == false);
    console.log("fileService.checkRemove('filename123', 'filena*me123') == false", fileService.checkRemove('filename123', 'filena*me123') == false);
    console.log("fileService.checkRemove('filename123', '*filena*') == false", fileService.checkRemove('filename123', '*filena*') == false);
}


testCheckRemove();
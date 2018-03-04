function stringToDate(str){
    var dateParts = str.split("/");
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
}

function getRefinedWodData(wodData, type){
    var refinedData = [];
    for( var movement in wodData){
        if(wodData[movement].type === type || type === 'all') {
            if (refinedData.length === 0) {
                refinedData.push({'id': wodData[movement].value, 'value': 1});
            } else {
                //check if movement is unique
                var isUnique = true;
                for (var i = 0; i < refinedData.length; i++) {
                    if (refinedData[i].id === wodData[movement].value) {
                        //increment counter
                        refinedData[i].value = refinedData[i].value + 1;
                        isUnique = false;
                        break;
                    }
                }
                if (isUnique) {
                    //add as new
                    refinedData.push({'id': wodData[movement].value, 'value': 1});
                }
            }
        }
    }
    return refinedData;
}

function sortDataByValue(data){
    // sort by value descending
    data.sort(function (a, b) {
        return b.value - a.value;
    });
}

function primitiveRefinedData(data){
    var primitiveRefinedData = [
        {'id': "squat", 'value': 0, 'subTypes': 'squat,thruster,wall ball'},
        {'id': "bench/push up", 'value': 0, 'subTypes': 'bench,push up'},
        {'id': "deadlift", 'value': 0, 'subTypes': 'deadlift,sdhp'},
        {'id': "press", 'value': 0, 'subTypes': 'press,hspu,thruster,c&j,cluster,wall ball,jerk'},
        {'id': "clean", 'value': 0, 'subTypes': 'clean,cluster,c&j'},
        {'id': "snatch", 'value': 0, 'subTypes': 'snatch'},
        {'id': "cardio", 'value': 0, 'subTypes': 'run,swim,row,burpee,bike'},
        {'id': "skip", 'value': 0, 'subTypes': 'su,du,tu'},
        {'id': "ttb", 'value': 0, 'subTypes': 'ttb,kte'},
        {'id': "sit up", 'value': 0, 'subTypes': 'ghd,sit up'},
        {'id': "pull up", 'value': 0, 'subTypes': 'pull up,c2b'},
        {'id': "muscle up", 'value': 0, 'subTypes': 'ring mu,bar mu'},
        {'id': "lunge", 'value': 0, 'subTypes': 'lunge'},
        {'id': "rope climb", 'value': 0, 'subTypes': 'rope'},
        {'id': "handstand", 'value': 0, 'subTypes': 'hs'},
        {'id': "jump", 'value': 0, 'subTypes': 'jump'},
        {'id': "other", 'value': 0, 'subTypes': undefined}
    ];
    for( var movement in data){
        //check which primitive(s) movement belongs to
        for(var primitiveMovement in primitiveRefinedData){
            if(primitiveRefinedData[primitiveMovement].subTypes){
                var subTypes = primitiveRefinedData[primitiveMovement].subTypes.split(",");
                for(var subType in subTypes){
                    if (data[movement].id.indexOf(subTypes[subType]) !== -1) {
                        primitiveRefinedData[primitiveMovement].value = primitiveRefinedData[primitiveMovement].value + data[movement].value;
                    }
                }
            }else{
                var others ="squat,thruster,bench,deadlift,sdhp,press,hspu,c&j,cluster,clean,snatch,run,swim,row,burpee,su,du,tu,ttb,kte,ghd,sit up,pull up,c2b,ring mu,bar mu,lunge,rope,hs,wall ball,jerk,jump,push up,bike";
                var othersArr = others.split(",");
                var isOther = true;
                for(var other in othersArr){
                    if (data[movement].id.indexOf(othersArr[other]) !== -1) {
                        isOther = false;
                        break;
                    }
                }
                if(isOther) {
                    primitiveRefinedData[16].value = primitiveRefinedData[16].value + data[movement].value;
                }
            }
        }
    }
    return primitiveRefinedData;
}

function getDataInDateRange(data, dateFrom, dateTo){
    var dateRangeData = [];
    for( var movement in data){
        if(data[movement].date){
            if(isDateWithinRange(data[movement].date,dateFrom,dateTo)){
                dateRangeData.push(data[movement]);
            }
        }
    }
    return dateRangeData;
}

function isDateWithinRange(date,dateFrom,dateTo) {
    date = stringToDate(date);
    dateFrom = stringToDate(dateFrom);
    dateTo = stringToDate(dateTo);
    return dateFrom <= date && date <= dateTo;
}

function getTopMovements(myData, mainsiteData){
    sortDataByValue(myData);
    sortDataByValue(mainsiteData);
    return [
        {"movement":myData[0].id,"myAmt":myData[0].value,"mainsiteAmt":findValueInArr(myData[0].id, mainsiteData)},
        {"movement":mainsiteData[0].id,"myAmt":findValueInArr(mainsiteData[0].id, myData),"mainsiteAmt":mainsiteData[0].value}
    ]
}

function findValueInArr(valueToFind, Arr){
    var value = "";
    for(var entry in Arr){
        if(Arr[entry].id === valueToFind){
            value = Arr[entry].value;
            break;
        }
    }
    return value;
}
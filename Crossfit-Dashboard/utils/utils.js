function stringToDate(str){
    let dateParts = str.split("/");
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
}

export function getRefinedWodData(wodData, type){
    let refinedData = [];
    for( let movement of wodData){
        if(movement.type === type || type === 'all') {
            if (refinedData.length === 0) {
                refinedData.push({'id': movement.value, 'value': 1});
            } else {
                //check if movement is unique
                let isUnique = true;
                for (let refinedMovement of refinedData) {
                    if (refinedMovement.id === movement.value) {
                        //increment counter
                        refinedMovement.value = refinedMovement.value + 1;
                        isUnique = false;
                        break;
                    }
                }
                if (isUnique) {
                    //add as new
                    refinedData.push({'id': movement.value, 'value': 1});
                }
            }
        }
    }
    return refinedData;
}

function sortDataByValue(data){
    // sort by value descending
    data.sort((a, b) => b.value - a.value);
}

function primitiveRefinedData(data){
    let primitiveRefinedData = [
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
    for(let movement of data){
        //check which primitive(s) movement belongs to
        for(let primitiveMovement of primitiveRefinedData){
            if(primitiveMovement.subTypes){
                let subTypes = primitiveMovement.subTypes.split(",");
                for(let subType of subTypes){
                    if (movement.id.indexOf(subType) !== -1) {
                        primitiveMovement.value = primitiveMovement.value + movement.value;
                    }
                }
            }else{
                let others ="squat,thruster,bench,deadlift,sdhp,press,hspu,c&j,cluster,clean,snatch,run,swim,row,burpee,su,du,tu,ttb,kte,ghd,sit up,pull up,c2b,ring mu,bar mu,lunge,rope,hs,wall ball,jerk,jump,push up,bike";
                let othersArr = others.split(",");
                let isOther = true;
                for(let other of othersArr){
                    if (movement.id.indexOf(other) !== -1) {
                        isOther = false;
                        break;
                    }
                }
                if(isOther) {
                    primitiveRefinedData[16].value = primitiveRefinedData[16].value + movement.value;
                }
            }
        }
    }
    return primitiveRefinedData;
}

export function getDataInDateRange(data, dateFrom, dateTo){
    let dateRangeData = [];
    for( let movement of data){
        if(movement.date){
            if(isDateWithinRange(movement.date,dateFrom,dateTo)){
                dateRangeData.push(movement);
            }
        }
    }
    return dateRangeData;
}

export function isDateWithinRange(date,dateFrom,dateTo) {
    date = stringToDate(date);
    dateFrom = stringToDate(dateFrom);
    dateTo = stringToDate(dateTo);
    return dateFrom <= date && date <= dateTo;
}

export function getTopMovements(myData, mainsiteData){
        sortDataByValue(myData);
        sortDataByValue(mainsiteData);
        let myTopMovement = myData.length>0?myData[0]:{id:'no data', value:0};
        let mainsiteTopMovement = mainsiteData.length>0?mainsiteData[0]:{id:'no data', value:0};
        return [
            {"movement":myTopMovement.id,"myAmt":myTopMovement.value,"mainsiteAmt":findValueInArr(myTopMovement.id, mainsiteData)},
            {"movement":mainsiteTopMovement.id,"myAmt":findValueInArr(mainsiteTopMovement.id, myData),"mainsiteAmt":mainsiteTopMovement.value}
        ]
}

export function findValueInArr(valueToFind, Arr){
    let value = "";
    for(let entry of Arr){
        if(entry.id === valueToFind){
            value = entry.value;
            break;
        }
    }
    return value;
}

export function addPercentageToData(myData, mainsiteData){
    let percentArr = [];
    //loop through myData
    for(let movement of myData){
        let mainsiteVol = findValueInArr(movement.id, mainsiteData);
        movement.percentage = calculatePercentage(movement.value, mainsiteVol);
        movement.ratio = calculateRatio(movement.value, mainsiteVol);
        percentArr.push(movement);
    }
    return percentArr;
}

function calculatePercentage(myVal, mainsiteVal){
    return myVal/(myVal+mainsiteVal);
}

function calculateRatio(myVal, mainsiteVal){
    return myVal/mainsiteVal;
}

export function calculateValueForHeatmap(percent){
    if(percent <= .5){
        percent = percent * 2;
    }else if(!percent) {
        return 0;
    }else{
        percent = (1 - percent) * 2;
    }
    return percent;
}

export function filterData(filter, rawWodData, rawMainsiteData){
    let filteredData, filteredMainsiteData;
    if(filter === 'primitive'){
        let refinedData = getRefinedWodData(rawWodData, 'all');
        //using refined data simplify the movements to primitives
        filteredData = primitiveRefinedData(refinedData);
        let refinedMainsiteDataData = getRefinedWodData(rawMainsiteData, 'all');
        //using refined data simplify the movements to primitives
        filteredMainsiteData = primitiveRefinedData(refinedMainsiteDataData);
    }else{
        filteredData = getRefinedWodData(rawWodData, filter);
        filteredMainsiteData = getRefinedWodData(rawMainsiteData, filter);
    }
    return [filteredData, filteredMainsiteData];
}

export function toPercentageRange(percentage){
    let range = 6;
    if(percentage > .85){
        range = 5;
    }else if(percentage > .7){
        range = 4;
    }else if(percentage > .55){
        range = 3;
    }else if(percentage > .4){
        range = 2;
    }else if(percentage > .25){
        range = 1;
    }else{
        range = 0;
    }
    return range;
}
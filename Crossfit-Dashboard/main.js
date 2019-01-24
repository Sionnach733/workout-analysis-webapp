import {getTopMovements, filterData, addPercentageToData, getDataInDateRange} from './utils/utils.js';
import {BarChart} from './barChart/BarChart.js';
import {BubbleChart} from './bubbleChart/BubbleChart.js';
import {DonutChart} from './donutChart/DonutChart.js';

$(document).ready(() => {
    getWodData();
    setupDropdown();

    function setupDropdown(){
        $( document.body ).on( 'click', '.dropdown-menu li', (event) => {
            let $target = $( event.currentTarget );
            $target.closest( '.btn-group' )
                .find( '[data-bind="label"]' ).text( $target.text() )
                .end()
                .children( '.dropdown-toggle' ).dropdown( 'toggle' );
            return false;
        });
    }

    function renderGraphs(filteredData, filteredMainsiteData){
        new BarChart(getTopMovements(filteredData,filteredMainsiteData));
        new BubbleChart(filteredData);
        let foo = [{"source": "myData", "average": 2.15},
            {"source": "mainsite", "average": 3},
            {"source": "foo", "average": 13},
            {"source": "bar", "average": 30}];
        new DonutChart(foo);
    }

    function getWodData() {
        let myData,mainsiteData;
        $.when(
            $.ajax({
                url: "data.json",
                dataType: 'json',
                success: (data) => myData = data
            }),

            $.ajax({
                url: "mainsite.json",
                dataType: 'json',
                success: (data) => mainsiteData = data
            })
        ).then(function(){
            let filteredData = filterData("all", myData, mainsiteData);
            filteredData[0] = addPercentageToData(filteredData[0], filteredData[1]);
            renderGraphs(filteredData[0], filteredData[1]);
            createDateToolbar(myData, mainsiteData);
            addClickEvents(myData, mainsiteData);
        });
    }

    function addClickEvents(myData, mainsiteData){
        $( "#All" ).click(function() {
            handleClick("all", myData, mainsiteData);
        });
        $( "#Warmup" ).click(function() {
            handleClick("warmup", myData, mainsiteData);
        });
        $( "#Strength" ).click(function() {
            handleClick("strength", myData, mainsiteData);
        });
        $( "#Wod" ).click(function() {
            handleClick("wod", myData, mainsiteData);
        });
        $( "#Skills" ).click(function() {
            handleClick("skills", myData, mainsiteData);
        });
        $( "#Primitives" ).click(function() {
            handleClick("primitive", myData, mainsiteData);
        });
    }

    function handleClick(filter, myData, mainsiteData){
        clearCharts();
        let filteredData = filterData(filter, myData, mainsiteData);
        filteredData[0] = addPercentageToData(filteredData[0], filteredData[1]);
        renderGraphs(filteredData[0], filteredData[1]);
    }

    function clearCharts() {
        $("#myChart").empty();
        $("#mytoptrends").empty();
    }

    function createDateToolbar(myData, mainsiteData){
        let fromDatePicker = $('#from-datepicker');
        let toDatePicker = $('#to-datepicker');


        fromDatePicker.datepicker({
            format: 'dd/mm/yyyy'
        })
            .on('changeDate', () => {
                //render graph with date range
                if(fromDatePicker.val() && toDatePicker.val()){
                    let dateRangeMyData = getDataInDateRange(myData,fromDatePicker.val(),toDatePicker.val());
                    let dateRangeMainsiteData = getDataInDateRange(mainsiteData,fromDatePicker.val(),toDatePicker.val());
                    clearCharts();
                    let filteredData = filterData("all", dateRangeMyData, dateRangeMainsiteData);
                    filteredData[0] = addPercentageToData(filteredData[0], filteredData[1]);
                    renderGraphs(filteredData[0], filteredData[1]);
                }
            });

        toDatePicker.datepicker({
            format: 'dd/mm/yyyy'
        })
            .on('changeDate', () => {
                //render graph with date range
                if(fromDatePicker.val() && toDatePicker.val()){
                    let dateRangeMyData = getDataInDateRange(myData,fromDatePicker.val(),toDatePicker.val());
                    let dateRangeMainsiteData = getDataInDateRange(mainsiteData,fromDatePicker.val(),toDatePicker.val());
                    clearCharts();
                    let filteredData = filterData("all", dateRangeMyData, dateRangeMainsiteData);
                    filteredData[0] = addPercentageToData(filteredData[0], filteredData[1]);
                    renderGraphs(filteredData[0], filteredData[1]);
                }
            });

        $('#clear-btn').button().click(() => clearDates(fromDatePicker, toDatePicker, myData, mainsiteData));
    }

    function clearDates(fromDatePicker, toDatePicker, myData, mainsiteData){
        fromDatePicker.datepicker('setDate', null);
        toDatePicker.datepicker('setDate', null);
        clearCharts();
        let filteredData = filterData("all", myData, mainsiteData);
        filteredData[0] = addPercentageToData(filteredData[0], filteredData[1]);
        renderGraphs(filteredData[0], filteredData[1]);
    }
});

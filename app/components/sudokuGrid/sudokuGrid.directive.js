'use strict';

angular.module('app')
    .directive('sudokuGrid', function () {
        return {
            templateUrl: 'components/sudokuGrid/sudokuGrid.html',
            restrict: 'EA',
            scope: {
                displayGrid:'=data1',
                initGrid:'=data2'},
            link: function (scope) {
                scope.getCellBackground = function(row, col){
                    if(((row < 3 || row > 5) && (col < 3 || col > 5)) || ((row >=3 && row <= 5) && (col >= 3 && col <= 5)) ){
                        return true;
                    }
                    return false;
                };

                scope.highlightCell = function(row, col){
                    if(scope.initGrid && scope.initGrid[row][col] == 0){
                        return true;
                    }
                    return false;
                }
            }
        };
    });


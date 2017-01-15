'use strict';

angular
    .module('app')
    .factory('appService', appService);

function appService() {

    var gridKeys = [
        ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
        ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'],
        ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
        ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'],
        ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'],
        ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9'],
        ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9'],
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9'],
        ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9']
    ];
    var blocks = [
        ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'],
        ['A4', 'A5', 'A6', 'B4', 'B5', 'B6', 'C4', 'C5', 'C6'],
        ['A7', 'A8', 'A9', 'B7', 'B8', 'B9', 'C7', 'C8', 'C9'],
        ['D1', 'D2', 'D3', 'E1', 'E2', 'E3', 'F1', 'F2', 'F3'],
        ['D4', 'D5', 'D6', 'E4', 'E5', 'E6', 'F4', 'F5', 'F6'],
        ['D7', 'D8', 'D9', 'E7', 'E8', 'E9', 'F7', 'F8', 'F9'],
        ['G1', 'G2', 'G3', 'H1', 'H2', 'H3', 'I1', 'I2', 'I3'],
        ['G4', 'G5', 'G6', 'H4', 'H5', 'H6', 'I4', 'I5', 'I6'],
        ['G7', 'G8', 'G9', 'H7', 'H8', 'H9', 'I7', 'I8', 'I9']
    ]

    var units = {};
    var peers = {};
    var allowedValues = "123456789";

    function generateUnits(){
        for(var row in gridKeys){
            for(var col in gridKeys[row]){
                units[gridKeys[row][col]] = generateUnitsForCell(gridKeys[row][col], row, col);
            }
        }
        return units;
    }

    function generateUnitsForCell(cell, row, col){
        var units = [];
        units.push(gridKeys[row]);

        var unitsCol = []
        for(var r in gridKeys){
            unitsCol.push(gridKeys[r][col]);
        }
        units.push(unitsCol);

        for(var b in blocks){
            if(blocks[b].indexOf(cell) != -1){
                units.push(blocks[b]);
            }
        }
        return units;
    }

    function generatePeers(){
        for(var row in gridKeys){
            for(var col in gridKeys[row]){
                peers[gridKeys[row][col]] = generatePeersForCell(gridKeys[row][col], units[gridKeys[row][col]])
            }
        }
        return peers;
    }

    function generatePeersForCell(cell, units){
        var peers = {};
        for(var unit in units){
            for(var c in units[unit]){
                if(units[unit][c] != cell){
                    peers[units[unit][c]] = true;
                }
            }
        }
        return peers;
    }


    function eliminateInitValues(cellValue, cell, possibleValues){
        if(cellValue != 0){
            possibleValues[cell] = cellValue + '';
            possibleValues = eliminateDigitFromPeers(cellValue, cell, possibleValues);
        }
        return possibleValues;
    }

    function eliminateDigitFromPeers(cellValue, cell, possibleValues){
        var peersForCell = Object.keys(peers[cell])

        for(var p in peersForCell) {
            if (possibleValues[peersForCell[p]].length == 1 && possibleValues[peersForCell[p]] == cellValue) {
                return false;
            }
        }

        for(var p in peersForCell){
            if (possibleValues[peersForCell[p]].length > 1){
                possibleValues[peersForCell[p]] = possibleValues[peersForCell[p]].replace(cellValue, '');

                if(possibleValues[peersForCell[p]].length == 1){
                    return eliminateDigitFromPeers(possibleValues[peersForCell[p]], peersForCell[p], possibleValues);
                }
            }
        }
        return possibleValues;
    }


    function parse_grid(grid){
        var possibleValues = {};
        for (var row in gridKeys) {
            for (var col in gridKeys[row]) {
                possibleValues[gridKeys[row][col]] = allowedValues;
            }
        }
        for(var row in gridKeys){
            for(var col in gridKeys[row]){
                possibleValues = eliminateInitValues(grid[row][col], gridKeys[row][col], possibleValues);
            }
        }
        return possibleValues;
    }

    function search(possibleValues){
        if (!possibleValues){
            return false;
        }

        var maxPossibilities = 1, minPossibilities = 10, cellWithMinPossibleValues = null;

        for(var row in gridKeys){
            for(var col in gridKeys[row]){
                if(possibleValues[gridKeys[row][col]].length > maxPossibilities){
                    maxPossibilities = possibleValues[gridKeys[row][col]].length;
                }

                if(possibleValues[gridKeys[row][col]].length < minPossibilities && possibleValues[gridKeys[row][col]].length > 1){
                    minPossibilities = possibleValues[gridKeys[row][col]].length;
                    cellWithMinPossibleValues = gridKeys[row][col];
                }
            }
        }

        if (maxPossibilities == 1){
            return possibleValues; //puzzle solved
        }

        for (var i = 0; i < possibleValues[cellWithMinPossibleValues].length; i++){
            var testValues = Object.assign({},possibleValues);
            var result = search(eliminateInitValues(testValues[cellWithMinPossibleValues].charAt(i), cellWithMinPossibleValues, testValues));
            if (result) {
                return result;
            }
        }
        return false;
    }


    return {
        solve: function solve(puzzle) {
            var solvedPuzzle = [];

            units = generateUnits();
            peers = generatePeers();

            var solution = search(parse_grid(puzzle));

            for(var row in gridKeys){
                solvedPuzzle[row] = [];
                for(var col in gridKeys[row]){
                    solvedPuzzle[row][col] = solution[gridKeys[row][col]];
                }
            }
            return solvedPuzzle;
        }
    };
}
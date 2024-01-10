let table;
let SP500DateArray = [];
let SP500ValueArray = [];

// VARIABLES FOR S&P500 CHART DISPLAY
let SP500Spacing = 6;
let SP500Height = 180; 

// VARIABLES FOR CAPITAL GAIN CHART DISPLAY
let currentDate;
let density = 8;
let sectorWidth;
let sectorValue = [];
let sectorValueArray = [];
let sectorValueScale = 0.00000013;
let sectorNameArray = [];

// COLORS
let colorArray = ["rgb(114,229,239)", "rgb(87,155,161)", "rgb(137,251,136)", "rgb(100,175,92)", "rgb(202,238,158)", "rgb(207,125,30)", "rgb(208,222,32)", "rgb(246,96,48)", "rgb(251,202,185)", "rgb(187,131,119)", "rgb(255,107,151)", "rgb(254,206,95)"]

let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

const PARAMS = {
  date:0,
};

const pane = new Tweakpane.Pane();

pane.addInput(PARAMS, 'date', { min: 0, max: 249});

function preload() {
    sector = loadTable("SectorCapGain.csv", 'csv', 'header')
    SP500 = loadTable("S&P2023.csv", "csv", "header");
    jetBrains = loadFont('JetBrainsMono-Light.otf');
    dreamOrphans = loadFont('Dream_Orphans_It.otf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(20);


  for (let r = 0; r < SP500.getRowCount(); r++) {
    
    let splitString = split(SP500.getString(r, 0), '/');
    let convFormat = splitString[2] + '-' + splitString[0] + '-' + splitString[1]
    append(SP500DateArray, convFormat);
    
    splitString = split(SP500.getString(r, 1), ',');
    convFormat = float(splitString[0] + splitString[1])
    append(SP500ValueArray, convFormat);
  }
  
    SP500DateArray = reverse(SP500DateArray)
    SP500ValueArray = reverse(SP500ValueArray)
    
    rectMode(CENTER);
    fill(220);
    stroke(220);
    // colorMode(HSB, 255);

    sectorWidth = windowWidth / 12

    // GET DAILY CAPITAL GAINS OF SECTOR AND GROUP BY DATE

    for (let i = 0; i < sector.getRowCount() / 12; i++) {

        for (let j = 0; j < 12; j++) {
            let count = i * 12 + j
            append(sectorValue, int(sector.getString(count, 2)))
        }

        append(sectorValueArray, sectorValue)
        sectorValue = []

    }

    for (let i = 0; i < 12; i++) {
        append(sectorNameArray, sector.getString(i, 1))
    }

    textAlign(CENTER, CENTER);
    textFont(jetBrains);
    
    console.log(sectorValueArray[2])

}

function draw() {

    background(10);
    

    SPChart()

    push();
    textSize(18);

    text(currentDate, windowWidth * 0.5, windowHeight - (SP500Height*0.25));
    pop();

    for (let i = 0; i < windowWidth; i += density) {
        for (let j = 0; j < windowHeight - (SP500Height * 1.5); j += density) {
            push();
            fill(120)
            noStroke()
            rect(i, j, 1, 1)
            pop()
        }
    }
    

    for (let i = 0; i < 12; i++) {
        sectorChart(sectorNameArray[i], i * sectorWidth, sectorValueArray[int(PARAMS.date)][i], colorArray[i])

    }


}

function SPChart() {

    // line(0, windowHeight - (SP500Height*1.5), windowWidth, windowHeight - (SP500Height*1.5))

    let SP500ChartWidth = SP500DateArray.length * SP500Spacing
    push();
    translate((windowWidth - SP500ChartWidth) * 0.5, 0)
    

    for (let i = 0; i <SP500DateArray.length; i++) {

        let mappedValue = map(SP500ValueArray[i], 3000, 5000, 0, SP500Height)
            
        push();
        noStroke();
        translate(0, windowHeight)
        rect(SP500Spacing*i, -mappedValue, 3)

        if (i == int(PARAMS.date)) {
            stroke(180);
            strokeWeight(1)
            line(SP500Spacing * i, -mappedValue + SP500Spacing, SP500Spacing * i, windowHeight)
            rect(SP500Spacing*i, -mappedValue, 4, 12)
        }

        pop();
    }
    pop();

    currentDate = SP500DateArray[int(PARAMS.date)]
  
}

function sectorChart(sector, xStart, height, color) {

    let posHeight = abs(height)
    let neg = 1;

    let sectorChartBaseline = (windowHeight - (SP500Height * 1.5)) / 2
    
    push();
    fill(color)
    noStroke();
    textSize(12);
    text(sector.toUpperCase(), xStart + sectorWidth / 2, windowHeight - (SP500Height*1.5) + 20)
    text(USDollar.format(height), xStart + sectorWidth / 2, windowHeight - (SP500Height*1.5) + 40)
    
    translate(0,-3)

    for (let i = 0; i < sectorWidth; i += density) {
        for (let j = 0; j < posHeight * sectorValueScale; j += density) {

            if (height < 0) {
                rect(xStart + i, sectorChartBaseline + j, 2, 2)
            } else {
                rect(xStart + i, sectorChartBaseline + j - height * sectorValueScale, 2, 2)
            }
        }
    }

    pop();

}
